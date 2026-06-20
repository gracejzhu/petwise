import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'dog', 'cat', 'rabbit'
  hunger: integer("hunger").notNull().default(100), // 0-100, 100 is full
  happiness: integer("happiness").notNull().default(100), // 0-100
  energy: integer("energy").notNull().default(100), // 0-100
  health: integer("health").notNull().default(100), // 0-100
  coins: integer("coins").notNull().default(100), // Starting currency
  isSleeping: boolean("is_sleeping").notNull().default(false),
  lastInteraction: timestamp("last_interaction").defaultNow(),
  backgroundColor: text("background_color").notNull().default("bg-gray-100/100"),
  lastChoreAt: timestamp("last_chore_at"),
  isPaused: boolean("is_paused").notNull().default(false),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'food', 'play', 'health', 'sleep'
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  effects: jsonb("effects").notNull(), // { hunger: 20, happiness: 10, energy: -5 }
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").notNull(),
  activityName: text("activity_name").notNull(),
  cost: integer("cost").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === SCHEMAS ===

export const insertPetSchema = createInsertSchema(pets).pick({
  name: true,
  type: true,
});

export const insertActivitySchema = createInsertSchema(activities);
export const insertLogSchema = createInsertSchema(logs);

// === TYPES ===

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Activity = typeof activities.$inferSelect;
export type Log = typeof logs.$inferSelect;

export type CreatePetRequest = InsertPet;

export type PerformActionRequest = {
  activityId: number;
};

// Response types
export type PetResponse = Pet;
export type ActivityListResponse = Activity[];
export type LogListResponse = Log[];
