#!/usr/bin/env python3
"""Public-repo hygiene guard for TelemForge.

Fails if tracked/public files or reachable git history contain personal local paths,
private agent/chat metadata, obvious credentials, or private artifacts.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Iterable


MAX_TEXT_BYTES = 2_000_000
SKIP_DIRS = {
    ".git",
    ".venv",
    "venv",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".cache",
    "dist",
    "build",
    ".next",
    ".turbo",
    "coverage",
}

POLICY_TEXT_ALLOWLIST = {
    ".gitignore",
    "AGENTS.md",
    ".github/workflows/public-repo-guard.yml",
    "scripts/public_repo_guard.py",
    "tests/test_public_repo_guard.py",
}

PLACEHOLDER_RE = re.compile(
    r"(?i)(example|sample|dummy|fake|placeholder|your_|changeme|replace_me|redacted|xxxxx|localhost|127\.0\.0\.1|<[^>]+>|\bpassword\b)"
)

PRIVATE_USER = "sa" "m"
PRIVATE_NAMES = ("S" "amuel H", "S" "amuel", "S" "am")
MESSAGE_SERVICE = "Sig" "nal"
PERSONAL_NAME_RE = re.compile(r"\b(?:" + "|".join(re.escape(name) for name in PRIVATE_NAMES) + r")\b")
MESSAGING_METADATA_RE = re.compile(
    r"(?i)\b(?:" + "|".join([r"via\s+" + MESSAGE_SERVICE, "chat_id", "thread_id", "telegram:", "discord:", "signal:", "DM with", "direct message"]) + r")\b"
)

CONTENT_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    (
        "personal_path",
        re.compile(
            rf"(?i)(/(?:Users|home)/{PRIVATE_USER}\.?(:?/|\b)[^\s\])}}`\"']*|~/\.(?:hermes|codex)\b[^\s\])}}`\"']*|~/(?:Projects|Desktop)\b[^\s\])}}`\"']*)".replace("(:?/", "(?:/")
        ),
    ),
    ("personal_name", PERSONAL_NAME_RE),
    (
        "messaging_metadata",
        MESSAGING_METADATA_RE,
    ),
    (
        "local_agent_artifact",
        re.compile(
            r"(?i)(?:/\.(?:hermes|codex)/|\.(?:hermes|codex)\b|cron/output|voice-memos|dispatcher/(?:logs|prompts|expect))"
        ),
    ),
    ("private_key_pem", re.compile(r"-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----")),
    (
        "known_token_shape",
        re.compile(
            r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b|\bsk-ant-[A-Za-z0-9\-_]{20,}\b|\bsk-[A-Za-z0-9]{20,}\b|\b(?:AKIA|ASIA)[0-9A-Z]{16}\b|\bxox[baprs]-[A-Za-z0-9-]{20,}\b|\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b|\bnpm_[A-Za-z0-9]{20,}\b"
        ),
    ),
    (
        "bearer_token",
        re.compile(r"(?i)\bbearer\s+[A-Za-z0-9._~+/=-]{20,}\b"),
    ),
    (
        "jwt",
        re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),
    ),
    (
        "db_uri_with_password",
        re.compile(r"(?i)\b(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis)://[^\s:/@]+:[^\s/@]+@[^\s]+"),
    ),
    (
        "secret_assignment",
        re.compile(
            r"(?x)\b(?:(?i:api[_-]?key|secret(?:[_-]?key)?|access[_-]?token|auth[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key|password|passwd|webhook[_-]?url)|[A-Z0-9_]*(?:API_KEY|TOKEN|SECRET|PASSWORD|PASSWD|CREDENTIAL|PRIVATE_KEY)[A-Z0-9_]*)\b\s*[:=]\s*['\"]?([^'\"\s#]{8,})"
        ),
    ),
    ("email_address", re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")),
    (
        "phone_like",
        re.compile(r"(?<!\d)(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?!\d)"),
    ),
)

FILENAME_PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("private_env_file", re.compile(r"(^|/)\.env($|\.)", re.I)),
    ("secret_filename", re.compile(r"(^|/).*(secret|credential|token|private[_-]?key|id_rsa).*", re.I)),
    ("key_material", re.compile(r".*\.(pem|key|p12|pfx)$", re.I)),
    ("database_artifact", re.compile(r".*\.(sqlite3?|db|dump)$", re.I)),
    ("private_log_artifact", re.compile(r".*(transcript|chat|screenrecord|screenshot).*|.*\.(log|har)$", re.I)),
    ("personal_filename", re.compile(r"(^|/)sam[-_]", re.I)),
)


@dataclass(frozen=True)
class Finding:
    kind: str
    path: str
    line: int | None
    snippet: str
    source: str = "tree"


def is_placeholder(line: str) -> bool:
    return bool(PLACEHOLDER_RE.search(line))


def redact_snippet(line: str) -> str:
    text = line.strip()
    user_pattern = re.escape(PRIVATE_USER) + r"\.?(?=/|\b)"
    text = re.sub(rf"/Users/{user_pattern}[^\s\])}}`\"']*", "/Users/<user>/<path>", text)
    text = re.sub(rf"/home/{user_pattern}[^\s\])}}`\"']*", "/home/<user>/<path>", text)
    text = re.sub(r"(?i)((?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis)://)[^\s:/@]+:[^\s/@]+@", r"\1<user>:<password>@", text)
    text = re.sub(
        r"(?ix)(\b(?:api[_-]?key|secret(?:[_-]?key)?|access[_-]?token|auth[_-]?token|refresh[_-]?token|client[_-]?secret|private[_-]?key|password|passwd|webhook[_-]?url|[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CREDENTIAL|PRIVATE)[A-Z0-9_]*)\b\s*[:=]\s*['\"]?)[^'\"\s#]{4,}",
        r"\1<redacted>",
        text,
    )
    text = re.sub(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{10,}\b", "<github-token>", text)
    text = re.sub(r"\bgithub_pat_[A-Za-z0-9_]{10,}\b", "<github-token>", text)
    text = re.sub(r"\bsk-ant-[A-Za-z0-9\-_]{10,}\b", "<anthropic-key>", text)
    text = re.sub(r"\bsk-[A-Za-z0-9]{10,}\b", "<openai-like-key>", text)
    text = re.sub(r"(?i)\bbearer\s+[A-Za-z0-9._~+/=-]{10,}\b", "Bearer <redacted>", text)
    text = re.sub(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b", "<jwt>", text)
    text = re.sub(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", "<email>", text)
    text = re.sub(r"(?<!\d)(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?!\d)", "<phone>", text)
    return text[:240]


def should_skip_path(path: str) -> bool:
    return any(part in SKIP_DIRS for part in PurePosixPath(path).parts)


def should_skip_content_scan(path: str) -> bool:
    return path in POLICY_TEXT_ALLOWLIST


def scan_text(text: str, relative_path: str, source: str = "tree") -> list[Finding]:
    findings: list[Finding] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        for kind, pattern in CONTENT_PATTERNS:
            if not pattern.search(line):
                continue
            if kind in {"secret_assignment", "bearer_token", "jwt", "db_uri_with_password", "email_address"} and is_placeholder(line):
                continue
            findings.append(
                Finding(kind=kind, path=relative_path, line=line_number, snippet=redact_snippet(line), source=source)
            )
    return findings


def scan_filename(relative_path: str, source: str = "tree") -> list[Finding]:
    findings: list[Finding] = []
    for kind, pattern in FILENAME_PATTERNS:
        if pattern.search(relative_path):
            findings.append(Finding(kind=kind, path=relative_path, line=None, snippet="filename only", source=source))
    return findings


def read_text_file(path: Path) -> str | None:
    try:
        data = path.read_bytes()
    except OSError:
        return None
    if len(data) > MAX_TEXT_BYTES or b"\x00" in data[:4096]:
        return None
    return data.decode("utf-8", errors="replace")


def iter_git_files(root: Path) -> Iterable[str]:
    proc = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"],
        cwd=root,
        check=False,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or "git ls-files failed")
    for line in proc.stdout.splitlines():
        if line and not should_skip_path(line):
            yield line


def scan_worktree(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    for relative_path in iter_git_files(root):
        findings.extend(scan_filename(relative_path))
        if should_skip_content_scan(relative_path):
            continue
        text = read_text_file(root / relative_path)
        if text is not None:
            findings.extend(scan_text(text, relative_path))
    return findings


def scan_staged_index(root: Path) -> list[Finding]:
    proc = subprocess.run(
        ["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"],
        cwd=root,
        check=False,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or "git diff --cached failed")

    findings: list[Finding] = []
    for relative_path in proc.stdout.splitlines():
        if not relative_path or should_skip_path(relative_path):
            continue
        findings.extend(scan_filename(relative_path, source="staged"))
        if should_skip_content_scan(relative_path):
            continue
        data = git_output(root, ["show", f":{relative_path}"], binary=True)
        assert isinstance(data, bytes)
        if len(data) > MAX_TEXT_BYTES or b"\x00" in data[:4096]:
            continue
        text = data.decode("utf-8", errors="replace")
        findings.extend(scan_text(text, relative_path, source="staged"))
    return findings


def git_output(root: Path, args: list[str], binary: bool = False) -> bytes | str:
    proc = subprocess.run(
        ["git", *args],
        cwd=root,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode(errors="replace").strip() or f"git {' '.join(args)} failed")
    return proc.stdout if binary else proc.stdout.decode(errors="replace")


def scan_history(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    objects = str(git_output(root, ["rev-list", "--objects", "--all"])).splitlines()
    seen: set[tuple[str, str]] = set()
    for item in objects:
        if " " not in item:
            continue
        blob, relative_path = item.split(" ", 1)
        if should_skip_path(relative_path):
            continue
        key = (blob, relative_path)
        if key in seen:
            continue
        seen.add(key)
        findings.extend(scan_filename(relative_path, source=f"history:{blob[:12]}"))
        if should_skip_content_scan(relative_path):
            continue
        obj_type = str(git_output(root, ["cat-file", "-t", blob])).strip()
        if obj_type != "blob":
            continue
        size = int(str(git_output(root, ["cat-file", "-s", blob])).strip() or "0")
        if size > MAX_TEXT_BYTES:
            continue
        data = git_output(root, ["cat-file", "blob", blob], binary=True)
        assert isinstance(data, bytes)
        if b"\x00" in data[:4096]:
            continue
        text = data.decode("utf-8", errors="replace")
        findings.extend(scan_text(text, relative_path, source=f"history:{blob[:12]}"))
    return findings


def dedupe_findings(findings: Iterable[Finding]) -> list[Finding]:
    unique: dict[tuple[str, str, int | None, str, str], Finding] = {}
    for finding in findings:
        key = (finding.kind, finding.path, finding.line, finding.snippet, finding.source)
        unique.setdefault(key, finding)
    return sorted(unique.values(), key=lambda item: (item.source, item.path, item.line or 0, item.kind))


def print_findings(findings: list[Finding]) -> None:
    for finding in findings:
        location = finding.path if finding.line is None else f"{finding.path}:{finding.line}"
        print(f"{finding.source}: {location}: {finding.kind}: {finding.snippet}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Block personal/private material from public TelemForge refs.")
    parser.add_argument("--root", default=".", help="repository root to scan")
    parser.add_argument("--scan-history", action="store_true", help="also scan all reachable git history")
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    if not (root / ".git").exists():
        git_dir = subprocess.run(
            ["git", "rev-parse", "--git-dir"],
            cwd=root,
            check=False,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if git_dir.returncode != 0:
            print(f"not a git repository: {root}", file=sys.stderr)
            return 2

    findings = scan_staged_index(root)
    findings.extend(scan_worktree(root))
    if args.scan_history:
        findings.extend(scan_history(root))
    findings = dedupe_findings(findings)

    if findings:
        print("public repo guard failed:")
        print_findings(findings)
        return 1

    print("public repo guard passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
