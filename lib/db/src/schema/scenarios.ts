import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scenariosTable = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  environment_type: text("environment_type").notNull(),
  user_type: text("user_type").notNull(),
  movement_speed: text("movement_speed").default("normal"),
  difficulty: text("difficulty").notNull(),
  hazard_density: text("hazard_density").notNull(),
  hazard_types: text("hazard_types").array().default([]),
  sensor_noise_level: text("sensor_noise_level").default("none"),
  lighting_condition: text("lighting_condition").default("normal"),
  obstacle_count: integer("obstacle_count"),
  dynamic_obstacles: boolean("dynamic_obstacles").default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertScenarioSchema = createInsertSchema(scenariosTable).omit({ id: true, created_at: true });
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenariosTable.$inferSelect;
