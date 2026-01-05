# Log delle modifiche

## 2026-01-05

- **Creato README nella cartella `data/`**. Documentazione completa dei file dati principali: `source.json/jsonl`, `time_line.jsonl`, `media_sostenitori_giornaliera.jsonl`, `check_date.txt`, `deploy_log.jsonl` e contenuto delle sottocartelle `quesiti/` e `sample/`. Include frequenza di aggiornamento e casi d'uso.
- **Disabilitato tasto di accesso ai dati nel footer**. Il pulsante download nel footer che permetteva di scaricare il file `source.jsonl` è stato commentato per il momento, in attesa di future modifiche. Modificato il file `src/components/Footer.astro`.
- **Risolto bug: menu hamburger coperto dagli sticky header in tutte le pagine**. Il problema era duplice:
  1. Il bottone hamburger non aveva z-index esplicito (era z-auto)
  2. Gli sticky header di pagina avevano `z-10`, che crea un nuovo stacking context e copre il menu z-60
- **Fix 1 - HamburgerMenuNative.astro**: Aggiunto `z-50` al `.hamburger-btn` e `z-index: 60` CSS standard al `.menu-dropdown` (poiché z-60 non esiste in Tailwind).
- **Fix 2 - Sticky headers**: Aumentati da `z-10` a `z-40` in TableView.tsx, numeri.astro, info.astro e dati.astro. I sticky header con stacking context basso impedirebbero al menu (z-60) di stare sopra.
- **Gerarchia z-index finale**: Menu dropdown z-60 > Sticky headers z-40 > Overlay z-40 > Contenuti z-auto
- **Corretto errore build**: La classe Tailwind `z-60` non esiste. Sostituito con proprietà CSS standard `z-index: 60`.

## 2026-01-04

- **Corretto Footer per applicare sempre role="contentinfo"**. Il componente Footer accettava un prop `role` opzionale ma senza valore default, causando situazioni in cui l'attributo non veniva reso nel HTML finale. Modificato `src/components/Footer.astro` per impostare `role = 'contentinfo'` come default. Questo garantisce che il footer avrà sempre il ruolo ARIA corretto per l'accessibilità, indipendentemente da come viene utilizzato il componente.
- **Implementati ARIA labels completi su componenti interattivi**:
  - **SearchAndFilters.tsx**: aria-label su input ricerca, select filtri (categoria, stato, tipo), select ordinamento, pulsante cancella. Aggiunta live region (role="status" aria-live="polite") per annunciare filtri applicati ai screen reader.
  - **Pagination.tsx**: aria-label su pulsanti precedente/successiva, numeri pagina. Aggiunto aria-current="page" al numero di pagina corrente. Migliorate le etichette con numero pagina esplicito.
  - **HamburgerMenuNative.astro**: Aggiunto aria-expanded e aria-controls al pulsante hamburger. Aggiunto aria-hidden="true" al menu. Aggiornato script per cambiare aria-expanded/aria-hidden al toggle del menu.
  - **ShareButton.tsx**: aria-label sul pulsante principale e su ogni opzione di condivisione. Menu condivisione con role="dialog", aria-modal="true", aria-label. Pulsante copia link con aria-label specifico.
- **Valutazione accessibilità migliorata da 6.5/10 a 8/10**: ARIA labels e live regions implementate riducono significativamente le barriere per utenti con disabilità e screen reader.
- **Risolto bug: banner "QUORUM RAGGIUNTO!" non visualizzato per iniziative chiuse**. Il banner era condizionato sia su `hasReachedQuorum` che su `signingActive`. Per iniziative come "Eutanasia Legale" (4100009) con quorum raggiunto ma stato CHIUSA, il banner non appariva.
- Il quorum raggiunto è un fatto storico che deve essere visualizzato indipendentemente dallo stato dell'iniziativa. Modificato il file `src/pages/initiative/[id].astro` rimuovendo la condizione `signingActive`.
- Ora il banner appare per qualsiasi iniziativa che ha raggiunto il quorum, indipendentemente dal fatto che la raccolta firme sia attiva o conclusa.
- **Aggiunto badge QUORUM nella vista a griglia anche per iniziative chiuse**. Modificato `src/components/InitiativeCard.tsx` per visualizzare il badge QUORUM in tutte le iniziative che hanno raggiunto il quorum, anche se chiuse. Questo comunica visivamente due informazioni importanti: il fatto che l'iniziativa è conclusa (sfondo grigetto) e che ha raggiunto il quorum (badge verde in alto a destra).
- **Rimosso quadrato decorativo inutile dal footer**. L'elemento era un semplice bordo semi-trasparente che non aveva alcuna funzione visuale o semantica. Semplificato il layout da 3 colonne a 2 colonne, mantenendo il contenuto centrale e le icone a destra.

