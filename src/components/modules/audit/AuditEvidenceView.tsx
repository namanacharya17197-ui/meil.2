import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  FileText,
  ShieldCheck,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Download,
  Eye,
  Filter,
  Search,
  FileCheck2,
} from 'lucide-react';

export const AuditEvidenceView: React.FC = () => {
  const {
    evidenceAttachments,
    kpiAuditLogs,
    currentRole,
    currentUser,
    toggleAuditorVerification,
    openEvidenceDrawerForKpi,
    brsrFormData,
  } = useEsg();

  const [activeTab, setActiveTab] = useState<'evidence' | 'logs'>('evidence');
  const [filterCoreOnly, setFilterCoreOnly] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const isAuditor = currentRole === 'Statutory Auditor' || currentRole === 'Independent Auditor (ISAE 3000)';

  const filteredAttachments = evidenceAttachments.filter((att) => {
    const matchesSearch =
      att.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (att.kpiLabel && att.kpiLabel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (att.invoiceNo && att.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const verifiedCount = evidenceAttachments.filter((a) => a.verifiedByAuditor).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-950 text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              ISAE 3000 Statutory Assurance Locker
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Audit Trail, Invoices &amp; Evidence Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Immutable log of all utility bills, fuel invoices, weighbridge receipts, and timestamped field modification notes for independent statutory verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Auditor Stamp Status: </span>
            <strong className="text-emerald-400 font-mono">
              {verifiedCount} of {evidenceAttachments.length} Documents Assured
            </strong>
          </div>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'evidence'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Uploaded Evidence Documents ({evidenceAttachments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Immutable Change Logs ({kpiAuditLogs.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents or invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* TAB 1: EVIDENCE REPOSITORY TABLE */}
      {activeTab === 'evidence' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Evidence Document Name</th>
                  <th className="py-3 px-4">Associated BRSR KPI</th>
                  <th className="py-3 px-4">Invoice / Meter Reference</th>
                  <th className="py-3 px-4">Uploaded By</th>
                  <th className="py-3 px-4 text-center">Assurance Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAttachments.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-800 rounded-md text-sky-400 shrink-0">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{att.fileName}</div>
                          <div className="text-[10px] text-slate-500">{att.fileSize || '1.5 MB'} • {att.uploadedAt}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-200">
                        {att.kpiLabel || 'P6 Emissions & Fuel'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      <div>{att.invoiceNo || 'REF-MEIL-2026-981'}</div>
                      <div className="text-[10px] text-slate-500">{att.meterReadingRef || 'Substation Feed 1'}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div>{att.uploadedBy}</div>
                      <div className="text-[10px] text-slate-500">{att.role || 'Site Operations'}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {att.verifiedByAuditor ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>ISAE 3000 Assured</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Pending Auditor Review</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleAuditorVerification(att.id)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          att.verifiedByAuditor
                            ? 'bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                        title={isAuditor ? 'Statutory Auditor Verification' : 'Toggle Assurance Verification'}
                      >
                        {att.verifiedByAuditor ? 'Revoke Assurance' : 'Verify & Stamp ✓'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: IMMUTABLE AUDIT LOGS TABLE */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp (IST)</th>
                  <th className="py-3 px-4">KPI Field Modified</th>
                  <th className="py-3 px-4">Previous Value</th>
                  <th className="py-3 px-4">Reconciled Value</th>
                  <th className="py-3 px-4">Changed By &amp; Role</th>
                  <th className="py-3 px-4">Mandatory Statutory Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {kpiAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-white">{log.kpiLabel}</td>
                    <td className="py-3 px-4 font-mono text-rose-300 bg-rose-950/20">{log.previousValue}</td>
                    <td className="py-3 px-4 font-mono text-emerald-300 bg-emerald-950/20 font-bold">{log.newValue}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-semibold">{log.changedBy}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{log.role}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-sm">
                      <p className="text-[11px] leading-relaxed">{log.reason}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
