# Note Tecniche - Referendum e Iniziative Popolari

Questo documento contiene note tecniche utili per la gestione e manutenzione del sito.

## Indice
- [Immagini OpenGraph](#immagini-opengraph)
- [Sviluppo e Deploy](#sviluppo-e-deploy)
- [Configurazione Path](#configurazione-path)
- [Gestione Percorsi con Utility](#gestione-percorsi-con-utility)
- [Troubleshooting](#troubleshooting)

---

## Immagini OpenGraph

### Come testare la generazione immagini OpenGraph

Per rigenerare tutte le immagini OpenGraph delle iniziative. Andare nella cartella del progetto e lanciare il comando:

```bash
npm run generate-og-images
```

**Note:**

- Le immagini vengono salvate in `public/og-images/`
- Ogni iniziativa ha un'immagine con nome `og-{id}.png`
- L'immagine di default è `og-default.png`
- Le immagini sono 1200x630px (formato ottimale per social media)

### Verifica immagini OpenGraph

Per verificare che un'immagine OpenGraph sia corretta:

1. Aprire la pagina dell'iniziativa
2. Visualizzare il sorgente della pagina (View Source)
3. Cercare il tag `<meta property="og:image" content="..."/>`
4. Verificare che l'URL sia corretto e accessibile

---

## Sviluppo e Deploy

### Comandi principali

**Sviluppo locale:**

```bash
npm run dev
```

**Build di produzione:**

```bash
npm run build
```

**Anteprima build locale:**

```bash
npm run preview
```

### Configurazione ambienti

Il sito ha configurazioni diverse per sviluppo e produzione:

**Sviluppo:**

- `site`: `http://localhost:4321`
- `base`: `/`

**Produzione (GitHub Pages):**

- `site`: `https://ondata.github.io`
- `base`: `/referendum_iniziative_popolari`

---

## Configurazione Path

### Gestione BASE_URL

Il progetto usa `import.meta.env.BASE_URL` per gestire i percorsi:

- **Sviluppo**: `/`
- **Produzione**: `/referendum_iniziative_popolari/`

### Pattern corretti per path

**Per link interni:**

```astro
<a href={import.meta.env.BASE_URL}>Home</a>
<a href={`${import.meta.env.BASE_URL}tabella`}>Tabella</a>
```

**Per risorse statiche (favicon, immagini):**

```astro
<!-- Favicon -->
<link rel="icon" href={(() => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return baseUrl.endsWith('/') ? `${baseUrl}favicon.svg` : `${baseUrl}/favicon.svg`;
})()} />

<!-- Immagini OpenGraph -->
const ogImageUrl = (() => {
  const site = Astro.site?.toString() || '';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanSite = site.replace(/\/$/, '');
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanSite}${cleanBase}og-images/${ogImage}`;
})();
```

---

## Gestione Percorsi con Utility

### Gestione BASE_URL tra sviluppo e produzione

Il progetto è configurato per funzionare sia in sviluppo locale che su GitHub Pages. La differenza principale è il BASE_URL:

- **Sviluppo**: `/` (root del localhost)
- **Produzione**: `/referendum_iniziative_popolari/` (subdirectory su GitHub Pages)

### Utility per gestione percorsi

Il file `src/lib/paths.ts` contiene utility essenziali per gestire correttamente i percorsi:

```typescript
// Ottiene il base path normalizzato
getBasePath(): string
// Crea un percorso completo aggiungendo il base path
createPath(path: string): string
// Normalizza un base URL rimuovendo trailing slash
normalizeBaseUrl(baseUrl: string): string
```

### Uso corretto delle utility

**❌ NON fare così:**

```typescript
// Concatenazione manuale - rischio di errori
const url = import.meta.env.BASE_URL + '/rss.xml';
const siteUrl = context.site + import.meta.env.BASE_URL;
```

**✅ Fare così:**

```typescript
import { getBasePath } from '../lib/paths';

// Per costruire URL interni
const rssUrl = `${getBasePath()}/rss.xml`;

// Per costruire site URL completi
const site = context.site?.toString().replace(/\/$/, '') || '';
const basePath = getBasePath();
const siteUrl = `${site}${basePath}`;
```

### Gestione menu di navigazione

**❌ NON fare così:**

```astro
<!-- Gestione manuale dei percorsi -->
<a href={`${baseUrl.replace(/\/$/, '')}/numeri`}>Numeri</a>
```

**✅ Fare così:**

```astro
---
import { normalizeBaseUrl } from '../lib/paths';
const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
---

<!-- Uso della utility per coerenza -->
<a href={`${normalizedBaseUrl}/numeri`}>Numeri</a>
```

### Esempi pratici

**Link interni nei componenti Astro:**

```astro
<a href={`${import.meta.env.BASE_URL}info`}>Info</a>
<!-- Oppure usando le utility -->
<a href={createPath('/info')}>Info</a>
```

**Feed RSS e API endpoints:**

```typescript
// Sempre usare le utility per coerenza
const site = context.site?.toString().replace(/\/$/, '') || '';
const basePath = getBasePath();
const siteUrl = `${site}${basePath}`;
```

**Vantaggi delle utility:**

- **Coerenza**: Stesso comportamento in tutto il progetto
- **Manutenibilità**: Cambiamenti centralizzati
- **Affidabilità**: Gestione corretta di casi edge (slash multipli, URL vuoti)
- **Testing**: Logica testabile e isolata

---

## Troubleshooting

### Favicon non viene caricato

**Problema**: Favicon restituisce 404
**Causa**: Path non corretto tra sviluppo e produzione
**Soluzione**: Verificare che il favicon usi la logica corretta per BASE_URL (vedi sezione Configurazione Path)

### Immagini OpenGraph con doppio slash

**Problema**: URL come `https://example.com//og-images/image.png`
**Causa**: Concatenazione errata di site e BASE_URL
**Soluzione**: Usare la funzione di pulizia degli URL come mostrato sopra

### Link interni non funzionano in produzione

**Problema**: Link relativi non funzionano su GitHub Pages
**Causa**: BASE_URL non gestito correttamente
**Soluzione**: Sempre usare `import.meta.env.BASE_URL` per link interni

### Errori di build

**Se il build fallisce:**

1. Verificare che tutti i path siano corretti
2. Controllare che non ci siano import mancanti
3. Verificare la sintassi TypeScript/Astro
4. Pulire la cache: `rm -rf dist node_modules/.astro && npm install`

---

## File di configurazione importanti

- `astro.config.mjs`: Configurazione principale Astro
- `src/lib/paths.ts`: Utility per gestione percorsi
- `scripts/generate-og-images.js`: Script generazione immagini OpenGraph
- `src/layouts/Layout.astro`: Layout base con meta tag

---

## Aggiornamento dati

I dati delle iniziative vengono caricati da:

- `data/source.json`: Dati principali delle iniziative
- API esterna (se configurata): Per aggiornamenti in tempo reale

Per aggiornare i dati manualmente, sostituire il file `data/source.json` e rifare il build.
