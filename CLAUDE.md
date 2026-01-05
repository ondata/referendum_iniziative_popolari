# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Referendum Astro** is a static site generator for Italian referendums and popular initiatives using Astro 5.11.0 with React 19.1.0 and TypeScript. The site displays real-time data from the Italian Ministry of Justice API with advanced filtering, search, and analytics.

**Key Tech Stack**:
- Astro 5.11.0 (static site generation)
- React 19.1.0 (interactive components)
- TypeScript (strict mode)
- Tailwind CSS 3.4 (custom "civic" theme)
- GitHub Pages deployment
- Sharp (OG image generation)

## Build and Development Commands

```bash
npm install                    # Install dependencies (uses --legacy-peer-deps)
npm run dev                    # Start dev server (http://localhost:4321)
npm run build                  # Full production build (includes OG images + Astro build)
npm run preview                # Preview production build locally
npm run generate-og-images     # Generate OG images only (1200x630 PNG per initiative)
./scripts/download_data.sh     # Fetch and process API data (requires jq, mlr)
```

**Note**: The build pipeline automatically generates ~500 Open Graph images before running Astro build. This is computationally intensive (10-15s).

## Data Flow and Architecture

### Data Sources (Graceful Degradation)

1. **Primary**: Italian Ministry of Justice API
   - Endpoint: `https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public`
   - Format: JSON with `content` array
   - Updated: 6 times daily via GitHub Actions cron

2. **Fallback**: Local `src/data/source.json` (cached copy)

3. **Last Resort**: `src/data/sample-initiatives.json` (for development)

### Data Processing Pipeline

```
download_data.sh (bash):
  ├─ curl → fetch API data → source.json
  ├─ jq/mlr → flatten nested JSON → source.jsonl
  ├─ Extract active initiatives → time_line.jsonl
  ├─ Calculate daily averages → media_sostenitori_giornaliera.jsonl
  └─ Download questions → quesiti/{id}.md (via json2markdown.py)
```

All data fetching is centralized in `src/lib/initiatives.ts`:
- `fetchInitiatives()` - implements the graceful degradation chain
- `isSigningActive()` - checks if status === 'IN RACCOLTA FIRME'
- `formatDate()`, `formatNumber()` - locale-aware formatting

### Initiative Data Structure

```typescript
interface Initiative {
  id: number
  titolo: string
  descrizioneBreve?: string
  sostenitori?: number
  quorum?: number
  dataApertura: string
  dataChiusura?: string
  sito?: string
  idDecCatIniziativa: {id, nome}        // Category
  idDecStatoIniziativa: {id, nome}      // Status: IN RACCOLTA FIRME, CHIUSA, etc.
  idDecTipologiaIniziativa?: {id, nome} // Type: Initiative, Constitutional Referendum, etc.
}
```

## High-Level Architecture

### Page Structure (Astro File-Based Routing)

- `/` - HomePage (grid view with pagination, 12 items/page)
- `/tabella` - Table view (sortable columns, all initiatives)
- `/numeri` - Statistics & analytics (charts, top initiatives)
- `/info` - Project information & about
- `/initiative/[id]` - Dynamic detail pages (pre-rendered for all initiatives)
- `/rss.xml` - RSS feed
- `/404` - Custom 404 page

### Component Organization

**Static (Astro)**:
- `Layout.astro` - Base HTML with favicon, OG meta tags, head
- `Footer.astro` - Footer with links and stats
- `HamburgerMenuNative.astro` - Navigation menu

**Interactive (React)**:
- `HomePage.tsx` - Grid view with pagination
- `SearchAndFilters.tsx` - Complex filter/search state (13KB)
- `TableView.tsx` - Table rendering with sorting (27KB)
- `InitiativeCard.tsx` - Individual card with quorum badge
- `Pagination.tsx` - Pagination controls
- `ShareButton.tsx` - Web Share API integration

**Important Pattern**: React components use `client:load` directive to hydrate on page load. This keeps the site fast while enabling interactivity where needed.

### Key Business Logic

**Filters** (preserved in URL query params):
- By category, status, type
- Text search in title/description
- Sort by date opened, title (A-Z), supporters
- Pagination (12 items per page)

**Quorum Logic**:
- `hasReachedQuorum = sostenitori >= quorum`
- Shown as green badge in card view (even for closed initiatives)
- Displayed as "QUORUM RAGGIUNTO!" banner on detail pages

**Status States**:
- `IN RACCOLTA FIRME` - active collection
- `CHIUSA` - closed (grayed out on cards, 60% opacity)
- Others shown but not filtered by default

## Deployment and CI/CD

### GitHub Actions Workflow (`deploy.yml`)

