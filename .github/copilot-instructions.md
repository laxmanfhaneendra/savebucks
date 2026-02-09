# Savebucks - Copilot Instructions

**Project Path:** `c:\Users\laxma\OneDrive\Desktop\Savebucks-main`

## Quick Start

```bash
npm install          # Install all workspace dependencies
npm run dev          # Start all services (web, api, worker)
npm run dev:web      # Start only web app (Vite)
npm run dev:api      # Start only API server
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

Individual app commands:
```bash
npm run -w apps/web dev          # Web app with hot reload
npm run -w apps/api dev          # API with --watch
npm run -w apps/worker dev       # Worker with --watch
npm run -w apps/worker telegram  # Run Telegram bot
npm run -w apps/worker ingestion # Run data ingestion job
```

## Architecture

### Monorepo Structure
- **apps/api** - Express.js REST API (Node.js, no build step)
- **apps/web** - React SPA with Vite + Tailwind CSS
- **apps/worker** - Background jobs + Telegram bot (BullMQ)
- **packages/shared** - Shared utilities (e.g., `hotScore`, `normalizeUrl`, `telegramParser`)

### Data Layer
- **Database**: Supabase (PostgreSQL) - schema in `supabase/sql/`
- **Auth**: Supabase Auth with JWT tokens
- **Rate Limiting**: Upstash Redis (optional, falls back to in-memory)
- **Deployment**: Render (see `render.yaml`)

### API Patterns

Routes follow RESTful conventions:
```
apps/api/src/routes/
├── deals.js      # /api/deals
├── users.js      # /api/users
├── coupons.js    # /api/coupons
└── ...
```

Auth middleware (`middleware/auth.js`) is applied globally and populates `req.user` from JWT. Routes that require auth use `requireAdmin` or check `req.user` directly.

Validation uses Zod schemas (`lib/validate.js`):
```javascript
import { z } from 'zod';
export const postDealSchema = z.object({ ... });
```

### Frontend Patterns

**Components** are organized by domain:
```
apps/web/src/components/
├── ui/          # Reusable primitives (Button, Card, Dialog, etc.)
├── Deal/        # Deal-specific components
├── Auth/        # Authentication components
├── Layout/      # Navbar, Footer, SkipLink
└── ...
```

**UI primitives** use Radix UI + Tailwind via `class-variance-authority`:
```javascript
import { Button, Card, Dialog } from '../ui';
import { Skeleton } from '../ui/Skeleton';
```

**API calls** go through `lib/api/`:
```javascript
import { api, apiRequest } from '../../lib/api';

// Use `api` object for typed methods
const tags = await api.getTags({ limit: 10 });

// Use `apiRequest` for direct endpoint calls
const deals = await apiRequest('/api/deals');
```

**Auth state** via `useAuth` hook:
```javascript
const { user, isAuthenticated, signIn, signOut } = useAuth();
```

## Conventions

### Imports
- Web app uses **relative imports** (no path aliases)
- Shared package: `import { hotScore, normalizeUrl } from '@savebucks/shared'`

### Database Migrations
SQL files in `supabase/sql/` organized by purpose:
- `schema/` - Core table definitions
- `features/` - Feature-specific migrations
- `fixes/` - Bug fixes and patches
- `seed/` - Seed data

### Environment Variables
- API: `apps/api/.env` (see `.env.example`)
- Web: Uses `VITE_` prefix for client-side vars
- Worker: `apps/worker/.env`

Key vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`

### Styling
- Tailwind CSS with `@tailwindcss/forms` and `@tailwindcss/typography`
- Dark mode supported via `dark:` prefix
- Use `clsx` or `tailwind-merge` for conditional classes
