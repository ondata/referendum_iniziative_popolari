import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import fs from 'fs';
import path from 'path';

interface Initiative {
  id: string;
  titolo: string;
  dataApertura: string;
  descrizioneBreve?: string;
  descrizione?: string;
  'idDecCatIniziativa.nome'?: string;
  'idDecTipoIniziativa.id'?: number;
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

    // Costruisci il site URL corretto come fanno le altre pagine
    const siteUrl = (() => {
      const site = context.site?.toString() || '';
      const baseUrl = import.meta.env.BASE_URL || '/';

      // Rimuovi trailing slash dal site
      const cleanSite = site.replace(/\/$/, '');

      // Gestisci il base URL: se è solo '/', non aggiungerlo
      let cleanBase = '';
      if (baseUrl !== '/') {
        cleanBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
        cleanBase = cleanBase.endsWith('/') ? cleanBase.slice(0, -1) : cleanBase;
      }

      return `${cleanSite}${cleanBase}`;
    })();

    return rss({
      title: 'Referendum e Iniziative Popolari - Ultime Iniziative',
      description: 'Feed RSS delle ultime iniziative e referendum popolari in Italia',
      site: siteUrl,
      items: initiatives.map((initiative) => {
        const officialUrl = `https://firmereferendum.giustizia.it/referendum/open/dettaglio-open/${initiative.id}`;

        // Determina il tipo di iniziativa
        const tipoIniziativa = initiative['idDecTipoIniziativa.id'] === 4
          ? 'Legge di iniziativa popolare'
          : initiative['idDecTipoIniziativa.id'] === 1
          ? 'Referendum abrogativo'
          : 'Iniziativa popolare';

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

    // Costruisci il site URL corretto anche per l'errore
    const siteUrl = (() => {
      const site = context.site?.toString() || '';
      const baseUrl = import.meta.env.BASE_URL || '/';

      // Rimuovi trailing slash dal site
      const cleanSite = site.replace(/\/$/, '');

      // Gestisci il base URL: se è solo '/', non aggiungerlo
      let cleanBase = '';
      if (baseUrl !== '/') {
        cleanBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
        cleanBase = cleanBase.endsWith('/') ? cleanBase.slice(0, -1) : cleanBase;
      }

      return `${cleanSite}${cleanBase}`;
    })();

    // Ritorna un feed vuoto in caso di errore
    return rss({
      title: 'Referendum e Iniziative Popolari - Feed non disponibile',
      description: 'Errore nel caricamento delle iniziative',
      site: siteUrl,
      items: [],
    });
  }
}
