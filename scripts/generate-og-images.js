import { fetchInitiatives } from '../src/lib/initiatives.ts';
import { generateAllOGImages } from '../src/lib/og-image-generator.ts';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    console.log('🚀 Avvio generazione immagini Open Graph...');

    // Fetch delle iniziative
    const initiatives = await fetchInitiatives();
    console.log(`📊 Trovate ${initiatives.length} iniziative`);

    // Directory di output per le immagini
    const outputDir = join(__dirname, '../public/og-images');

    // Genera tutte le immagini
    await generateAllOGImages(initiatives, outputDir);

    console.log('🎉 Generazione completata con successo!');
  } catch (error) {
    console.error('❌ Errore nella generazione delle immagini:', error);
    process.exit(1);
  }
}

main();
