#!/usr/bin/env python3
"""Increment the semantic version stored in VERSION."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT_DIR / "VERSION"
SEMVER_RE = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")
BUMP_CHOICES: tuple[str, ...] = ("patch", "minor", "major")


class VersionNotFoundError(FileNotFoundError):
    """Represent a missing VERSION file error."""

    def __init__(self, version_path: Path) -> None:
        """Initialize error with the missing VERSION path."""
        super().__init__(f"VERSION file not found at {version_path}")


class InvalidVersionError(ValueError):
    """Represent an invalid semantic version string in VERSION."""

    def __init__(self, raw: str) -> None:
        """Initialize error with the malformed VERSION text."""
        super().__init__(f"Invalid current VERSION {raw!r}; expected X.Y.Z.")


class InvalidBumpTypeError(ValueError):
    """Represent an unsupported semantic version bump type."""

    def __init__(self, part: str) -> None:
        """Initialize error with the unsupported bump type."""
        super().__init__(
            f"Invalid bump type {part!r}; expected patch, minor, or major."
        )


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """Parse CLI arguments for semantic version bumping."""
    parser = argparse.ArgumentParser(
        description="Increment the semantic version in VERSION.",
    )
    parser.add_argument(
        "part",
        nargs="?",
        default="patch",
        choices=BUMP_CHOICES,
        help="Version component to increment (default: patch).",
    )
    return parser.parse_args(argv)


def read_current_version(version_path: Path) -> tuple[int, int, int]:
    """Read and parse the current X.Y.Z version from version_path."""
    if not version_path.is_file():
        raise VersionNotFoundError(version_path)
    raw = version_path.read_text(encoding="utf-8").strip()
    match = SEMVER_RE.fullmatch(raw)
    if match is None:
        raise InvalidVersionError(raw)
    return int(match.group(1)), int(match.group(2)), int(match.group(3))


def compute_next_version(current: tuple[int, int, int], part: str) -> str:
    """Compute the next X.Y.Z version string for the requested bump part."""
    major, minor, patch = current
    if part == "patch":
        return f"{major}.{minor}.{patch + 1}"
    if part == "minor":
        return f"{major}.{minor + 1}.0"
    if part == "major":
        return f"{major + 1}.0.0"
    raise InvalidBumpTypeError(part)


def bump_version(version_path: Path, part: str) -> tuple[str, str]:
    """Read, increment, and write VERSION, returning (old, new) strings."""
    current = read_current_version(version_path)
    old_version = f"{current[0]}.{current[1]}.{current[2]}"
    new_version = compute_next_version(current, part)
    version_path.write_text(f"{new_version}\n", encoding="utf-8")
    return old_version, new_version


def main(argv: list[str] | None = None) -> int:
    """Run semantic version bump on VERSION and print the transition."""
    args = parse_args(argv)
    part = str(args.part)
    try:
        old_version, new_version = bump_version(VERSION_FILE, part)
    except (OSError, UnicodeDecodeError, ValueError) as exc:
        sys.stderr.write(f"Error: {exc}\n")
        return 1
    sys.stdout.write(f"Updated VERSION: {old_version} -> {new_version}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
