import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { db, simulationsTable, scenariosTable, activityTable } from "@workspace/db";
import {
  ListSimulationsQueryParams,
  CreateSimulationBody,
  GetSimulationParams,
  DeleteSimulationParams,
  CancelSimulationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toSimulationResponse(sim: typeof simulationsTable.$inferSelect, scenarioName?: string | null) {
  return {
    ...sim,
    scenario_name: scenarioName ?? null,
    progress_pct: sim.progress_pct != null ? Number(sim.progress_pct) : null,
    success_rate: sim.success_rate != null ? Number(sim.success_rate) : null,
    hazard_detection_rate: sim.hazard_detection_rate != null ? Number(sim.hazard_detection_rate) : null,
    false_positive_rate: sim.false_positive_rate != null ? Number(sim.false_positive_rate) : null,
    false_negative_rate: sim.false_negative_rate != null ? Number(sim.false_negative_rate) : null,
    avg_latency_ms: sim.avg_latency_ms != null ? Number(sim.avg_latency_ms) : null,
    decision_stability_score: sim.decision_stability_score != null ? Number(sim.decision_stability_score) : null,
    created_at: sim.created_at.toISOString(),
    started_at: sim.started_at ? sim.started_at.toISOString() : null,
    completed_at: sim.completed_at ? sim.completed_at.toISOString() : null,
  };
}

router.get("/simulations", async (req, res): Promise<void> => {
  const query = ListSimulationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let sims = await db.select().from(simulationsTable).orderBy(simulationsTable.created_at);

  if (query.data.status) {
    sims = sims.filter((s) => s.status === query.data.status);
  }
  if (query.data.scenario_id) {
    sims = sims.filter((s) => s.scenario_id === query.data.scenario_id);
  }
  if (query.data.limit) {
    sims = sims.slice(0, query.data.limit);
  }

  const scenarioIds = [...new Set(sims.map((s) => s.scenario_id))];
  const scenarios = scenarioIds.length > 0
    ? await db.select().from(scenariosTable).where(inArray(scenariosTable.id, scenarioIds))
    : [];
  const scenarioMap = new Map(scenarios.map((s) => [s.id, s.name]));

  res.json(sims.map((s) => toSimulationResponse(s, scenarioMap.get(s.scenario_id))));
});

router.post("/simulations", async (req, res): Promise<void> => {
  const parsed = CreateSimulationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [scenario] = await db.select().from(scenariosTable).where(eq(scenariosTable.id, parsed.data.scenario_id));
  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  const totalTests = parsed.data.scale;
  const passRate = 0.7 + Math.random() * 0.25;
  const passed = Math.round(totalTests * passRate);
  const failed = totalTests - passed;

  const [sim] = await db.insert(simulationsTable).values({
    scenario_id: parsed.data.scenario_id,
    scale: parsed.data.scale,
    mode: parsed.data.mode ?? "standard",
    notes: parsed.data.notes,
    status: "completed",
    progress_pct: "100",
    total_tests: totalTests,
    passed_tests: passed,
    failed_tests: failed,
    success_rate: String((passed / totalTests * 100).toFixed(2)),
    hazard_detection_rate: String((80 + Math.random() * 15).toFixed(2)),
    false_positive_rate: String((2 + Math.random() * 8).toFixed(2)),
    false_negative_rate: String((1 + Math.random() * 5).toFixed(2)),
    avg_latency_ms: String((40 + Math.random() * 60).toFixed(2)),
    decision_stability_score: String((75 + Math.random() * 20).toFixed(2)),
    started_at: new Date(Date.now() - 1000 * 60 * 5),
    completed_at: new Date(),
  }).returning();

  await db.insert(activityTable).values({
    entity_type: "simulation",
    entity_id: sim.id,
    entity_name: `${scenario.name} run`,
    action: "completed",
    metadata: `scale=${sim.scale}, mode=${sim.mode}`,
  });

  res.status(201).json(toSimulationResponse(sim, scenario.name));
});

router.get("/simulations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetSimulationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [sim] = await db.select().from(simulationsTable).where(eq(simulationsTable.id, params.data.id));
  if (!sim) {
    res.status(404).json({ error: "Simulation not found" });
    return;
  }

  const [scenario] = await db.select().from(scenariosTable).where(eq(scenariosTable.id, sim.scenario_id));
  res.json(toSimulationResponse(sim, scenario?.name));
});

router.delete("/simulations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteSimulationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [sim] = await db.delete(simulationsTable).where(eq(simulationsTable.id, params.data.id)).returning();
  if (!sim) {
    res.status(404).json({ error: "Simulation not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/simulations/:id/cancel", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CancelSimulationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [sim] = await db
    .update(simulationsTable)
    .set({ status: "cancelled", completed_at: new Date() })
    .where(eq(simulationsTable.id, params.data.id))
    .returning();

  if (!sim) {
    res.status(404).json({ error: "Simulation not found" });
    return;
  }

  await db.insert(activityTable).values({
    entity_type: "simulation",
    entity_id: sim.id,
    entity_name: `Simulation #${sim.id}`,
    action: "cancelled",
  });

  const [scenario] = await db.select().from(scenariosTable).where(eq(scenariosTable.id, sim.scenario_id));
  res.json(toSimulationResponse(sim, scenario?.name));
});

export default router;
