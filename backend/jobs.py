"""
Async job manager for long-running scraping tasks.
Stores jobs in memory (ephemeral on Vercel, but works for single session).
"""
import uuid
from typing import Dict, Optional
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

# In-memory job storage
_jobs: Dict[str, Dict] = {}

def create_job(params: Dict) -> str:
    """Create a new scraping job and return job ID."""
    job_id = str(uuid.uuid4())
    _jobs[job_id] = {
        "id": job_id,
        "status": JobStatus.PENDING,
        "params": params,
        "results": None,
        "error": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    return job_id

def get_job(job_id: str) -> Optional[Dict]:
    """Get job by ID."""
    return _jobs.get(job_id)

def update_job(job_id: str, status: JobStatus, results=None, error=None):
    """Update job status and results."""
    if job_id in _jobs:
        _jobs[job_id]["status"] = status
        _jobs[job_id]["updated_at"] = datetime.utcnow().isoformat()
        if results is not None:
            _jobs[job_id]["results"] = results
        if error is not None:
            _jobs[job_id]["error"] = error

def start_job(job_id: str):
    """Mark job as running."""
    update_job(job_id, JobStatus.RUNNING)

def complete_job(job_id: str, results):
    """Mark job as completed with results."""
    update_job(job_id, JobStatus.COMPLETED, results=results)

def fail_job(job_id: str, error: str):
    """Mark job as failed with error."""
    update_job(job_id, JobStatus.FAILED, error=error)
