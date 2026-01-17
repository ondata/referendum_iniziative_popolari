# Specifiche Tecniche Generali

Questo documento descrive le scelte architetturali di base adottate nel progetto, indipendenti dal caso d'uso specifico. Rappresenta un pattern riutilizzabile per progetti simili.

## Stack Tecnologico Core

**Generatore di siti statici**: Astro 5.x

- Output: sito completamente statico
- File-based routing automatico
- Build-time rendering per performance

**Componenti interattivi**: React 19.x

- Hydration selettiva tramite direttiva `client:load`
- Usato solo dove serve interattività (filtri, tabelle sortabili, paginazione)
- Pattern: componenti Astro per layout/statico, React per UI interattiva

**Type Safety**: TypeScript strict mode

- `extends: "astro/tsconfigs/strict"`
- No ESLint, no Prettier
- TypeScript come unico guardrail di qualità del codice

**Styling**: Tailwind CSS 3.x

- Tema personalizzato con variabili semantiche del dominio
- Typography plugin per contenuti markdown
- Configurazione custom animations/colors/fonts
- Mobile-first responsive design

## Architettura Componenti

### Separazione Static vs Interactive

**Componenti Astro** (`.astro`):
- Layout generale
- Header, Footer, Navigation
- Pagine con contenuto prevalentemente statico
- HTML pre-renderizzato a build time

**Componenti React** (`.tsx`):
- Filtri e ricerca
- Tabelle sortabili
- Paginazione
- Share button (Web Share API)
- Qualsiasi UI che richiede stato client-side

### State Management

**URL Query Params come single source of truth**:

- Tutti i filtri/stato persistiti in query string
- Shareability nativa (copia URL = condividi stato)
- No Redux/Zustand/Context per filtri semplici
- Browser back/forward funziona out-of-the-box

Esempio: `/?category=2&status=active&sort=date&page=3`

### Hydration Strategy

Direttiva `client:load` per componenti React:

- Hydration immediata al page load
- Alternativa: `client:idle` per componenti non critici
- Preferire `client:load` per UX (evita flash di contenuto non interattivo)

## Build & Deployment

### GitHub Actions Workflow

**Trigger multipli**:
1. Push al branch main (esclusi file .md e docs/)
2. Schedule cron (opzionale, per task ricorrenti)
3. Manual dispatch con input parametrizzato

**Build pipeline**:

```yaml
- Generate OG images (pre-build)
- Build with Astro
- Deploy to GitHub Pages
```

**Pattern importante**: Auto-commit in CI

- File generati/processati committati automaticamente se modificati
- Commit message con `[skip ci]` per evitare loop
- `git pull --rebase --autostash` prima del push

### Generazione OG Images

**Automatica e pre-build**:

- Script dedicato: `npm run generate-og-images`
- Libreria: Sharp (SVG → PNG)
- Esecuzione: prima di `astro build` in pipeline
- Output committato: `public/og-images/*.png`

**Pattern**:
- Un'immagine default
- Un'immagine per pagina/entità (dinamica, con contenuto inserito)
- Dimensioni standard: 1200x630px
- Colori/layout dinamici basati su categoria/tipo

### Configurazione Ambienti

**Dev vs Production tramite `NODE_ENV`**:

```javascript
// astro.config.mjs
const isProd = process.env.NODE_ENV === 'production';

export default {
  site: isProd ? 'https://example.github.io' : 'http://localhost:4321',
  base: isProd ? '/repo-name' : '/',
  output: 'static'
}
```

**Deploy target**: GitHub Pages

- Static site hosting
- Base path configurabile (per progetti sotto organizzazione)
- Ambiente production configurato via Pages settings

## Accessibilità (a11y)

### Principi Base

**Semantic HTML First**:
- Tag semantici (`<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`)
- Struttura documenti con headings gerarchici (`<h1>` → `<h6>`)
- Liste non ordinate (`<ul>`) per navigazione
- Button vs link: `<button>` per azioni, `<a>` per navigazione

**ARIA Attributes**:
- `aria-label` per descrizioni accessibili su elementi interattivi
- `aria-expanded` / `aria-hidden` per stati di componenti dinamici
- `aria-controls` per associazioni tra elementi
- `aria-current="page"` per indicare pagina corrente in navigazione
- `aria-live="polite"` / `role="status"` per regioni dinamiche (es. risultati filtri)
- `aria-modal="true"` per dialog/modal

**Immagini**:
- Rehype plugin custom (`rehypeValidateAlt`) per validare alt text
- Controlla immagini senza alt o con alt troppo corto (<10 caratteri)
- Warning a build time se missing/insufficient alt text
- Tutte le immagini decorative devono avere `alt=""`

