# Savebucks Project Context

## Project Overview
**Savebucks** - A monorepo application for savings/deals management

## Tech Stack
- **Runtime**: Node.js (see .nvmrc)
- **Package Manager**: npm with workspaces
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS

## Project Structure
```
savebucks/
├── apps/
│   ├── api/                        # Backend API server
│   │   └── src/
│   │       ├── lib/                # Shared utilities
│   │       ├── middleware/         # Express middleware
│   │       └── routes/             # API routes
│   ├── web/                        # Frontend web application
│   │   └── src/
│   │       ├── components/         # React components (organized by domain)
│   │       │   ├── Ads/            # Ad-related components
│   │       │   ├── Auth/           # Authentication components
│   │       │   ├── Deal/           # Deal-related components
│   │       │   ├── Forums/         # Forum components
│   │       │   ├── Layout/         # Layout components
│   │       │   ├── ui/             # Generic UI components
│   │       │   └── ...             # Other domain folders
│   │       ├── context/            # React context providers
│   │       ├── hooks/              # Custom React hooks
│   │       ├── lib/                # Utilities & services
│   │       │   ├── api/            # API clients (api.js, feedApi.js, supa.js)
│   │       │   ├── forums/         # Forum service layer
│   │       │   └── utils/          # Utility functions
│   │       ├── pages/              # Page components (organized by domain)
│   │       │   ├── Admin/          # Admin pages
│   │       │   ├── Auth/           # Auth pages (SignIn, SignUp, etc.)
│   │       │   ├── Deals/          # Deal pages
│   │       │   ├── Forums/         # Forum pages
│   │       │   ├── Legal/          # Legal pages (Privacy, Terms, Disclosure)
│   │       │   ├── User/           # User pages (Profile, Settings, etc.)
│   │       │   └── *.jsx           # Top-level pages
│   │       └── styles/             # CSS styles
│   └── worker/                     # Background worker + Telegram bot
│       └── src/
│           ├── config/             # Configuration
│           ├── jobs/               # Background jobs
│           └── lib/                # Worker utilities
├── packages/
│   └── shared/                     # Shared utilities/types
├── scripts/
│   ├── db/                         # Database scripts & helpers
│   ├── deploy/                     # Deployment scripts
│   └── setup/                      # Setup/installation scripts
├── supabase/
│   ├── email-templates/            # Email templates
│   └── sql/                        # SQL migrations (organized by type)
│       ├── schema/                 # Core schema definitions
│       ├── seed/                   # Seed data
│       ├── fixes/                  # Bug fixes and patches
│       └── features/               # Feature migrations
├── tests/                          # Test files and fixtures
└── docs/                           # Project documentation
```

## Available Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services (web, api, worker) |
| `npm run dev:web` | Start web app only |
| `npm run dev:api` | Start API only |
| `npm run dev:worker` | Start worker only |
| `npm run dev:telegram` | Start Telegram bot |
| `npm run build` | Build API and web for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Session History

### 2026-02-04
- **Initial exploration**: Identified project structure, tech stack, and available scripts
- **Created this context file** to maintain continuity across sessions
- **Cleanup analysis**: Identified unnecessary debug/temp files
- **Phase 1 reorganization**: Root level cleanup, database organization
- **Phase 2 reorganization**: Deep structure improvements
  - Organized components into domain folders
  - Organized pages into domain folders (Auth, Legal, Deals, User)
  - Reorganized lib into api/ and utils/ subfolders
  - Organized SQL migrations by type (schema, seed, fixes, features)

### 2026-02-07
- **Security cleanup**: Removed debug files with hardcoded secrets
  - Deleted `apps/api/check_data.cjs` (contained Supabase service key)
  - Deleted `apps/api/check_schema_simple.cjs` (contained Supabase service key)
  - Deleted `scripts/db/test_connection.js` (contained Supabase service key)
  - Deleted `scripts/db/test_connection.cjs` (contained Supabase service key)
