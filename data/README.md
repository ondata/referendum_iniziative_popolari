# File Dati

Questa cartella contiene i file dati che alimentano il sito.

## File Principali

### `source.json` e `source.jsonl`

- **Fonte**: API Ministero della Giustizia
- **Contenuto**: Elenco completo di tutte le iniziative in raccolta firme e chiuse
- **Formato**:
  - `source.json` - JSON standard (uno per riga, struttura nidificata)
  - `source.jsonl` - JSON Lines (una riga = un'iniziativa, più efficiente)
- **Aggiornamento**: 6 volte al giorno via GitHub Actions
- **Uso**: Base dati per pagina home, tabella, ricerca e filtri
- **Anagrafica**: L'unico file che contiene i titoli e i metadati completi di ogni iniziativa

**Struttura dati principali:**

| Campo | Tipo | Esempio |
|-------|------|---------|
| id | numero | 5400034 |
| titolo | stringa | "Raccolta di almeno 500.000 firme per il referendum..." |
| descrizioneBreve | stringa | "La legge costituzionale oggetto della richiesta..." |
| sostenitori | numero | 220494 |
| quorum | numero | 500000 |
| dataApertura | stringa (YYYY-MM-DD) | 2025-12-22 |
| idDecCatIniziativa.nome | stringa | DIRITTO |
| idDecStatoIniziativa.nome | stringa | IN RACCOLTA FIRME |

**Nota**: Oltre ai campi elencati, il file contiene molti altri dati disponibili come date di inizio/fine validità, descrizione completa, quesito, e metadati dell'oggetto categoria e dello stato. Consultare un record completo del file per l'elenco esaustivo di tutti i campi disponibili.

### `time_line.jsonl`

- **Contenuto**: Timeline storica delle iniziative con data e numero di sostenitori nel tempo
- **Formato**: JSON Lines (una riga per data/iniziativa)
- **Uso**: Grafici e statistiche nella pagina Numeri, timeline dei sostenitori nelle pagine di dettaglio
- **Disponibilità dati**: Dal 6 luglio 2025 in poi
- **Nota**: Contiene solo ID e dati numerici. Per ottenere titoli e metadati, fare un join con `source.jsonl` sull'`id`
- **Dati storici**: Include sia iniziative attive che chiuse. Rimane traccia degli ID vecchi (chiusi) che hanno avuto dati storici durante la raccolta firme

**Struttura dati:**

| Campo | Tipo | Esempio |
|-------|------|---------|
| id | numero | 500022 |
| data | stringa (YYYY-MM-DD) | 2025-07-06 |
| sostenitori | numero | 11792 |

## Link alle Iniziative

Per accedere alla pagina di dettaglio di un'iniziativa dato un ID, il permalink è:

```
https://ondata.github.io/referendum_iniziative_popolari/initiative/{id}/
```

**Esempio**: L'iniziativa con ID `4100009` è disponibile a:
```
https://ondata.github.io/referendum_iniziative_popolari/initiative/4100009/
```

## Cartella `quesiti/`

- **Contenuto**: Testi ufficiali dei quesiti referendari (uno per iniziativa)
- **Formato**: File Markdown individualmente nominati per ID iniziativa
- **Esempio**: `4100009.md` contiene il quesito dell'iniziativa con ID 4100009
- **Uso**: Visualizzati nelle pagine di dettaglio delle iniziative
