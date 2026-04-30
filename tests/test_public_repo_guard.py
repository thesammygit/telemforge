import importlib.util
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUARD_PATH = ROOT / "scripts" / "public_repo_guard.py"


def load_guard():
    spec = importlib.util.spec_from_file_location("public_repo_guard", GUARD_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def collect_for_text(text, relative_path="docs/example.md"):
    guard = load_guard()
    return guard.scan_text(text, relative_path)


def test_blocks_absolute_user_paths():
    user = "sa" + "m."
    findings = collect_for_text(f"See /Users/{user}/Projects/telemforge for local setup")
    assert any(item.kind == "personal_path" for item in findings)


def test_blocks_messaging_metadata_without_blocking_domain_signal_terms():
    name = "S" + "am"
    channel = "Sig" + "nal"
    prefix = "Requested" + " by"
    bad = collect_for_text(f"{prefix}: {name} via {channel}")
    good = collect_for_text("Downlink Signal-To-Noise Ratio nominal", "fixtures/telemetry/channels.json")

    assert any(item.kind == "personal_name" for item in bad)
    assert any(item.kind == "messaging_metadata" for item in bad)
    assert good == []


def test_blocks_secret_like_assignments():
    sample = "API_" + "TOKEN" + "='abc123" + "def456ghi789'"
    findings = collect_for_text(sample)
    assert any(item.kind == "secret_assignment" for item in findings)


def test_allows_public_relative_docs_and_placeholder_secrets():
    text = """
    See [Development Path](docs/development/README.md).
    Example token: YOUR_API_TOKEN
    DATABASE_URL=postgresql://user:password@localhost:5432/telemforge
    """
    assert collect_for_text(text) == []
