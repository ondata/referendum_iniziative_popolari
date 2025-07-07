# Note Tecniche - Referendum e Iniziative Popolari

Questo documento contiene note tecniche utili per la gestione e manutenzione del sito.

## Indice
- [Immagini OpenGraph](#immagini-opengraph)
- [Sviluppo e Deploy](#sviluppo-e-deploy)
- [Configurazione Path](#configurazione-path)
- [Gestione Percorsi con Utility](#gestione-percorsi-con-utility)
- [Gestione Menu di Navigazione](#gestione-menu-di-navigazione)
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

## Gestione Menu di Navigazione

### Configurazione Centralizzata

Il menu di navigazione è ora gestito tramite un file di configurazione centralizzato che elimina la duplicazione del codice tra i diversi componenti menu.

**File di configurazione:** `src/config/navigation.ts`

```typescript
export interface MenuItem {
  href: string;
  label: string;
  icon: string; // SVG path
  external?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '/numeri',
    label: 'Numeri',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    href: '/tabella',
    label: 'Tabella',
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0V4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  },
  {
    href: '/info',
    label: 'Info',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }
];

// Funzione helper per ottenere l'URL completo di una voce di menu
export function getMenuItemUrl(item: MenuItem, baseUrl: string): string {
  if (item.external || item.href.startsWith('http')) {
    return item.href;
  }
  
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return item.href === '/' ? (normalizedBaseUrl || '/') : `${normalizedBaseUrl}${item.href}`;
}
```

### Componenti Menu

Il progetto utilizza due componenti menu:

1. **HamburgerMenuNative.astro**: Menu nativo Astro (utilizzato nelle pagine principali)
2. **HamburgerMenuReact.tsx**: Menu React (utilizzato nelle pagine con componenti React pesanti)

Entrambi ora utilizzano la configurazione centralizzata:

**Esempio utilizzo in HamburgerMenuNative.astro:**

```astro
---
import { menuItems, getMenuItemUrl } from '../config/navigation';
const { baseUrl } = Astro.props;
---

<nav class="menu-dropdown">
  <div class="menu-content">
    {menuItems.map((item) => (
      <a href={getMenuItemUrl(item, baseUrl)} class="menu-item">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
        </svg>
        {item.label}
      </a>
    ))}
  </div>
</nav>
```

**Esempio utilizzo in HamburgerMenuReact.tsx:**

```tsx
import { menuItems, getMenuItemUrl } from '../config/navigation';

export default function HamburgerMenuReact({ baseUrl }: HamburgerMenuReactProps) {
  return (
    <div className="py-2">
      {menuItems.map((item) => (
        <a
          key={item.href}
          href={getMenuItemUrl(item, baseUrl)}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
          onClick={closeMenu}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {item.label}
          </div>
        </a>
      ))}
    </div>
  );
}
```

### Vantaggi della Centralizzazione

- **Single Source of Truth**: Tutte le voci di menu definite in un solo posto
- **Coerenza**: Stesso ordine e struttura in tutti i menu
- **Manutenibilità**: Aggiungere/rimuovere voci modificando solo il file di configurazione
- **Type Safety**: TypeScript garantisce la struttura corretta delle voci di menu
- **Gestione URL**: Funzione helper per gestire correttamente i percorsi in sviluppo e produzione

### Aggiungere una Nuova Voce di Menu

Per aggiungere una nuova voce al menu:

1. Aprire `src/config/navigation.ts`
2. Aggiungere la nuova voce all'array `menuItems`:

```typescript
{
  href: '/nuova-pagina',
  label: 'Nuova Pagina',
  icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}
```

3. I menu verranno automaticamente aggiornati in tutte le pagine

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
