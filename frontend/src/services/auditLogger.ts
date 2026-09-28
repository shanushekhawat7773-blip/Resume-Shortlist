import { AuditLogEntry } from '../types';

const AUDIT_STORAGE_KEY = 'rs_audit_log_v1';

export class AuditLogger {
  private logs: AuditLogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
        return;
      }
    } catch (e) {}

    // Initial realistic benchmark audit history
    this.logs = [
      {
        id: 'aud_1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        action: 'UPLOAD',
        candidateName: 'Aarav Mehta',
        details: 'Resume uploaded (Aarav_Mehta_Senior_Data_Analyst.pdf) and SHA-256 fingerprint cached.',
        user: 'Vikram S. (Principal Recruiter)',
      },
      {
        id: 'aud_2',
        timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
        action: 'ANALYSIS',
        candidateName: 'Aarav Mehta',
        jobTitle: 'Senior Data Analyst',
        details: 'Evaluation completed: 89/100 composite score generated across 6 dimensions. Zero protected attributes used.',
        user: 'System (Scoring Engine v2.4)',
      },
      {
        id: 'aud_3',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        action: 'STAGE_CHANGE',
        candidateName: 'Aarav Mehta',
        details: 'Candidate moved from Reviewed to Shortlisted.',
        user: 'Vikram S. (Principal Recruiter)',
      },
      {
        id: 'aud_4',
        timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        action: 'WEIGHT_UPDATE',
        details: 'Scoring weights updated: Required Skills (30%), Experience (20%), Responsibilities (20%), Education (10%).',
        user: 'Vikram S. (Principal Recruiter)',
      },
    ];
  }

  private persist() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {}
  }

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 200) this.logs = this.logs.slice(0, 200);
    this.persist();
  }

  public getLogs(): AuditLogEntry[] {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
    this.persist();
  }
}

export const auditLogger = new AuditLogger();
