import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, benchmarksTable, activityTable } from "@workspace/db";
import {
  ListBenchmarksQueryParams,
  CreateBenchmarkBody,
  GetBenchmarkParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toBenchmarkResponse(b: typeof benchmarksTable.$inferSelect) {
  return {
    ...b,
    success_rate: b.success_rate != null ? Number(b.success_rate) : null,
    hazard_detection_rate: b.hazard_detection_rate != null ? Number(b.hazard_detection_rate) : null,
    false_positive_rate: b.false_positive_rate != null ? Number(b.false_positive_rate) : null,
    false_negative_rate: b.false_negative_rate != null ? Number(b.false_negative_rate) : null,
    decision_stability_score: b.decision_stability_score != null ? Number(b.decision_stability_score) : null,
    avg_latency_ms: b.avg_latency_ms != null ? Number(b.avg_latency_ms) : null,
    min_latency_ms: b.min_latency_ms != null ? Number(b.min_latency_ms) : null,
    max_latency_ms: b.max_latency_ms != null ? Number(b.max_latency_ms) : null,
    confidence_calibration_score: b.confidence_calibration_score != null ? Number(b.confidence_calibration_score) : null,
    created_at: b.created_at.toISOString(),
    completed_at: b.completed_at ? b.completed_at.toISOString() : null,
  };
}

router.get("/benchmarks/aggregate", async (_req, res): Promise<void> => {
  const benchmarks = await db.select().from(benchmarksTable).where(eq(benchmarksTable.status, "completed"));

  if (benchmarks.length === 0) {
    res.json({
      total_benchmarks: 0,
      avg_success_rate: 0,
      avg_hazard_detection_rate: 0,
      avg_false_positive_rate: 0,
      avg_false_negative_rate: 0,
      avg_latency_ms: 0,
      total_weaknesses_found: 0,
      by_suite: [],
    });
    return;
  }

  const avg = (arr: (number | null)[]) => {
    const valid = arr.filter((v) => v != null) as number[];
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  };

  const suiteMap = new Map<string, typeof benchmarks>();
  for (const b of benchmarks) {
    const list = suiteMap.get(b.suite) ?? [];
    list.push(b);
    suiteMap.set(b.suite, list);
  }

  const by_suite = Array.from(suiteMap.entries()).map(([suite, list]) => ({
    suite,
    count: list.length,
    avg_success_rate: avg(list.map((b) => b.success_rate != null ? Number(b.success_rate) : null)),
  }));

  res.json({
    total_benchmarks: benchmarks.length,
    avg_success_rate: avg(benchmarks.map((b) => b.success_rate != null ? Number(b.success_rate) : null)),
    avg_hazard_detection_rate: avg(benchmarks.map((b) => b.hazard_detection_rate != null ? Number(b.hazard_detection_rate) : null)),
    avg_false_positive_rate: avg(benchmarks.map((b) => b.false_positive_rate != null ? Number(b.false_positive_rate) : null)),
    avg_false_negative_rate: avg(benchmarks.map((b) => b.false_negative_rate != null ? Number(b.false_negative_rate) : null)),
    avg_latency_ms: avg(benchmarks.map((b) => b.avg_latency_ms != null ? Number(b.avg_latency_ms) : null)),
    total_weaknesses_found: benchmarks.reduce((sum, b) => sum + (b.weaknesses_found ?? 0), 0),
    by_suite,
  });
});

router.get("/benchmarks", async (req, res): Promise<void> => {
  const query = ListBenchmarksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows = await db.select().from(benchmarksTable).orderBy(benchmarksTable.created_at);

  if (query.data.suite) {
    rows = rows.filter((b) => b.suite === query.data.suite);
  }
  if (query.data.limit) {
    rows = rows.slice(0, query.data.limit);
  }

  res.json(rows.map(toBenchmarkResponse));
});

router.post("/benchmarks", async (req, res): Promise<void> => {
  const parsed = CreateBenchmarkBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const scenarioCount = parsed.data.scenario_count ?? 100;
  const successRate = 72 + Math.random() * 22;
  const hazardRate = 78 + Math.random() * 18;
  const fpRate = 2 + Math.random() * 8;
  const fnRate = 1 + Math.random() * 6;
  const avgLatency = 35 + Math.random() * 65;
  const weaknesses = Math.floor(Math.random() * 8);

  const [benchmark] = await db.insert(benchmarksTable).values({
    suite: parsed.data.suite,
    name: parsed.data.name ?? `${parsed.data.suite} run`,
    status: "completed",
    scenario_count: scenarioCount,
    success_rate: String(successRate.toFixed(2)),
    hazard_detection_rate: String(hazardRate.toFixed(2)),
    false_positive_rate: String(fpRate.toFixed(2)),
    false_negative_rate: String(fnRate.toFixed(2)),
    decision_stability_score: String((70 + Math.random() * 25).toFixed(2)),
    avg_latency_ms: String(avgLatency.toFixed(2)),
    min_latency_ms: String((avgLatency * 0.4).toFixed(2)),
    max_latency_ms: String((avgLatency * 2.5).toFixed(2)),
    confidence_calibration_score: String((65 + Math.random() * 30).toFixed(2)),
    weaknesses_found: weaknesses,
    completed_at: new Date(),
  }).returning();

  await db.insert(activityTable).values({
    entity_type: "benchmark",
    entity_id: benchmark.id,
    entity_name: benchmark.name,
    action: "completed",
    metadata: `suite=${benchmark.suite}, scenarios=${scenarioCount}`,
  });

  res.status(201).json(toBenchmarkResponse(benchmark));
});

router.get("/benchmarks/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBenchmarkParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [benchmark] = await db.select().from(benchmarksTable).where(eq(benchmarksTable.id, params.data.id));
  if (!benchmark) {
    res.status(404).json({ error: "Benchmark not found" });
    return;
  }

  res.json(toBenchmarkResponse(benchmark));
});

export default router;
