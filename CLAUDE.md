# CLAUDE.md

## What this is

**hosimi**（星見）is a mobile-first web app for stargazing. The user sets an observation
location, and the app renders a 3D sky of stars and constellations that you look around
by tilting the phone (device orientation). Production site: **hosimi.net**. UI language is
Japanese.

Monorepo with three deployables plus a reverse proxy:

- `backend/` — Rails 8.0.2 API-only, Ruby 3.3.8, PostgreSQL 15
- `frontend/` — Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- `nginx/` — routes `/` → Next.js, `/api/` → Rails
- `docker-compose.yml` — production stack (`db` + `rails` + `nextjs` + `nginx`)
- `docker-compose.dev.yml` — dev overlay (`db` + `rails` + `nextjs` with hot reload); see below

## Running it

### Local dev stack (Docker — the normal way to run `db` + `rails` + `nextjs` for development)
```
docker compose -f docker-compose.yml -f docker-compose.dev.yml up db rails nextjs
```
- Frontend: `https://localhost:3000` (Next.js's own self-signed cert, `--experimental-https`,
  same mkcert-generated files under `frontend/certificates/` as before)
- Backend API: `http://localhost:3001/api/...` (also reachable through the frontend's
  `/api/...` rewrite at :3000)
- Source is bind-mounted from `frontend/` and `backend/` — edits on the host take effect
  immediately (Next.js Fast Refresh / Rails `enable_reloading`). `node_modules`/`.next`
  and Ruby gems live in named volumes so they survive rebuilds and aren't clobbered by the
  bind mount.
- The `nextjs` dev container runs `next dev --webpack` (not `--turbopack`, unlike the plain
  `npm run dev`) with `WATCHPACK_POLLING=true`. Confirmed by testing: on Docker Desktop for
  Windows, bind-mount file-change events don't reach Turbopack's watcher at all (even with
  `watchOptions.pollIntervalMs` set) — Fast Refresh silently does nothing until the container
  is restarted. Plain webpack's polling watcher (`WATCHPACK_POLLING`) does pick up bind-mount
  edits reliably, so that's what [frontend/Dockerfile.dev](frontend/Dockerfile.dev) uses.
- `nginx` is **not** part of the dev overlay (production-only reverse proxy) — don't include
  it when bringing the dev stack up.
- Uses its own throwaway DB user/volume (`hosimi`/`hosimi`, `pgdata_dev`), independent from
  the production `pgdata` volume.
- `docker-compose.dev.yml` sets `name: hosimi-dev`, giving the dev stack its own Compose
  project (`hosimi-dev-db-1`, etc.) separate from production's `hosimi-*` containers. This is
  load-bearing: without it, Compose's project name defaults to the directory name (`hosimi`)
  regardless of which `-f` files are combined, so the dev stack would recreate/replace the
  running production containers under the same names the moment it starts — this actually
  happened once. Always pass **both** `-f` files together (a plain `docker compose up` on
  `docker-compose.yml` alone still targets the production project and is safe on its own).
- Dockerfiles: [backend/Dockerfile.dev](backend/Dockerfile.dev) / [frontend/Dockerfile.dev](frontend/Dockerfile.dev)
  (dev-only; production uses the plain `Dockerfile` in each directory, unaffected by this).

### Frontend tooling (`cd frontend`, needs a local `npm ci` — not containerized)
| Task | Command |
|---|---|
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Unit tests (Vitest, node — coordinate math) | `npm run test:unit` |
| Component tests (Vitest, Storybook browser mode / Playwright chromium) | `npx vitest` |
| Storybook | `npm run storybook` |

Package manager is **npm** (`package-lock.json`).

### Backend tooling (`cd backend`, needs local Ruby/bundle — not containerized)
| Task | Command |
|---|---|
| Tests (Minitest) | `bin/rails test` |
| Lint | `bin/rubocop` (rubocop-rails-omakase) |
| Security scan | `bin/brakeman` |
| CI-equivalent | `bin/rails db:test:prepare test` |

### Production stack
`cp .env.sample .env` and fill it, then `docker compose up --build` (no `-f docker-compose.dev.yml`).

## Architecture notes

### Backend API (no auth, `ActionController::API`)
Routes in [backend/config/routes.rb](backend/config/routes.rb):

- `GET /api/stars?minVMag=&maxVMag=` — star coords from DB, filtered by visual magnitude (both params required)
- `GET /api/stars/:id` — live detail for one star: scrapes **SIMBAD** HTML, classifies object type, computes distance from parallax
- `GET /api/constellations` — constellations plus their line segments
- `GET /api/geolocation/:locationName` — place name → lat/lng via **Nominatim (OpenStreetMap)**

Layering: `controllers/` → `app/services/<domain>/` (one service per domain, with
`*_manager` classes wrapping each external call) → `app/utils/` (`ScrapingUtils` = Nokogiri
open-uri).

