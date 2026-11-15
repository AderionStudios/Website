#!/usr/bin/env python3
"""Update the offline fallback after editing data/credits.json.
Online/HTTP deployments read data/credits.json directly; this fallback helps file:// viewing.
"""
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
source = root / "data" / "credits.json"
data = json.loads(source.read_text(encoding="utf-8"))
assert isinstance(data.get("departments"), list), "Missing departments list"
output = root / "assets" / "credits-data.js"
output.write_text("/* Auto-generated from data/credits.json. */\nwindow.ADERION_CREDITS = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print(f"Wrote {output}")
