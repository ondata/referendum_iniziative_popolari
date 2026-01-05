# Dati

<h2 id="i-dati-non-disponibili">I dati non disponibili <a href="#i-dati-non-disponibili" class="header-anchor" aria-label="Anchor link">🔗</a></h2>

Il [sito ufficiale](https://firmereferendum.giustizia.it/) dedicato a Referendum e iniziative popolari **non ha una sezione dedicata ai dati raccolti**. I numeri delle raccolta firme sono disponibili attualmente soltanto come grafici (sotto un esempio), immagini e tabelle HTML, e non è possibile leggere la loro **variazione nel tempo**.

È una **grave lacuna**, perché sarebbe molto utile poter seguire e monitorare l'**andamento** delle firme raccolte nel **tempo**, per **iniziativa**, per **area geografica**, per **fascia di età** e **sesso**.

![Esempio di grafico a torta mostrante la distribuzione percentuale dei dati di raccolta firme dal sito ufficiale del Ministero della Giustizia](/images/dati/torta.png)

La non disponibilità dei dati inoltre è in **contrasto** con il **quadro normativo** su **trasparenza** digitale e riutilizzo dei **dati pubblici**, in particolare:

- il **Codice dell'Amministrazione Digitale – CAD (D.Lgs. 82/2005)**, che disciplina la **pubblicazione e il riutilizzo dei dati** da parte delle PA (anche tramite formati aperti e licenze idonee), e in particolare l'**art. 52** sui dati e documenti delle pubbliche amministrazioni. [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2005-03-07;82)
- il **Decreto Legislativo 24 gennaio 2006, n. 36**, che regola le modalità di **riutilizzo dei documenti contenenti dati pubblici** nella disponibilità delle amministrazioni, oggi allineato alla disciplina europea sull'open data. [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2006-01-24;36!vig=2026-01-04)
- la **Direttiva (UE) 2019/1024 (Open Data/PSI)**, che si fonda sul principio generale per cui le informazioni del settore pubblico dovrebbero essere **riutilizzabili** (anche a fini civici), promuovendo disponibilità e accesso con attenzione anche a casi come dati dinamici e, per alcune categorie, dataset di alto valore. [EUR-Lex](https://eur-lex.europa.eu/eli/dir/2019/1024/oj?locale=it)

Nel rispetto della normativa sulla _privacy_, la pubblicazione di **dati anonimizzati** consentirebbe trasparenza, attività di ricerca, monitoraggio e controllo civico sull'andamento delle sottoscrizioni.

### Altre informazioni non accessibili

Il sito ufficiale mette a disposizione informazioni molto interessanti, ma **accessibili soltanto dopo autenticazione con SPID o CIE**. Purtroppo, questi non sono scaricabili in formato _machine-readable_ e rimangono confinati in una visualizzazione web.

**Dati per regione**

Una analisi geografica della raccolta firme per ogni regione italiana, con suddivisione per sesso (femmine e maschi). I dati sono visualizzati sia tramite una **mappa coropleta** (che mostra intensità variabile per regione) che tramite una **tabella con valori numerici esatti**.

![Mappa dell'Italia mostrante la distribuzione regionale delle firme raccolte](/images/dati/regionali.png)

**Dati per sesso e fascia di età**

Una segmentazione demografica che mostra la distribuzione delle firme secondo **13 fasce di età** (dai 18-22 anni fino a 68 e più), con confronto tra firme femminili e maschili per ogni fascia. Questi dati sono visualizzati tramite un **grafico a barre divergente** che permette il confronto immediato tra generi, accompagnato da una tabella.

![Grafico a barre divergente mostrante la distribuzione delle firme per fasce di età con confronto tra donne e uomini](/images/dati/eta_genere.png)

Nonostante il valore civico e scientifico di questa segmentazione demografica, **non esiste un accesso pubblico** ai dati in formato aperto.

<h2 id="i-dati-disponibili-in-questo-sito">I dati disponibili in questo sito <a href="#i-dati-disponibili-in-questo-sito" class="header-anchor" aria-label="Anchor link">🔗</a></h2>

Li raccogliamo e aggiorniamo giornalmente in **formato _machine readable_** (JSON Lines) e con **licenza aperta CC-BY 4.0**, rendendo possibile analisi, ricerche e riutilizzo civico che il sito ufficiale non consente.

**Cosa pubblichiamo:**

- **Anagrafica completa** di tutte le iniziative e referendum (`source.jsonl`) con titoli, descrizioni, categorie, stati e quorum
- **Dati storici giornalieri** delle firme raccolte per ogni iniziativa (`time_line.jsonl`) - il nostro dataset più prezioso, in quanto il sito originale mostra **solo i dati attuali** tramite grafici e tabelle, perdendo la storia della raccolta
- **Testi ufficiali dei quesiti** (`quesiti/`) in formato strutturato

Il [dataset della **timeline storica**](https://raw.githubusercontent.com/ondata/referendum_iniziative_popolari/refs/heads/main/data/time_line.jsonl) rappresenta il valore aggiunto principale: consente di analizzare l'**andamento reale nel tempo** delle firme, calcolare velocità di raccolta, identificare trend e anomalie - dati che il portale ufficiale non rende disponibili in formato riutilizzabile.

> **📋 Accedi ai dati**
>
> Scarica e utilizza i dati in formato aperto: **[vai al repository](https://github.com/ondata/referendum_iniziative_popolari/blob/main/data/README.md)** per accedere ai file, scoprire le strutture disponibili e imparare come citarli correttamente.

### Come citare i dati

Se utilizzi questi dati è importante citare sia la **fonte originale** che il nostro **lavoro di elaborazione**. Ecco due modi semplici per farlo:

**Forma completa:**
```
Dati sui referendum e iniziative popolari italiane forniti dal Ministero della Giustizia
Fonte originale: https://firmereferendum.giustizia.it/ (CC-BY 4.0)
Elaborazione: https://ondata.github.io/referendum_iniziative_popolari
Licenza: CC-BY 4.0
```

**Forma compatta:**
```
© Ministero della Giustizia & onData (CC-BY 4.0)
Fonte: https://firmereferendum.giustizia.it/ | Progetto: https://ondata.github.io/referendum_iniziative_popolari
```

Scegli il formato che si adatta meglio al tuo contesto. L'importante è che sia chiara la **fonte originale** (Ministero) e la **nostra elaborazione**.

---

**Cosa manca (e perché)**

I dati per **regione**, **fascia di età** e **sesso** mostrati nel sito ufficiale non sono ancora disponibili in questo _repository_. Per renderli accessibili sarebbe necessario sviluppare script di automazione che effettuino il login sul sito ufficiale tramite **SPID o CIE**, estraggano i dati dalle API interne, e li convertano in formato aperto. Rimane importante segnalare che tali dati esistono e sottolineare la loro importanza civica.
