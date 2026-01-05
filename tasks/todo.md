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

## Domande Non Risolte

- Schema: Usare `DataFeed` per le iniziative come feed aggregato?
- Canonicalization: Preferire base URL con/senza `/index` per parametri?
- Breadcrumb: Mostrare sempre o solo in pagine dettaglio?
- Monitoraggio: Integrare Google Analytics 4 o Plausible?
