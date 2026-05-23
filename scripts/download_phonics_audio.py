#!/usr/bin/env python3
"""Download phonics MP3s from phonics_audio_links.csv into audio/phonics_audio/."""

import csv
import urllib.request
from pathlib import Path

CATEGORY_DIRS = {
    "Schwa": "Schwa",
    "Short Vowel": "Short_Vowel",
    "Long Vowel": "Long_Vowel",
    "Vowel and r": "Vowel_and_r",
    "Other Vowel Teams": "Other_Vowel_Teams",
    "Consonant": "Consonant",
    "Soft Consonant": "Soft_Silent_Consonant",
    "Digraph": "Digraph",
    "Silent Consonant": "Soft_Silent_Consonant",
}

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "audio" / "phonics_audio"
CSV = Path.home() / "Documents" / "phonics_audio_links.csv"


def main():
    import sys
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else CSV
    if not csv_path.is_file():
        print(f"CSV not found: {csv_path}")
        return 1

    ok = fail = 0
    with csv_path.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            cat = row["Category"].strip()
            filename = row["Filename"].strip()
            url = row["Full URL"].strip()
            subdir = CATEGORY_DIRS.get(cat, cat.replace(" ", "_"))
            dest_dir = BASE / subdir
            dest_dir.mkdir(parents=True, exist_ok=True)
            dest = dest_dir / filename
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=30) as resp:
                    data = resp.read()
                if len(data) < 500:
                    raise ValueError(f"response too small ({len(data)} bytes)")
                dest.write_bytes(data)
                print(f"OK  {subdir}/{filename}")
                ok += 1
            except Exception as e:
                print(f"FAIL {subdir}/{filename}: {e}")
                fail += 1

    print(f"\n{ok} downloaded, {fail} failed → {BASE}")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
