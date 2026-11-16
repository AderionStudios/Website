#!/usr/bin/env python3
"""Simple repository QA runner for Aderion Studios."""

from __future__ import annotations

import json
import re
import shutil
import subprocess  # nosec B404
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
            "D203,D213,CPY001,COM812",
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
        "cmd": [
            "phpstan",
            "analyse",
            "--configuration=phpstan.neon",
            "--no-progress",
        ],
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
        "cmd": [
            "semgrep",
            "scan",
            "--config=auto",
            "--error",
            "--severity=WARNING",
            "--quiet",
            ".",
        ],
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
    start = match.end()
    end = pos - 1
    body = text[start:end]
    return {m.group(1) or m.group(2) for m in KEY_RE.finditer(body)}


def check_version(root: Path) -> list[str]:
    """Validate semantic version in VERSION file."""
    version = (root / "VERSION").read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", version):
        return [f"Invalid VERSION: {version!r}"]
    return []


def check_credits_json(root: Path) -> list[str]:
    """Validate data/credits.json structure."""
    credits_path = root / "data" / "credits.json"
    try:
        credits_data = json.loads(credits_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"data/credits.json error: {exc}"]
    if not isinstance(credits_data.get("departments"), list):
        return ["data/credits.json: 'departments' must be a list"]
    return []


def check_html_file(
    html_file: Path,
    site_tr: set[str],
    site_en: set[str],
) -> list[str]:
    """Validate links, CSP rules, and i18n keys for one HTML file."""
    errors: list[str] = []
    parser = PageParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    for issue in sorted(set(parser.csp_issues)):
        errors.append(f"{html_file.name}: CSP issue ({issue})")
    for link in parser.links:
        if not link.startswith(IGNORED_PREFIXES):
            clean = link.split("#", 1)[0].split("?", 1)[0]
            if not (html_file.parent / clean).exists():
                errors.append(f"{html_file.name}: broken link '{link}'")
    if html_file.name != "mini-paint.html":
        for key in sorted(parser.site_keys - site_tr):
            errors.append(f"{html_file.name}: missing TR key '{key}'")
        for key in sorted(parser.site_keys - site_en):
            errors.append(f"{html_file.name}: missing EN key '{key}'")
    return errors


def check_site_basics(root: Path) -> list[str]:
    """Check VERSION, data/credits.json, HTML links, CSP, and i18n."""
    errors = check_version(root) + check_credits_json(root)
    main_js = (root / "assets" / "main.js").read_text(encoding="utf-8")
    pages_js = (root / "assets" / "pages.js").read_text(encoding="utf-8")
    site_tr = extract_keys(main_js, r"\btr\s*:\s*\{") | extract_keys(
        pages_js, r"\bconst\s+extraTr\s*=\s*\{"
    )
    site_en = extract_keys(main_js, r"\ben\s*:\s*\{") | extract_keys(
        pages_js, r"\bconst\s+extraEn\s*=\s*\{"
    )
    for html_file in sorted(root.glob("*.html")):
        errors.extend(check_html_file(html_file, site_tr, site_en))
    return errors


def run_tool(tool: dict[str, Any]) -> bool:
    """Run one configured QA tool and return True if it failed."""
    print(f"\n[{tool['name']}]")
    exe = shutil.which(tool["cmd"][0])
    if not exe:
        print(f"  Skipped: '{tool['cmd'][0]}' not installed locally.")
        return False
    result = subprocess.run(  # nosec B603
        [exe, *tool["cmd"][1:]],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode == 0:
        print("  Clear.")
        return False
    print("  WARNING / ERROR FOUND:")
    output = (result.stdout or result.stderr).strip().splitlines()
    for line in output[:15]:
        print(f"    {line}")
    if len(output) > 15:
        print("    ... (truncated)")
    return True


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
        if run_tool(tool):
            has_failures = True

    print("\n" + "=" * 60)
    if has_failures:
        print("  Results: Some checks failed.")
        return 1
    print("  Results: All checks passed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(run_qa())
