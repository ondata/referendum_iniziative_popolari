# Log delle modifiche

## 2025-07-07

* Aggiunta pagina 404 personalizzata.
* Aggiunta gestione centralizzata del menu di navigazione.
* Integrazione di Heroicons per le icone.
* Aggiunta gestione dei percorsi normalizzati nel menu hamburger.

## 2025-07-06

* Aggiunto file `.gitattributes` per la normalizzazione delle interruzioni di riga.
* Aggiunto script per il download e la trasformazione dei dati JSON.
* Migliorata la documentazione e la struttura dello script di download dei dati.
* Aggiornata la pianificazione del deploy automatico a 4 volte al giorno.
* Corretta la costruzione dell'URL del sito per il feed RSS.
* Aggiunta la sezione "Gestione Percorsi con Utility" nel documento NOTE_TECNICHE.
* Aggiunta la funzionalità di generazione del feed RSS e il tracciamento della timeline dei sostenitori.
* Aggiunta l'icona per il download dei dati nel footer.
* Migliorato il layout del footer con una griglia responsiva.
* Aggiunta la funzione `normalizeUrl` per la gestione degli URL.
* Aggiunta la funzione `normalizeForSorting` per migliorare l'ordinamento dei titoli.
* Aggiornato il footer della pagina di dettaglio per includere link ufficiali dell'iniziativa.
* Corretti URL nel README per riflettere il nome corretto del progetto.
* Aggiunti attributi title alle icone nel footer.
* Migliorata la timeline delle firme con filtraggio e ordinamento.

## 2025-07-05

* Semplificata l'importazione del contenuto markdown nella pagina delle informazioni.
* Ridotta la dimensione del titolo e rimosso il messaggio di stato della raccolta firme.
* Gestita la paginazione e i filtri tramite URL nella HomePage e in SearchAndFilters.
* Migliorata la responsività e l'aspetto visivo della pagina dell'iniziativa.
* Aggiunto il file `check_date.txt` con la data di scaricamento dei dati dell'API.
* Aggiunta la logica per leggere la data di aggiornamento da `check_date.txt` nel footer.
* Migliorata la logica di filtraggio delle opzioni disponibili nei menu a discesa.
* Centralizzati i contenuti della home page in un file di configurazione.
* Aggiunto il supporto per il plugin `@tailwindcss/typography`.
* Migliorata la formattazione e la chiarezza del contenuto nella sezione "Come funziona il sito?".
* Aggiunti filtri dinamici e gestione degli URL per la ricerca delle iniziative.
* Aggiornato il favicon con un nuovo design SVG.
* Aggiunto il documento Note Tecniche per la gestione e la manutenzione del sito.
* Riorganizzato il footer e aggiunta l'icona di GitHub.
* Aggiunto `HamburgerMenuReact` e sostituito `HamburgerMenu` in `TableView`.
* Aggiunto il file `LICENSE.md` con la licenza MIT.
* Sostituita l'icona `UserGroup` con `FlagIcon` per il quorum.
* Migliorata la gestione dell'URL di base.
* Normalizzato il `baseUrl` in vari componenti.
* Aggiornata la nota sulle firme per indicare che vengono aggiornate una volta al giorno.

## 2025-07-04

* Commit iniziale da Astro.
* Impostazione per il deploy su GitHub Pages.
* Aggiunto il supporto per il deploy manuale con motivo personalizzato.
* Aggiornata la versione di tailwindcss e aggiunto il file di configurazione di tailwind.
* Rimossa l'importazione di tailwindcss e semplificate le classi di utilità.
* Aggiunte variabili d'ambiente per la build e abilitato automaticamente GitHub Pages.
* Aggiunta un'utilità per la gestione dei percorsi e aggiornati i link con `BASE_URL`.
* Aggiunto un trigger di deploy automatico giornaliero.
* Aggiunta la generazione di immagini Open Graph e aggiornato il layout per i metadati OG.
* Aggiunto il menu hamburger e l'integrazione in diverse pagine.
* Corretto il percorso del link "Info".
* Aggiunto il download automatico dei dati dell'API e il fallback al `source.json` locale.
* Aggiornati i permessi per il deploy.
* Rimossa la funzione `getInitiativeUrl` e utilizzato il campo 'sito' per l'URL ufficiale.
* Aggiunto il filtro per tipologia e la visualizzazione nella pagina dell'iniziativa.
* Scambiati i filtri per categoria e tipologia nel componente `SearchAndFilters`.
* Aggiornato il link ufficiale e aggiunte le informazioni sul quorum nella pagina dell'iniziativa.
* Migliorata la funzione di wrapping del testo e gestite le parole lunghe nel generatore di immagini OG.
* Aggiunta la funzionalità di condivisione con l'API Web Share e il fallback per il desktop.
* Aggiunte pagine aggiuntive per la descrizione del progetto e la visualizzazione tabellare delle iniziative.
* Aggiunta la visualizzazione tabellare per le iniziative e aggiornato il menu hamburger.
* Aggiunta la colonna "Data Apertura" nella visualizzazione tabellare delle iniziative.
* Aggiunto il supporto per l'ordinamento e la visualizzazione del quorum nella tabella delle iniziative.
* Aggiunto il componente Footer e integrato in tutte le pagine.
* Aggiunte le informazioni sull'associazione onData nel footer.
