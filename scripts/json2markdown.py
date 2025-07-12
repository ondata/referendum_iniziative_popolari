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
            # Gestisci gli spazi agli estremi per evitare markdown malformato
            # Se il testo stilizzato inizia o finisce con spazi, sposta i marker
            styled_text = text[start:end]

            # Conta spazi iniziali e finali
            leading_spaces = len(styled_text) - len(styled_text.lstrip())
            trailing_spaces = len(styled_text) - len(styled_text.rstrip())

            # Aggiusta le posizioni dei marker per evitare spazi dentro i marker
            actual_start = start + leading_spaces
            actual_end = end - trailing_spaces

            if actual_start < actual_end:  # Solo se c'è contenuto non-spazio
                inserts.setdefault(actual_start, []).append(marker)
                inserts.setdefault(actual_end, []).append(marker)

    result = ""
    for i in range(len(text) + 1):
        if i in inserts:
            result += "".join(inserts[i])
        if i < len(text):
            result += text[i]
    return result

def is_title_block(text, styles):
    """Determina se un blocco è un titolo basandosi sugli stili dichiarati nel JSON"""
    if not styles:
        return False

    text_lower = text.lower()
    title_keywords = [
        "articolo", "art.", "premessa", "conclusioni",
        "disposizioni", "legge di iniziativa", "firma",
        "proposta di legge", "si compone", "entrata in vigore",
        "capo"
    ]

    # Verifica se contiene parole chiave tipiche dei titoli
    has_title_keywords = any(keyword in text_lower for keyword in title_keywords)

    if not has_title_keywords:
        return False

    for style in styles:
        if style["style"] == "BOLD":
            # Caso 1: tutto il testo è in grassetto
            if (style["offset"] == 0 and style["length"] == len(text)):
                return True

            # Caso 2: inizia con "Art. X" in grassetto
            if (style["offset"] == 0 and
                text_lower.startswith(("art.", "articolo")) and
                style["length"] >= 5):  # Almeno "Art. " o "Art.X"
                return True

    return False

def main(file_path):
    with open(file_path) as f:
        full_data = json.load(f)

    quesito = json.loads(full_data["content"]["quesito"])
    blocks = quesito["blocks"]

    # Raccogli tutti i blocchi non vuoti
    content_blocks = []

    i = 0
    while i < len(blocks):
        current = blocks[i]
        current_text = current.get("text", "").strip()

        if current_text:  # Solo se c'è contenuto
            current_styles = current.get("inlineStyleRanges", [])
            current_formatted = apply_styles(current_text, current_styles)

            # Se è un titolo basato sugli stili del JSON, convertilo in header markdown
            if is_title_block(current_text, current_styles):
                # Mantieni il grassetto ma converti in header
                current_formatted = "## " + current_formatted

            # Se è tipo "ART. x" e il prossimo è un sottotitolo, uniscili
            if current_formatted.startswith("**ART.") and (i + 1) < len(blocks):
                next_block = blocks[i + 1]
                next_text = next_block.get("text", "").strip()
                if next_text:
                    next_formatted = apply_styles(next_text, next_block.get("inlineStyleRanges", []))
                    content_blocks.append(current_formatted)
                    content_blocks.append(next_formatted)
                    content_blocks.append("")  # Riga vuota dopo titolo+sottotitolo
                    i += 2
                    continue

            content_blocks.append(current_formatted)
        i += 1

    # Stampa il contenuto con logica più intelligente per gli a capo
    for j, block in enumerate(content_blocks):
        if block == "":  # Riga vuota esplicita
            print()
        else:
            print(block)
            # Aggiungi riga vuota solo se:
            # 1. Non è l'ultimo blocco
            # 2. Il prossimo blocco non è una riga vuota
            # 3. Il blocco corrente sembra essere un titolo/intestazione o lista
            if (j < len(content_blocks) - 1 and
                content_blocks[j + 1] != "" and
                (block.startswith("**ART.") or
                 block.startswith("## **") or      # Qualsiasi header markdown con grassetto
                 block.startswith("Art.") or
                 block.startswith("a)") or
                 block.startswith("b)") or
                 block.startswith("c)") or
                 block.startswith("-") or
                 len(block) < 100)):  # Righe corte probabilmente sono titoli
                print()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: ./genera_markdown_quesito.py <file.json>")
        sys.exit(1)
    main(sys.argv[1])