## 2026-01-02

- **Risolto bug: tipologie iniziative non visualizzate correttamente**. Il codice era hardcodato per mostrare solo 2 tipologie (ID 1 e 4), escludendo altre come "Referendum costituzionale" (ID 2).
- Cambiato da logica hardcodata a utilizzo del campo `idDecTipoIniziativa.nome` in tutte le componenti:
  - Pagine dettaglio iniziative
  - Filtri di ricerca e tabella iniziative
  - Feed RSS
- Ora tutte le tipologie presenti nei dati vengono visualizzate correttamente e sono filtrabili.

## 2025-08-17

- Migliorata la leggibilità delle etichette dell'asse X nel grafico "Timeline sostenitori" su mobile:
	- Le label sono ora ruotate di 45°.
	- Aumentato il margine inferiore del grafico per evitare il taglio delle scritte.
	- Issue tracciata e chiusa su GitHub.

## 2025-08-08

- Migliorato il grafico della timeline dei sostenitori nella pagina di dettaglio dell'iniziativa. Ora, passando il mouse sul grafico, compare una linea verticale che segue il puntatore, con un tooltip che mostra la data e il numero di sostenitori per il punto selezionato. Questo migliora l'interattività e la leggibilità dei dati.

## 2025-07-23

- **Implementata sezione "Iniziative correlate"** nelle pagine di dettaglio delle iniziative. La nuova sezione mostra un elenco di massimo 3 iniziative correlate della stessa categoria, selezionate casualmente tra quelle con raccolta firme attiva.
- **Criteri di selezione**: le iniziative correlate devono appartenere alla stessa categoria dell'iniziativa visualizzata, escludere l'iniziativa corrente, e avere stato "IN RACCOLTA FIRME".
- **Ottimizzata la funzione `isSigningActive()`**: ora si basa esclusivamente sullo stato ufficiale dell'iniziativa (`idDecStatoIniziativa.nome === 'IN RACCOLTA FIRME'`) invece di calcoli complessi sulle date, garantendo maggiore affidabilità e coerenza con i dati del Ministero della Giustizia.
- **Posizionamento**: la sezione appare dopo la timeline dei sostenitori e prima del quesito, come specificato nei requisiti.
- **Comportamento dinamico**: la sezione si nasconde automaticamente se non ci sono iniziative correlate disponibili nella categoria.
- La funzionalità migliora la navigabilità del sito e aiuta gli utenti a scoprire iniziative correlate di loro interesse.

## 2025-07-17

- Aggiunta l'integrazione `@astrojs/sitemap` per la generazione automatica della sitemap.xml. Questo migliora l'indicizzazione del sito da parte dei motori di ricerca.
- Aggiunto il file `robots.txt` per guidare i crawler dei motori di ricerca e specificare la posizione della sitemap.

## 2025-07-14

- Il ranking Top 10 delle iniziative per media sostenitori giornalieri mostra ora **solo le iniziative attive** ("IN RACCOLTA FIRME").
- Correzione workflow: ora il deploy del log (`data/deploy_log.jsonl`) viene gestito nel job `build` e non più in `deploy`, per evitare errori git dovuti all'ambiente di deploy-pages. La sequenza aggiornata dovrebbe garantire la corretta scrittura e commit del log notturno. Da verificare nei prossimi run automatici.

## 2025-07-13

- Corretto errore nel job `deploy` del workflow GitHub Actions: ora viene creata la cartella `data` prima di scrivere il file `data/deploy_log.jsonl` durante il cron delle 21:30 UTC. Questo evita errori di mancata creazione del file di log e garantisce la corretta registrazione dello stato del deploy notturno.
- Nessun impatto sull'archiviazione dei dati principali: i file dati vengono comunque aggiornati e committati regolarmente dal job `build`.

## 2025-07-12

- Aggiunta la registrazione automatica dello stato del deploy notturno (cron delle 21:30 UTC) nel file `data/deploy_log.jsonl`. Ogni giorno viene salvato se il deploy è andato a buon fine (`success`) o meno (`fail`), in formato JSON Lines. Questo permette di monitorare facilmente la riuscita dei deploy automatici direttamente dal repository.

Esempio di riga:

