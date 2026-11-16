#!/usr/bin/env python3
"""Repository QA runner and integrity checker for Aderion Studios."""

from __future__ import annotations

import argparse
import ast
import json
import re
import shutil
import subprocess  # nosec B404
import sys
import time
from html.parser import HTMLParser
from pathlib import Path
from typing import NamedTuple

ROOT_DIR = Path(__file__).resolve().parent.parent

SITE_HTML_FILES: tuple[str, ...] = (
    "index.html",
    "visual-novel.html",
    "studio.html",
    "credits.html",
    "join.html",
)
SITE_CSS_FILES: tuple[str, ...] = (
    "assets/styles.css",
    "assets/visual-novel.css",
)
PYTHON_QA_FILES: tuple[str, ...] = (
    "scripts/qa-check.py",
    "scripts/bump-version.py",
)

IGNORED_DIRS: frozenset[str] = frozenset(
    {
        ".git",
        "node_modules",
        ".mypy_cache",
        ".ruff_cache",
        ".pytest_cache",
        ".phpstan.cache",
        "vendor",
        "__pycache__",
        ".semgrep",
        ".semgrep_logs",
    }
)
CONFLICT_EXTENSIONS: frozenset[str] = frozenset(
    {
        ".html",
        ".css",
        ".js",
        ".php",
        ".json",
        ".xml",
        ".md",
        ".yml",
        ".yaml",
        ".py",
    }
)
IGNORED_PREFIXES: tuple[str, ...] = (
    "#",
    "http://",
    "https://",
    "mailto:",
    "tel:",
    "data:",
)
I18N_ATTRS: frozenset[str] = frozenset(
    {"data-t", "data-t-html", "data-t-aria", "data-t-alt"}
)

DEFAULT_MAX_LINES = 40
BANNER_WIDTH = 60

VERSION_RE = re.compile(r"^\d+\.\d+\.\d+$")
DISCORD_ID_RE = re.compile(r"^\d{16,24}$")
CONFLICT_RE = re.compile(r"^(?:<{7}|={7}|>{7})(?:\s|$)", re.MULTILINE)
JS_IDENT_RE = re.compile(r"[A-Za-z0-9_$-]+")


class ToolSpec(NamedTuple):
    """External QA tool specification."""

    name: str
    cmd: tuple[str, ...]


class RunCounts:
    """Track passed, failed, and skipped check counts."""

    def __init__(self) -> None:
        """Initialize zeroed QA counters."""
        self.passed = 0
        self.failed = 0
        self.skipped = 0


TOOLS: tuple[ToolSpec, ...] = (
    ToolSpec(
        name="Ruff (Python)",
        cmd=(
            "ruff",
            "check",
            "--select",
            "ALL",
            "--ignore",
            "D203,D213,CPY001,COM812",
            *PYTHON_QA_FILES,
        ),
    ),
    ToolSpec(
        name="Flake8 (Python PEP8)",
        cmd=(
            "flake8",
            "--max-line-length=88",
            "--max-complexity=10",
            *PYTHON_QA_FILES,
        ),
    ),
    ToolSpec(
        name="Mypy (Python Types)",
        cmd=(
            "mypy",
            "--strict",
            "--ignore-missing-imports",
            *PYTHON_QA_FILES,
        ),
    ),
    ToolSpec(
        name="Bandit (Python Security)",
        cmd=("bandit", "-r", "scripts", "-ll", "-ii"),
    ),
    ToolSpec(
        name="PHPCS (PSR-12)",
        cmd=("phpcs", "--standard=phpcs.xml"),
    ),
    ToolSpec(
        name="PHPStan (Level Max)",
        cmd=(
            "phpstan",
            "analyse",
            "--configuration=phpstan.neon",
            "--no-progress",
        ),
    ),
    ToolSpec(
        name="PHP-CS-Fixer (Dry Run)",
        cmd=(
            "php-cs-fixer",
            "fix",
            "--dry-run",
            "--diff",
            "--config=.php-cs-fixer.dist.php",
        ),
    ),
    ToolSpec(
        name="Biome (JS & JSON)",
        cmd=("biome", "check", "--error-on-warnings"),
    ),
    ToolSpec(
        name="ESLint (JS)",
        cmd=("eslint", ".", "--max-warnings=0"),
    ),
    ToolSpec(
        name="Stylelint (CSS)",
        cmd=("stylelint", *SITE_CSS_FILES, "--max-warnings=0"),
    ),
    ToolSpec(
        name="HTMLHint (HTML)",
        cmd=("htmlhint", *SITE_HTML_FILES),
    ),
    ToolSpec(
        name="xmllint (sitemap.xml)",
        cmd=("xmllint", "--noout", "sitemap.xml"),
    ),
    ToolSpec(
        name="Semgrep (SAST)",
        cmd=(
            "semgrep",
            "scan",
            "--config=auto",
            "--error",
            "--severity=WARNING",
            "--quiet",
            ".",
        ),
    ),
)


