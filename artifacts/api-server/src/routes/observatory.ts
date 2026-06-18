import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, observationsTable, activityTable } from "@workspace/db";
import {
  ListObservationsQueryParams,
  CreateObservationBody,
  GetObservationParams,
  UpdateObservationParams,
  UpdateObservationBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function toObservationResponse(obs: typeof observationsTable.$inferSelect) {
  return {
    ...obs,
    created_at: obs.created_at.toISOString(),
    resolved_at: obs.resolved_at ? obs.resolved_at.toISOString() : null,
  };
}

router.get("/observatory", async (req, res): Promise<void> => {
  const query = ListObservationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows = await db.select().from(observationsTable).orderBy(observationsTable.created_at);

  if (query.data.type) {
    rows = rows.filter((o) => o.type === query.data.type);
  }
  if (query.data.severity) {
    rows = rows.filter((o) => o.severity === query.data.severity);
  }
  if (query.data.resolved != null) {
    rows = rows.filter((o) => o.resolved === query.data.resolved);
  }
  if (query.data.limit) {
    rows = rows.slice(0, query.data.limit);
  }

  res.json(rows.map(toObservationResponse));
});

router.post("/observatory", async (req, res): Promise<void> => {
  const parsed = CreateObservationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [obs] = await db.insert(observationsTable).values({
    ...parsed.data,
    resolved: false,
  }).returning();

  await db.insert(activityTable).values({
    entity_type: "observation",
    entity_id: obs.id,
    entity_name: obs.title,
    action: "logged",
    metadata: `type=${obs.type}, severity=${obs.severity}`,
  });

  res.status(201).json(toObservationResponse(obs));
});

router.get("/observatory/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetObservationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [obs] = await db.select().from(observationsTable).where(eq(observationsTable.id, params.data.id));
  if (!obs) {
    res.status(404).json({ error: "Observation not found" });
    return;
  }

  res.json(toObservationResponse(obs));
});

router.patch("/observatory/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateObservationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateObservationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.resolved === true) {
    updates.resolved_at = new Date();
  }

  const [obs] = await db
    .update(observationsTable)
    .set(updates)
    .where(eq(observationsTable.id, params.data.id))
    .returning();

  if (!obs) {
    res.status(404).json({ error: "Observation not found" });
    return;
  }

  if (parsed.data.resolved === true) {
    await db.insert(activityTable).values({
      entity_type: "observation",
      entity_id: obs.id,
      entity_name: obs.title,
      action: "resolved",
    });
  }

  res.json(toObservationResponse(obs));
});

export default router;
