import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const benchmarksTable = pgTable("benchmarks", {
  id: serial("id").primaryKey(),
  suite: text("suite").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("pending"),
  scenario_count: integer("scenario_count"),
  success_rate: numeric("success_rate", { precision: 5, scale: 2 }),
  hazard_detection_rate: numeric("hazard_detection_rate", { precision: 5, scale: 2 }),
  false_positive_rate: numeric("false_positive_rate", { precision: 5, scale: 2 }),
  false_negative_rate: numeric("false_negative_rate", { precision: 5, scale: 2 }),
  decision_stability_score: numeric("decision_stability_score", { precision: 5, scale: 2 }),
  avg_latency_ms: numeric("avg_latency_ms", { precision: 8, scale: 2 }),
  min_latency_ms: numeric("min_latency_ms", { precision: 8, scale: 2 }),
  max_latency_ms: numeric("max_latency_ms", { precision: 8, scale: 2 }),
  confidence_calibration_score: numeric("confidence_calibration_score", { precision: 5, scale: 2 }),
  weaknesses_found: integer("weaknesses_found").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
  completed_at: timestamp("completed_at"),
});

export const insertBenchmarkSchema = createInsertSchema(benchmarksTable).omit({ id: true, created_at: true });
export type InsertBenchmark = z.infer<typeof insertBenchmarkSchema>;
export type Benchmark = typeof benchmarksTable.$inferSelect;
