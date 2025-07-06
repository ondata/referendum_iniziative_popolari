#!/bin/bash

set -x
set -e
set -u
set -o pipefail

folder="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

curl -s "https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public?v=1751271726271" \
  -H "Accept: application/json" \
  -H "User-Agent: Mozilla/5.0 (compatible; referendum-astro-bot/1.0)" >"${folder}"/../data/source.json

<"${folder}"/../data/source.json jq -c '.content[]' | mlr --jsonl flatten then sort -tr id >"${folder}"/../data/source.jsonl
