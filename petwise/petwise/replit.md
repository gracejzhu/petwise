# Cute Pixel Pet Game

## Overview

A virtual pet simulation game with a cute pixel art aesthetic inspired by games like Stardew Valley and Animal Crossing. Users adopt a pet (dog, cat, or rabbit), manage its stats (hunger, happiness, energy, health), and perform activities using an in-game coin system. The app features playful animations, pastel colors, and a cozy, friendly UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state with 5-second polling for live pet stats
- **Styling**: Tailwind CSS with custom pixel-art theme (Silkscreen/Quicksand fonts, pastel color palette, 8px grid system)
- **Animations**: Framer Motion for bouncing pet animations and smooth transitions
- **UI Components**: Shadcn/ui component library (New York style variant)
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Build System**: Vite for client, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines pets, activities, and logs tables
- **Migrations**: Drizzle Kit with `db:push` command

### Key Design Patterns
- **Shared Types**: Database schemas and API contracts in `shared/` directory are used by both client and server
- **Type-Safe API**: Zod schemas validate all API inputs/outputs
- **Single Pet Model**: Simple design with one pet per application instance

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (PetDisplay, StatBar, ActivityCard)
    pages/        # Route pages (Home, Dashboard, Onboarding)
    hooks/        # Custom hooks (use-game.ts for API calls)
server/           # Express backend
  routes.ts       # API endpoint handlers
  storage.ts      # Database operations
  db.ts           # Drizzle connection
shared/           # Shared between client/server
  schema.ts       # Drizzle table definitions
  routes.ts       # API contract with Zod schemas
```

## External Dependencies

### Database
- PostgreSQL database (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe queries
- `connect-pg-simple` for session storage capability

### Frontend Libraries
- Radix UI primitives (comprehensive set for dialogs, dropdowns, tooltips, etc.)
- Lucide React for icons (pet icons: Dog, Cat, Rabbit)
- date-fns for time formatting
- embla-carousel-react for carousel components

### Build & Development
- Vite with React plugin
- Replit-specific plugins for development (error overlay, cartographer, dev banner)
- esbuild for production server bundling