# Sistema di Generazione Immagini Open Graph

## Panoramica

Il sito genera automaticamente immagini di anteprima personalizzate per ogni iniziativa del referendum, ottimizzate per la condivisione sui social media e nelle chat.

## Come Funziona

### 1. Generazione Automatica

- Durante il build, il sistema scarica tutte le iniziative dall'API
- Per ogni iniziativa viene generata un'immagine PNG di 1200x630px
- Le immagini vengono salvate in `public/og-images/`

### 2. Template delle Immagini

Ogni immagine include:

- **Sfondo gradiente** con colori personalizzati
- **Titolo dell'iniziativa** (max 3 righe)
- **Badge della categoria** con colore specifico per tipo
- **Status dell'iniziativa** (es. "IN RACCOLTA FIRME")
- **Branding** discreto del sito
- **Elementi decorativi** per un design accattivante

### 3. Colori per Categoria

```typescript
AMBIENTE: #10b981 (verde)
DIRITTO: #8b5cf6 (viola)
ENERGIA: #f59e0b (ambra)
ISTRUZIONE E COMUNICAZIONE: #6366f1 (indaco)
OCCUPAZIONE E LAVORO: #14b8a6 (teal)
QUESTIONI SOCIALI: #ec4899 (rosa)
TRASPORTO: #84cc16 (lime)
UNIONE EUROPEA: #3b82f6 (blu)
VITA POLITICA: #ef4444 (rosso)
```

### 4. Meta Tag Open Graph

Ogni pagina di iniziativa include:

```html
<meta property="og:image" content="https://ondata.github.io/referendum_iniziative_popolari/og-images/og-[ID].png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
```

## File Coinvolti

### Generazione

- `src/lib/og-image-generator.ts` - Libreria principale per creare le immagini
- `scripts/generate-og-images.js` - Script che genera tutte le immagini
- `package.json` - Include il comando `npm run generate-og-images`

### Layout

- `src/layouts/Layout.astro` - Aggiunge i meta tag Open Graph
- `src/pages/initiative/[id].astro` - Usa l'immagine specifica per iniziativa

### Deploy

- `.github/workflows/deploy.yml` - Genera le immagini durante il build su GitHub Actions

## Comandi Utili

```bash
# Genera solo le immagini Open Graph
npm run generate-og-images

# Build completo (include generazione immagini)
npm run build

# Sviluppo locale
npm run dev
```

## Personalizzazione

### Modificare i Colori

Modifica la funzione `getCategoryColor()` in `src/lib/og-image-generator.ts`

### Cambiare il Template

Modifica la variabile `svgTemplate` nella funzione `generateOGImage()`

### Aggiungere Nuovi Elementi

- Logo/immagini: aggiungile come elementi SVG nel template
- Testi aggiuntivi: modifica la struttura SVG
- Effetti grafici: usa pattern SVG o gradienti

## Risoluzione Problemi

### Le immagini non vengono generate

1. Controlla che Sharp sia installato: `npm list sharp`
2. Verifica i permessi di scrittura in `public/og-images/`
3. Controlla i log del comando: `npm run generate-og-images`

### URL delle immagini non corretti

- Verifica la configurazione `site` e `base` in `astro.config.mjs`
- Controlla la funzione `ogImageUrl` in `Layout.astro`

### Immagini non visibili sui social

- Testa con il [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Usa il [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Assicurati che le immagini siano pubblicamente accessibili

## Dimensioni Ottimali

- **Open Graph**: 1200x630px (rapporto 1.91:1)
- **Twitter Card**: stessa immagine funziona per entrambi
- **Peso file**: ~30-50KB per immagine (ottimizzato con Sharp)

## Performance

- Le immagini vengono generate una sola volta durante il build
- Sono servite come file statici (molto veloce)
- Nessun impatto sulle performance runtime del sito
- Cache-friendly per i social media
