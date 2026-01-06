<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/` holds Astro routes (e.g., `index.astro`, `tabella.astro`, `info.astro`).
- `src/components/` contains reusable React/Astro UI pieces.
- `src/layouts/` defines shared page chrome.
- `src/lib/` and `src/types/` keep helpers and TypeScript types.
- `public/` stores static assets served as-is.
- `data/` contains API snapshots and derived JSONL files used by the site.
- `scripts/` includes data/asset utilities (e.g., `download_data.sh`, `generate-og-images.js`).

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the Astro dev server.
- `npm run build` generates OpenGraph images and builds the static site.
- `npm run preview` serves the production build locally.
- `npm run generate-og-images` runs `scripts/generate-og-images.js` directly.

## Coding Style & Naming Conventions
- Use 2-space indentation as seen in `.astro` and JS/TS files.
- Prefer clear, descriptive component names in `PascalCase` (e.g., `HomePage`, `Footer`).
- Keep Astro page files lowercase and route-aligned (e.g., `tabella.astro`).
- Styling is Tailwind-first; avoid custom CSS unless necessary. Configuration lives in `tailwind.config.mjs`.

## Testing Guidelines
- There is no automated test suite wired in `package.json` today.
- When changing UI or data logic, verify locally with `npm run dev` and `npm run preview`.
- If you add tests, document the runner and add corresponding `npm run test` scripts.

## Commit & Pull Request Guidelines
- Recent history follows Conventional Commits (e.g., `chore: update data files...`) and sometimes adds `[skip ci]` for data-only updates.
- Keep commit subjects short and scoped; use `feat:`, `fix:`, or `chore:` as appropriate.
- PRs should include a concise summary, link relevant issues, and add screenshots for UI changes.

## Data & Configuration Notes
- `astro.config.mjs` defines `site` and `base` for GitHub Pages deployments; update when forking.
- Data appears to be refreshed via scripts and CI; avoid editing `data/` by hand unless the change is intentional and documented.