### Implementazione

**Configurazione Markdown**:

```javascript
// astro.config.mjs
import { rehypeValidateAlt } from './src/lib/rehype-validate-alt.mjs';

export default {
  markdown: {
    rehypePlugins: [
      rehypeValidateAlt,  // Valida alt text
      // ... altri plugin
    ]
  }
}
```

**Pattern Componenti Interattivi**:

```tsx
// Esempio: Button con aria-label
<button
  aria-label="Condividi questa pagina"
  aria-expanded={isOpen}
  aria-controls="share-menu"
>
  <ShareIcon aria-hidden="true" />
</button>

// Live region per filtri
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {`${filteredCount} risultati trovati`}
</div>
```

**Lingua Documento**:
- Attributo `lang="it"` (o lingua appropriata) su `<html>`
- Importante per screen reader (pronuncia corretta)

### Checklist Accessibilità

- [ ] Tutti gli elementi interattivi hanno label accessibili
- [ ] Immagini hanno alt text descrittivo (non decorativo = alt vuoto)
- [ ] Headings gerarchici senza salti di livello
- [ ] Navigazione tastiera funzionante (tab order logico)
- [ ] Stati dinamici annunciati (aria-live, role="status")
- [ ] Contrast ratio sufficiente (WCAG AA: 4.5:1 per testo normale)
- [ ] Focus visibile su elementi interattivi
- [ ] Form inputs associati a label (`<label for="...">` o wrapping)

### Tool di Validazione

**Build-time**:
- Rehype plugin per alt text validation
- TypeScript strict (type safety riduce errori UI)

**Runtime (manuale)**:
- Lighthouse accessibility audit (Chrome DevTools)
- axe DevTools browser extension
- WAVE browser extension
- Keyboard navigation testing (solo tastiera)

## SEO e Social Sharing

### Meta Tags Foundation

**HTML Base**:
```html
<html lang="it">  <!-- Lingua documento -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="..." />
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  <meta name="author" content="..." />
  <link rel="canonical" href="..." />
  <title>...</title>
</head>
```

**Canonical URL**:
- Sempre presente su ogni pagina
- Opzionale: rimuovere query params se pagina base è canonica
- Pattern: `canonicalizeToBase` prop per controllare comportamento

### Open Graph (Facebook/LinkedIn)

**Meta tags completi**:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website|article" />
<meta property="og:url" content="..." />
<meta property="og:site_name" content="..." />
<meta property="og:locale" content="it_IT" />
<meta property="og:image" content="..." />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="..." />
```

**Immagini OG**:
- Dimensione standard: 1200x630px (aspect ratio 1.91:1)
- Formato: PNG (migliore supporto cross-platform)
- Generate automaticamente via script pre-build
- Committate in `public/og-images/`
- Una immagine default + una per pagina/entità

### Twitter Cards

**Summary Large Image**:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
<meta name="twitter:image:alt" content="..." />
```

### JSON-LD Structured Data

**Schema.org markup** per Google Rich Results:

**Organization Schema**:
```typescript
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nome Organizzazione",
  "url": "https://...",
  "description": "..."
}
```

**Article Schema** (per pagine contenuto):
```typescript
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": { "@type": "Organization", "name": "..." },
  "datePublished": "2024-01-01",
  "url": "https://..."
}
```

**BreadcrumbList Schema**:
```typescript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "..." },
    { "@type": "ListItem", "position": 2, "name": "Page", "item": "..." }
  ]
}
```

**SearchAction Schema** (homepage):
```typescript
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://.../?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Implementation Pattern

**Centralized Schema Generation**:
```typescript
// src/lib/json-ld-schemas.ts
export function generateOrganizationSchema(baseUrl: string) { ... }
export function generateArticleSchema(entity, baseUrl, id) { ... }
export function generateBreadcrumbListSchema(baseUrl, breadcrumbs) { ... }
export function generateSearchActionSchema(baseUrl) { ... }
```

**Layout Integration**:
```astro
---
// src/layouts/Layout.astro
export interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  jsonLdSchemas?: string[];  // Array di JSON-LD serializzati
}
---

<head>
  {jsonLdSchemas.map((schema) => (
    <script type="application/ld+json" set:html={schema} />
  ))}
