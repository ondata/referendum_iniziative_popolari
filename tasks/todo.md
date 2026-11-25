# Tabella responsive (`/tabella`) — 2026-11-25

Branch `feat/tabella-schede`. Problema: a 390px si vedono solo Titolo e Tipologia; le altre 5 colonne sono fuori schermo senza indicazione. L'ordinamento è un `onClick` sulle `<th>`: non usabile da tastiera, nessun `aria-sort`. Scelta concordata: schede impilate sotto i 600px di larghezza del contenitore.

## Fase 1 — Semantica e accessibilità (vale a ogni larghezza)

- [x] Intestazioni: `<th scope="col">` con `<button type="button">` interno, `aria-sort` solo sulla colonna ordinata → verifica: Tab raggiunge i pulsanti, Invio ordina, `aria-sort` cambia
- [x] Titolo come intestazione di riga (`<th scope="row">`), `<caption>` nascosta, contenitore scorrevole con `role="region"`, nome accessibile e `tabindex="0"` → verifica: DOM renderizzato

## Fase 2 — Schede impilate sotto i 600px (container query)

- [x] CSS in `global.css`: `@container` sul contenitore della tabella; sotto 600px `thead` nascosto, ogni riga è una scheda, ogni cella mostra la sua etichetta da `data-label` → verifica: screenshot a 390px, tutti i 7 campi visibili senza scorrimento orizzontale
- [x] Controlli «Ordina per» e direzione, visibili solo in modalità schede e legati allo stesso stato del sort → verifica: cambiano ordine e URL come le intestazioni
- [x] Desktop invariato → verifica: screenshot a 1440px prima/dopo

## Fase 3 — Chiusura

- [x] Build di produzione, anteprima locale in finestra stretta (agent-browser headed via X410), `LOG.md`, commit, PR → 2026-11-25, [PR #21](https://github.com/ondata/referendum_iniziative_popolari/pull/21), dopo rebase su `main` (include la #20)

## Domande aperte

- nessuna

## Review

- 2026-11-25, verificato con build di produzione su Node 22 e anteprima locale in agent-browser headed (X410). A 390px: intestazione nascosta, schede con tutti i 7 campi, «Ordina per → Sostenitori» ordina dalla più firmata e scrive `?ordinamento=sostenitori`. A 1280px: tabella come prima (screenshot prima/dopo), Invio sul pulsante «Quorum» ordina crescente, `aria-sort=ascending` solo su Quorum, focus resta sul pulsante.

# Redesign — Referendum Astro

Audit basato su pagine **renderizzate** (Chrome headless, desktop 1440px + mobile 390px) e lettura del codice.

## Diagnosi: il progetto è già forte

Design system "Civic Brutalism" maturo e coerente: font pairing Crimson Pro / DM Sans / JetBrains Mono, accento terracotta singolo e desaturato, tabular-nums sui dati, hover/focus/active states, skip-link, favicon completi, OG + JSON-LD, texture, ombre tinte. I passi 1–2 della Fix Priority della skill (font swap, color cleanup di base) sono **già fatti**. Non si riparte da zero: solo interventi chirurgici.

## Cosa è genuinamente debole (drift di palette generico in un sistema terra/charcoal)

### Fase 1 — Coerenza palette + componenti (alto impatto, basso rischio)

- [ ] **Pagination.tsx** — interamente generica: angoli arrotondati (`rounded-md/lg`), bordi `gray-200/300`, stato attivo `bg-blue-50/border-blue-500/text-blue-600`. Stona col sistema angolare brutalista. Visibile in home a ogni visita. → angolare (niente rounded), `civic-border`, stato attivo `civic-terra`, focus/active feedback coerente.
- [ ] **SearchAndFilters.tsx** — input/select dei filtri con `border-gray-300` e focus ring `ring-blue-500` (su ogni pagina). → `civic-border` + focus ring terracotta (coerente con `a/button` in global.css).
- [ ] **initiative/[id].astro** — grafico timeline sostenitori con linea `#1f77b4` (blu default matplotlib/D3), unica nota blu del sito. → `civic-terra` (#c1694f). Testi `text-gray-700/800/900` (righe ~490–498) → `civic-charcoal`/`civic-neutral`.
- [ ] **HomePage.tsx** — stato vuoto: bottone "Rimuovi filtri" `bg-blue-600 rounded-md` + statistiche `text-gray-600`. → bottone terracotta angolare + `civic-neutral`.
- [ ] **tabella.astro:16** — `bg-gray-50` → `civic-stone`.

### Fase 2 — Pulizia

- [ ] **test_timeline.astro** — artefatto di debug (75 righe), non linkato da nessuna pagina, in routing di produzione. → rimuovere (da confermare).

## Lasciato intenzionalmente com'è

- **ShareButton.tsx** — i blu/verde sono i colori brand delle piattaforme (Twitter/Facebook, WhatsApp): corretti, non drift.
- **404 "Ops!"** — copy ironico volutamente in italiano con curiosità sul CERN: scelta editoriale, non un errore.
- **HamburgerMenuReact.tsx** — non è morto: usato in TableView.tsx.

## Domande aperte

- Pagination: ricostruisco in stile brutalista angolare (consigliato) o tocco solo i colori?
- test_timeline.astro: lo rimuovo?
- ShareButton: confermo che i colori-piattaforma restano?

## Review

Tutto verificato su pagine renderizzate (Chrome headless, cache pulita).

**Fatto — Fase 1:**
- `Pagination.tsx` ricostruita angolare: niente `rounded`, bordi `border-2 civic-border`, pagina attiva `civic-terra` (era blu), `civic-number` tabular, `active:translate-y-px`.
- `SearchAndFilters.tsx`: input/select → `border-2 civic-border` + focus ring `civic-terra` (era `ring-blue-500`); contenitori `border-3 civic-border` (niente rounded/shadow grigia); checkbox `accent-civic-terra`; bottone "cancella" angolare con hover terracotta; icona ricerca `civic-neutral`.
- `initiative/[id].astro`: linea+dot timeline `#1f77b4` → `#c1694f`; prose `text-gray-700/800/900` → `civic-charcoal`/`civic-neutral`.
- `HomePage.tsx`: stato vuoto → riquadro tratteggiato civic + bottone terracotta angolare (era `bg-blue-600 rounded-md`); statistiche `civic-neutral` + `civic-number`; header di fallback (ramo dead `hideHeader=false`) riallineato a charcoal/terra.
- `tabella.astro`: `bg-gray-50` → `bg-civic-stone`.

**Fatto — extra emersi durante il lavoro:**
- `HamburgerMenuReact.tsx` (usato in TableView su header charcoal): righe `bg-gray-600` → bianche, terracotta da aperto; dropdown `rounded-lg border-gray-200` → `border-3 civic-border` + ombra brutalista; voci uppercase con accento terracotta. Ora identico al Native.
- `public/manifest.json`: `theme_color #3B82F6` (blu) → `#1a1a1a`; `background_color #ffffff` → `#f5f3f0`.

**Fatto — Fase 2:**
- Rimosso `src/pages/test_timeline.astro` (artefatto di debug).

**Lasciato intenzionalmente:** colori-piattaforma di `ShareButton.tsx`; copy ironico del 404.

**Drift residuo dopo i lavori:** solo `ShareButton.tsx` (intenzionale).

**Nota operativa:** durante il lavoro l'utente vedeva ancora il vecchio design — era **cache del browser** (nessun service worker). Risolto con hard refresh; il server serviva già il design aggiornato.

**Non committato:** modifiche lasciate nel working tree in attesa di conferma.