class PageParser(HTMLParser):
    """Collect relative links, CSP violations, and i18n keys from HTML."""

    def __init__(self) -> None:
        """Initialize empty collections."""
        super().__init__()
        self.links: list[str] = []
        self.site_keys: set[str] = set()
        self.csp_issues: list[str] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        """Inspect tags for links, CSP violations, and i18n keys."""
        lower_tag = tag.lower()
        attr_map = {key.lower(): value for key, value in attrs}
        if lower_tag == "style":
            self.csp_issues.append("inline <style> tag")
        elif lower_tag == "script" and not (attr_map.get("src") or "").strip():
            self.csp_issues.append("inline <script> tag")

        for key, value in attrs:
            self._inspect_attr(key.lower(), value)

    def _inspect_attr(self, key: str, value: str | None) -> None:
        """Inspect one lowercased attribute for CSP, links, and i18n."""
        if key == "style":
            self.csp_issues.append("inline style attribute")
        elif key.startswith("on"):
            self.csp_issues.append(f"inline handler '{key}'")
        elif key in {"src", "href"} and value is not None:
            self._inspect_url_attr(key, value)
        elif key in I18N_ATTRS and value:
            self.site_keys.add(value)

    def _inspect_url_attr(self, key: str, value: str) -> None:
        """Record URL link or flag javascript: URLs as CSP violations."""
        stripped = value.strip()
        if not stripped:
            return
        if stripped.lower().startswith("javascript:"):
            self.csp_issues.append(f"javascript: URL in '{key}'")
            return
        self.links.append(stripped)


def log(msg: str = "") -> None:
    """Write a line to standard output."""
    sys.stdout.write(f"{msg}\n")


def _skip_quoted(text: str, idx: int) -> int:
    """Return index past a JS quoted or template string literal."""
    quote = text[idx]
    pos = idx + 1
    length = len(text)
    while pos < length:
        if text[pos] == "\\":
            pos += 2
            continue
        if text[pos] == quote:
            return pos + 1
        pos += 1
    return length


def _skip_comment(text: str, idx: int) -> int | None:
    """Return index past a JS comment, or None if idx is not a comment."""
    if text.startswith("//", idx):
        nl = text.find("\n", idx + 2)
        return len(text) if nl == -1 else nl + 1
    if text.startswith("/*", idx):
        end = text.find("*/", idx + 2)
        return len(text) if end == -1 else end + 2
    return None


def _skip_non_code(text: str, idx: int) -> int | None:
    """Return index past a JS string literal or comment, or None if code."""
    if text[idx] in {"'", '"', "`"}:
        return _skip_quoted(text, idx)
    return _skip_comment(text, idx)


def _extract_brace_block(text: str, open_idx: int) -> str | None:
    """Extract balanced object body inside outer braces, or None if invalid."""
    depth = 0
    idx = open_idx
    length = len(text)
    while idx < length:
        skipped = _skip_non_code(text, idx)
        if skipped is not None:
            idx = skipped
            continue
        ch = text[idx]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                start = open_idx + 1
                return text[start:idx]
        idx += 1
    return None


def _read_js_key(body: str, idx: int) -> tuple[str | None, int]:
    """Read a JS object property key followed by ':', or return (None, next_idx)."""
    if body[idx] in {"'", '"'}:
        end_quote = _skip_quoted(body, idx)
        start = idx + 1
        end = end_quote - 1
        key = body[start:end]
        pos = end_quote
    else:
        ident = JS_IDENT_RE.match(body, idx)
        if ident is None:
            return None, idx + 1
        key = ident.group(0)
        pos = ident.end()

    length = len(body)
    while pos < length and body[pos].isspace():
        pos += 1
    if pos < length and body[pos] == ":":
        return key, pos + 1
    return None, pos


