#!/usr/bin/env python3
import json
import sys

def apply_styles(text, styles):
    inserts = {}
    for style in styles:
        start = style["offset"]
        end = start + style["length"]
        marker = {"BOLD": "**", "ITALIC": "*"}.get(style["style"], "")
        if marker:
            inserts.setdefault(start, []).append(marker)
            inserts.setdefault(end, []).append(marker)

    result = ""
    for i in range(len(text) + 1):
        if i in inserts:
            result += "".join(inserts[i])
        if i < len(text):
            result += text[i]
    return result

def main(file_path):
    with open(file_path) as f:
        full_data = json.load(f)

    quesito = json.loads(full_data["content"]["quesito"])
    blocks = quesito["blocks"]

    i = 0
    while i < len(blocks):
        current = blocks[i]
        current_text = current.get("text", "").strip()
        current_formatted = apply_styles(current_text, current.get("inlineStyleRanges", []))

        # Se è tipo "ART. x" e il prossimo è un sottotitolo, stampali uno per riga
        if current_formatted.startswith("**ART.") and (i + 1) < len(blocks):
            next = blocks[i + 1]
            next_text = next.get("text", "").strip()
            next_formatted = apply_styles(next_text, next.get("inlineStyleRanges", []))
            print(current_formatted)
            print(next_formatted)
            print()  # riga vuota dopo il titolo+sottotitolo
            i += 2
            continue

        # stampa testo se c'è contenuto
        if current_text:
            print(current_formatted)
            print()  # riga vuota dopo ogni paragrafo
        i += 1

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: ./genera_markdown_quesito.py <file.json>")
        sys.exit(1)
    main(sys.argv[1])