**Triggers**:
1. **Push to main** (excluding .md and docs/ files)
2. **Scheduled**: 04:00, 08:00, 12:00, 16:00, 20:00, 21:30 UTC
3. **Manual**: via workflow_dispatch with reason input

**Build Steps**:
1. Checkout code
2. Node 18 + npm cache
3. Install system tools: `jq`, `mlr` (required for data processing)
4. Run `download_data.sh` (fetch and process API data)
5. Commit data files if changed
6. Generate OG images
7. Build with Astro
8. Deploy to GitHub Pages

**Environments**:
- Dev: `http://localhost:4321`, base=`/`
- Prod: `https://ondata.github.io`, base=`/referendum_iniziative_popolari`

**Remote Configuration**:
- Repository moved from `aborruso/referendum_astro` to `ondata/referendum_iniziative_popolari`
- Ensure `origin` remote points to `https://github.com/ondata/referendum_iniziative_popolari.git`
- Verify with: `git remote -v`

## Styling and Theme

**Custom Tailwind Theme** (`tailwind.config.mjs`):
- `civic-charcoal` - dark text/backgrounds
- `civic-terra` - terracotta/burnt orange accents
- `civic-stone` - neutral light gray
- `civic-success` - green (for quorum badges)
- `civic-neutral` - muted text

**Design Aesthetic**: "Civic Brutalism" with geometric shapes, strong borders, angular badges.

**Responsive Breakpoints**: Mobile-first, md (768px), lg (1024px)

## Open Graph Image Generation

`src/lib/og-image-generator.ts` generates per-initiative OG images (1200x630):

- **Default image** (id=0): branding/logo
- **Per-initiative images**: Dynamic background color by category
- **NumeriOG**: Statistics page image
- Uses Sharp library to render SVG → PNG
- Images cached in `public/og-images/` and committed to git

**Pattern**: Always run `npm run build` to regenerate images. They're critical for social media sharing.

## Important Notes

### Data Updates

- API data is fetched 6 times daily automatically
- Manual data refresh: Run `./scripts/download_data.sh` locally
- Data files in `src/data/` are committed to git (for GitHub Pages build)
- Questions (quesiti) are individual files, not in a database

### TypeScript Configuration

- `tsconfig.json` uses strict mode
- React 19 JSX support enabled
- Target ES2020

### Testing and Linting

**No formal testing setup** (no vitest, jest, playwright).
**No linting** (no ESLint, Prettier).
TypeScript strict mode provides type safety.

### Recent Architectural Changes

- **Jan 2026**: Fixed quorum banner visibility for closed initiatives
- **Jan 2026**: Initiative types now dynamic (not hardcoded IDs)
- **Jan 2026**: Quorum badge now visible on cards for closed initiatives
- See `LOG.md` for detailed change history

### File Size Hotspots

Monitor these for complexity:
- `src/components/TableView.tsx` (27KB) - sorting/filtering logic
- `src/components/SearchAndFilters.tsx` (13KB) - state management
- `src/pages/numeri.astro` (24KB) - multiple charts

## Git Workflow and Commits

**Important**: Always check for remote updates before committing and pushing:

```bash
git fetch origin              # Check what's on remote
git status                    # Verify local vs remote
git log origin/main -3        # See recent remote commits
```

**Standard workflow**:
```bash
git pull --rebase origin main # Get latest (rebase preferred)
# ... make changes ...
git commit -m "..."           # Commit locally
git push origin main          # Push immediately after commit
```

**Why**: The GitHub Actions workflow frequently commits data file updates (e.g., `source.json`). Local branch can fall behind, causing push rejections. Always `pull --rebase` before pushing.

**Quick workflow - avoid retry loops**:
```bash
git pull --rebase origin main && git push origin main
```
This single command prevents the "push rejected → pull → retry push" cycle. Always use this combined approach to ensure latest remote state before pushing.

**Remote Configuration**: Ensure `origin` points to `https://github.com/ondata/referendum_iniziative_popolari.git` (not a fork):
```bash
git remote -v  # Verify both fetch and push point to ondata org
```

## Development Tips

1. **Edit sample data locally**: `src/data/sample-initiatives.json` for development without API calls
2. **Fresh data**: Run `./scripts/download_data.sh` to download latest API data
3. **Quick preview**: `npm run dev` then edit components - Astro handles HMR for most changes
4. **Deploy testing**: Use manual workflow trigger to test without commit
5. **URL state**: All filters are in query params - maintain this for shareability

## Repository Links

- GitHub: `https://github.com/ondata/referendum_iniziative_popolari`
- Live Site: `https://ondata.github.io/referendum_iniziative_popolari/`
- Official API: `https://firmereferendum.giustizia.it/referendum/api-portal/`