- **Fixed remaining hardcoded secrets**: Updated db scripts to use env vars
  - `scripts/db/apply_migration.js` - now uses SUPABASE_URL/SUPABASE_SERVICE_ROLE
  - `scripts/db/apply_sql_supabase.js` - now uses SUPABASE_URL/SUPABASE_SERVICE_ROLE
  - `scripts/db/apply_sql.js` - now uses DATABASE_URL
- **Removed unnecessary files**:
  - Deleted `apps/api/logs/` (empty folder)
  - Deleted `.eslintrc.json` (duplicate - using flat config eslint.config.js)
  - Deleted `apps/web/dist/` (build artifact)
  - Deleted `.vscode/` (IDE-specific, in .gitignore)
- **Organized SQL folder**: Moved loose SQL files into proper subfolders
- **SQL consolidation** (reduced from 88 files to 43 files):
  - `schema/`: 9 → 3 files (kept complete_schema, reset, policies)
  - `seed/`: 7 → 2 files (consolidated seed data)
  - `fixes/`: 27 → 2 files (removed debug scripts and applied fixes)
  - `features/`: 45 → 36 files (removed duplicates and superseded versions)

## Work Completed
- [x] Explored codebase structure
- [x] Created session context file
- [x] Deleted debug/temp files
- [x] Moved test files to `tests/` folder
- [x] Phase 1 reorganization (root level, scripts, supabase)
- [x] Phase 2 reorganization:
  - [x] Components: Moved loose files to domain folders, created Ads/
  - [x] Pages: Created Auth/, Legal/, Deals/, User/ folders
  - [x] Lib: Created api/ and utils/ subfolders with re-exports
  - [x] SQL: Organized into schema/, seed/, fixes/, features/
  - [x] Fixed all import paths
  - [x] Verified build passes
- [x] Security cleanup (2026-02-07)
  - [x] Removed debug files with hardcoded secrets
  - [x] Fixed db scripts to use environment variables
  - [x] Removed build artifacts and IDE files
- [x] SQL consolidation (2026-02-07)
  - [x] Reduced schema/ from 9 to 3 files
  - [x] Reduced seed/ from 7 to 2 files
  - [x] Reduced fixes/ from 27 to 2 files
  - [x] Reduced features/ from 45 to 36 files

## Current Project Structure
```
savebucks/
├── apps/
│   ├── admin/         # Admin dashboard (Vite + React)
│   ├── api/           # Backend API (Express.js)
│   ├── web/           # Main web app (Vite + React + Tailwind)
│   └── worker/        # Background jobs + Telegram bot
├── packages/
│   └── shared/        # Shared utilities (@savebucks/shared)
├── scripts/
│   ├── db/            # Database migration scripts (use env vars!)
│   ├── deploy/        # Deployment scripts (Render)
│   └── setup/         # Setup scripts
├── supabase/
│   ├── email-templates/
│   └── sql/           # Organized by: schema/, seed/, fixes/, features/
├── tests/             # Test files (empty - tests needed)
└── docs/              # Documentation
```

## Important Notes for Agents
- **NEVER hardcode secrets** - Always use environment variables
- **Required env vars**: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE, DATABASE_URL
- **Build command**: `npm run build` (builds api + web)
- **Lint command**: `npm run lint` (uses eslint.config.js flat config)
- **Deployment**: Render (see render.yaml)
- The `tests/` folder is empty - test coverage should be added
- Admin app (`apps/admin`) is a separate workspace app

## Environment Variables Reference
| Variable | Used In | Purpose |
|----------|---------|---------|
| SUPABASE_URL | api, worker, scripts | Supabase project URL |
| SUPABASE_ANON_KEY | web | Public Supabase key |
| SUPABASE_SERVICE_ROLE | api, worker, scripts | Service role key (server-side only) |
| DATABASE_URL | scripts/db | Direct PostgreSQL connection |
| TELEGRAM_BOT_TOKEN | worker | Telegram bot authentication |

## Pending Tasks
- [ ] Add test coverage (tests/ folder is empty)
- [ ] Consider initializing git repository (not a git repo currently)
