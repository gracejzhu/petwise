import { z } from 'zod';
import { insertPetSchema, pets, activities, logs } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  badRequest: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  pets: {
    get: {
      method: 'GET' as const,
      path: '/api/pet',
      responses: {
        200: z.custom<typeof pets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/pet',
      input: insertPetSchema,
      responses: {
        201: z.custom<typeof pets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    action: {
      method: 'POST' as const,
      path: '/api/pet/action',
      input: z.object({ activityId: z.number() }),
      responses: {
        200: z.custom<typeof pets.$inferSelect>(),
        400: errorSchemas.badRequest,
        404: errorSchemas.notFound,
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/pet/reset',
      responses: {
        200: z.object({ message: z.string() }),
      }
    }
  },
  activities: {
    list: {
      method: 'GET' as const,
      path: '/api/activities',
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    },
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: {
        200: z.array(z.custom<typeof logs.$inferSelect>()),
      },
    },
  },
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
