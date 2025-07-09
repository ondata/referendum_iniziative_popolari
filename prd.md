# Product Requirements Document (PRD)

L'URL dei dati di input è: [https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public](https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public)

## 1. Introduzione

- **Scopo del documento:** Definire i requisiti per lo sviluppo di un sito web che visualizza informazioni estratte da un dataset JSON fornito, utilizzando un formato a card per una presentazione chiara e coinvolgente.
- **Pubblico di riferimento:** Persone che vogliono partecipare alla vita democratica e in generale tutte le persone interessate a conoscere e sostenere le iniziative referendarie e proposte di legge.

## 2. Obiettivi

- Fornire un'interfaccia utente intuitiva e facile da navigare.
- Presentare le informazioni chiave in modo chiaro e sintetico.
- Permettere agli utenti di esplorare le informazioni in dettaglio se lo desiderano.
- Ottimizzare il sito per la visualizzazione su diversi dispositivi (desktop, tablet, mobile).

## 3. Funzionalità

### Visualizzazione a Card

- Ogni elemento del dataset JSON deve essere rappresentato come una card separata.
- Le card devono essere disposte in un layout responsive (griglia o simile).
- Le card devono contenere un sottoinsieme delle informazioni più rilevanti (vedi "Informazioni da visualizzare nelle card").

### Dettagli Elemento

- Cliccando su una card, l'utente deve essere reindirizzato a una pagina di dettaglio specifica.
- La pagina di dettaglio deve visualizzare tutte le informazioni disponibili per quell'elemento del dataset JSON.

### Paginazione

- Implementare un sistema di paginazione per gestire un numero elevato di elementi.
- Visualizzare il numero di elementi totali, l'indice della pagina corrente e il numero di elementi per pagina.

### Ricerca/Filtro

- Fornire una barra di ricerca per consentire agli utenti di trovare elementi specifici in base a parole chiave.
- Implementare filtri basati su categorie o altri attributi rilevanti (es. `idDecCatIniziativa.nome`, `idDecStatoIniziativa.nome`).
- **Filtri dinamici:** I filtri si influenzano reciprocamente mostrando solo le opzioni disponibili in base alle altre selezioni attive.
- **URL persistenti:** I filtri attivi vengono riflessi nell'URL permettendo di condividere link con filtri preimpostati e di mantenere lo stato durante la navigazione.

### Ordinamento

- Consentire agli utenti di ordinare gli elementi in base a determinati criteri (es. data di apertura, numero di sostenitori, titolo).

### Pagine Aggiuntive

#### Pagina Info

- Una pagina dedicata che descrive il progetto, i suoi obiettivi e come utilizzare il sito.
- Deve includere informazioni sul dataset utilizzato e la fonte dei dati.
- Accessibile tramite link nel menu di navigazione principale.

#### Vista Tabellare

