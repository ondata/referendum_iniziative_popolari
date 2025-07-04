// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  // Configurazione per GitHub Pages
  site: 'https://aborruso.github.io', // Sostituisci con il tuo username GitHub
  base: '/referendum_astro', // Nome del repository
  output: 'static', // Genera sito statico

  vite: {
    plugins: [tailwindcss()]
  }
});
