// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],

  // Configurazione per GitHub Pages
  site: process.env.NODE_ENV === 'production' ? 'https://ondata.github.io' : 'http://localhost:4321',
  base: process.env.NODE_ENV === 'production' ? '/referendum_iniziative_popolari' : '/',
  output: 'static', // Genera sito statico
});
