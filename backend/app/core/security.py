import hashlib
import re
from typing import List

def compute_document_hash(text: str) -> str:
    """Compute SHA-256 cryptographic digest of document content."""
    clean_bytes = text.strip().encode("utf-8")
    return hashlib.sha256(clean_bytes).hexdigest()

def validate_file_extension(filename: str, allowed: List[str]) -> bool:
    """Validate that uploaded file ends with an allowed extension."""
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in allowed

def mask_email(email: str) -> str:
    """Mask email for privacy compliance logs."""
    if "@" not in email:
        return "***"
    local, domain = email.split("@", 1)
    if len(local) <= 2:
        masked_local = "*" * len(local)
    else:
        masked_local = local[0] + "*" * (len(local) - 2) + local[-1]
    return f"{masked_local}@{domain}"

def mask_phone(phone: str) -> str:
    """Mask telephone number for log confidentiality."""
    clean = re.sub(r"\D", "", phone)
    if len(clean) >= 4:
        return f"***-***-{clean[-4:]}"
    return "***-***-****"
