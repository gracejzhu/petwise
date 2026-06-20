import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Ensure activities exist
  await storage.seedActivities();

  app.get(api.pets.get.path, async (req, res) => {
    let pet = await storage.getPet();
    if (!pet) {
      return res.status(404).json({ message: "No pet found" });
    }
    if (pet.isPaused) {
      // If paused, keep lastInteraction current so decay doesn't accumulate
      const now = new Date();
      await storage.updatePet(pet.id, { lastInteraction: now });
      return res.json({ ...pet, lastInteraction: now });
    }

    // Passive stat decay logic (1 point every 10 seconds)
    const now = new Date();
    const lastInteraction = pet.lastInteraction ? new Date(pet.lastInteraction) : now;

    // calculate seconds passed 
    const diffInSeconds = Math.floor((now.getTime() - lastInteraction.getTime()) / 1000);

      if (diffInSeconds > 0 && !pet.isPaused) {
        const decreaseAmount = Math.floor(diffInSeconds / 10);

      if (decreaseAmount > 0) {
        // **create updates object**
        const updates = {
          hunger: Math.max(0, pet.hunger - decreaseAmount),
          happiness: Math.max(0, pet.happiness - decreaseAmount),
          energy: Math.max(0, pet.energy - decreaseAmount),
          health: Math.max(0, pet.health - decreaseAmount),
          lastInteraction: now,
        };

        pet = await storage.updatePet(pet.id, updates);
      }
    }

    res.json(pet);
  });

  app.post(api.pets.create.path, async (req, res) => {
    const existing = await storage.getPet();
    if (existing) {
      return res.status(400).json({ message: "Pet already exists" });
    }

    try {
      const input = api.pets.create.input.parse(req.body);
      const pet = await storage.createPet(input);
      // Give initial bonus log
      await storage.createLog({
        petId: pet.id,
        activityName: "Adopted",
        cost: 0,
      });
      res.status(201).json(pet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.pets.action.path, async (req, res) => {
    const pet = await storage.getPet();
    if (!pet) {
      return res.status(404).json({ message: "No pet found" });
    }

    try {
      const { activityId } = api.pets.action.input.parse(req.body);
      const activity = await storage.getActivity(activityId);

      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Check costs
      if (activity.cost > 0 && pet.coins < activity.cost) {
        return res.status(400).json({ message: "Not enough coins!" });
      }

      // Calculate new stats
      const effects = activity.effects as Record<string, number>;
      const updates: any = {};

      if (activity.cost > 0) {
        updates.coins = pet.coins - activity.cost;
      }
      
      // Special case for 'work' category which adds coins
      if (effects.coins) {
        // Enforce 60 sec cooldown for chores (i may change later depending on playtest feedback yes i will find ppl trust me)
        if (pet.lastChoreAt) {
          const now = new Date();
          const lastChore = new Date(pet.lastChoreAt);
          const diffInSeconds = Math.floor((now.getTime() - lastChore.getTime()) / 1000);
          if (diffInSeconds < 60) {
            return res.status(400).json({ 
              message: `You need to wait ${60 - diffInSeconds} more seconds to do chores again!` 
            });
          }
        }
        updates.coins = (updates.coins ?? pet.coins) + effects.coins;
        updates.lastChoreAt = new Date();

        // Log chores as negative cost (income)
        await storage.createLog({
          petId: pet.id,
          activityName: activity.name,
          cost: -effects.coins,
        });
      } else {
        // Log regular activities
        await storage.createLog({
          petId: pet.id,
          activityName: activity.name,
          cost: activity.cost,
        });
      }

      // Apply effects (0-100)
      if (effects.hunger) updates.hunger = Math.min(100, Math.max(0, pet.hunger + effects.hunger));
      if (effects.happiness) updates.happiness = Math.min(100, Math.max(0, pet.happiness + effects.happiness));
      if (effects.energy) updates.energy = Math.min(100, Math.max(0, pet.energy + effects.energy));
      if (effects.health) updates.health = Math.min(100, Math.max(0, pet.health + effects.health));

      // Handle sleep state
      if (activity.category === 'sleep' || (updates.energy !== undefined && updates.energy <= 0)) {
        updates.isSleeping = true;
      } else {
        updates.isSleeping = false;
      }
      
      updates.lastInteraction = new Date();

      const updatedPet = await storage.updatePet(pet.id, updates);

      // Log it
      // await storage.createLog({
      //   petId: pet.id,
      //   activityName: activity.name,
      //   cost: activity.cost,
      // });

      res.json(updatedPet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  });

  app.post(api.pets.reset.path, async (req, res) => {
     const pet = await storage.getPet();
     if (pet) {
       await storage.deletePet(pet.id);
     }
     res.json({ message: "Pet reset" });
  });

  app.get(api.activities.list.path, async (req, res) => {
    const list = await storage.getActivities();
    res.json(list);
  });

  app.get(api.logs.list.path, async (req, res) => {
    const pet = await storage.getPet();
    if (!pet) return res.json([]);
    const logs = await storage.getLogs(pet.id);
    res.json(logs);
  });

  app.patch("/api/pet", async (req, res) => {
    const pet = await storage.getPet();
    if (!pet) return res.status(404).json({ message: "No pet found" });

    const updated = await storage.updatePet(pet.id, req.body);
    res.json(updated);
  });

  app.patch("/api/activities/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const activity = await storage.getActivity(id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    const { description } = req.body;
    const updated = await storage.updateActivity(id, { description });
    res.json(updated);
  });
  app.get("/api/pet", async (req, res) => {
    const pet = await storage.getPet();
    if (!pet) {
      // no pet exists yet, return 404 or null
      return res.status(404).json({ message: "No pet found" });
    }

    res.json(pet);
  });

  return httpServer;
}
