"""
Audit Trail Logging Service
Maintains immutable logs of document uploads, match analyses, stage updates, and privacy purges.
"""
import datetime
import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.entities import AuditLogModel

async def log_audit_event(
    db: AsyncSession,
    action: str,
    details: str,
    user: str = "System (Scoring Engine v2.4)",
    candidate_name: Optional[str] = None,
    candidate_id: Optional[str] = None,
    job_title: Optional[str] = None,
) -> AuditLogModel:
    """Record an immutable event entry to the audit log."""
    event = AuditLogModel(
        id=f"aud_{uuid.uuid4().hex[:12]}",
        timestamp=datetime.datetime.utcnow(),
        action=action,
        candidate_name=candidate_name,
        candidate_id=candidate_id,
        job_title=job_title,
        details=details,
        user=user,
    )
    db.add(event)
    await db.flush()
    return event
