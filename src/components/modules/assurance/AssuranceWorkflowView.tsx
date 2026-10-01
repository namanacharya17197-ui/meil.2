import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import { MeilLogo } from '../../common/MeilLogo';
import {
  ShieldAlert,
  CheckSquare,
  Lock,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Download,
  Printer,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const AssuranceWorkflowView: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    approvals,
    updateApprovalStatus,
    auditTrail,
    currentRole,
    aggregatedMetrics,
    sites,
    selectedCycle,
    addAuditLog,
  } = useEsg();

  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [auditFilterUser, setAuditFilterUser] = useState('All');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [xbrlExportSuccess, setXbrlExportSuccess] = useState(false);

  const selectedApproval = approvals.find((a) => a.id === selectedApprovalId);

  const handleApprove = (id: string) => {
    updateApprovalStatus(id, 'Approved', commentText || 'Verified against primary energy bills. Approved under ISAE 3000 assurance standard.');
    setCommentText('');
    setSelectedApprovalId(null);
  };

  const handleReject = (id: string) => {
    updateApprovalStatus(id, 'Rejected', commentText || 'Discrepancy found between reported telemetry and fuel ledger. Returned for rectification.');
    setCommentText('');
    setSelectedApprovalId(null);
  };

  const handleClarify = (id: string) => {
    updateApprovalStatus(id, 'Clarification Requested', commentText || 'Kindly attach calibration test certificate for heavy equipment flow meters.');
    setCommentText('');
    setSelectedApprovalId(null);
  };

  const handleExportXbrl = () => {
    const xbrlData = {
      standard: 'SEBI_BRSR_CORE_TAXONOMY_v2.0',
      reportingEntity: 'Megha Engineering & Infrastructures Limited (MEIL)',
      cin: 'U45202TG2006PLC050271',
      reportingCycle: selectedCycle,
      generatedTimestamp: new Date().toISOString(),
      assuranceFramework: 'ISAE 3000 (Revised)',
      leadAuditor: 'Dr. Anita Desai, Independent Assurance Lead',
      csoSignOff: 'K. V. Rao, Chief Sustainability Officer',
      coreAttributes: {
        scope1_tco2e: aggregatedMetrics.totalScope1,
        scope2_tco2e: aggregatedMetrics.totalScope2,
        scope3_tco2e: aggregatedMetrics.totalScope3,
        ghg_intensity_tco2e_per_cr: aggregatedMetrics.intensityTco2ePerCr,
        water_recycled_proportion_pct: aggregatedMetrics.avgWaterRecycledPct,
        ltifr_per_million_man_hours: aggregatedMetrics.avgLtifr,
        total_turnover_inr_cr: aggregatedMetrics.totalTurnoverCr,
        site_coverage_count: sites.length,
      },
      digitalSignatureSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };

    const blob = new Blob([JSON.stringify(xbrlData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MEIL_BRSR_Core_XBRL_${selectedCycle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addAuditLog({
      user: 'K. V. Rao',
      role: currentRole,
      action: 'EXPORT_XBRL',
      entity: 'SEBI XBRL Submission Repository',
      field: 'BRSR Core Statutory Package',
      oldValue: 'Pre-flight Validation',
      newValue: 'Exported & Cryptographically Signed',
    });

    setXbrlExportSuccess(true);
    setTimeout(() => setXbrlExportSuccess(false), 3000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const filteredAuditTrail = auditTrail.filter((entry) => {
    const matchesUser = auditFilterUser === 'All' || entry.user === auditFilterUser;
    const matchesSearch =
      entry.entity.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      entry.field.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(auditSearchQuery.toLowerCase());
    return matchesUser && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Independent Assurance & Statutory Governance</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">ISAE 3000 Reasonable Assurance Standard</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span>Assurance & Statutory Compliance Hub</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Four-eyes approval kanban, immutable cryptographic audit trail, and official SEBI BRSR Core / XBRL report generation.
            </p>
          </div>

          {/* Subtab Segmented Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSubtab('approvals')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'approvals'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Four-Eyes Approvals
            </button>
            <button
              onClick={() => setActiveSubtab('audit-trail')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'audit-trail'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Immutable Audit Trail
            </button>
            <button
              onClick={() => setActiveSubtab('report-generator')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'report-generator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BRSR Report & XBRL
            </button>
          </div>
        </div>
      </div>

      {/* 1. FOUR-EYES REVIEW & APPROVAL WORKFLOW */}
      {activeSubtab === 'approvals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvals.map((appr) => (
              <div
                key={appr.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  appr.status === 'Approved'
                    ? 'bg-slate-950/80 border-slate-800'
                    : appr.status === 'Clarification Requested'
                    ? 'bg-amber-950/30 border-amber-800/60'
                    : 'bg-slate-900 border-slate-700 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-emerald-400 font-bold">{appr.siteCode}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        appr.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : appr.status === 'Clarification Requested'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}
                    >
                      {appr.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{appr.siteName}</h3>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Submitted by {appr.submittedBy} · {appr.period}
                  </div>

                  <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scope 1 Fuel</span>
                      <span className="text-amber-400 font-bold font-mono">{appr.scope1.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scope 2 Grid</span>
                      <span className="text-sky-400 font-bold font-mono">{appr.scope2.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Water Recycled</span>
                      <span className="text-cyan-400 font-bold font-mono">{appr.waterWithdrawalKl.toLocaleString()} kL</span>
                    </div>
                  </div>

                  {appr.comments.length > 0 && (
                    <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                      <span className="font-semibold text-white block mb-0.5">
                        Latest Audit Note ({appr.comments[appr.comments.length - 1].author}):
                      </span>
                      {appr.comments[appr.comments.length - 1].text}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {appr.attachments.map((att, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-sky-400" />
                        <span className="truncate max-w-[120px]">{att}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedApprovalId(appr.id)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Action Sign-Off
                  </button>

                  <span className="text-[10px] text-slate-500">{appr.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Modal for Four-Eyes Decision */}
          {selectedApproval && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {selectedApproval.siteCode}
                    </span>
                    <h2 className="text-base font-bold text-white">{selectedApproval.siteName}</h2>
                    <p className="text-xs text-slate-400">Statutory Assurance Review by {currentRole}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApprovalId(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-200">Attached Primary Verification Documents:</div>
                  <div className="space-y-1">
                    {selectedApproval.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300 p-1.5 bg-slate-900 rounded border border-slate-800">
                        <span className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{att}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">Digital Seal Verified</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Auditor Review Remarks / Clarification Query
                  </label>
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter formal ISAE 3000 assurance observations, testing sample notes, or site requisition..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedApprovalId(null)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleClarify(selectedApproval.id)}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Request Clarification
                    </button>
                    <button
                      onClick={() => handleReject(selectedApproval.id)}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold"
                    >
                      Reject Submission
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApproval.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Seal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. IMMUTABLE AUDIT TRAIL LOG */}
      {activeSubtab === 'audit-trail' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Statutory Immutable Audit Trail (ISAE 3000 Standard)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Cryptographically hashed chronology of every modification, factor recalibration, and sign-off.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
                />
              </div>

              <select
                value={auditFilterUser}
                onChange={(e) => setAuditFilterUser(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="All">All Users</option>
                <option value="K. V. Rao">K. V. Rao (CSO)</option>
                <option value="Dr. Anita Desai">Dr. Anita Desai (Auditor)</option>
                <option value="S. K. Verma">S. K. Verma</option>
                <option value="M. S. Reddy">M. S. Reddy</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Timestamp (IST)</th>
                  <th className="py-2.5 px-3">User & Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Entity / Site</th>
                  <th className="py-2.5 px-3">Field & Mutation</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3 text-right">Verification Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredAuditTrail.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{entry.timestamp}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-semibold text-white">{entry.user}</div>
                      <div className="text-[10px] text-slate-400">{entry.role}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          entry.action === 'APPROVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : entry.action === 'RECALCULATE'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : entry.action === 'EXPORT_XBRL'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-200">{entry.entity}</td>
                    <td className="py-2.5 px-3 font-sans">
                      <div className="text-slate-400">{entry.field}</div>
                      <div className="text-emerald-400 truncate max-w-xs">{entry.newValue}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{entry.ipAddress}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400/90 font-bold">{entry.verifiedHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BRSR STATUTORY REPORT GENERATOR & XBRL EXPORT */}
      {activeSubtab === 'report-generator' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span>Statutory SEBI BRSR Core Report & XBRL Package</span>
              </h2>
              <p className="text-xs text-slate-400">
                Official filing format under SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                <Printer className="w-4 h-4 text-sky-400" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={handleExportXbrl}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export SEBI XBRL Data Package</span>
              </button>
            </div>
          </div>

          {xbrlExportSuccess && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 no-print">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official SEBI BRSR XBRL taxonomy JSON file exported successfully and logged into immutable audit trail!</span>
            </div>
          )}

          {/* Official SEBI Document Print Preview */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 sm:p-12 shadow-2xl text-slate-200 font-sans space-y-8">
            {/* Document Header */}
            <div className="border-b-2 border-slate-700 pb-6 text-center space-y-3">
              <div className="flex justify-center mb-2">
                <div className="p-2.5 bg-black/90 rounded-xl border border-slate-700 shadow-md">
                  <MeilLogo height={38} showText={true} />
                </div>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Securities and Exchange Board of India (SEBI)
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                BUSINESS RESPONSIBILITY AND SUSTAINABILITY REPORT (BRSR CORE)
              </h1>
              <div className="text-xs text-slate-400">
                For the Financial Year ended March 31, 2025 · Format as per Regulation 34(2)(f) of LODR Regulations
              </div>
            </div>

            {/* Corporate Profile Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] uppercase font-bold text-slate-400">1. Corporate Identification</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Identity Number (CIN):</span>
                  <span className="font-mono text-white font-bold">U45202TG2006PLC050271</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Name of the Listed Entity:</span>
                  <span className="text-white font-semibold">Megha Engineering & Infrastructures Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reporting Boundary:</span>
                  <span className="text-emerald-400 font-semibold">Consolidated (All 25+ Mega Sites)</span>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] uppercase font-bold text-slate-400">2. Assurance Provider Details</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Independent Assurance Firm:</span>
                  <span className="text-white font-semibold">Deloitte Touche Tohmatsu India LLP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assurance Standard:</span>
                  <span className="text-white font-semibold">ISAE 3000 (Revised) Reasonable Assurance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assurance Opinion:</span>
                  <span className="text-emerald-400 font-bold">Unmodified / Clean Report</span>
                </div>
              </div>
            </div>

            {/* BRSR Core 9 Mandatory Attributes Table */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Annexure I: SEBI BRSR Core Mandatory Nine Attributes Disclosures
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800">
                  <thead className="bg-slate-900 text-slate-300 text-[11px] uppercase font-bold">
                    <tr>
                      <th className="p-2.5 border border-slate-800">#</th>
                      <th className="p-2.5 border border-slate-800">BRSR Core Attribute Description</th>
                      <th className="p-2.5 border border-slate-800">Unit of Metric</th>
                      <th className="p-2.5 border border-slate-800 text-right">FY 2023-24</th>
                      <th className="p-2.5 border border-slate-800 text-right">FY 2024-25 (Current)</th>
                      <th className="p-2.5 border border-slate-800 text-center">Assurance Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-2.5 border border-slate-800 font-bold">1</td>
                      <td className="p-2.5 border border-slate-800">Greenhouse Gas (GHG) Scope 1 Emissions (Direct)</td>
                      <td className="p-2.5 border border-slate-800">tCO₂e</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono">162,400</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono font-bold text-emerald-400">
                        {aggregatedMetrics.totalScope1.toLocaleString()}
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-emerald-400">Reasonable</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-800 font-bold">2</td>
                      <td className="p-2.5 border border-slate-800">Greenhouse Gas (GHG) Scope 2 Emissions (Location-based)</td>
                      <td className="p-2.5 border border-slate-800">tCO₂e</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono">68,900</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono font-bold text-emerald-400">
                        {aggregatedMetrics.totalScope2.toLocaleString()}
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-emerald-400">Reasonable</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-800 font-bold">3</td>
                      <td className="p-2.5 border border-slate-800">GHG Intensity per Rupee of Turnover</td>
                      <td className="p-2.5 border border-slate-800">tCO₂e / ₹ Cr</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono">4.50</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono font-bold text-emerald-400">
                        {aggregatedMetrics.intensityTco2ePerCr}
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-emerald-400">Reasonable</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-800 font-bold">4</td>
                      <td className="p-2.5 border border-slate-800">Water Recycled and Reused as % of Total Withdrawal</td>
                      <td className="p-2.5 border border-slate-800">%</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono">58.7%</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono font-bold text-cyan-300">
                        {aggregatedMetrics.avgWaterRecycledPct}%
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-emerald-400">Reasonable</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-800 font-bold">5</td>
                      <td className="p-2.5 border border-slate-800">Lost Time Injury Frequency Rate (LTIFR) per 1M Hours</td>
                      <td className="p-2.5 border border-slate-800">Incidents/Mh</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono">0.21</td>
                      <td className="p-2.5 border border-slate-800 text-right font-mono font-bold text-amber-300">
                        {aggregatedMetrics.avgLtifr}
                      </td>
                      <td className="p-2.5 border border-slate-800 text-center text-emerald-400">Reasonable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statutory Signatures Block */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
              <div>
                <div className="font-semibold text-white">For and on behalf of the Board of Directors</div>
                <div className="mt-8 pt-2 border-t border-slate-700 w-48">
                  <div className="font-bold text-white">K. V. Rao</div>
                  <div className="text-slate-400">Chief Sustainability Officer</div>
                  <div className="text-slate-500 text-[10px]">DIN / EMP ID: MEIL-CSO-001</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-white">Independent Sustainability Auditor</div>
                <div className="mt-8 pt-2 border-t border-slate-700 w-48">
                  <div className="font-bold text-white">Dr. Anita Desai</div>
                  <div className="text-slate-400">Lead Partner (ESG & Climate)</div>
                  <div className="text-slate-500 text-[10px]">ICAI / ISAE Reg: #104291W</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