Every outbound-call service holds an in-process `AccessManager` (`app/services/access_manager.rb`)
that rate-limits third-party requests and raises `TooManyRequestsError` → HTTP 429. The
counter is per-process and resets on restart — it is **not** shared across Puma workers.

### Backend data
Three models: `Star` (`simbad_id`, `right_ascension`, `declination`, `v_mag`),
`Constellation` (eng/jpn name), `ConstellationLine` (`start_star_id`, `end_star_id`,
`constellation_id`). Schema is small; see [backend/db/schema.rb](backend/db/schema.rb).

Seeds ([backend/db/seeds.rb](backend/db/seeds.rb)) are idempotent (`find_or_create_by!`):
star catalog is parsed from **`backend/simbad.txt`** (pipe-delimited, read from the hardcoded
path `/rails/simbad.txt` — the Dockerfile copies it there explicitly), 88 constellations are
hardcoded, and `constellation_lines` seeding is currently commented out. The Docker
entrypoint runs `db:create db:migrate db:seed` on every boot.

### Frontend
App Router pages: `/` (welcome), `/location-settings` (+ `/auto`, `/manual`),
`/observation`, `/settings`.

- `src/features/<Feature>/` — feature modules (`Root`, `Observation`, `LocationSetting*`, `Settings`), each with local `components/` and `assets/`
- `src/components/` — shared UI; `src/context/` — three Context providers (`UserPosition`, `StarData`, `Setting`) wrapping the app in [src/app/layout.tsx](frontend/src/app/layout.tsx)
- `src/lib/api/*` — typed `fetch` wrappers returning `{ success: true, ... } | { success: false, error }`, validated at runtime by `isX` type guards in `src/type/*`
- 3D sky: **three.js** + `@react-three/fiber` + `@react-three/drei`; look-around uses `deviceorientation` events with an iOS permission-request flow (`Observation.tsx`)
- Sky orientation: stars are placed in a sphere-fixed equatorial frame, and `src/utils/celestialSphere.ts` rotates the whole `<group>` into the observer's horizon frame (world axes are **+X east / +Y zenith / +Z south**, matching what `DeviceOrientationControls` produces). Local sidereal time is computed from the device clock — there is no API call for it. Guard tests: `npm run test:unit`
- Location picking: **Leaflet** + `react-leaflet`
- `StarData` / `Setting` context state is persisted to `localStorage` (`starData`, `constellationLines`, `contrastValue`, `starSizeValue`); star/constellation data is fetched once then reused from storage

### How frontend reaches the API
API base URL is `process.env.NEXT_PUBLIC_API_ORIGIN` — `https://hosimi.net` in production,
**empty** in dev (`.env.development`), so requests go to relative `/api/...`. In dev,
[frontend/next.config.ts](frontend/next.config.ts) rewrites `/api/:path*` to
`process.env.BACKEND_ORIGIN` (default **`http://localhost:3001`**, i.e. Rails on port 3001).
`docker-compose.dev.yml` overrides `BACKEND_ORIGIN` to `http://rails:3000` so the `nextjs`
container reaches the `rails` container by service name instead. In production, nginx does
the `/api/` routing instead and this rewrite is never hit.

### Frontend Docker build
[frontend/Dockerfile](frontend/Dockerfile) is a multi-stage build that runs `npm ci` +
`npm run build` inside the image (no pre-built `.next/` needed). `NEXT_PUBLIC_*` values are
inlined at build time via `--build-arg` (`NEXT_PUBLIC_API_ORIGIN`,
`NEXT_PUBLIC_ADOBE_FONTS_KIT_ID`) — `docker-compose.yml` passes them, and CD passes them
from GitHub Actions Variables.

## Conventions

- Commit messages: Japanese, `type : 説明` (`fix : ...`, `refactor : ...`, `add : ...`, `style : ...`, `chore : ...`). Code comments are Japanese.
- Default branch is `master`; active development on `develop`; feature branches like `feat/…`, `add/…`, `style/…` merged via PR.
- CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on PRs and pushes to `master` / `develop`: backend brakeman / rubocop / minitest (Postgres service), frontend `npm run build`.
- CD ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) runs on push to `master` (or manual dispatch): builds + pushes both images to GHCR, then SSHes to the server to `docker compose pull` + `up -d`. Runbook: [docs/deployment.md](docs/deployment.md).
- Rails Gemfile still carries `sqlite3` and default Kamal/`config/deploy.yml` scaffolding; the real DB is Postgres and deployment is docker-compose — ignore the Kamal boilerplate.
- Design docs (OpenAPI spec, ER / robustness / screen-transition diagrams) live in `docs/`; editable sources under `docs/doc_source/` are gitignored.
