#!/usr/bin/env python3
"""Simple repository QA runner for Aderion Studios."""

from __future__ import annotations

import json
import re
import shutil
import subprocess  # nosec B404
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).resolve().parent.parent
IGNORED_PREFIXES = ("#", "http://", "https://", "mailto:", "tel:", "data:")
I18N_ATTRS = ("data-t", "data-t-html", "data-t-aria", "data-t-alt")
KEY_RE = re.compile(
    r"(?:^|[,{])\s*(?:['\"]([a-zA-Z0-9_.-]+)['\"]|([a-zA-Z0-9_$-]+))\s*:",
    re.MULTILINE,
)

TOOLS: list[dict[str, Any]] = [
    {
        "name": "Ruff (Python)",
        "cmd": [
            "ruff",
            "check",
            "--select",
            "ALL",
            "--ignore",
            "D203,D213",
            "scripts/qa-check.py",
            "scripts/bump-version.py",
        ],
    },
    {
        "name": "Flake8 (Python PEP8)",
        "cmd": [
            "flake8",
            "--max-line-length=88",
            "--max-complexity=10",
            "scripts/qa-check.py",
            "scripts/bump-version.py",
        ],
    },
    {
        "name": "Mypy (Python Types)",
        "cmd": [
            "mypy",
            "--strict",
            "--ignore-missing-imports",
            "scripts/qa-check.py",
            "scripts/bump-version.py",
        ],
    },
    {
        "name": "Bandit (Python Security)",
        "cmd": ["bandit", "-r", "scripts", "-ll", "-ii"],
    },
    {
        "name": "PHPCS (PSR-12)",
        "cmd": ["phpcs", "--standard=phpcs.xml"],
    },
    {
        "name": "PHPStan (Level Max)",
        "cmd": ["phpstan", "analyse", "--configuration=phpstan.neon", "--no-progress"],
    },
    {
        "name": "PHP-CS-Fixer (Dry Run)",
        "cmd": [
            "php-cs-fixer",
            "fix",
            "--dry-run",
            "--diff",
            "--config=.php-cs-fixer.dist.php",
        ],
    },
    {
        "name": "Biome (JS & JSON)",
        "cmd": ["biome", "check", "--error-on-warnings"],
    },
    {
        "name": "ESLint (JS)",
        "cmd": ["eslint", ".", "--max-warnings=0"],
    },
    {
        "name": "Stylelint (CSS)",
        "cmd": ["stylelint", "assets/*.css", "--max-warnings=0"],
    },
    {
        "name": "HTMLHint (HTML)",
        "cmd": ["htmlhint", "*.html"],
    },
    {
        "name": "xmllint (sitemap.xml)",
        "cmd": ["xmllint", "--noout", "sitemap.xml"],
    },
    {
        "name": "Semgrep (SAST)",
        "cmd": ["semgrep", "scan", "--config=auto", "--error", "--severity=WARNING", "."],
    },
]


class PageParser(HTMLParser):
    """Collect relative links, inline CSP issues, and i18n keys from HTML."""

    def __init__(self) -> None:
        """Initialize empty collections."""
        super().__init__()
        self.links: list[str] = []
        self.site_keys: set[str] = set()
        self.paint_keys: set[str] = set()
        self.csp_issues: list[str] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        """Inspect tags for links, CSP violations, and i18n keys."""
        attr_map = dict(attrs)
        if tag == "style":
            self.csp_issues.append("inline <style> tag")
        if tag == "script" and "src" not in attr_map:
            self.csp_issues.append("inline <script> tag")
        if "style" in attr_map:
            self.csp_issues.append("inline style attribute")
        for key, value in attrs:
            if key.startswith("on"):
                self.csp_issues.append(f"inline handler '{key}'")
            if key in ("src", "href") and value:
                self.links.append(value)
            if key in I18N_ATTRS and value:
                self.site_keys.add(value)
            if key.startswith("data-i18n") and value:
                self.paint_keys.add(value)


def extract_keys(text: str, marker: str) -> set[str]:
    """Extract top-level keys from a JS object literal starting at marker."""
    match = re.search(marker, text)
    if not match:
        return set()
    depth = 1
    pos = match.end()
    while pos < len(text) and depth > 0:
        if text[pos] == "{":
            depth += 1
        elif text[pos] == "}":
            depth -= 1
        pos += 1
    body = text[match.end() : pos - 1]
    return {m.group(1) or m.group(2) for m in KEY_RE.finditer(body)}


def check_site_basics(root: Path) -> list[str]:
    """Check VERSION, data/credits.json, HTML links, CSP, and i18n."""
    errors: list[str] = []
    version = (root / "VERSION").read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        errors.append(f"Invalid VERSION: {version!r}")

    try:
        credits = json.loads((root / "data" / "credits.json").read_text(encoding="utf-8"))
        if not isinstance(credits.get("departments"), list):
            errors.append("data/credits.json: 'departments' must be a list")
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"data/credits.json error: {exc}")

    main_js = (root / "assets" / "main.js").read_text(encoding="utf-8")
    pages_js = (root / "assets" / "pages.js").read_text(encoding="utf-8")
    site_tr = extract_keys(main_js, r"\btr\s*:\s*\{") | extract_keys(
        pages_js, r"\bconst\s+extraTr\s*=\s*\{"
    )
    site_en = extract_keys(main_js, r"\ben\s*:\s*\{") | extract_keys(
        pages_js, r"\bconst\s+extraEn\s*=\s*\{"
    )

    for html_file in sorted(root.glob("*.html")):
        parser = PageParser()
        parser.feed(html_file.read_text(encoding="utf-8"))
        for issue in sorted(set(parser.csp_issues)):
            errors.append(f"{html_file.name}: CSP issue ({issue})")
        for link in parser.links:
            if not link.startswith(IGNORED_PREFIXES):
                target = (html_file.parent / link.split("#", 1)[0].split("?", 1)[0])
                if not target.exists():
                    errors.append(f"{html_file.name}: broken link '{link}'")
        if html_file.name != "mini-paint.html":
            for key in sorted(parser.site_keys - site_tr):
                errors.append(f"{html_file.name}: missing TR key '{key}'")
            for key in sorted(parser.site_keys - site_en):
                errors.append(f"{html_file.name}: missing EN key '{key}'")
    return errors


def run_qa() -> int:
    """Run site checks and all configured QA tools."""
    print("=" * 60)
    print("  Aderion Studios QA Starting ...")
    print("=" * 60)

    has_failures = False
    site_errors = check_site_basics(ROOT_DIR)
    print("\n[Site Checks: VERSION, JSON, Links, CSP, i18n]")
    if site_errors:
        has_failures = True
        for err in site_errors:
            print(f"  ERROR: {err}")
    else:
        print("  Clear.")

    for tool in TOOLS:
        print(f"\n[{tool['name']}]")
        exe = shutil.which(tool["cmd"][0])
        if not exe:
            print(f"  Skipped: '{tool['cmd'][0]}' not installed locally.")
            continue
        result = subprocess.run(  # nosec B603
            [exe, *tool["cmd"][1:]],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode == 0:
            print("  Clear.")
        else:
            has_failures = True
            print("  WARNING / ERROR FOUND:")
            output = (result.stdout or result.stderr).strip().splitlines()
            for line in output[:15]:
                print(f"    {line}")
            if len(output) > 15:
                print("    ... (truncated)")

    print("\n" + "=" * 60)
    if has_failures:
        print("  Results: Some checks failed.")
        return 1
    print("  Results: All checks passed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(run_qa())