def _advance_js_state(
    body: str,
    idx: int,
    depth: int,
    *,
    expect_key: bool,
) -> tuple[int, int, bool]:
    """Advance past one non-key token inside a JS object body."""
    ch = body[idx]
    if ch in {"'", '"', "`"}:
        return _skip_quoted(body, idx), depth, expect_key
    if ch in "{[(":
        return idx + 1, depth + 1, expect_key
    if ch in "}])":
        return idx + 1, max(0, depth - 1), expect_key
    if depth == 0 and ch == ",":
        return idx + 1, depth, True
    return idx + 1, depth, expect_key


def _is_js_key_start(ch: str) -> bool:
    """Return True if ch can begin a JS object property key."""
    return ch in {"'", '"'} or ch.isalnum() or ch in "_$"


def _scan_js_keys(body: str) -> set[str]:
    """Collect top-level property keys from a JS object body."""
    keys: set[str] = set()
    depth = 0
    expect_key = True
    idx = 0
    length = len(body)
    while idx < length:
        comment_end = _skip_comment(body, idx)
        if comment_end is not None:
            idx = comment_end
            continue
        ch = body[idx]
        if ch.isspace():
            idx += 1
            continue
        if depth == 0 and expect_key and _is_js_key_start(ch):
            key, idx = _read_js_key(body, idx)
            if key:
                keys.add(key)
                expect_key = False
            continue
        idx, depth, expect_key = _advance_js_state(
            body,
            idx,
            depth,
            expect_key=expect_key,
        )
    return keys


def extract_keys(text: str, marker: str) -> set[str] | None:
    """Extract top-level keys from a JS object literal starting at marker."""
    match = re.search(marker, text)
    if not match:
        return None
    open_idx = text.find("{", match.start())
    if open_idx == -1:
        return None
    body = _extract_brace_block(text, open_idx)
    if body is None:
        return None
    return _scan_js_keys(body)


def check_version(root: Path) -> list[str]:
    """Validate semantic version in VERSION file."""
    version_path = root / "VERSION"
    if not version_path.is_file():
        return ["VERSION file is missing."]
    try:
        version = version_path.read_text(encoding="utf-8").strip()
    except (OSError, UnicodeDecodeError) as exc:
        return [f"VERSION read error: {exc}"]
    if not VERSION_RE.fullmatch(version):
        return [f"Invalid VERSION: {version!r} (expected X.Y.Z)"]
    return []


def _collect_repo_files(directory: Path) -> list[Path]:
    """Collect text-candidate files outside ignored directories."""
    collected: list[Path] = []
    for entry in sorted(directory.iterdir()):
        if entry.is_symlink():
            continue
        if entry.is_dir():
            if entry.name not in IGNORED_DIRS:
                collected.extend(_collect_repo_files(entry))
        elif entry.is_file() and entry.suffix.lower() in CONFLICT_EXTENSIONS:
            collected.append(entry)
    return collected


def _check_file_conflicts(path: Path, root: Path) -> str | None:
    """Return an error string if path contains merge conflict markers."""
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError as exc:
        rel = path.relative_to(root)
        return f"Failed to read {rel}: {exc}"
    if CONFLICT_RE.search(text):
        rel = path.relative_to(root)
        return f"Merge conflict marker found in {rel}"
    return None


def check_conflict_markers(root: Path) -> list[str]:
    """Scan repository text files for git merge conflict markers."""
    errors: list[str] = []
    for path in _collect_repo_files(root):
        err = _check_file_conflicts(path, root)
        if err:
            errors.append(err)
    return errors


def _validate_member(
    dep_idx: int,
    mem_idx: int,
    member: object,
) -> str | None:
    """Validate one member dictionary and its 16-24 digit discordId."""
    if not isinstance(member, dict):
        return (
            f"data/credits.json: departments[{dep_idx}]"
            f".members[{mem_idx}] must be an object"
        )
    discord_id = member.get("discordId")
    if not isinstance(discord_id, str) or not DISCORD_ID_RE.fullmatch(
        discord_id,
    ):
        member_id = member.get("id", f"index {mem_idx}")
        return (
            f"data/credits.json: invalid discordId for "
            f"'{member_id}': {discord_id!r}"
        )
    return None


