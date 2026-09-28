import React, { useState } from 'react';
import {
  Shield,
  Clock,
  UserCheck,
  FileCheck2,
  Lock,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { auditLogger } from '../../services/auditLogger';
import { AuditLogEntry } from '../../types';

export const AuditLogView: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(() => auditLogger.getLogs());

  const handleExportAuditJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-brand-400" />
            Compliance & System Audit Trail
          </div>
          <h2 className="text-xl font-black text-white">
            Immutable Recruitment Audit Log
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Traceable log of all resume uploads, algorithmic score runs, weight modifications, and candidate stage transitions.
          </p>
        </div>

        <button
          onClick={handleExportAuditJson}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-lg border border-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            System Events ({logs.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Zero Protected Attributes Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp (ISO)</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Candidate / Role</th>
                <th className="py-2.5 px-3">Audit Details</th>
                <th className="py-2.5 px-3 text-right">Initiator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      log.action === 'ANALYSIS' ? 'bg-brand-950 text-brand-300 border border-brand-800' :
                      log.action === 'UPLOAD' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      log.action === 'STAGE_CHANGE' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-200 font-medium">
                    {log.candidateName || log.jobTitle || 'System'}
                  </td>

                  <td className="py-3 px-3 text-slate-300 max-w-md leading-snug">
                    {log.details}
                  </td>

                  <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                    {log.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
