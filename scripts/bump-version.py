#!/usr/bin/env python3
"""Atomic semantic version bumper for Aderion Studios website."""

from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess  # nosec B404
import sys
import tempfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT_DIR / "VERSION"
SEMVER_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """Parse CLI arguments for version bumping."""
    parser = argparse.ArgumentParser(
        description="Bump VERSION atomically and optionally commit/tag.",
    )
    parser.add_argument(
        "target",
        nargs="?",
        default="patch",
        help="Bump type (patch, minor, major) or explicit X.Y.Z (default: patch).",
    )
    parser.add_argument(
        "--commit",
        action="store_true",
        help='Stage VERSION and commit as "chore(release): vX.Y.Z".',
    )
    parser.add_argument(
        "--tag",
        action="store_true",
        help="Create git tag vX.Y.Z and print push command.",
    )
    return parser.parse_args(argv)


def read_current_version(version_path: Path) -> tuple[int, int, int]:
    """Read and parse the current X.Y.Z version from VERSION."""
    if not version_path.is_file():
        raise FileNotFoundError(f"VERSION file not found at {version_path}")
    raw = version_path.read_text(encoding="utf-8").strip()
    match = SEMVER_RE.match(raw)
    if not match:
        raise ValueError(f"Invalid current VERSION '{raw}'; expected X.Y.Z.")
    return int(match.group(1)), int(match.group(2)), int(match.group(3))


def compute_next_version(current: tuple[int, int, int], target: str) -> str:
    """Compute the next X.Y.Z version string from current and target."""
    major, minor, patch = current
    if target == "patch":
        return f"{major}.{minor}.{patch + 1}"
    if target == "minor":
        return f"{major}.{minor + 1}.0"
    if target == "major":
        return f"{major + 1}.0.0"
    if SEMVER_RE.match(target):
        return target
    raise ValueError(
        f"Invalid target '{target}'. Expected patch, minor, major, or X.Y.Z."
    )


def write_version_atomic(version_path: Path, new_version: str) -> None:
    """Write new_version to version_path atomically via a temporary file."""
    tmp_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            encoding="utf-8",
            dir=version_path.parent,
            prefix=".VERSION.",
            delete=False,
        ) as handle:
            tmp_path = Path(handle.name)
            handle.write(f"{new_version}\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp_path, version_path)
    except Exception:
        if tmp_path is not None and tmp_path.exists():
            tmp_path.unlink(missing_ok=True)
        raise


def run_git(git_bin: str, args: list[str], cwd: Path) -> None:
    """Execute a git command safely without shell invocation."""
    subprocess.run([git_bin, *args], cwd=cwd, check=True)  # nosec B603


def main(argv: list[str] | None = None) -> int:
    """Run version bump workflow and optional git commit/tag actions."""
    args = parse_args(argv)
    try:
        current = read_current_version(VERSION_FILE)
        new_version = compute_next_version(current, args.target)
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    write_version_atomic(VERSION_FILE, new_version)
    old_str = f"{current[0]}.{current[1]}.{current[2]}"
    print(f"Updated VERSION: {old_str} -> {new_version}")

    if not args.commit and not args.tag:
        return 0

    git_bin = shutil.which("git")
    if git_bin is None:
        print("Error: git executable not found in PATH.", file=sys.stderr)
        return 1

    try:
        if args.commit:
            run_git(git_bin, ["add", "VERSION"], ROOT_DIR)
            run_git(
                git_bin,
                ["commit", "-m", f"chore(release): v{new_version}"],
                ROOT_DIR,
            )
        if args.tag:
            run_git(git_bin, ["tag", f"v{new_version}"], ROOT_DIR)
            print(f"Created tag v{new_version}.")
            print("Run the following command to trigger deploy:")
            print("  git push origin main --tags")
    except subprocess.CalledProcessError as exc:
        print(f"Git command failed with exit code {exc.returncode}.", file=sys.stderr)
        return exc.returncode or 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
