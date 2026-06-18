import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, simulationsTable, scenariosTable, benchmarksTable, observationsTable, activityTable } from "@workspace/db";
import { GetDashboardActivityQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [scenarios, simulations, benchmarks, observations] = await Promise.all([
    db.select().from(scenariosTable),
    db.select().from(simulationsTable),
    db.select().from(benchmarksTable),
    db.select().from(observationsTable),
  ]);

  const completedSims = simulations.filter((s) => s.status === "completed");
  const activeSims = simulations.filter((s) => s.status === "running" || s.status === "pending").length;

  const avg = (arr: (number | null)[]) => {
    const valid = arr.filter((v) => v != null) as number[];
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  };

  const totalTests = completedSims.reduce((sum, s) => sum + (s.total_tests ?? 0), 0);
  const openObs = observations.filter((o) => !o.resolved).length;
  const criticalObs = observations.filter((o) => o.severity === "critical" && !o.resolved).length;
  const totalWeaknesses = benchmarks.reduce((sum, b) => sum + (b.weaknesses_found ?? 0), 0);

  res.json({
    total_scenarios: scenarios.length,
    total_simulations: simulations.length,
    total_tests_run: totalTests,
    overall_success_rate: avg(completedSims.map((s) => s.success_rate != null ? Number(s.success_rate) : null)),
    overall_hazard_detection_rate: avg(completedSims.map((s) => s.hazard_detection_rate != null ? Number(s.hazard_detection_rate) : null)),
    overall_false_positive_rate: avg(completedSims.map((s) => s.false_positive_rate != null ? Number(s.false_positive_rate) : null)),
    overall_false_negative_rate: avg(completedSims.map((s) => s.false_negative_rate != null ? Number(s.false_negative_rate) : null)),
    active_simulations: activeSims,
    total_benchmarks: benchmarks.length,
    open_observations: openObs,
    critical_observations: criticalObs,
    total_weaknesses_found: totalWeaknesses,
    avg_latency_ms: avg(completedSims.map((s) => s.avg_latency_ms != null ? Number(s.avg_latency_ms) : null)),
  });
});

router.get("/dashboard/activity", async (req, res): Promise<void> => {
  const query = GetDashboardActivityQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const limit = query.data.limit ?? 20;
  const rows = await db.select().from(activityTable).orderBy(activityTable.created_at).limit(limit);

  res.json(rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
  })));
});

export default router;
