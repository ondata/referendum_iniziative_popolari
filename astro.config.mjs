// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { rehypeBaseUrl } from './src/lib/rehype-base-url.mjs';
import { rehypeValidateAlt } from './src/lib/rehype-validate-alt.mjs';

// Configurazione per GitHub Pages
const baseUrl = process.env.NODE_ENV === 'production' ? '/referendum_iniziative_popolari' : '/';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), sitemap()],

  // Configurazione per GitHub Pages
  site: process.env.NODE_ENV === 'production' ? 'https://ondata.github.io' : 'http://localhost:4321',
  base: baseUrl,
  output: 'static', // Genera sito statico

  // Markdown processing
  markdown: {
    rehypePlugins: [
      [rehypeBaseUrl, baseUrl],
      rehypeValidateAlt,
    ],
  },
});