- Una pagina che presenta le iniziative in formato tabellare per una visualizzazione più compatta.
- Colonne della tabella:
  - **Titolo:** `titolo` (con link alla single page dell'iniziativa)
  - **Tipologia:** `idDecTipologiaIniziativa.nome`
  - **Categoria:** `idDecCatIniziativa.nome`
  - **Stato:** `idDecStatoIniziativa.nome`
  - **Numero Sostenitori:** `sostenitori`
  - **Quorum:** `quorum`
  - **Data Apertura:** `dataApertura`
- La tabella deve essere ordinabile per ogni colonna con indicazione visiva della direzione di ordinamento.
- **Filtri avanzati:** Include la stessa logica di filtri della home page con:
  - Filtri dinamici che si influenzano reciprocamente
  - URL che si adatta ai filtri applicati
  - Barra di ricerca integrata
  - Pulsante per cancellare tutti i filtri
  - Contatore di risultati filtrati
- **Gestione stato vuoto:** Messaggio informativo quando non ci sono risultati con opzione per rimuovere i filtri.
- Accessibile tramite link nel menu di navigazione principale.

#### Pagina Numeri

- Una pagina dedicata alle statistiche e ai numeri di riepilogo delle iniziative.
- Deve presentare i dati in forma di istogrammi e visualizzazioni grafiche.
- Include metriche aggregate come totali per categoria, stato delle iniziative e trend.
- Accessibile tramite link nel menu di navigazione principale.

### Informazioni da visualizzare nelle card

- **Titolo:** `titolo`
- **Descrizione Breve:** `descrizioneBreve`
- **Categoria:** `idDecCatIniziativa.nome` (es. "VITA POLITICA")
- **Stato:** `idDecStatoIniziativa.nome` (es. "IN RACCOLTA FIRME")
- **Data Apertura:** `dataApertura` (formattata in modo leggibile)
- **Numero Sostenitori:** `sostenitori`

### Informazioni da visualizzare nella pagina di dettaglio

- Tutti i campi del JSON, formattati in modo leggibile.
- Possibilità di tornare alla pagina principale.

### Link Esterni

- Se presente, il campo `sito` deve essere visualizzato come un link cliccabile che apre una nuova scheda.

### Funzionalità di Condivisione

- Nella pagina di dettaglio, accanto al tasto "Sostieni", deve essere presente un tasto "Condividi".
- Il tasto "Condividi" deve permettere la condivisione dell'URL della pagina su social media, chat e altre piattaforme.
- La funzionalità deve utilizzare la Web Share API nativa quando disponibile sui dispositivi mobili.
- Come fallback per desktop, deve fornire opzioni di condivisione per le principali piattaforme (WhatsApp, Telegram, Twitter, Facebook, LinkedIn).
- L'URL condiviso deve includere i metadati OpenGraph ottimizzati per una preview ricca sui social.

### Feed RSS

- Il sito deve generare automaticamente un feed RSS (`/rss.xml`) contenente le ultime iniziative.
- Il feed deve includere:
  - **Titolo dell'iniziativa:** `titolo`
  - **Descrizione:** Composta da tipologia, categoria e descrizione nel formato `"{tipologia} - {categoria}: {descrizione}"`
  - **Data di pubblicazione:** `dataApertura`
  - **Link:** URL ufficiale dell'iniziativa su firmereferendum.giustizia.it
  - **GUID univoco:** Basato sull'ID dell'iniziativa (`initiative-{id}`)
- Il feed deve essere limitato alle prime 10 iniziative ordinate per data di apertura (più recenti prima).
- Il feed deve essere accessibile tramite icona RSS nel footer del sito.
- Auto-aggiornamento: Il feed si aggiorna automaticamente ad ogni deploy con i nuovi dati.

### Timeline Sostenitori

- Il sistema deve tracciare l'evoluzione nel tempo del numero di sostenitori per ogni iniziativa.
- **Visualizzazione nella pagina di dettaglio:** Nella pagina di dettaglio di ogni iniziativa, se disponibili dati storici, verrà mostrato un grafico che visualizza l'andamento nel tempo del numero di sostenitori.
- **Raccolta dati automatica:**
  - Durante ogni aggiornamento dei dati (4 volte al giorno), il sistema deve salvare:
    - **ID dell'iniziativa:** `id`
    - **Numero di sostenitori corrente:** `sostenitori`
    - **Data di rilevamento:** formato `YYYY-MM-DD`
  - Salvare solo le iniziative in stato "IN RACCOLTA FIRME" (`idDecStatoIniziativa.id == 2`)
- **Gestione duplicati:** Il sistema deve eliminare automaticamente i duplicati per evitare multiple entry nella stessa giornata per la stessa iniziativa.
- **File di output:** I dati della timeline devono essere salvati in `data/time_line.jsonl` in formato JSONL.
- **Struttura dati timeline:**

  ```json
  {"id": "123456", "sostenitori": 1500, "data": "2025-01-15"}
  {"id": "123456", "sostenitori": 1750, "data": "2025-01-16"}
  ```

- **Utilizzo futuro:** Questi dati possono essere utilizzati per:
  - Creare grafici dell'andamento delle firme nel tempo
  - Mostrare statistiche di crescita giornaliera/settimanale
  - Identificare iniziative con maggiore momentum
  - Analisi predittive sul raggiungimento del quorum

### Trasparenza dei Dati

- **Accessibilità dei dati grezzi:** Quando il sito pubblica grafici, statistiche o visualizzazioni basate sui dati, deve sempre fornire un link diretto ai dati grezzi utilizzati.
- **Posizionamento dei link:** I link ai dati grezzi devono essere chiaramente visibili nelle sezioni delle note o legenda di ogni grafico/statistica.
- **Formato dei dati:** I dati grezzi devono essere accessibili in formato JSONL per garantire interoperabilità e facilità di elaborazione.
- **Link persistenti:** I link devono puntare a repository pubblici (es. GitHub) per garantire persistenza e versionamento dei dati.

### Pagina 404 Personalizzata

- Il sito deve avere una pagina 404 personalizzata e coinvolgente per gestire gli errori di navigazione.
- **Contenuti richiesti:**
  - Messaggio di errore spiritoso e in tema con il contesto delle iniziative popolari e referendum
  - Icona visiva appropriata (es. emoji o icona triste)
  - Numero "404" ben visibile e stilizzato
  - Spiegazione amichevole dell'errore
- **Funzionalità di navigazione:**
  - Pulsante principale per tornare alla home page
  - Pulsante secondario per tornare alla pagina precedente (tramite `history.back()`)
- **Contenuti aggiuntivi:**
  - Curiosità o informazione divertente correlata al tema del sito
  - Design coerente con il resto del sito utilizzando lo stesso layout e componenti
- **Comportamento:**
  - La pagina deve essere automaticamente servita da Astro per tutte le URL non trovate
  - Deve mantenere la struttura responsive del sito
  - Deve essere ottimizzata per tutti i dispositivi (desktop, tablet, mobile)

## 4. Wireframes/Mockups

- **Pagina Principale:**
  - Header: Logo del sito, barra di ricerca, filtri, ordinamento.
  - Area card: Griglia di card, paginazione.
- **Pagina di Dettaglio:**
  - Header: Titolo dell'elemento.
  - Contenuto: Visualizzazione formattata di tutti i campi del JSON.
  - Footer: Link per aprire pagina ufficiale iniziativa (se c'è) e link alla pagina ufficiale dell'iniziativa sul sito del Ministero.

## 5. Design (UI)

- **Schema colori:** Palette moderna e pulita utilizzando Tailwind CSS
- **Tipografia:** Font system di Tailwind CSS per leggibilità ottimale
- **Stile delle card:** Design minimalista con ombre e bordi arrotondati
- **Responsività:** Il sito deve essere pienamente responsive e adattabile a diverse dimensioni di schermo utilizzando Tailwind CSS

## 6. Dati

- **Formato dati:** JSON (come fornito dall'API)
- **Origine dati:** API endpoint fornito dal Ministero di Giustizia
- **Aggiornamento dati:** I dati vengono recuperati al momento del build del sito statico

## 7. Requisiti Tecnici

- Il sito deve essere statico: per ogni referendum o proposta di legge verrà generata una pagina singola (single page) dedicata.
- **Astro** è il framework scelto per la generazione statica delle pagine e la gestione delle rotte.

- Ogni single page avrà una sezione OpenGraph ottimizzata per la condivisione su social e chat:
  - Verrà generata staticamente un'immagine di preview con il titolo dell'iniziativa.
  - Il link OpenGraph non punterà alla pagina web del sito, ma direttamente alla pagina ufficiale del Referendum o dell'iniziativa popolare, così l'utente potrà partecipare subito.

- **Linguaggi e Framework:**
  - HTML, CSS, JavaScript
  - Framework: **Astro** per la generazione statica e la gestione delle pagine
  - Componenti: Astro components con possibile integrazione di componenti React/Vue se necessario
- **Responsività:** Utilizzo di Tailwind CSS per garantire la responsività e un design moderno.
- **Paginazione:** Implementazione client-side per la navigazione tra le card.
- **Hosting:** Il sito sarà ospitato su **GitHub Pages** con supporto per siti statici Astro.
- **Automazione dati:**
  - Utilizzo di **GitHub Actions** per l'aggiornamento automatico dei dati 4 volte al giorno (ore 8, 12, 16, 20 UTC).
  - Script bash per download e processamento dati utilizzando `jq` e `miller` (mlr).
  - Commit automatico dei dati aggiornati nel repository.
  - **Deploy selettivo:** Il deploy automatico deve essere escluso per modifiche ai soli file di documentazione (`prd.md`, `LOG.md`, `README.md`, file nella cartella `docs/`) per ottimizzare le risorse e evitare build non necessarie.
- **Feed RSS:**
  - Generazione automatica tramite `@astrojs/rss` come endpoint Astro (`/rss.xml`).
  - Lettura diretta del file `data/source.jsonl` per performance ottimali.
- **Timeline sostenitori:**
  - Processamento automatico durante il download dei dati.
  - Utilizzo di `miller` per filtraggio, trasformazione e deduplicazione.
  - Accumulo progressivo dei dati storici in `data/time_line.jsonl`.
- **SEO:**
  - Ottimizzazione per i motori di ricerca (meta description, titoli, URL amichevoli).
  - Ottimizzazione OpenGraph per ogni single page, con immagine di anteprima e link diretto alla pagina ufficiale dell'iniziativa.
  - Astro genera automaticamente HTML ottimizzato per SEO.

## 8. Test

- **Test di funzionalità:** Verificare che tutte le funzionalità funzionino correttamente.
- **Test di usabilità:** Assicurarsi che l'interfaccia sia intuitiva e facile da usare.
- **Test di compatibilità:** Verificare la compatibilità con diversi browser e dispositivi.
- **Test di performance:** Assicurarsi che il sito si carichi rapidamente e sia reattivo.

Nota bene: al momento non sono implementati.

## 9. Criteri di Accettazione

- Tutte le funzionalità devono essere implementate secondo le specifiche.
- Il design deve corrispondere ai mockup approvati.
- Il sito deve superare tutti i test.
- Il codice deve essere pulito, ben documentato e conforme agli standard di codifica.

## 10. Tempi e Budget

Non applicabile.
