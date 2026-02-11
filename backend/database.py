"""
In-memory + JSON file storage for search history and saved leads.
"""
import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

# Data directory
DATA_DIR = Path(__file__).parent.parent / "data"
HISTORY_FILE = DATA_DIR / "history.json"
LEADS_FILE = DATA_DIR / "leads.json"

# In-memory storage
_history: List[Dict] = []
_leads: List[Dict] = []
_current_results: List[Dict] = []


def _ensure_data_dir():
    """Create data directory if it doesn't exist."""
    DATA_DIR.mkdir(exist_ok=True)


def _load_json_file(file_path: Path) -> List[Dict]:
    """Load data from JSON file."""
    if file_path.exists():
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def _save_json_file(file_path: Path, data: List[Dict]):
    """Save data to JSON file."""
    _ensure_data_dir()
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)


def initialize():
    """Initialize database by loading existing data."""
    global _history, _leads
    _ensure_data_dir()
    _history = _load_json_file(HISTORY_FILE)
    _leads = _load_json_file(LEADS_FILE)


# Search History Functions
def get_history() -> List[Dict]:
    """Get all search history."""
    return _history


def add_history(search_params: Dict) -> Dict:
    """Add a search to history."""
    history_entry = {
        "id": f"history_{datetime.now().timestamp()}",
        "timestamp": datetime.now().isoformat(),
        "params": search_params,
        "result_count": search_params.get("result_count", 0)
    }
    _history.insert(0, history_entry)  # Most recent first
    _save_json_file(HISTORY_FILE, _history)
    return history_entry


# Saved Leads Functions
def get_leads() -> List[Dict]:
    """Get all saved leads."""
    return _leads


def add_lead(lead_data: Dict) -> Dict:
    """Add a lead to bookmarks."""
    # Check if lead already exists
    existing = next((l for l in _leads if l.get("id") == lead_data.get("id")), None)
    if existing:
        return existing

    lead_data["saved_at"] = datetime.now().isoformat()
    _leads.insert(0, lead_data)
    _save_json_file(LEADS_FILE, _leads)
    return lead_data


def delete_lead(lead_id: str) -> bool:
    """Remove a lead from bookmarks."""
    global _leads
    initial_count = len(_leads)
    _leads = [l for l in _leads if l.get("id") != lead_id]

    if len(_leads) < initial_count:
        _save_json_file(LEADS_FILE, _leads)
        return True
    return False


# Current Results Functions
def set_current_results(results: List[Dict]):
    """Store current search results."""
    global _current_results
    _current_results = results


def get_current_results() -> List[Dict]:
    """Get current search results."""
    return _current_results


# Initialize on module import
initialize()
