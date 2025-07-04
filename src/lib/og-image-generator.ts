import sharp from 'sharp';
import type { Initiative } from '../types/initiative';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface OGImageOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  categoryColor?: string;
}

const defaultOptions: Required<OGImageOptions> = {
  width: 1200,
  height: 630,
  backgroundColor: '#1e40af', // blue-800
  textColor: '#ffffff',
  categoryColor: '#3b82f6' // blue-500
};

// Funzione per wrappare il testo su più righe considerando la larghezza del font
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  // Stima approssimativa: carattere medio = fontSize * 0.6
  const avgCharWidth = fontSize * 0.6;
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    // Se la parola singola è troppo lunga, la spezziamo
    if (word.length > maxCharsPerLine) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }

      // Spezza la parola lunga
      let remainingWord = word;
      while (remainingWord.length > maxCharsPerLine) {
        lines.push(remainingWord.substring(0, maxCharsPerLine - 1) + '-');
        remainingWord = remainingWord.substring(maxCharsPerLine - 1);
      }
      currentLine = remainingWord;
    } else if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// Funzione per generare il colore basato sulla categoria
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'AMBIENTE': '#10b981', // emerald-500
    'SALUTE': '#ef4444', // red-500
    'ECONOMIA': '#f59e0b', // amber-500
    'DIRITTI': '#8b5cf6', // violet-500
    'GIUSTIZIA': '#6366f1', // indigo-500
    'SOCIALE': '#ec4899', // pink-500
    'LAVORO': '#14b8a6', // teal-500
    'TRASPORTI': '#84cc16', // lime-500
  };

  return colors[category.toUpperCase()] || '#3b82f6'; // default blue-500
}

export async function generateOGImage(
  initiative: Initiative,
  outputPath: string,
  options: OGImageOptions = {}
): Promise<void> {
  const opts = { ...defaultOptions, ...options };

  const title = initiative.titolo || 'Iniziativa Popolare';
  const category = initiative.idDecCatIniziativa?.nome || 'GENERALE';
  const status = initiative.idDecStatoIniziativa?.nome || 'IN RACCOLTA FIRME';

  // Wrapper del titolo considerando la larghezza disponibile
  const titleMaxWidth = opts.width - 120; // Margini laterali
  const titleFontSize = 56;
  const titleLines = wrapText(title, titleMaxWidth, titleFontSize);
  const maxLines = 3;
  const displayLines = titleLines.slice(0, maxLines);
  if (titleLines.length > maxLines) {
    displayLines[maxLines - 1] = displayLines[maxLines - 1].slice(0, -3) + '...';
  }

  const categoryColor = getCategoryColor(category);

  // Calcolo più preciso delle larghezze
  const categoryWidth = Math.max(category.length * 11 + 40, 120);
  const statusWidth = Math.max(status.length * 9 + 30, 100);

  // Creo il template SVG per l'immagine
  const svgTemplate = `
    <svg width="${opts.width}" height="${opts.height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Sfondo gradiente -->
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${opts.backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
        </linearGradient>

        <!-- Pattern decorativo -->
        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)" />
        </pattern>
      </defs>

      <!-- Sfondo principale -->
      <rect width="100%" height="100%" fill="url(#bg)" />
      <rect width="100%" height="100%" fill="url(#dots)" />

      <!-- Barra superiore -->
      <rect x="0" y="0" width="100%" height="8" fill="${categoryColor}" />

      <!-- Badge categoria -->
      <rect x="60" y="60" width="${categoryWidth}" height="40" rx="20" fill="${categoryColor}" />
      <text x="${60 + categoryWidth / 2}" y="85"
            text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="18"
            font-weight="600"
            fill="white">
        ${category}
      </text>

      <!-- Titolo principale -->
      ${displayLines.map((line, index) => `
        <text x="60" y="${180 + (index * 65)}"
              font-family="system-ui, -apple-system, sans-serif"
              font-size="56"
              font-weight="700"
              fill="${opts.textColor}"
              textLength="${Math.min(line.length * 33, titleMaxWidth)}"
              lengthAdjust="spacingAndGlyphs">
          ${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </text>
      `).join('')}

      <!-- Status badge -->
      <rect x="60" y="${opts.height - 120}" width="${statusWidth}" height="35" rx="17" fill="rgba(255,255,255,0.2)" />
      <text x="${60 + statusWidth / 2}" y="${opts.height - 97}"
            text-anchor="middle"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="16"
            font-weight="500"
            fill="${opts.textColor}">
        ${status}
      </text>

      <!-- Logo/Brand text -->
      <text x="${opts.width - 60}" y="${opts.height - 40}"
            text-anchor="end"
            font-family="system-ui, -apple-system, sans-serif"
            font-size="20"
            font-weight="500"
            fill="rgba(255,255,255,0.7)">
        Referendum e Iniziative Popolari
      </text>

      <!-- Elemento decorativo -->
      <circle cx="${opts.width - 100}" cy="100" r="80" fill="rgba(255,255,255,0.05)" />
      <circle cx="${opts.width - 100}" cy="100" r="50" fill="rgba(255,255,255,0.1)" />
    </svg>
  `;

  try {
    // Genero l'immagine PNG usando Sharp
    const pngBuffer = await sharp(Buffer.from(svgTemplate))
      .png({
        quality: 90,
        compressionLevel: 6
      })
      .toBuffer();

    // Creo la directory se non esiste
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    mkdirSync(dir, { recursive: true });

    // Salvo il file
    writeFileSync(outputPath, pngBuffer);

    console.log(`✅ Immagine OG generata: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Errore nella generazione dell'immagine per ${initiative.id}:`, error);
    throw error;
  }
}

export async function generateAllOGImages(initiatives: Initiative[], outputDir: string): Promise<void> {
  console.log(`🎨 Generazione di ${initiatives.length} immagini Open Graph...`);

  // Genero l'immagine di default per la homepage
  const defaultInitiative: Initiative = {
    id: 0,
    titolo: 'Referendum e Iniziative Popolari',
    dataApertura: '',
    idDecCatIniziativa: { id: 0, nome: 'DEMOCRAZIA' },
    idDecStatoIniziativa: { id: 0, nome: 'ATTIVE' }
  };

  await generateOGImage(
    defaultInitiative,
    join(outputDir, 'og-default.png')
  );

  // Genero le immagini per ogni iniziativa
  const promises = initiatives.map(initiative =>
    generateOGImage(
      initiative,
      join(outputDir, `og-${initiative.id}.png`)
    )
  );

  await Promise.all(promises);
  console.log(`✅ Tutte le immagini Open Graph generate in: ${outputDir}`);
}
