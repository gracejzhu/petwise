import { Pet } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// ============================================
// PET HOOKS
// ============================================

export function usePet() {
  return useQuery({
    queryKey: [api.pets.get.path],
    queryFn: async () => {
      const res = await fetch(api.pets.get.path);
      // Don't throw on 404, just return null so we can show onboarding
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch pet');
      return api.pets.get.responses[200].parse(await res.json());
    },
    // Poll every 5 seconds to get updated stats (hunger decay, etc.)
    refetchInterval: 5000,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.pets.create.input>) => {
      const res = await fetch(api.pets.create.path, {
        method: api.pets.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to adopt pet');
      }
      return api.pets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pets.get.path] });
    },
  });
}

export function usePerformAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { activityId: number }) => {
      const res = await fetch(api.pets.action.path, {
        method: api.pets.action.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to perform action');
      }
      return api.pets.action.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate both pet stats and logs
      queryClient.invalidateQueries({ queryKey: [api.pets.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Pet>) => {
      const res = await fetch(api.pets.get.path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update pet");
      return api.pets.get.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.pets.get.path] });
    },
  });
}

export function useResetGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.pets.reset.path, {
        method: api.pets.reset.method,
      });
      if (!res.ok) throw new Error('Failed to reset game');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// ============================================
// ACTIVITY HOOKS
// ============================================

export function useActivities() {
  const queryClient = useQueryClient();
  return {
    ...useQuery({
      queryKey: [api.activities.list.path],
      queryFn: async () => {
        const res = await fetch(api.activities.list.path);
        if (!res.ok) throw new Error('Failed to fetch activities');
        return api.activities.list.responses[200].parse(await res.json());
      },
    }),
    updateActivity: useMutation({
      mutationFn: async ({ id, description }: { id: number, description: string }) => {
        const res = await fetch(`/api/activities/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        });
        if (!res.ok) throw new Error("Failed to update activity");
        return await res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [api.activities.list.path] });
      },
    })
  };
}

// ============================================
// LOG HOOKS
// ============================================

export function useLogs() {
  return useQuery({
    queryKey: [api.logs.list.path],
    queryFn: async () => {
      const res = await fetch(api.logs.list.path);
      if (!res.ok) throw new Error('Failed to fetch logs');
      return api.logs.list.responses[200].parse(await res.json());
    },
  });
}