```bash
{"date": "2025-07-12", "status": "success"}
```

- La funzionalità è integrata nel workflow GitHub Actions e aggiorna il log solo per il cron delle 21:30 UTC.
- Lo script di download ora scarica e archivia automaticamente i dettagli dei quesiti per ogni iniziativa in raccolta firme, salvandoli nella cartella `data/quesiti/` come file JSON individuali.
- Integrato lo script `json2markdown.py` nel processo di download dati (`download_data.sh`). Ora, per ogni quesito scaricato, viene generato automaticamente anche il corrispondente file Markdown, a partire dal JSON sorgente, nella cartella `data/-uesiti/`. Questo migliora la leggibilità e la fruibilità dei testi dei quesiti direttamente dal repository.
- Lo script Python non richiede dipendenze esterne: funziona con la sola libreria standard di Python 3.
- Aggiunta la gestione dei quesiti con riconoscimento automatico di titoli come ART., CAPO, ecc. nei file JSON tramite script `json2markdown.py`.
- Aggiunti nuovi quesiti nella cartella `data/quesiti/`.
- I quesiti sono ora visibili anche nelle pagine di dettaglio (single page) di ciascuna iniziativa, rendendo immediatamente consultabile il testo ufficiale direttamente dal sito.

## 2025-07-09

- Modificato l'indicatore di "Tendenza" nella pagina Numeri: ora mostra la variazione percentuale della crescita delle firme. Questo permette un confronto più equo ed efficace tra iniziative con volumi di raccolta molto diversi.
- Semplificata la tabella per dispositivi mobili nella pagina Numeri, rimuovendo la colonna della tendenza per una migliore leggibilità.
- Aggiunta la sezione "Timeline sostenitori" nella pagina di dettaglio dell'iniziativa. Questa sezione mostra un grafico con l'andamento temporale del numero di sostenitori ed è visibile solo per le iniziative per cui sono disponibili dati storici.
- I valori della "Media sostenitori giornalieri" nella tabella e nel grafico lollipop della pagina Numeri sono ora arrotondati a numero intero (firme), senza decimali, per maggiore chiarezza e coerenza.

## 2025-07-08

- Implementato il requisito di trasparenza dei dati: aggiunti link ai dati grezzi nella pagina Numeri.
- Aggiunto link al file `source.jsonl` per la sezione "Numero di iniziative per categoria".
- Aggiunto link al file `time_line.jsonl` per la sezione "Top 10 - Media sostenitori giornalieri".
- I link ai dati grezzi sono posizionati nelle note di ciascuna sezione per garantire trasparenza e accessibilità.

## 2025-07-07

- Aggiunta pagina 404 personalizzata.
- Aggiunta gestione centralizzata del menu di navigazione.
- Integrazione di Heroicons per le icone.
- Aggiunta gestione dei percorsi normalizzati nel menu hamburger.
- Creata pagina Numeri con statistiche e grafici delle iniziative.
- Aggiunto grafico lollipop orizzontale nella pagina Numeri per visualizzare le top 10 iniziative con più alta media di sostenitori giornalieri.
- Implementata visualizzazione responsive per il grafico lollipop: su desktop viene mostrato il grafico, su mobile una tabella compatta con titoli troncati.
- Aggiunta logica per caricare e unire i dati da `media_sostenitori_giornaliera.jsonl` con le iniziative esistenti.
- Implementate ancore cliccabili per i titoli delle sezioni grafiche per consentire link diretti e navigazione SEO-friendly.
- Applicata conformità alle best practices per la gestione dei percorsi usando le utility centralizzate (`createPath`).
- Creata immagine OpenGraph dedicata per la pagina Numeri (`og-numeri.png`) e aggiornato il generatore di immagini OG.
- Aggiornate le note esplicative nella pagina Numeri per riflettere le nuove funzionalità di visualizzazione dati.
- Migliorata la UI della vista a griglia: i box delle iniziative con stato "CHIUSA" ora appaiono con colori più spenti per distinguerli visivamente.

## 2025-07-06