</head>
```

### Favicon Strategy

**Multi-format per compatibilità**:
- `favicon.ico` (root fallback, legacy browsers)
- `favicon.svg` (modern browsers, scalabile)
- PNG multiple dimensioni: 16x16, 32x32, 48x48, 180x180 (Apple), 192x192, 512x512
- `manifest.json` per PWA (nome, icone, colori)

### RSS Feed

**Feed completo in XML**:
- Endpoint: `/rss.xml`
- Content-type: `application/rss+xml`
- Include: title, description, link, pubDate per ogni item
- Validato con W3C Feed Validator

### SEO Checklist

- [ ] Meta description unica per pagina (<160 caratteri)
- [ ] Title tag descrittivo (<60 caratteri, include keyword)
- [ ] Canonical URL su ogni pagina
- [ ] Open Graph tags completi (OG image 1200x630)
- [ ] Twitter Card configurata
- [ ] JSON-LD structured data (Organization, Article, Breadcrumb)
- [ ] Favicon multi-formato
- [ ] RSS feed (se contenuto periodico)
- [ ] Sitemap.xml generata (Astro sitemap plugin)
- [ ] robots.txt configurato
- [ ] Lingua documento dichiarata (`<html lang="...">`)

## Convenzioni & Best Practices

### No Formal Testing/Linting

**Scelta consapevole**:
- No vitest, jest, playwright
- No ESLint, no Prettier
- TypeScript strict mode fornisce type safety sufficiente
- Focus su semplicità e velocità di sviluppo

**Quando aggiungere testing**:
- Progetti enterprise
- Team multipli
- Logica business critica

### File Organization

```
src/
├── components/      # React (.tsx) + Astro (.astro)
├── pages/           # File-based routing
├── layouts/         # Layout Astro riusabili
├── lib/             # Utility functions, helpers
├── types/           # TypeScript types/interfaces
└── content/         # Markdown/MDX content (opzionale)

public/              # Asset statici, OG images generate
scripts/             # Automation scripts (opzionale)
```

### Markdown Processing

**Rehype plugins custom**:

```javascript
// astro.config.mjs
markdown: {
  rehypePlugins: [
    [rehypeBaseUrl, baseUrl],  // Fix relative URLs
    rehypeValidateAlt,         // Accessibilità immagini
  ]
}
```

### Tailwind Theme

**Pattern**: Variabili semantiche del dominio

```javascript
// tailwind.config.mjs
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#...',
        secondary: '#...',
        accent: '#...',
        // Semantica specifica del dominio, non "blue-500"
      }
    }
  }
}
```

## Git Workflow

### Pattern Anti-Conflict

**Sempre pull before push** quando CI fa commit automatici:

```bash
# Standard workflow
git pull --rebase origin main
# ... modifiche locali ...
git add .
git commit -m "..."
git push origin main

# One-liner per evitare retry loops
git pull --rebase origin main && git push origin main
```

**Motivo**: GitHub Actions può committare file automaticamente (es. build artifacts). Branch locale può essere dietro a remote.

### Commit Messages

**Conventional Commits implicito**:
- `chore:` per data updates, build config
- `feat:` per nuove funzionalità
- `fix:` per bug fix
- `[skip ci]` quando commit automatico da CI

## Performance Patterns

### Static Generation + Selective Hydration

- Tutte le pagine generate a build time
- JavaScript minimo caricato (solo componenti con `client:*`)
- Nessuna SSR, nessun server runtime

### Image Optimization

- Sharp per processing (build time)
- OG images pre-generate (non on-demand)
- Standard web formats (PNG per OG, ottimizzati con Sharp)

## Estensibilità

### Quando aggiungere questo pattern ad altri progetti

**Adatto per**:
- Contenuto prevalentemente statico con interattività selettiva
- Deploy su hosting statico (GitHub Pages, Netlify, Vercel)
- Siti con molte pagine pre-renderizzabili
- Team piccoli senza requirement enterprise

**Meno adatto per**:
- Applicazioni real-time (chat, live dashboards)
- E-commerce con inventario dinamico
- Piattaforme multi-tenant con dati per-utente
- Progetti che richiedono autenticazione server-side

## Dipendenze Core

```json
{
  "astro": "^5.x",
  "react": "^19.x",
  "typescript": "latest",
  "tailwindcss": "^3.x",
  "@astrojs/react": "^4.x",
  "@astrojs/tailwind": "^6.x",
  "sharp": "^0.34.x"
}
```

## Checklist Setup Nuovo Progetto

### Stack Base

- [ ] Init Astro con template base
- [ ] Aggiungi React integration
- [ ] Configura TypeScript strict
- [ ] Setup Tailwind con tema custom
- [ ] Configurazione base/site per production

### Build & Deploy

- [ ] GitHub Actions workflow (build + deploy)
- [ ] Script generazione OG images
- [ ] Configurazione triggers (push, schedule, manual)
- [ ] README con comandi build/dev
- [ ] Setup GitHub Pages environment
