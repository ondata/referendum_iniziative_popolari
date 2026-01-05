#!/bin/bash

# Script per scaricare e processare i dati delle iniziative da firmereferendum.giustizia.it
# Scarica i dati JSON, li converte in JSONL e aggiorna la timeline delle firme
#
# REQUISITI SOFTWARE:
# - curl: per scaricare i dati dall'API
# - jq: per processare i dati JSON
# - miller (mlr): per manipolare e convertire i dati

# Configurazione bash per errori e debug
set -x          # stampa ogni comando eseguito
set -e          # esce se un comando fallisce
set -u          # esce se usa variabili non definite
set -o pipefail # esce se un comando in una pipe fallisce

# Ottiene il percorso della directory dello script
folder="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Scarica i dati JSON dall'API ufficiale del Ministero della Giustizia
# Il parametro v= sembra essere un timestamp per cache-busting
curl -s "https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public" \
  -H "Accept: application/json" \
  -H "User-Agent: Mozilla/5.0 (compatible; referendum-astro-bot/1.0)" >"${folder}"/../data/source.json

# Converte il JSON in JSONL (una riga per iniziativa), appiattisce la struttura e ordina per ID
<"${folder}"/../data/source.json jq -c '.content[]' | mlr --jsonl flatten then sort -tr id >"${folder}"/../data/source.jsonl

# Crea variabile con data in formato YYYY-MM-DD per tracciare quando sono stati raccolti i dati
check_date=$(date +%Y-%m-%d)

# Aggiorna la timeline delle firme: preserva cronologia e aggiunge dati nuovi di oggi
# Se il file esiste, rimuove i dati di oggi (da run precedenti) prima di appendere
if [[ -f "${folder}"/../data/time_line.jsonl ]]; then
  mlr --jsonl filter -x '$data=="'"${check_date}"'"' "${folder}"/../data/time_line.jsonl >"${folder}"/../data/time_line.jsonl.tmp
  mv "${folder}"/../data/time_line.jsonl.tmp "${folder}"/../data/time_line.jsonl
fi

# Filtra iniziative in raccolta firme (stato=2), estrae ID e numero sostenitori, aggiunge data
# APPEND ai dati storici anziché sovrascrivere (>> invece di >)
mlr --jsonl filter '${idDecStatoIniziativa.id}==2' then cut -f id,sostenitori then put '$data="'"${check_date}"'"' then reorder -f id,data,sostenitori "${folder}"/../data/source.jsonl >>"${folder}"/../data/time_line.jsonl

# Rimuove duplicati dalla timeline e riordina per data e ID
mlr -I --jsonl top -f sostenitori -g id,data then sort -t data,id then cut -x -f top_idx then rename sostenitori_top,sostenitori "${folder}"/../data/time_line.jsonl

# media sostenitori giornaliera per iniziativa, escludendo il giorno corrente
# per evitare valori parziali che falserebbero la statistica
mlr --jsonl filter -x '$data=="'"${check_date}"'"' then sort -t id,data then step -a delta -f sostenitori -g id then cat -n -g id then filter -x '$n==1' then stats1 -a mean -g id -f sostenitori_delta then sort -t id "${folder}"/../data/time_line.jsonl >"${folder}"/../data/media_sostenitori_giornaliera.jsonl

# scarica i quesiti
mkdir -p "${folder}"/../data/quesiti

mlr --ijsonl --onidx cut -f id "${folder}"/../data/source.jsonl | while read -r id; do
  # se "${folder}"/../data/quesiti/"${id}".json non esiste, lo scarica
  if [[ ! -f "${folder}"/../data/quesiti/"${id}".json ]]; then
    echo "Scaricando quesito con ID: ${id}"
    curl -skL "https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public/${id}" >"${folder}"/../data/quesiti/"${id}".json
  fi

  # estrai il testo del quesito
  if [[ ! -f "${folder}"/../data/quesiti/"${id}".txt ]]; then
    echo "Creando file di testo per quesito con ID: ${id}"
    jq -r '.content.quesito | fromjson | .plainText' "${folder}"/../data/quesiti/"${id}".json >"${folder}"/../data/quesiti/"${id}".txt
  fi

  # crea versione markdown del quesito
  if [[ ! -f "${folder}"/../data/quesiti/"${id}".md ]]; then
    "${folder}"/json2markdown.py "${folder}"/../data/quesiti/"${id}".json >"${folder}"/../data/quesiti/"${id}".md
  fi

done