- Aggiunto file `.gitattributes` per la normalizzazione delle interruzioni di riga.
- Aggiunto script per il download e la trasformazione dei dati JSON.
- Migliorata la documentazione e la struttura dello script di download dei dati.
- Aggiornata la pianificazione del deploy automatico a 4 volte al giorno.
- Corretta la costruzione dell'URL del sito per il feed RSS.
- Aggiunta la sezione "Gestione Percorsi con Utility" nel documento NOTE_TECNICHE.
- Aggiunta la funzionalità di generazione del feed RSS e il tracciamento della timeline dei sostenitori.
- Aggiunta l'icona per il download dei dati nel footer.
- Migliorato il layout del footer con una griglia responsiva.
- Aggiunta la funzione `normalizeUrl` per la gestione degli URL.
- Aggiunta la funzione `normalizeForSorting` per migliorare l'ordinamento dei titoli.
- Aggiornato il footer della pagina di dettaglio per includere link ufficiali dell'iniziativa.
- Corretti URL nel README per riflettere il nome corretto del progetto.
- Aggiunti attributi title alle icone nel footer.
- Migliorata la timeline delle firme con filtraggio e ordinamento.

## 2025-07-05

- Semplificata l'importazione del contenuto markdown nella pagina delle informazioni.
- Ridotta la dimensione del titolo e rimosso il messaggio di stato della raccolta firme.
- Gestita la paginazione e i filtri tramite URL nella HomePage e in SearchAndFilters.
- Migliorata la responsività e l'aspetto visivo della pagina dell'iniziativa.
- Aggiunto il file `check_date.txt` con la data di scaricamento dei dati dell'API.
- Aggiunta la logica per leggere la data di aggiornamento da `check_date.txt` nel footer.
- Migliorata la logica di filtraggio delle opzioni disponibili nei menu a discesa.
- Centralizzati i contenuti della home page in un file di configurazione.
- Aggiunto il supporto per il plugin `@tailwindcss/typography`.
- Migliorata la formattazione e la chiarezza del contenuto nella sezione "Come funziona il sito?".
- Aggiunti filtri dinamici e gestione degli URL per la ricerca delle iniziative.
- Aggiornato il favicon con un nuovo design SVG.
- Aggiunto il documento Note Tecniche per la gestione e la manutenzione del sito.
- Riorganizzato il footer e aggiunta l'icona di GitHub.
- Aggiunto `HamburgerMenuReact` e sostituito `HamburgerMenu` in `TableView`.
- Aggiunto il file `LICENSE.md` con la licenza MIT.
- Sostituita l'icona `UserGroup` con `FlagIcon` per il quorum.
- Migliorata la gestione dell'URL di base.
- Normalizzato il `baseUrl` in vari componenti.
- Aggiornata la nota sulle firme per indicare che vengono aggiornate una volta al giorno.

## 2025-07-04

- Commit iniziale da Astro.
- Impostazione per il deploy su GitHub Pages.
- Aggiunto il supporto per il deploy manuale con motivo personalizzato.
- Aggiornata la versione di tailwindcss e aggiunto il file di configurazione di tailwind.
- Rimossa l'importazione di tailwindcss e semplificate le classi di utilità.
- Aggiunte variabili d'ambiente per la build e abilitato automaticamente GitHub Pages.
- Aggiunta un'utilità per la gestione dei percorsi e aggiornati i link con `BASE_URL`.
- Aggiunto un trigger di deploy automatico giornaliero.
- Aggiunta la generazione di immagini Open Graph e aggiornato il layout per i metadati OG.
- Aggiunto il menu hamburger e l'integrazione in diverse pagine.
- Corretto il percorso del link "Info".
- Aggiunto il download automatico dei dati dell'API e il fallback al `source.json` locale.
- Aggiornati i permessi per il deploy.
- Rimossa la funzione `getInitiativeUrl` e utilizzato il campo 'sito' per l'URL ufficiale.
- Aggiunto il filtro per tipologia e la visualizzazione nella pagina dell'iniziativa.
- Scambiati i filtri per categoria e tipologia nel componente `SearchAndFilters`.
- Aggiornato il link ufficiale e aggiunte le informazioni sul quorum nella pagina dell'iniziativa.
- Migliorata la funzione di wrapping del testo e gestite le parole lunghe nel generatore di immagini OG.
- Aggiunta la funzionalità di condivisione con l'API Web Share e il fallback per il desktop.
- Aggiunte pagine aggiuntive per la descrizione del progetto e la visualizzazione tabellare delle iniziative.
- Aggiunta la visualizzazione tabellare per le iniziative e aggiornato il menu hamburger.
- Aggiunta la colonna "Data Apertura" nella visualizzazione tabellare delle iniziative.
- Aggiunto il supporto per l'ordinamento e la visualizzazione del quorum nella tabella delle iniziative.
- Aggiunto il componente Footer e integrato in tutte le pagine.
- Aggiunte le informazioni sull'associazione onData nel footer.
