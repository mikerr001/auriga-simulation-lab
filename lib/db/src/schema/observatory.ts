import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const observationsTable = pgTable("observations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  simulation_id: integer("simulation_id"),
  benchmark_id: integer("benchmark_id"),
  subsystem: text("subsystem").notNull().default("unknown"),
  tags: text("tags").array().default([]),
  resolved: boolean("resolved").notNull().default(false),
  resolution_notes: text("resolution_notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  resolved_at: timestamp("resolved_at"),
});

export const insertObservationSchema = createInsertSchema(observationsTable).omit({ id: true, created_at: true, resolved: true, resolved_at: true });
export type InsertObservation = z.infer<typeof insertObservationSchema>;
export type Observation = typeof observationsTable.$inferSelect;
