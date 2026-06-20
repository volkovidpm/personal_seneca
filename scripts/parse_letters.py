#!/usr/bin/env python3
"""Парсер «Нравственных писем к Луцилию» Сенеки.

Читает исходный .txt (Windows-1251), режет на письма по маркеру
«Письмо <римская цифра>», чистит сноски вида [n - ...], нормализует
пробелы и пишет src/data/letters.json.

Запуск:
    python3 scripts/parse_letters.py [путь_к_txt]

По умолчанию ищет файл в ~/Downloads.
"""
from __future__ import annotations

import json
import os
import re
import sys

DEFAULT_SRC = os.path.expanduser(
    "~/Downloads/Seneka_L._Yeksklyuzivnaya._Nravstvennyie_Pisma_K_Luciliyu.txt"
)
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "letters.json")

# Маркер начала письма: «Письмо I», «Письмо II» ... (между словом и цифрой
# может стоять обычный или неразрывный пробел, либо вообще ничего).
LETTER_RE = re.compile(r"Письмо\s*([IVXLCDM]+)\b", re.IGNORECASE)
# Сноски: [1 - ...], могут содержать вложенный текст без закрывающей скобки внутри.
FOOTNOTE_RE = re.compile(r"\[\s*\d+\s*-[^\]]*\]")
# Маркеры-номера абзацев в письмах: «(1)», «(12)».
PARA_NUM_RE = re.compile(r"^\(\d+\)\s*")


def roman_to_int(s: str) -> int:
    vals = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    total = 0
    prev = 0
    for ch in reversed(s.upper()):
        cur = vals[ch]
        if cur < prev:
            total -= cur
        else:
            total += cur
            prev = cur
    return total


def clean(text: str) -> str:
    text = FOOTNOTE_RE.sub("", text)
    text = text.replace("\xa0", " ").replace("", " ")
    text = text.replace("\r", "\n")
    # схлопываем повторяющиеся пробелы внутри строки
    text = re.sub(r"[ \t]+", " ", text)
    return text


def split_paragraphs(body: str) -> list[str]:
    """Делит тело письма на абзацы.

    Издание разбивает текст маркерами (1), (2)... Используем их как границы,
    а если их нет — режем по пустым строкам.
    """
    body = body.strip()
    # вставляем разрыв перед каждым «(N)», стоящим как номер абзаца
    marked = re.sub(r"\s\((\d+)\)\s", r"\n(\1) ", body)
    chunks = re.split(r"\n(?=\(\d+\))", marked)
    paras: list[str] = []
    for ch in chunks:
        ch = PARA_NUM_RE.sub("", ch.strip())
        ch = re.sub(r"\s+", " ", ch).strip()
        if ch:
            paras.append(ch)
    if not paras:
        # запасной путь — по пустым строкам
        for ch in re.split(r"\n\s*\n", body):
            ch = re.sub(r"\s+", " ", ch).strip()
            if ch:
                paras.append(ch)
    return paras


def parse(raw: str) -> list[dict]:
    raw = clean(raw)
    matches = list(LETTER_RE.finditer(raw))
    letters: list[dict] = []
    seen: set[int] = set()
    for i, m in enumerate(matches):
        number = roman_to_int(m.group(1))
        if number in seen:
            # дубликат маркера (например в оглавлении) — пропускаем
            continue
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(raw)
        body = raw[start:end]
        # отбрасываем строку-приветствие «Сенека приветствует Луцилия!»
        body = re.sub(r"^\s*Сенека[^\n]*!\s*", "", body)
        paragraphs = split_paragraphs(body)
        if not paragraphs:
            continue
        seen.add(number)
        letters.append(
            {
                "number": number,
                "title": f"Письмо {m.group(1).upper()}",
                "paragraphs": paragraphs,
            }
        )
    letters.sort(key=lambda x: x["number"])
    return letters


def main() -> None:
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    if not os.path.exists(src):
        sys.exit(f"Источник не найден: {src}")
    raw = open(src, "rb").read().decode("cp1251", "replace")
    letters = parse(raw)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(letters, f, ensure_ascii=False, indent=2)
    print(f"Записано писем: {len(letters)} → {os.path.normpath(OUT)}")
    if letters:
        sample = letters[0]
        print(f"Первое: {sample['title']}, абзацев: {len(sample['paragraphs'])}")
        print(f"Последнее: {letters[-1]['title']}")


if __name__ == "__main__":
    main()
