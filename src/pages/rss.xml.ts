import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import fs from 'fs';
import path from 'path';
import { getBasePath } from '../lib/paths';

interface Initiative {
  id: string;
  titolo: string;
  dataApertura: string;
  descrizioneBreve?: string;
  descrizione?: string;
  'idDecCatIniziativa.nome'?: string;
  'idDecTipoIniziativa.id'?: number;
  'idDecTipoIniziativa.nome'?: string;
}

export async function GET(context: APIContext) {
  try {
    // Percorso del file JSONL
    const jsonlPath = path.join(process.cwd(), 'data', 'source.jsonl');

    // Leggi il file JSONL
    const fileContent = fs.readFileSync(jsonlPath, 'utf-8');
    const lines = fileContent.trim().split('\n');

    // Prendi le prime 10 linee e parsale
    const initiatives: Initiative[] = lines
      .slice(0, 10)
      .map(line => JSON.parse(line))
      .sort((a, b) => new Date(b.dataApertura).getTime() - new Date(a.dataApertura).getTime());

    // Costruisci il site URL utilizzando le utility esistenti
    const site = context.site?.toString().replace(/\/$/, '') || '';
    const basePath = getBasePath();
    const siteUrl = `${site}${basePath}`;

    return rss({
      title: 'Referendum e Iniziative Popolari - Ultime Iniziative',
      description: 'Feed RSS delle ultime iniziative e referendum popolari in Italia',
      site: siteUrl,
      items: initiatives.map((initiative) => {
        const officialUrl = `https://firmereferendum.giustizia.it/referendum/open/dettaglio-open/${initiative.id}`;

        // Determina il tipo di iniziativa
        const tipoIniziativa = initiative['idDecTipoIniziativa.nome'] || 'Iniziativa popolare';

        const categoria = initiative['idDecCatIniziativa.nome'] || 'Generale';

        const description = initiative.descrizioneBreve || initiative.descrizione || 'Descrizione non disponibile';

        return {
          title: initiative.titolo,
          pubDate: new Date(initiative.dataApertura),
          description: `${tipoIniziativa} - ${categoria}: ${description}`,
          link: officialUrl,
          guid: `initiative-${initiative.id}`,
        };
      }),
      customData: `<language>it-it</language>`,
    });
  } catch (error) {
    console.error('Errore nella generazione del feed RSS:', error);

    // Costruisci il site URL utilizzando le utility esistenti anche per l'errore
    const site = context.site?.toString().replace(/\/$/, '') || '';
    const basePath = getBasePath();
    const siteUrl = `${site}${basePath}`;

    // Ritorna un feed vuoto in caso di errore
    return rss({
      title: 'Referendum e Iniziative Popolari - Feed non disponibile',
      description: 'Errore nel caricamento delle iniziative',
      site: siteUrl,
      items: [],
    });
  }
}
