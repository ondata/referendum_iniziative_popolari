#!/bin/bash

# Script per scaricare e processare i dati delle iniziative da firmereferendum.giustizia.it
# Scarica i dati JSON, li converte in JSONL e aggiorna la timeline delle firme
#
# REQUISITI SOFTWARE:
# - curl: per scaricare i dati dall'API
# - jq: per processare i dati JSON
# - miller (mlr): per manipolare e convertire i dati

# Configurazione bash per errori e debug
set -x  # stampa ogni comando eseguito
set -e  # esce se un comando fallisce
set -u  # esce se usa variabili non definite
set -o pipefail  # esce se un comando in una pipe fallisce

# Ottiene il percorso della directory dello script
folder="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Scarica i dati JSON dall'API ufficiale del Ministero della Giustizia
# Il parametro v= sembra essere un timestamp per cache-busting
curl -s "https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public?v=1751271726271" \
  -H "Accept: application/json" \
  -H "User-Agent: Mozilla/5.0 (compatible; referendum-astro-bot/1.0)" >"${folder}"/../data/source.json

# Converte il JSON in JSONL (una riga per iniziativa), appiattisce la struttura e ordina per ID
<"${folder}"/../data/source.json jq -c '.content[]' | mlr --jsonl flatten then sort -tr id >"${folder}"/../data/source.jsonl

# Crea variabile con data in formato YYYY-MM-DD per tracciare quando sono stati raccolti i dati
check_date=$(date +%Y-%m-%d)

# Aggiorna la timeline delle firme: filtra solo iniziative in raccolta firme (stato=2),
# estrae ID e numero sostenitori, aggiunge la data corrente
mlr --jsonl filter '${idDecStatoIniziativa.id}==2' then cut -f id,sostenitori then put '$data="'"${check_date}"'"' then reorder -f id,data,sostenitori "${folder}"/../data/source.jsonl >>"${folder}"/../data/time_line.jsonl

# Rimuove duplicati dalla timeline e riordina per data e ID
mlr -I --jsonl top -f sostenitori -g id,data then sort -t data,id then cut -x -f top_idx then rename sostenitori_top,sostenitori "${folder}"/../data/time_line.jsonl

# media sostenitori giornaliera per iniziativa
mlr --jsonl sort -t id,data then step -a delta -f sostenitori -g id then cat -n -g id then filter -x '$n==1' then stats1 -a mean -g id -f sostenitori_delta then sort -t id "${folder}"/../data/time_line.jsonl >"${folder}"/../data/media_sostenitori_giornaliera.jsonl
