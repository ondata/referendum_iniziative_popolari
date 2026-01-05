# Piano Azione SEO - Referendum Astro

**Data inizio**: 2026-01-05
**Data completamento Fase 1-2**: 2026-01-05
**Obiettivo**: Portare score SEO da 6.5/10 a 8.5/10+

## Fase 1: Criticità Alta (impatto SEO immediato) ✅

- [x] Aggiungere H1 mancante in `/tabella.astro`
- [x] Aggiungere H1 mancante in `/initiative/[id].astro` (già presente)
- [x] Implementare JSON-LD Schema per Organization (home page)
- [x] Implementare JSON-LD Schema per Article (initiative detail pages)
- [x] Implementare JSON-LD Schema per BreadcrumbList (pagine principali)

## Fase 2: Miglioramenti Medi (impatto rilevante) ✅

- [x] Fix robots.txt: parametrizzare URL sitemap (non hardcoded)
- [x] Aggiungere breadcrumb visibile in pagine dettaglio
- [x] Canonicalize query params per filtri (evitare duplicati)
- [x] Aggiungere SearchAction schema (Google Search Box)

## Fase 3: Ottimizzazioni Minori (impatto piccolo ma misurabile)

- [ ] Aggiungere meta tag `theme-color` per browser
- [ ] Verificare link interni in markdown (BASE_URL handling)
- [ ] Aggiungere Open Graph article:published_time per initiative pages
- [ ] Aggiungere structured data per iniziative con rating schema

## Fase 4: Monitoring (post-fix)

- [ ] Setup Google Search Console integration
- [ ] Implementare Core Web Vitals monitoring
- [ ] Testare con Lighthouse
- [ ] Validare JSON-LD con Google Structured Data Testing Tool

---

# Feature: Filtro Quorum (GitHub Issue #12) ✅

**Data inizio**: 2026-01-05
**Data completamento**: 2026-01-05
**Obiettivo**: Aggiungere checkbox per filtrare solo iniziative che hanno raggiunto il quorum

## Implementazione ✅

### Fase 1: Funzione Helper ✅
- [x] Aggiungere `hasReachedQuorum()` in `src/lib/initiatives.ts`
  - Verifica: `sostenitori >= quorum` (entrambi definiti)

### Fase 2: Modifica SearchAndFilters.tsx ✅
- [x] Aggiungere stato `onlyQuorumReached`
- [x] Aggiungere checkbox nella barra filtri
- [x] Gestire URL parameters (`quorum=true`)
- [x] Aggiungere logica di filtraggio
- [x] Aggiornare `clearAllFilters()`

### Fase 3: Test ✅
- [x] Build completato senza errori
- [x] URL shareable (`?quorum=true`)
- [x] Checkbox persiste negli URL params

## Summary Modifiche

**File modificati**:
1. `src/lib/initiatives.ts`: aggiunta funzione `hasReachedQuorum()`
2. `src/components/SearchAndFilters.tsx`: aggiunto stato, checkbox, gestione URL, logica filtraggio
3. `LOG.md`: documentate le modifiche

**Funzionalità**:
- Checkbox nella barra filtri per mostrare solo iniziative con quorum raggiunto
- Funziona sia per iniziative aperte che chiuse
- URL param shareable: `/tabella?quorum=true`
- Si integra con altri filtri (categoria, stato, tipo, ricerca)
- Checkbox resettabile con pulsante "Cancella filtri"

**Commit**: `ea17806` - "feat: add quorum filter checkbox to search panel"

---

## Domande Non Risolte

- Schema: Usare `DataFeed` per le iniziative come feed aggregato?
- Canonicalization: Preferire base URL con/senza `/index` per parametri?
- Breadcrumb: Mostrare sempre o solo in pagine dettaglio?
- Monitoraggio: Integrare Google Analytics 4 o Plausible?
