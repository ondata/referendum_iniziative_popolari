# Referendum e Iniziative Popolari

Un sito web moderno per visualizzare e esplorare referendum e iniziative popolari in Italia, utilizzando i dati ufficiali del Ministero della Giustizia.

## 🌟 Caratteristiche

- **Dati ufficiali**: Integrazione con l'API del Ministero della Giustizia
- **Ricerca e filtri**: Cerca per titolo/descrizione, filtra per categoria e stato
- **Ordinamento intelligente**: Per data, titolo (A-Z) o numero sostenitori
- **Design responsive**: Ottimizzato per desktop, tablet e mobile
- **Paginazione**: Navigazione facile tra le iniziative
- **Link diretti**: Collegamenti alle pagine ufficiali per firmare
- **Stato dinamico**: Pulsanti "Firma ora" disabilitati se la raccolta è terminata

## 🚀 Demo

Il sito è pubblicato automaticamente su GitHub Pages ad ogni push al branch main.

**URL**: `https://aborruso.github.io/referendum_astro/`

## 🛠️ Tecnologie

- **Astro** - Framework per siti statici
- **React** - Componenti interattivi
- **TypeScript** - Tipizzazione sicura
- **Tailwind CSS** - Styling moderno
- **Heroicons** - Icone professionali
- **GitHub Actions** - Deploy automatico

## 📡 API

I dati provengono dall'API ufficiale del Ministero della Giustizia:
```
https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public
```

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

## � Configurazione

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
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