def _validate_department(dep_idx: int, dep: object) -> list[str]:
    """Validate one department object and all of its members."""
    if not isinstance(dep, dict):
        return [f"data/credits.json: departments[{dep_idx}] must be an object"]
    members = dep.get("members")
    if not isinstance(members, list):
        return [
            f"data/credits.json: departments[{dep_idx}].members must be a list"
        ]
    errors: list[str] = []
    for mem_idx, member in enumerate(members):
        err = _validate_member(dep_idx, mem_idx, member)
        if err:
            errors.append(err)
    return errors


def check_credits_json(root: Path) -> list[str]:
    """Validate data/credits.json structure and member discordId values."""
    credits_path = root / "data" / "credits.json"
    if not credits_path.is_file():
        return ["data/credits.json is missing."]
    try:
        payload: object = json.loads(credits_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        return [f"data/credits.json error: {exc}"]
    if not isinstance(payload, dict):
        return ["data/credits.json: root must be a JSON object"]
    departments = payload.get("departments")
    if not isinstance(departments, list) or not departments:
        return ["data/credits.json: 'departments' must be a non-empty list"]
    errors: list[str] = []
    for dep_idx, dep in enumerate(departments):
        errors.extend(_validate_department(dep_idx, dep))
    return errors


def _compile_python_file(py_path: Path, root: Path) -> str | None:
    """Parse and compile one Python file, returning an error on failure."""
    try:
        source = py_path.read_text(encoding="utf-8")
        tree = ast.parse(source, filename=str(py_path))
        compile(tree, filename=str(py_path), mode="exec")
    except (OSError, UnicodeDecodeError, SyntaxError, ValueError) as exc:
        rel = py_path.relative_to(root)
        return f"Python syntax error in {rel}: {exc}"
    return None


def check_python_syntax(root: Path) -> list[str]:
    """Validate Python syntax across all scripts/*.py files."""
    scripts_dir = root / "scripts"
    if not scripts_dir.is_dir():
        return ["scripts/ directory is missing."]
    py_files = sorted(p for p in scripts_dir.glob("*.py") if p.is_file())
    if not py_files:
        return ["No Python files found in scripts/."]
    errors: list[str] = []
    for py_path in py_files:
        err = _compile_python_file(py_path, root)
        if err:
            errors.append(err)
    return errors


def _combine_output(stdout: str, stderr: str) -> str:
    """Combine non-empty stdout and stderr strings."""
    return "\n".join(part for part in (stdout.strip(), stderr.strip()) if part)


def _lint_php_file(php_bin: str, php_file: Path, root: Path) -> str | None:
    """Run php -l on one PHP file and return an error message on failure."""
    result = subprocess.run(  # noqa: S603  # nosec B603
        [php_bin, "-l", str(php_file)],
        cwd=root,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode == 0:
        return None
    rel = php_file.relative_to(root)
    detail = _combine_output(result.stdout, result.stderr)
    return f"{rel}: {detail or 'php -l failed'}"


def check_php_syntax(root: Path) -> list[str]:
    """Run php -l on all api/*.php files when php is available in PATH."""
    php_bin = shutil.which("php")
    if php_bin is None:
        return []
    api_dir = root / "api"
    if not api_dir.is_dir():
        return ["api/ directory is missing."]
    php_files = sorted(p for p in api_dir.glob("*.php") if p.is_file())
    if not php_files:
        return ["No PHP files found in api/."]
    errors: list[str] = []
    for php_file in php_files:
        err = _lint_php_file(php_bin, php_file, root)
        if err:
            errors.append(err)
    return errors


def _check_relative_links(
    html_file: Path,
    root: Path,
    links: list[str],
) -> list[str]:
    """Verify relative links exist and resolve inside repository root."""
    errors: list[str] = []
    resolved_root = root.resolve()
    for link in links:
        if link.lower().startswith(IGNORED_PREFIXES):
            continue
        clean = link.split("#", 1)[0].split("?", 1)[0].strip()
        if not clean:
            continue
        base = root if clean.startswith("/") else html_file.parent
        rel_part = clean.lstrip("/")
        candidate = (base / rel_part if rel_part else root).resolve()
        if (
            not candidate.is_relative_to(resolved_root)
            or not candidate.exists()
        ):
            errors.append(f"{html_file.name}: broken link '{link}'")
    return errors


def check_html_file(
    html_file: Path,
    root: Path,
    site_tr: set[str],
    site_en: set[str],
) -> list[str]:
    """Validate links, CSP rules, and i18n keys for one HTML file."""
    if not html_file.is_file():
        return [f"{html_file.name}: HTML file is missing."]
    errors: list[str] = []
    parser = PageParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    parser.close()
    errors.extend(
        f"{html_file.name}: CSP issue ({issue})"
        for issue in sorted(set(parser.csp_issues))
    )
    errors.extend(_check_relative_links(html_file, root, parser.links))
    errors.extend(
        f"{html_file.name}: missing TR key '{key}'"
        for key in sorted(parser.site_keys - site_tr)
    )
    errors.extend(
        f"{html_file.name}: missing EN key '{key}'"
        for key in sorted(parser.site_keys - site_en)
    )
    return errors


def _load_site_i18n(root: Path) -> tuple[set[str], set[str], list[str]]:
    """Load TR and EN i18n keys from assets/main.js and assets/pages.js."""
    errors: list[str] = []
    sources = (
        ("assets/main.js", r"\btr\s*:\s*\{", r"\ben\s*:\s*\{"),
        (
            "assets/pages.js",
            r"\bconst\s+extraTr\s*=\s*\{",
            r"\bconst\s+extraEn\s*=\s*\{",
        ),
    )
    tr_keys: set[str] = set()
    en_keys: set[str] = set()
    for rel_path, tr_marker, en_marker in sources:
        file_path = root / rel_path
        if not file_path.is_file():
            errors.append(f"{rel_path} is missing.")
            continue
        text = file_path.read_text(encoding="utf-8")
        tr_part = extract_keys(text, tr_marker)
        en_part = extract_keys(text, en_marker)
        if tr_part is None:
            errors.append(f"{rel_path}: failed to parse TR i18n keys")
        else:
            tr_keys |= tr_part
        if en_part is None:
            errors.append(f"{rel_path}: failed to parse EN i18n keys")
        else:
            en_keys |= en_part
    return tr_keys, en_keys, errors


def _check_i18n_parity(site_tr: set[str], site_en: set[str]) -> list[str]:
    """Verify exact TR and EN translation key parity."""
    errors = [
        f"i18n parity: key '{key}' exists in TR but missing in EN"
        for key in sorted(site_tr - site_en)
    ]
    errors.extend(
        f"i18n parity: key '{key}' exists in EN but missing in TR"
        for key in sorted(site_en - site_tr)
    )
    return errors


def check_site_basics(root: Path) -> list[str]:
    """Check VERSION, conflicts, JSON, Python syntax, HTML, and i18n."""
    errors: list[str] = []
    errors.extend(check_version(root))
    errors.extend(check_conflict_markers(root))
    errors.extend(check_credits_json(root))
    errors.extend(check_python_syntax(root))

    site_tr, site_en, i18n_errors = _load_site_i18n(root)
    errors.extend(i18n_errors)
    if not i18n_errors:
        errors.extend(_check_i18n_parity(site_tr, site_en))

    for rel_html in SITE_HTML_FILES:
        errors.extend(check_html_file(root / rel_html, root, site_tr, site_en))
    return errors


def _print_tool_output(output: str, max_lines: int) -> None:
    """Print failed tool output, truncated to max_lines when > 0."""
    lines = output.splitlines()
    if not lines:
        log("    (no output captured)")
        return
    shown = lines if max_lines == 0 else lines[:max_lines]
    for line in shown:
        log(f"    {line}")
    if max_lines > 0 and len(lines) > max_lines:
        remaining = len(lines) - max_lines
        log(f"    ... ({remaining} more line(s) truncated)")


def _record_check_result(
    errors: list[str],
    elapsed: float,
    counts: RunCounts,
) -> None:
    """Print built-in check result and update pass/fail counters."""
    if errors:
        counts.failed += 1
        for err in errors:
            log(f"  ERROR: {err}")
        log(f"  Failed ({elapsed:.2f}s).")
        return
    counts.passed += 1
    log(f"  Clear ({elapsed:.2f}s).")


def _run_site_checks(root: Path, counts: RunCounts) -> None:
    """Run built-in site integrity checks and update counts."""
    log("\n[Site Checks: VERSION, Conflicts, JSON, Python, Links, CSP, i18n]")
    t0 = time.monotonic()
    site_errors = check_site_basics(root)
    _record_check_result(site_errors, time.monotonic() - t0, counts)


def _run_php_syntax(root: Path, counts: RunCounts) -> None:
    """Run PHP syntax lint across api/*.php and update counts."""
    log("\n[PHP Syntax (php -l)]")
    if shutil.which("php") is None:
        log("  Skipped: 'php' not installed locally.")
        counts.skipped += 1
        return
    t0 = time.monotonic()
    php_errors = check_php_syntax(root)
    _record_check_result(php_errors, time.monotonic() - t0, counts)


def run_tool(tool: ToolSpec, counts: RunCounts, max_lines: int) -> None:
    """Run one configured external QA tool and update counts."""
    log(f"\n[{tool.name}]")
    exe = shutil.which(tool.cmd[0])
    if not exe:
        log(f"  Skipped: '{tool.cmd[0]}' not installed locally.")
        counts.skipped += 1
        return
    t0 = time.monotonic()
    result = subprocess.run(  # noqa: S603  # nosec B603
        [exe, *tool.cmd[1:]],
        cwd=ROOT_DIR,
        capture_output=True,
        text=True,
        check=False,
    )
    elapsed = time.monotonic() - t0
    if result.returncode == 0:
        log(f"  Clear ({elapsed:.2f}s).")
        counts.passed += 1
        return
    log(
        f"  WARNING / ERROR FOUND (exit {result.returncode}, {elapsed:.2f}s):"
    )
    combined = _combine_output(result.stdout, result.stderr)
    _print_tool_output(combined, max_lines)
    counts.failed += 1


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """Parse CLI arguments for the QA runner."""
    parser = argparse.ArgumentParser(
        description="Run repository QA checks and installed external linters.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Fail if any configured QA tool is not installed locally.",
    )
    parser.add_argument(
        "--max-lines",
        type=int,
        default=DEFAULT_MAX_LINES,
        help=(
            "Maximum output lines to print per failed tool "
            f"(0 for unlimited, default: {DEFAULT_MAX_LINES})."
        ),
    )
    args = parser.parse_args(argv)
    if args.max_lines < 0:
        parser.error("--max-lines must be a non-negative integer.")
    return args


def run_qa(
    *,
    strict: bool = False,
    max_lines: int = DEFAULT_MAX_LINES,
) -> int:
    """Run repository checks and all configured QA tools."""
    run_start = time.monotonic()
    log("=" * BANNER_WIDTH)
    log("  Aderion Studios QA Starting ...")
    log("=" * BANNER_WIDTH)

    counts = RunCounts()
    _run_site_checks(ROOT_DIR, counts)
    _run_php_syntax(ROOT_DIR, counts)

    for tool in TOOLS:
        run_tool(tool, counts, max_lines)

    total_elapsed = time.monotonic() - run_start
    log("\n" + "=" * BANNER_WIDTH)
    log(
        f"  Passed: {counts.passed} | Failed: {counts.failed} | "
        f"Skipped: {counts.skipped} | Time: {total_elapsed:.2f}s"
    )
    if counts.failed > 0:
        log("  Results: Some checks failed.")
        return 1
    if strict and counts.skipped > 0:
        log("  Results: Failed (--strict: some checks were skipped).")
        return 1
    log("  Results: All checks passed successfully.")
    return 0


def main(argv: list[str] | None = None) -> int:
    """Parse CLI arguments and run repository QA checks."""
    args = parse_args(argv)
    return run_qa(strict=bool(args.strict), max_lines=int(args.max_lines))


if __name__ == "__main__":
    raise SystemExit(main())
