import type { Activity } from "./schema";

export const mockActivities: Activity[] = [
  { id: 1, name: "Kibble", category: "food", description: "Basic nutritional food.", cost: 10, effects: { hunger: 20, health: 5, happiness: 5 } },
  { id: 2, name: "Premium Treat", category: "food", description: "A delicious gourmet treat for your pet!", cost: 25, effects: { hunger: 35, happiness: 25 } },
  { id: 3, name: "Play with Toy", category: "play", description: "Throw a ball or chew toy!", cost: 0, effects: { happiness: 15, energy: -10, hunger: -5 } },
  { id: 4, name: "New Toy", category: "play", description: "Buy a shiny new toy for your pet!", cost: 50, effects: { happiness: 40, energy: -15 } },
  { id: 5, name: "Vet Visit", category: "health", description: "Take your pet to a licensed doctor for a checkup and medicine.", cost: 100, effects: { health: 50, happiness: -10 } },
  { id: 6, name: "Grooming", category: "health", description: "Get your pet professionally brushed and pampered.", cost: 30, effects: { health: 10, happiness: 10 } },
  { id: 7, name: "Nap", category: "sleep", description: "A quick power nap.", cost: 0, effects: { energy: 30, hunger: -10 } },
  { id: 8, name: "Full Sleep", category: "sleep", description: "Deep restorative sleep.", cost: 0, effects: { energy: 100, hunger: -30 } },
  { id: 9, name: "Do Chores", category: "work", description: "Earn some coins through helping out around the house!", cost: 0, effects: { coins: 50, energy: -20, happiness: -5 } },
];