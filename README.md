# Referendum e Iniziative Popolari

Un sito web moderno per visualizzare e esplorare referendum e iniziative popolari in Italia, utilizzando i dati ufficiali del Ministero della Giustizia.

## 🌟 Caratteristiche

- **Dati ufficiali**: integrazione con l'API del Ministero della Giustizia
- **Ricerca e filtri**: cerca per titolo/descrizione, filtra per categoria e stato
- **Ordinamento intelligente**: per data, titolo (A-Z) o numero sostenitori
- **Design responsive**: ottimizzato per desktop, tablet e mobile
- **Paginazione**: navigazione facile tra le iniziative
- **Link diretti**: collegamenti alle pagine ufficiali per firmare
- **Stato dinamico**: pulsanti "Firma ora" disabilitati se la raccolta è terminata

## 🚀 Demo

Il sito è pubblicato automaticamente su GitHub Pages ad ogni push al branch main.

**URL**: <https://ondata.github.io/referendum_iniziative_popolari/>

## 🛠️ Tecnologie

- **Astro** - Framework per siti statici
- **React** - Componenti interattivi
- **TypeScript** - Tipizzazione sicura
- **Tailwind CSS** - Styling moderno
- **Heroicons** - Icone professionali
- **GitHub Actions** - Deploy automatico

## 📡 API

I dati provengono dall'API del Ministero della Giustizia:

```bash
https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public
```

## 📊 File Dati

I file dati scaricati dalla API sono archiviati nella cartella `data/`. Per una documentazione completa dei file disponibili, i loro formati e i campi contenuti, consulta [`data/README.md`](data/README.md).

**File principali**:

- `source.jsonl` - anagrafica completa di tutte le iniziative
- `time_line.jsonl` - dati storici giornalieri delle firme raccolte
- `quesiti/` - testi ufficiali dei quesiti referendari

## 🏗️ Sviluppo

```bash
# Installa dipendenze
npm install

# Avvia server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview del build
npm run preview
```

## 📦 Deploy

Il sito si auto-deploya su GitHub Pages tramite GitHub Actions. Per configurare:

1. Vai su **Settings** → **Pages** nel repository GitHub
2. Seleziona **GitHub Actions** come source
3. Il deploy avviene automaticamente ad ogni push al branch `main`

## ⚙️ Configurazione

Per utilizzare questo progetto su un altro repository:

1. Modifica `astro.config.mjs`:

   ```js
   site: 'https://tuousername.github.io',
   base: '/nome-repository',
   ```

2. Il workflow GitHub Actions in `.github/workflows/deploy.yml` gestisce automaticamente il resto.

## 📄 Licenza

Progetto open source. I dati provengono dal Ministero della Giustizia italiano.

## 👨‍💻 Sviluppo

Sviluppato con ❤️ per rendere più accessibili le informazioni sui referendum e iniziative popolari italiane.

### Struttura del progetto

- `src/pages/` - Pagine del sito (index.astro, tabella.astro, info.astro)
- `src/components/` - Componenti React/Astro riutilizzabili
- `src/layouts/` - Layout base per le pagine
- `src/lib/` - Utilità e funzioni helper
- `src/types/` - Definizioni TypeScript
- `public/` - Asset statici (immagini, favicon)

### Funzionalità principali

- **Vista a card**: Presentazione moderna delle iniziative con paginazione
- **Vista tabellare**: Visualizzazione compatta con ordinamento per colonne
- **Filtri dinamici**: Ricerca e filtri che si influenzano reciprocamente
- **URL persistenti**: I filtri vengono salvati nell'URL per condivisione
- **Pagine dettaglio**: Informazioni complete per ogni iniziativa
- **OpenGraph**: Immagini di anteprima ottimizzate per social media
- **Design responsive**: Ottimizzato per tutti i dispositivi
- **Aggiornamento**: Le informazioni sono aggiornate una volta al giorno
