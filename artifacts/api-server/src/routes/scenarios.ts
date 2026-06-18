import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, scenariosTable, activityTable } from "@workspace/db";
import {
  ListScenariosQueryParams,
  CreateScenarioBody,
  GetScenarioParams,
  UpdateScenarioParams,
  UpdateScenarioBody,
  DeleteScenarioParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/scenarios", async (req, res): Promise<void> => {
  const query = ListScenariosQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows = await db.select().from(scenariosTable).orderBy(scenariosTable.created_at);

  if (query.data.environment_type) {
    rows = rows.filter((r) => r.environment_type === query.data.environment_type);
  }
  if (query.data.user_type) {
    rows = rows.filter((r) => r.user_type === query.data.user_type);
  }
  if (query.data.difficulty) {
    rows = rows.filter((r) => r.difficulty === query.data.difficulty);
  }

  const result = rows.map((r) => ({
    ...r,
    created_at: r.created_at.toISOString(),
  }));
  res.json(result);
});

router.post("/scenarios", async (req, res): Promise<void> => {
  const parsed = CreateScenarioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [scenario] = await db.insert(scenariosTable).values(parsed.data).returning();

  await db.insert(activityTable).values({
    entity_type: "scenario",
    entity_id: scenario.id,
    entity_name: scenario.name,
    action: "created",
  });

  res.status(201).json({ ...scenario, created_at: scenario.created_at.toISOString() });
});

router.get("/scenarios/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetScenarioParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scenario] = await db.select().from(scenariosTable).where(eq(scenariosTable.id, params.data.id));
  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  res.json({ ...scenario, created_at: scenario.created_at.toISOString() });
});

router.patch("/scenarios/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateScenarioParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateScenarioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [scenario] = await db
    .update(scenariosTable)
    .set(parsed.data)
    .where(eq(scenariosTable.id, params.data.id))
    .returning();

  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  await db.insert(activityTable).values({
    entity_type: "scenario",
    entity_id: scenario.id,
    entity_name: scenario.name,
    action: "updated",
  });

  res.json({ ...scenario, created_at: scenario.created_at.toISOString() });
});

router.delete("/scenarios/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteScenarioParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [scenario] = await db.delete(scenariosTable).where(eq(scenariosTable.id, params.data.id)).returning();
  if (!scenario) {
    res.status(404).json({ error: "Scenario not found" });
    return;
  }

  await db.insert(activityTable).values({
    entity_type: "scenario",
    entity_id: scenario.id,
    entity_name: scenario.name,
    action: "deleted",
  });

  res.sendStatus(204);
});

export default router;
