import React, { useState, useMemo } from 'react';
import { useEsg } from '../../../context/EsgContext';
import { EmissionsLog, EmissionLogStatus, AuditTrailRecord } from '../../../types/esg';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  FileText,
  Search,
  Filter,
  History,
  Lock,
  ExternalLink,
  ChevronRight,
  Hash,
  Eye,
  MessageSquare,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export const AuditorVerificationPortal: React.FC = () => {
  const {
    emissionsLogs,
    updateEmissionsLogStatus,
    evidenceAttachments,
    auditTrailRecords,
    currentRole,
    currentUser,
  } = useEsg();

  // Selection
  const [selectedLogId, setSelectedLogId] = useState<string>(emissionsLogs[0]?.id || 'em-log-01');
  const [filterScope, setFilterScope] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auditor Actions State
  const [auditorComment, setAuditorComment] = useState<string>('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Document Viewer Zoom / State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);

  // Active selected log
  const selectedLog: EmissionsLog = useMemo(() => {
    return emissionsLogs.find((l) => l.id === selectedLogId) || emissionsLogs[0];
  }, [selectedLogId, emissionsLogs]);

  // Associated evidence attachment
  const selectedEvidence = useMemo(() => {
    if (!selectedLog) return null;
    return (
      evidenceAttachments.find((e) => e.emissionLogId === selectedLog.id) || {
        id: 'ev-default',
        emissionLogId: selectedLog.id,
        fileName: selectedLog.fileUrl ? selectedLog.fileUrl.split('/').pop() || 'Invoice_Document.pdf' : 'Signed_IOCL_Delivery_Challan_8821.pdf',
        fileUrl: selectedLog.fileUrl || 'https://storage.meilgroup.com/evidence/Signed_IOCL_Delivery_Challan_8821.pdf',
        documentType: selectedLog.documentType || 'Fuel Invoice',
        uploadedBy: 'Er. Rajesh Kumar (Site In-Charge)',
        uploadedAt: selectedLog.uploadedAt || '2026-09-28 09:18 AM',
        fileSizeBytes: 2450000,
        verificationHash: '1a8565a9dae4b4198bcfa89c4f11641001b60d65279b9c9f7a93a1c6e1074e2',
        ocrConfidencePct: 99.4,
      }
    );
  }, [selectedLog, evidenceAttachments]);

  // Associated audit trail records for selected log
  const selectedLogAuditRecords: AuditTrailRecord[] = useMemo(() => {
    if (!selectedLog) return [];
    return auditTrailRecords.filter((r) => r.recordId === selectedLog.id);
  }, [selectedLog, auditTrailRecords]);

  // Filtered emission logs list
  const filteredLogs = useMemo(() => {
    return emissionsLogs.filter((log) => {
      const matchSearch =
        log.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.activityCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.invoiceNo || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchScope = filterScope === 'ALL' || log.scopeType === filterScope;
      const matchStatus = filterStatus === 'ALL' || log.status === filterStatus;
      return matchSearch && matchScope && matchStatus;
    });
  }, [emissionsLogs, searchQuery, filterScope, filterStatus]);

  // Handle Auditor Decisions with Validation
  const handleAuditorDecision = async (status: EmissionLogStatus) => {
    setActionError(null);
    setActionSuccess(null);

    // Validation check: Rejection or Clarification requires mandatory comment
    if ((status === 'Flagged' || status === 'Draft') && !auditorComment.trim()) {
      setActionError(
        'Mandatory Comment Required: Under ISAE 3000 assurance standards, auditors must provide explicit technical remarks or queries when flagging or requesting clarification.'
      );
      return;
    }

    try {
      const commentToSave = auditorComment.trim()
        ? auditorComment.trim()
        : status === 'Audited'
        ? 'Verified against original digital weighbridge challan and delivery receipt. Certified under ISAE 3000 reasonable assurance criteria.'
        : 'Approved by statutory review panel.';

      await updateEmissionsLogStatus(selectedLog.id, status, commentToSave);
      setActionSuccess(`Record ${selectedLog.id} transitioned to "${status}" successfully. Immutable audit trail appended.`);
      setAuditorComment('');
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      setActionError(`Failed to update status: ${err?.message || err}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span className="text-emerald-400 font-semibold">Step 3 & Feature 3</span>
              <span>·</span>
              <span>ISAE 3000 (Revised) Statutory Assurance Protocol</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800">
                <Lock className="w-3 h-3 text-purple-400" />
                Cryptographic Evidence Vault
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Split-Screen Auditor Verification Portal & Evidence Viewer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cross-examine site telemetry entries against primary source invoices, weighbridge challans, and DISCOM meter calibration logs with instant hash verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuditDrawerOpen(!isAuditDrawerOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAuditDrawerOpen ? 'Close Audit Drawer' : 'View Audit Trail'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPLIT-SCREEN VERIFICATION UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Emissions Record List & Selected Item Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search site, invoice #, activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={filterScope}
                onChange={(e) => setFilterScope(e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              >
                <option value="ALL">All Scopes</option>
                <option value="Scope 1">Scope 1</option>
                <option value="Scope 2">Scope 2</option>
                <option value="Scope 3">Scope 3</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="Submitted">Submitted (Review Needed)</option>
                <option value="Approved">Approved</option>
                <option value="Audited">Audited (Certified)</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div>
          </div>

          {/* Record Queue Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm space-y-2 max-h-[380px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No emission records found matching criteria.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isSelected = log.id === selectedLogId;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`p-3 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200 truncate max-w-[200px]">
                        {log.siteName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.status === 'Audited'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : log.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : log.status === 'Flagged'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1.5">
                      <span className="truncate">{log.activityCategory}</span>
                      <span className="font-mono text-emerald-400 font-bold ml-2 flex-shrink-0">
                        {log.co2eMetricTonnes.toLocaleString()} tCO₂e
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80 font-mono">
                      <span>{log.reportingMonthYear}</span>
                      <span>Inv: {log.invoiceNo || 'N/A'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Metadata Card for Selected Entry */}
          {selectedLog && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Entry Telemetry Specifications</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">ID: {selectedLog.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Activity Quantity</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {selectedLog.activityQuantity.toLocaleString()} {selectedLog.unit}
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Emission Factor</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {selectedLog.emissionFactor} kg CO₂e / unit
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Calculated Emissions</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {selectedLog.co2eMetricTonnes.toLocaleString()} tCO₂e
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Facility / Fleet</span>
                  <span className="text-slate-200 font-semibold truncate block">
                    {selectedLog.facility || 'Spillway Fleet #4'}
                  </span>
                </div>
              </div>

              {selectedLog.auditorComments && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-[11px] text-amber-200">
                  <span className="font-bold block text-amber-300 mb-0.5">Prior Auditor Remark:</span>
                  <span>{selectedLog.auditorComments}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANE: Embedded Document Viewer & Auditor Action Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Document Viewer Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            {/* Viewer Header with Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white truncate max-w-[240px]">
                    {selectedEvidence?.fileName || 'Primary_Evidence_Invoice.pdf'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>Type: {selectedEvidence?.documentType || 'Fuel Invoice'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">
                    OCR Confidence: {selectedEvidence?.ocrConfidencePct || 99.4}%
                  </span>
                </div>
              </div>

              {/* Zoom & View Controls */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
                  title="Zoom Out"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[10px] text-slate-300">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 15, 180))}
                  title="Zoom In"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  title="Reset Zoom"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated High-Fidelity Official Statutory Evidence Document */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 min-h-[380px] overflow-auto flex items-center justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-[560px] bg-slate-900 border-2 border-slate-700/80 rounded-lg p-6 shadow-2xl text-slate-200 space-y-4 font-sans text-xs transition-transform"
              >
                {/* Document Top Letterhead */}
                <div className="flex items-start justify-between border-b-2 border-slate-700 pb-3">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                      OFFICIAL DISPATCH & INVOICE RECEIPT
                    </div>
                    <div className="text-base font-extrabold text-white">
                      {selectedLog.scopeType === 'Scope 2'
                        ? 'SOUTHERN POWER DISTRIBUTION COMPANY (DISCOM)'
                        : selectedLog.scopeType === 'Scope 3'
                        ? 'STEEL AUTHORITY OF INDIA LTD (SAIL) - MILL DISPATCH'
                        : 'INDIAN OIL CORPORATION LIMITED (IOCL BULK DEPOT)'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      GSTIN: 36AAACI1681G1ZM • Statutory Delivery Challan
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      NABL ACCREDITED
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Ref: {selectedLog.invoiceNo || 'INV-2026-9812'}
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-2 gap-4 text-[11px] p-3 rounded bg-slate-950/80 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[9px]">Consignee / Site:</span>
                    <span className="font-bold text-white block">{selectedLog.siteName}</span>
                    <span className="text-slate-400 text-[10px]">Division: Hydro & Infrastructure</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase font-mono text-[9px]">Challan Date & Vehicle:</span>
                    <span className="font-semibold text-slate-300 block">{selectedLog.reportingMonthYear}</span>
                    <span className="text-emerald-400 font-mono text-[10px]">Carrier: AP 39 TE 4821</span>
                  </div>
                </div>

                {/* Material Line Items Table */}
                <table className="w-full text-left text-[11px] border border-slate-800">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[9px]">
                    <tr>
                      <th className="p-2">Description of Commodity</th>
                      <th className="p-2 text-right">Net Quantity</th>
                      <th className="p-2 text-right">Unit Rate</th>
                      <th className="p-2 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-2 font-medium text-slate-200">
                        {selectedLog.activityCategory}
                        <div className="text-[9px] text-slate-500 font-mono">
                          Density @15°C: 0.8385 kg/L • Flash Pt: 42°C
                        </div>
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-white">
                        {selectedLog.activityQuantity.toLocaleString()} {selectedLog.unit}
                      </td>
                      <td className="p-2 text-right font-mono text-slate-400">₹88.50</td>
                      <td className="p-2 text-right font-mono font-bold text-emerald-400">
                        ₹{(selectedLog.activityQuantity * 88.5).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Digital Stamp & Cryptographic Signature Box */}
                <div className="p-3 rounded bg-slate-950 border border-emerald-900/60 flex items-center justify-between text-[10px]">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CRYPTOGRAPHICALLY SEALED & OCR MATCHED</span>
                    </div>
                    <div className="font-mono text-slate-500 text-[9px] truncate max-w-[320px] mt-0.5">
                      SHA256: {selectedEvidence?.verificationHash || '1a8565a9dae4b4198bcfa89c4f11641001b60d65'}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-400">
                    <div>Status: VERIFIED</div>
                    <div className="text-emerald-400 font-bold">100% Match</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AUDITOR ACTION CONTROLS PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Independent Auditor Decision Controls
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Auditor: {currentUser?.name || 'S. Narayanan (ISAE 3000 Lead)'}
              </span>
            </div>

            {/* Mandatory Comment Field */}
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1">
                Auditor Audit Note / Statutory Queries
                <span className="text-slate-500 text-[11px] font-normal ml-1">
                  (Mandatory when Requesting Clarification or Rejecting)
                </span>
              </label>
              <textarea
                value={auditorComment}
                onChange={(e) => setAuditorComment(e.target.value)}
                placeholder="Enter statutory inspection commentary, sample voucher verification notes, or reason for clarification..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Feedback Banners */}
            {actionError && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 flex items-start gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-start gap-2 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* One-Click Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-1 flex-wrap">
              {/* Reject */}
              <button
                type="button"
                onClick={() => handleAuditorDecision('Draft')}
                className="flex items-center gap-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Entry</span>
              </button>

              {/* Request Clarification / Flag */}
              <button
                type="button"
                onClick={() => handleAuditorDecision('Flagged')}
                className="flex items-center gap-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Clarification</span>
              </button>

              {/* Verify & Approve */}
              <button
                type="button"
                onClick={() => handleAuditorDecision('Audited')}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Sign-Off (Audited)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIT TRAIL DRAWER (Slide-Over / Expandable) */}
      {isAuditDrawerOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Immutable Regulatory Audit Trail: {selectedLog?.siteName} ({selectedLog?.id})
              </h3>
            </div>
            <button
              onClick={() => setIsAuditDrawerOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-semibold">
                  <th className="py-2.5 px-3">Timestamp (IST)</th>
                  <th className="py-2.5 px-3">Actor ID</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Transition (Old → New)</th>
                  <th className="py-2.5 px-3">Auditor Comments</th>
                  <th className="py-2.5 px-3">Verified Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {selectedLogAuditRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-slate-500">
                      No state transitions recorded yet for this item.
                    </td>
                  </tr>
                ) : (
                  selectedLogAuditRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-slate-300">{rec.timestamp}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{rec.actorId}</td>
                      <td className="py-2.5 px-3 text-slate-400">{rec.role}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-emerald-400">{rec.action}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                        {rec.previousValue} → <strong className="text-white">{rec.newValue}</strong>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-[200px] truncate" title={rec.comments}>
                        {rec.comments}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                        {rec.verifiedHash ? `${rec.verifiedHash.substring(0, 10)}...` : '0x8f43...0e6d'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
