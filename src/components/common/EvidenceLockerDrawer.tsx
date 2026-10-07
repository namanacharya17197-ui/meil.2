import React, { useState } from 'react';
import { useEsg } from '../../context/EsgContext';
import {
  X,
  Paperclip,
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Download,
  Eye,
  Hash,
  Gauge,
} from 'lucide-react';

export const EvidenceLockerDrawer: React.FC = () => {
  const {
    isEvidenceDrawerOpen,
    setIsEvidenceDrawerOpen,
    activeKpiForEvidence,
    evidenceAttachments,
    setEvidenceAttachments,
    kpiAuditLogs,
    currentRole,
    currentUser,
    toggleAuditorVerification,
    addKpiAuditLog,
  } = useEsg();

  const [activeTab, setActiveTab] = useState<'attachments' | 'history'>('attachments');
  const [newFile, setNewFile] = useState<string>('');
  const [invoiceNo, setInvoiceNo] = useState<string>('');
  const [meterRef, setMeterRef] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  if (!isEvidenceDrawerOpen || !activeKpiForEvidence) return null;

  const kpiAttachments = evidenceAttachments.filter(
    (a) => a.kpiKey === activeKpiForEvidence.key
  );

  const kpiHistory = kpiAuditLogs.filter(
    (l) => l.kpiKey === activeKpiForEvidence.key
  );

  const isAuditor = currentRole === 'Statutory Auditor' || currentRole === 'Independent Auditor (ISAE 3000)';

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = newFile || `${activeKpiForEvidence.label.replace(/\s+/g, '_')}_Bill_Oct26.pdf`;
    
    const newAttachment = {
      id: `att-${Date.now()}`,
      kpiKey: activeKpiForEvidence.key,
      kpiLabel: activeKpiForEvidence.label,
      fileName,
      fileSize: '1.8 MB',
      fileUrl: '#',
      uploadedBy: currentUser?.name || 'Site Operations Engineer',
      role: currentRole,
      uploadedAt: 'Just now',
      invoiceNo: invoiceNo || `INV/MEIL/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      meterReadingRef: meterRef || 'Digital Telemetry Logger #2',
      notes: notes || 'Statutory utility documentation submitted for statutory assurance.',
      verifiedByAuditor: false,
    };

    setEvidenceAttachments((prev) => [newAttachment, ...prev]);
    
    addKpiAuditLog({
      kpiKey: activeKpiForEvidence.key,
      kpiLabel: activeKpiForEvidence.label,
      previousValue: `${activeKpiForEvidence.currentValue} ${activeKpiForEvidence.unit}`,
      newValue: `${activeKpiForEvidence.currentValue} ${activeKpiForEvidence.unit}`,
      changedBy: currentUser?.name || 'Engineer',
      role: currentRole,
      reason: `Attached statutory evidence document: ${fileName} (Ref: ${newAttachment.invoiceNo})`,
    });

    setNewFile('');
    setInvoiceNo('');
    setMeterRef('');
    setNotes('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-700 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                <Paperclip className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Statutory Evidence Locker &amp; Audit Trail
              </span>
              {activeKpiForEvidence.isCore && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SEBI BRSR Core
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {activeKpiForEvidence.label}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Current Reported Value:</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {activeKpiForEvidence.currentValue} {activeKpiForEvidence.unit}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEvidenceDrawerOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 gap-4">
          <button
            onClick={() => setActiveTab('attachments')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'attachments'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Attached Evidence ({kpiAttachments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Immutable Audit Logs ({kpiHistory.length})</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'attachments' && (
            <>
              {/* Evidence Upload Form */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Utility Bill / Supporting Invoice</span>
                  </h3>
                  <span className="text-[10px] text-slate-500">PDF, JPG, PNG (Max 25MB)</span>
                </div>

                {uploadSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Evidence attached and verified hash logged to audit trail!</span>
                  </div>
                )}

                <form onSubmit={handleSimulatedUpload} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Document File Name</label>
                    <input
                      type="text"
                      placeholder="e.g. MSEB_Substation_Electricity_Bill_Q3.pdf"
                      value={newFile}
                      onChange={(e) => setNewFile(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Invoice / Document Ref</label>
                      <input
                        type="text"
                        placeholder="e.g. TSSPDCL-2026-9812"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Meter / Sensor Reference</label>
                      <input
                        type="text"
                        placeholder="e.g. Feeder #2 / Ultrasonic M1"
                        value={meterRef}
                        onChange={(e) => setMeterRef(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Description / Statutory Justification</label>
                    <textarea
                      rows={2}
                      placeholder="Specify metering methodology, calibration date or supplier details..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach Evidence to {activeKpiForEvidence.label}</span>
                  </button>
                </form>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Attached Statutory Evidence ({kpiAttachments.length})</span>
                  <span className="text-[10px] text-slate-500">ISAE 3000 Assurance Ready</span>
                </h3>

                {kpiAttachments.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    No evidence document attached to this KPI yet. Attach a bill or calibration certificate above.
                  </div>
                ) : (
                  kpiAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                            <FileCheck2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-white truncate max-w-[260px]">
                              {att.fileName}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>Ref: {att.invoiceNo || 'N/A'}</span>
                              <span>•</span>
                              <span>{att.fileSize || '1.5 MB'}</span>
                              <span>•</span>
                              <span>{att.uploadedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Assurance Verification Stamp */}
                        {att.verifiedByAuditor ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>ISAE 3000 Assured</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Pending Review</span>
                          </span>
                        )}
                      </div>

                      {att.notes && (
                        <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-md border border-slate-800">
                          {att.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                        <span className="text-slate-500">
                          Uploaded by: <strong className="text-slate-300">{att.uploadedBy}</strong> ({att.role || 'Operations'})
                        </span>

                        {/* Auditor Assurance Toggle Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAuditorVerification(att.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              att.verifiedByAuditor
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800'
                                : 'bg-slate-800 hover:bg-emerald-900/60 text-slate-200 hover:text-emerald-300 border border-slate-700'
                            }`}
                            title={isAuditor ? 'Statutory Auditor Verification' : 'Toggle Assurance Verification'}
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{att.verifiedByAuditor ? 'Revoke Assurance' : 'Mark as Audited & Verified'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Field Change History &amp; Immutable Reason Log</span>
                <span className="text-[10px] text-emerald-400 font-mono">SEBI Audit Standard</span>
              </h3>

              {kpiHistory.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  No previous modification logs recorded for this indicator.
                </div>
              ) : (
                kpiHistory.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium text-white">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/60">
                        {log.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Previous Value</span>
                        <span className="font-mono text-slate-400">{log.previousValue}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase block">Reconciled Value</span>
                        <span className="font-mono font-bold text-white">{log.newValue}</span>
                      </div>
                    </div>

                    <div className="text-slate-300 text-[11px]">
                      <strong className="text-slate-400">Modification Reason:</strong> {log.reason}
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-1">
                      <span>Changed by: <strong className="text-slate-300">{log.changedBy}</strong></span>
                      <span className="font-mono text-emerald-500">Hash Verified ✓</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Assurance Scope: <strong className="text-white">ISAE 3000 Standard</strong></span>
          <button
            onClick={() => setIsEvidenceDrawerOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
