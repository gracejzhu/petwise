import { db } from "./db";
import {
  pets,
  activities,
  logs,
  type Pet,
  type InsertPet,
  type Activity,
  type Log,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Pet
  getPet(): Promise<Pet | undefined>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, updates: Partial<Pet>): Promise<Pet>;
  deletePet(id: number): Promise<void>;

  // Activities
  getActivities(): Promise<Activity[]>;
  seedActivities(): Promise<void>;
  getActivity(id: number): Promise<Activity | undefined>;
  updateActivity(id: number, updates: Partial<Activity>): Promise<Activity>;

  // Logs
  createLog(log: typeof logs.$inferInsert): Promise<Log>;
  getLogs(petId: number): Promise<Log[]>;
}

export class DatabaseStorage implements IStorage {
  async getPet(): Promise<Pet | undefined> {
    // Single pet for this simple version, just get the first one
    const [pet] = await db.select().from(pets).limit(1);
    return pet;
  }

  async createPet(pet: InsertPet): Promise<Pet> {
    const [newPet] = await db.insert(pets).values(pet).returning();
    return newPet;
  }

  async updatePet(id: number, updates: Partial<Pet>): Promise<Pet> {
    const [updated] = await db
      .update(pets)
      .set(updates)
      .where(eq(pets.id, id))
      .returning();
    return updated;
  }

  async deletePet(id: number): Promise<void> {
    await db.delete(pets).where(eq(pets.id, id));
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }

  async updateActivity(id: number, updates: Partial<Activity>): Promise<Activity> {
    const [updated] = await db
      .update(activities)
      .set(updates)
      .where(eq(activities.id, id))
      .returning();
    return updated;
  }

  async seedActivities(): Promise<void> {
    const count = await db.select().from(activities);
    if (count.length === 0) {
      await db.insert(activities).values([
        // Food
        { name: "Kibble", category: "food", description: "Basic nutritional food.", cost: 10, effects: { hunger: 20, health: 5, happiness: 5 } },
        { name: "Premium Treat", category: "food", description: "A delicious gourmet treat for your pet!", cost: 25, effects: { hunger: 35, happiness: 25 } },
        // Play
        { name: "Play with Toy", category: "play", description: "Throw a ball or chew toy!", cost: 0, effects: { happiness: 15, energy: -10, hunger: -5 } },
        { name: "New Toy", category: "play", description: "Buy a shiny new toy for your pet!", cost: 50, effects: { happiness: 40, energy: -15 } },
        // Health
        { name: "Vet Visit", category: "health", description: "Take your pet to a licensed doctor for a checkup and medicine.", cost: 100, effects: { health: 50, happiness: -10 } },
        { name: "Grooming", category: "health", description: "Get your pet professionally brushed and pampered.", cost: 30, effects: { health: 10, happiness: 10 } },
        // Sleep
        { name: "Nap", category: "sleep", description: "A quick power nap.", cost: 0, effects: { energy: 30, hunger: -10 } },
        { name: "Full Sleep", category: "sleep", description: "Deep restorative sleep.", cost: 0, effects: { energy: 100, hunger: -30 } },
        // Work/Earn
        { name: "Do Chores", category: "work", description: "Earn some coins through helping out around the house!", cost: 0, effects: { coins: 50, energy: -20, happiness: -5 } },
      ]);
    }
  }

  async createLog(log: typeof logs.$inferInsert): Promise<Log> {
    const [newLog] = await db.insert(logs).values(log).returning();
    return newLog;
  }

  async getLogs(petId: number): Promise<Log[]> {
    return await db
      .select()
      .from(logs)
      .where(eq(logs.petId, petId))
      .orderBy(desc(logs.timestamp))
      .limit(20);
  }
}

export const storage = new DatabaseStorage();
