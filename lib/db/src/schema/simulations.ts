import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const simulationsTable = pgTable("simulations", {
  id: serial("id").primaryKey(),
  scenario_id: integer("scenario_id").notNull(),
  status: text("status").notNull().default("pending"),
  scale: integer("scale").notNull(),
  mode: text("mode").default("standard"),
  progress_pct: numeric("progress_pct", { precision: 5, scale: 2 }),
  total_tests: integer("total_tests"),
  passed_tests: integer("passed_tests"),
  failed_tests: integer("failed_tests"),
  success_rate: numeric("success_rate", { precision: 5, scale: 2 }),
  hazard_detection_rate: numeric("hazard_detection_rate", { precision: 5, scale: 2 }),
  false_positive_rate: numeric("false_positive_rate", { precision: 5, scale: 2 }),
  false_negative_rate: numeric("false_negative_rate", { precision: 5, scale: 2 }),
  avg_latency_ms: numeric("avg_latency_ms", { precision: 8, scale: 2 }),
  decision_stability_score: numeric("decision_stability_score", { precision: 5, scale: 2 }),
  started_at: timestamp("started_at"),
  completed_at: timestamp("completed_at"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulationsTable).omit({ id: true, created_at: true });
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulationsTable.$inferSelect;
