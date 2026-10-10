import React, { useState, useMemo } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
  ShieldCheck,
  Building2,
  Users,
  Flame,
  Droplets,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Scale,
  Check,
  AlertCircle,
  Eye,
  Lock,
  X,
  FileCheck2,
  FileCheck,
  FileClock,
  Clock,
  Search,
  CheckSquare,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  Send,
  MessageSquare,
  FileWarning,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { BRSRIndicator } from '../../../types/esg';

// Reconciliation Issue Interface for Issue Management
export interface ReconciliationIssue {
  id: string;
  title: string;
  indicatorKey: string;
  sourceAValue: number;
  sourceCLabel: string;
  sourceCValue: number;
  difference: number;
  status: 'Open' | 'Under Investigation' | 'Awaiting Evidence' | 'Pending Approval' | 'Resolved' | 'Rejected';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedDepartment: string;
  responsibleUser: string;
  dueDate: string;
  populationBreakdown?: {
    permanentEmployees: number;
    contractualLabor: number;
    familyDependents: number;
  };
  comments: {
    author: string;
    role: string;
    timestamp: string;
    text: string;
  }[];
  evidenceFile?: string;
}

export const BrsrPortalView: React.FC = () => {
  const {
    brsrFormData,
    updateBrsrField,
    resolveContradiction,
    convertElectricityKwhToGj,
    saveScope1Justification,
    openEvidenceDrawerForKpi,
    evidenceAttachments,
    brsrCoreFilterOnly,
    setBrsrCoreFilterOnly,
    currentRole,
    activeSubtab,
    setActiveSubtab,
    addAuditLog,
    brsrIndicators,
    setBrsrIndicators,
  } = useEsg();

  // Subtabs within BRSR Portal: section-a | section-b | section-c
  const activeSection = ['section-a', 'section-b', 'section-c'].includes(activeSubtab)
    ? activeSubtab
    : 'section-c';

  // Principle selector for Section C (P1 through P9)
  const [selectedPrinciple, setSelectedPrinciple] = useState<number>(3); // Default Principle 3 (Wellbeing) or 6 (Environment)
  const [kwhInputModal, setKwhInputModal] = useState<boolean>(false);
  const [tempKwh, setTempKwh] = useState<number>(1144450);
  const [justificationText, setJustificationText] = useState<string>(
    brsrFormData.sectionC_p6_scope1Justification ||
      'Phase 2 tunnel excavation required 3 additional emergency diesel gensets during grid substation maintenance.'
  );

  // Role permissions checking
  const isPlant1Head = currentRole === 'Plant 1 Head (Operations)';
  const isHrLead = currentRole === 'HR Lead';
  const isAuditor = currentRole === 'Statutory Auditor' || currentRole === 'Independent Auditor (ISAE 3000)';

  // Smart Contradiction Population Breakdown State
  const [populationBreakdown, setPopulationBreakdown] = useState({
    permanentEmployees: 1200,
    contractualLabor: 150,
    familyDependents: 100,
  });

  // Cross-Reconciliation Check: Section C P3 Health Insurance > Section A Employees
  const isContradiction =
    brsrFormData.sectionC_p3_healthInsurance > brsrFormData.sectionA_employees;

  // YoY Anomaly: Scope 1 MT vs FY25 (850 MT)
  const fy25Baseline = 850;
  const scope1VariancePct = Math.round(
    ((brsrFormData.sectionC_p6_scope1Mt - fy25Baseline) / fy25Baseline) * 100
  );
  const isScope1YoyAnomaly = scope1VariancePct > 30;

  // Unit Warning: If raw kWh entered
  const isUnitWarning = (brsrFormData.sectionC_p6_electricityKwhRaw || 0) > 0;

  // Reconciliation Confirmation Modal State
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [reconciliationAction, setReconciliationAction] = useState<'sync-insurance' | 'update-employees' | 'investigate'>('sync-insurance');
  const [proposedValue, setProposedValue] = useState<number>(0);
  const [reconciliationReason, setReconciliationReason] = useState<string>('');
  const [reconciliationEvidenceRef, setReconciliationEvidenceRef] = useState<string>('ESIC_Group_Medical_Roster_2024.pdf');

  // Issue Management Drawer / Tracking State
  const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
  const [issuesList, setIssuesList] = useState<ReconciliationIssue[]>([
    {
      id: 'ISSUE-BRSR-001',
      title: 'P3 Health Insurance Coverage Exceeds Section A Workforce',
      indicatorKey: 'sectionC_p3_healthInsurance',
      sourceAValue: 1200,
      sourceCLabel: 'Section C P3 Insurance (1,450)',
      sourceCValue: 1450,
      difference: 250,
      status: 'Under Investigation',
      severity: 'High',
      assignedDepartment: 'HR & Personnel Wellbeing',
      responsibleUser: 'Er. R. K. Varma (HR Lead)',
      dueDate: '2026-10-15',
      populationBreakdown: {
        permanentEmployees: 1200,
        contractualLabor: 150,
        familyDependents: 100,
      },
      comments: [
        {
          author: 'Statutory Auditor (ISAE 3000)',
          role: 'External Auditor',
          timestamp: '2026-10-09 11:30 AM',
          text: 'Section C P3 insurance coverage (1,450) cannot exceed Section A permanent employees (1,200) without documented roster reconciliation of contract staff.',
        },
        {
          author: 'HR Lead',
          role: 'HR Lead',
          timestamp: '2026-10-09 02:15 PM',
          text: 'Verified policy: 1,200 permanent engineers + 150 project contractual laborers + 100 family members covered under MEIL Group Medical Benefit.',
        },
      ],
      evidenceFile: 'MEIL_Group_Mediclaim_Roster_Q2.xlsx',
    },
    {
      id: 'ISSUE-BRSR-002',
      title: 'Scope 1 Heavy Machinery Diesel Surge YoY (>30%)',
      indicatorKey: 'sectionC_p6_scope1Mt',
      sourceAValue: 850,
      sourceCLabel: 'Section C P6 Scope 1 (1,240 MT)',
      sourceCValue: 1240,
      difference: 390,
      status: 'Awaiting Evidence',
      severity: 'Medium',
      assignedDepartment: 'Plant Operations & Tunneling',
      responsibleUser: 'Er. Rajesh Kumar (Plant Lead)',
      dueDate: '2026-10-18',
      comments: [
        {
          author: 'Group ESG Admin',
          role: 'Admin',
          timestamp: '2026-10-10 09:00 AM',
          text: 'Please upload substation maintenance logbook justifying 3 standby DG gensets run.',
        },
      ],
      evidenceFile: 'Zojila_Tunnel_DG_Logbook_Oct.pdf',
    },
  ]);

  const [activeIssue, setActiveIssue] = useState<ReconciliationIssue>(issuesList[0]);
  const [newIssueComment, setNewIssueComment] = useState('');

  // Helper to check evidence attached count for KPI
  const getEvidenceCount = (key: string) => {
    return evidenceAttachments.filter((a) => a.kpiKey === key).length;
  };

  // Open Reconciliation Modal
  const handleOpenReconciliationModal = (action: 'sync-insurance' | 'update-employees' | 'investigate') => {
    setReconciliationAction(action);
    if (action === 'sync-insurance') {
      setProposedValue(brsrFormData.sectionA_employees);
      setReconciliationReason('Reconcile Principle 3 insurance coverage to match Section A verified permanent workforce rosters.');
    } else if (action === 'update-employees') {
      setProposedValue(brsrFormData.sectionC_p3_healthInsurance);
      setReconciliationReason('Update Section A total permanent employees following audited payroll additions across newly commissioned EPC packages.');
    } else {
      setProposedValue(brsrFormData.sectionC_p3_healthInsurance);
      setReconciliationReason('Assign contradiction to HR and Independent Auditor for contract labor & dependent eligibility review.');
    }
    setIsReconciliationModalOpen(true);
  };

  // Execute Reconciled Change with Maker-Checker / Audit Trail
  const handleExecuteReconciliation = () => {
    if (!reconciliationReason.trim()) {
      alert('Please provide an authorized justification reason for this statutory change.');
      return;
    }

    if (reconciliationAction === 'sync-insurance') {
      const oldVal = brsrFormData.sectionC_p3_healthInsurance;
      updateBrsrField('sectionC_p3_healthInsurance', proposedValue, reconciliationReason);
      addAuditLog({
        user: 'K. V. Rao',
        role: currentRole,
        action: 'UPDATE',
        entity: 'Section C Principle 3 (Health Insurance)',
        field: 'sectionC_p3_healthInsurance',
        oldValue: `${oldVal} persons`,
        newValue: `${proposedValue} persons (Synced to Section A)`,
      });
      // Update issue status
      setIssuesList((prev) =>
        prev.map((iss) =>
          iss.id === 'ISSUE-BRSR-001'
            ? { ...iss, status: 'Resolved', comments: [...iss.comments, { author: currentRole, role: currentRole, timestamp: new Date().toLocaleString(), text: `Reconciled: Synced to ${proposedValue} (${reconciliationReason})` }] }
            : iss
        )
      );
    } else if (reconciliationAction === 'update-employees') {
      const oldVal = brsrFormData.sectionA_employees;
      updateBrsrField('sectionA_employees', proposedValue, reconciliationReason);
      addAuditLog({
        user: 'K. V. Rao',
        role: currentRole,
        action: 'UPDATE',
        entity: 'Section A (General Workforce)',
        field: 'sectionA_employees',
        oldValue: `${oldVal} employees`,
        newValue: `${proposedValue} employees (Aligned with Section C)`,
      });
      setIssuesList((prev) =>
        prev.map((iss) =>
          iss.id === 'ISSUE-BRSR-001'
            ? { ...iss, status: 'Resolved', comments: [...iss.comments, { author: currentRole, role: currentRole, timestamp: new Date().toLocaleString(), text: `Reconciled: Updated employees to ${proposedValue} (${reconciliationReason})` }] }
            : iss
        )
      );
    } else {
      // Assign for investigation
      setIssuesList((prev) =>
        prev.map((iss) =>
          iss.id === 'ISSUE-BRSR-001'
            ? {
                ...iss,
                status: 'Under Investigation',
                comments: [
                  ...iss.comments,
                  {
                    author: currentRole,
                    role: currentRole,
                    timestamp: new Date().toLocaleString(),
                    text: `Formal Investigation Notice logged: ${reconciliationReason} [Ref: ${reconciliationEvidenceRef}]`,
                  },
                ],
              }
            : iss
        )
      );
    }

    setIsReconciliationModalOpen(false);
  };

  // Add Comment to Active Issue
  const handleAddComment = () => {
    if (!newIssueComment.trim()) return;
    const newEntry = {
      author: currentRole,
      role: currentRole,
      timestamp: new Date().toLocaleString(),
      text: newIssueComment,
    };

    setIssuesList((prev) =>
      prev.map((iss) =>
        iss.id === activeIssue.id
          ? { ...iss, comments: [...iss.comments, newEntry] }
          : iss
      )
    );

    setActiveIssue((prev) => ({
      ...prev,
      comments: [...prev.comments, newEntry],
    }));

    setNewIssueComment('');
  };

  // P1 through P9 Compliance Overview Metrics
  const complianceOverview = useMemo(() => {
    const totalPrinciples = 9;
    const totalDisclosures = brsrIndicators.length;
    const verifiedDisclosures = brsrIndicators.filter((i) => i.verified).length;
    const openContradictionsCount = isContradiction ? 1 : 0;
    const pendingApprovalsCount = issuesList.filter((i) => i.status === 'Pending Approval' || i.status === 'Under Investigation').length;
    const missingEvidenceCount = issuesList.filter((i) => i.status === 'Awaiting Evidence').length;
    const completionPct = Math.round((verifiedDisclosures / totalDisclosures) * 100);

    return {
      totalPrinciples,
      totalDisclosures,
      verifiedDisclosures,
      openContradictionsCount,
      pendingApprovalsCount,
      missingEvidenceCount,
      completionPct,
    };
  }, [brsrIndicators, isContradiction, issuesList]);

  // Principle Descriptions
  const PRINCIPLE_TITLES: { [key: number]: { title: string; subtitle: string; icon: any } } = {
    1: { title: 'Principle 1: Ethics, Transparency & Accountability', subtitle: 'Anti-corruption training, whistleblower mechanism, and statutory disclosures', icon: ShieldCheck },
    2: { title: 'Principle 2: Sustainable & Safe Goods & Services', subtitle: 'R&D green capex, embodied life-cycle management, and clean tech', icon: Sparkles },
    3: { title: 'Principle 3: Employee Wellbeing & Safety', subtitle: 'Health insurance coverage, LTIFR benchmark, safe man-hours, and zero fatalities', icon: Users },
    4: { title: 'Principle 4: Stakeholder Engagement & CSR', subtitle: 'Local community consultation, vulnerable groups, and corporate social responsibility', icon: Building2 },
    5: { title: 'Principle 5: Human Rights & Fair Remuneration', subtitle: 'Equal remuneration, minimum wages, POSH compliance, and accessibility', icon: Scale },
    6: { title: 'Principle 6: Environmental Stewardship', subtitle: 'GHG Scope 1 & 2 emissions, energy in GJ, water circularity, and waste management', icon: Flame },
    7: { title: 'Principle 7: Public Policy & Association Memberships', subtitle: 'Transparent policy advocacy, chamber trade bodies, and public representations', icon: FileText },
    8: { title: 'Principle 8: Inclusive Growth & SCM Procurement', subtitle: 'Local sourcing within 50km radius, MSME vendor onboarding, and social impact', icon: CheckSquare },
    9: { title: 'Principle 9: Consumer Value & Client Trust', subtitle: 'Critical infrastructure reliability, client grievances, and cyber data privacy', icon: Lock },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Section Tabs & BRSR Core Filter Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Section Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubtab('section-a')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'section-a'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Section A: General</span>
          </button>

          <button
            onClick={() => setActiveSubtab('section-b')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'section-b'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Section B: Governance</span>
          </button>

          <button
            onClick={() => setActiveSubtab('section-c')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSection === 'section-c'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Section C: Principles (P1-P9)</span>
          </button>
        </div>

        {/* Right: Issue Management Drawer Trigger & BRSR Core Filter */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Issue Tracker Trigger Pill */}
          <button
            onClick={() => setIsIssueDrawerOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Issue Ledger</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 font-bold text-[10px] border border-amber-800">
              {issuesList.filter((i) => i.status !== 'Resolved').length}
            </span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">BRSR Core Filter:</span>
            <button
              onClick={() => setBrsrCoreFilterOnly(!brsrCoreFilterOnly)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                brsrCoreFilterOnly
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{brsrCoreFilterOnly ? 'Core Only' : 'All Indicators'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Clearance Notice Banner */}
      {isPlant1Head && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Role Scoped: Plant 1 Head (Operations)</strong> — Authorized to input &amp; edit Principle 6 (Energy, GHG Emissions &amp; Water). Section A and other principles are read-only.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700">P6 Operational Clearance</span>
        </div>
      )}

      {isHrLead && (
        <div className="p-3 bg-indigo-950/40 border border-indigo-800/80 rounded-xl text-xs text-indigo-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Role Scoped: HR Lead (Personnel &amp; Wellbeing)</strong> — Authorized to input &amp; edit Section A (Workforce) and Section C Principle 3 (Employee Wellbeing).
            </span>
          </div>
          <span className="font-mono text-[10px] bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700">HR Clearance</span>
        </div>
      )}

      {isAuditor && (
        <div className="p-3 bg-sky-950/40 border border-sky-800/80 rounded-xl text-xs text-sky-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Statutory Assurance Mode (ISAE 3000 Auditor)</strong> — Read-Only operational data. Click 📎 Paperclip to verify evidence and stamp digital assurance.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700">Auditor Read-Only</span>
        </div>
      )}

      {/* CROSS-SECTION CONTRADICTION BANNER (The Monday Morning Problem) */}
      {isContradiction && (
        <div className="p-4 bg-rose-950/90 border-2 border-rose-600 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-white animate-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-600 rounded-lg text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="font-bold text-sm text-rose-200 flex items-center gap-2">
                <span>Contradiction Detected: The Monday Morning Problem!</span>
                <span className="px-2 py-0.2 rounded bg-rose-900 text-[10px] font-mono border border-rose-500">
                  SEBI Reconciliation Error #409
                </span>
              </div>
              <p className="text-rose-100 mt-1 leading-relaxed">
                Section C (Principle 3) health insurance coverage (<strong className="font-mono font-bold text-white">{brsrFormData.sectionC_p3_healthInsurance}</strong>) cannot exceed Section A total permanent employees (<strong className="font-mono font-bold text-white">{brsrFormData.sectionA_employees}</strong>) without population justification (contractors/dependents).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => handleOpenReconciliationModal('sync-insurance')}
              className="px-3 py-2 bg-white text-rose-950 hover:bg-rose-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Sync Insurance to {brsrFormData.sectionA_employees}</span>
            </button>

            <button
              onClick={() => handleOpenReconciliationModal('update-employees')}
              className="px-3 py-2 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-500"
            >
              <span>Update Employees to {brsrFormData.sectionC_p3_healthInsurance}</span>
            </button>

            <button
              onClick={() => handleOpenReconciliationModal('investigate')}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 border border-slate-700"
            >
              <span>Investigate / Justify &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* SECTION A: GENERAL DISCLOSURES */}
      {/* ============================================================================== */}
      {activeSection === 'section-a' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>SEBI BRSR Section A: General Disclosures</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Entity details, listed infrastructure assets, workforce demographics, and statutory plants.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Assurance Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Entity Registration Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                I. Listed Entity Details
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Corporate Identity Number (CIN)</span>
                  <span className="font-mono text-white font-bold">U45202TG2006PLC050271</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Company Name</span>
                  <span className="font-bold text-white">Megha Engineering &amp; Infrastructures Ltd</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-500">Registered Office</span>
                  <span className="text-right">S-2, Technocrat Ind. Estate, Balanagar, Hyderabad</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consolidated Turnover</span>
                  <span className="font-mono text-emerald-400 font-bold">₹ 42,500 Crore (FY 2024-25)</span>
                </div>
              </div>
            </div>

            {/* Workforce & Operations Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>II. Workforce &amp; Plant Ingestion Fields</span>
                <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  Cross-Reconciled
                </span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Total Permanent Employees (Workforce Baseline)
                  </label>
                  <input
                    type="number"
                    value={brsrFormData.sectionA_employees}
                    onChange={(e) =>
                      updateBrsrField('sectionA_employees', parseInt(e.target.value) || 0)
                    }
                    disabled={isPlant1Head || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Audited headcount across domestic and international infrastructure assets.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Number of Operating Plants / Mega Asset Sites
                  </label>
                  <input
                    type="number"
                    value={brsrFormData.sectionA_operatingPlants}
                    onChange={(e) =>
                      updateBrsrField('sectionA_operatingPlants', parseInt(e.target.value) || 0)
                    }
                    disabled={isPlant1Head || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white text-sm font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* SECTION B: MANAGEMENT & GOVERNANCE DISCLOSURES */}
      {/* ============================================================================== */}
      {activeSection === 'section-b' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">
              SEBI BRSR Section B: Management &amp; Process Disclosures
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory verification of policies, governance sign-offs, and board oversight across BRSR Principles 1 through 9.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Statutory Policy Name</th>
                  <th className="py-3 px-3">BRSR Principle</th>
                  <th className="py-3 px-3 text-center">Entity Policy Enacted</th>
                  <th className="py-3 px-3 text-center">Board Approved</th>
                  <th className="py-3 px-3 text-right">Weblink / Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { p: 'P1', name: 'Anti-Bribery, Anti-Corruption & Whistleblower Policy' },
                  { p: 'P2', name: 'Sustainable Engineering & Clean Technology Capex Charter' },
                  { p: 'P3', name: 'Zero Harm Occupational Health & Safety Standard' },
                  { p: 'P4', name: 'Community Stakeholder & Public Consultation Policy' },
                  { p: 'P5', name: 'Human Rights, Equal Opportunity & Anti-Harassment (POSH)' },
                  { p: 'P6', name: 'Net Zero Environment, Energy & Water Circularity Policy' },
                ].map((pol, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{pol.name}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{pol.p}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400">
                        <Check className="w-3.5 h-3.5 mr-1" /> 100% Implemented
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-sky-400">
                        <Check className="w-3.5 h-3.5 mr-1" /> Active Ombudsman
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      https://meil.in/policies/{pol.p.toLowerCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* SECTION C: PRINCIPLE-WISE PERFORMANCE (P1 to P9) */}
      {/* ============================================================================== */}
      {activeSection === 'section-c' && (
        <div className="space-y-6">
          {/* P1-P9 COMPLIANCE OVERVIEW DASHBOARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>SEBI BRSR Core Principles (P1–P9) Compliance Dashboard</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live statutory assurance readiness tracking across all 9 NGRBC principles derived from actual audit records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Statutory Health:</span>
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-mono font-bold text-xs border border-emerald-800">
                  {complianceOverview.completionPct}% Complete
                </span>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Principles</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">9 / 9 Active</span>
                <span className="text-[10px] text-emerald-400">P1 to P9 Mandated</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Disclosures Verified</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                  {complianceOverview.verifiedDisclosures} / {complianceOverview.totalDisclosures}
                </span>
                <span className="text-[10px] text-slate-500">ISAE 3000 Verified</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Open Contradictions</span>
                <span className={`text-base font-bold font-mono mt-0.5 block ${complianceOverview.openContradictionsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {complianceOverview.openContradictionsCount} Active
                </span>
                <span className="text-[10px] text-slate-500">
                  {complianceOverview.openContradictionsCount > 0 ? 'Action Required' : 'Zero Errors'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Pending Approvals</span>
                <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">
                  {complianceOverview.pendingApprovalsCount}
                </span>
                <span className="text-[10px] text-slate-500">Maker-Checker Queue</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Missing Data / Evidence</span>
                <span className="text-base font-bold text-sky-400 font-mono mt-0.5 block">
                  {complianceOverview.missingEvidenceCount}
                </span>
                <span className="text-[10px] text-slate-500">Awaiting Submissions</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Reporting Cycle</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">FY 2024–25</span>
                <span className="text-[10px] text-emerald-400">SEBI Core LODR 34</span>
              </div>
            </div>
          </div>

          {/* Principle Navigation Pill Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-2 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pNum) => {
              const isSelected = selectedPrinciple === pNum;
              const hasAlert = pNum === 3 && isContradiction;
              const hasYoy = pNum === 6 && isScope1YoyAnomaly;

              const labelMap: { [key: number]: string } = {
                1: 'Ethics',
                2: 'Product',
                3: 'Wellbeing',
                4: 'Stakeholder',
                5: 'Human Rights',
                6: 'Environment',
                7: 'Public Policy',
                8: 'Inclusive SCM',
                9: 'Customer Value',
              };

              return (
                <button
                  key={pNum}
                  onClick={() => setSelectedPrinciple(pNum)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>P{pNum}</span>
                  <span className="text-[11px] font-normal opacity-90">({labelMap[pNum]})</span>
                  {hasAlert && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                  {hasYoy && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Principle Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>SEBI BRSR Section C</span>
                <span>·</span>
                <span className="text-emerald-400 font-semibold">Principle {selectedPrinciple} Performance</span>
              </div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{PRINCIPLE_TITLES[selectedPrinciple]?.title}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {PRINCIPLE_TITLES[selectedPrinciple]?.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SEBI Mandatory Assurance
              </span>
            </div>
          </div>

          {/* ============================================================================== */}
          {/* PRINCIPLE 3: EMPLOYEE WELLBEING */}
          {/* ============================================================================== */}
          {selectedPrinciple === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Field 1: Health Insurance Coverage (The Monday Morning Problem) */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isContradiction
                    ? 'bg-rose-950/30 border-rose-600'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Employees with Health Insurance</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p3_healthInsurance',
                          label: 'P3 Employees Covered by Health Insurance',
                          unit: 'Persons',
                          currentValue: brsrFormData.sectionC_p3_healthInsurance,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      title="Attach Medical Insurance Roster"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p3_healthInsurance')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p3_healthInsurance}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p3_healthInsurance', parseInt(e.target.value) || 0)
                    }
                    disabled={isPlant1Head || isAuditor}
                    className={`w-full bg-slate-900 border rounded-lg px-3 py-2 font-mono text-base font-bold focus:outline-none ${
                      isContradiction
                        ? 'border-rose-500 text-rose-300'
                        : 'border-slate-700 text-white focus:border-emerald-500'
                    } ${isPlant1Head || isAuditor ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />

                  {isContradiction && (
                    <div className="mt-2 text-[11px] text-rose-300 flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                      <div>
                        <span>Contradiction: {brsrFormData.sectionC_p3_healthInsurance} &gt; Section A Permanent Staff ({brsrFormData.sectionA_employees}).</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Population difference of {brsrFormData.sectionC_p3_healthInsurance - brsrFormData.sectionA_employees} requires contractor / dependent attribution.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>SEBI Reconciled</span>
                    <button
                      onClick={() => handleOpenReconciliationModal('sync-insurance')}
                      className="text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Reconciliation Action &rarr;
                    </button>
                  </div>
                </div>

                {/* Field 2: Fatalities */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Total Work-Related Fatalities</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p3_fatalities',
                          label: 'Total Work-Related Fatalities',
                          unit: 'Incidents',
                          currentValue: brsrFormData.sectionC_p3_fatalities,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p3_fatalities')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p3_fatalities}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p3_fatalities', parseInt(e.target.value) || 0)
                    }
                    disabled={isPlant1Head || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-emerald-400 mt-2 font-medium">
                    Vision Zero milestone maintained across 48 monitored project reaches.
                  </p>
                </div>

                {/* Field 3: LTIFR */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>LTIFR (Per Million Man-Hours)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p3_ltifr',
                          label: 'Lost Time Injury Frequency Rate (LTIFR)',
                          unit: 'Rate',
                          currentValue: brsrFormData.sectionC_p3_ltifr,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p3_ltifr')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    step="0.01"
                    value={brsrFormData.sectionC_p3_ltifr}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p3_ltifr', parseFloat(e.target.value) || 0)
                    }
                    disabled={isPlant1Head || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-2">
                    Industry benchmark: &lt; 0.50 (MEIL target met: 0.14)
                  </p>
                </div>
              </div>

              {/* Principle 3 Population Attribution Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Insurance Beneficiary Population Breakdown (Disclosee Eligibility)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Policy: MEIL-ESIC-GMI-2024</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">1. Permanent Staff</span>
                    <strong className="text-white font-mono text-sm block mt-0.5">{populationBreakdown.permanentEmployees}</strong>
                    <span className="text-[10px] text-emerald-400">100% Covered (Section A)</span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">2. Contract Laborers</span>
                    <strong className="text-amber-400 font-mono text-sm block mt-0.5">{populationBreakdown.contractualLabor}</strong>
                    <span className="text-[10px] text-slate-400">Special Risk Group</span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">3. Family Dependents</span>
                    <strong className="text-indigo-400 font-mono text-sm block mt-0.5">{populationBreakdown.familyDependents}</strong>
                    <span className="text-[10px] text-slate-400">Extended Corporate Plan</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================================== */}
          {/* PRINCIPLE 6: ENVIRONMENT, ENERGY & GHG EMISSIONS */}
          {/* ============================================================================== */}
          {selectedPrinciple === 6 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              {/* Unit Standardisation Warning Bar */}
              {isUnitWarning && (
                <div className="p-3 bg-amber-950/80 border border-amber-600 rounded-xl flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Raw Grid Electricity entered in <strong>kWh ({brsrFormData.sectionC_p6_electricityKwhRaw?.toLocaleString()} kWh)</strong>. SEBI BRSR Principle 6 mandates standardisation in <strong>Gigajoules (GJ)</strong>.
                    </span>
                  </div>
                  <button
                    onClick={convertElectricityKwhToGj}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Auto-Convert to GJ &rarr;</span>
                  </button>
                </div>
              )}

              {/* YoY Anomaly Banner for Scope 1 */}
              {isScope1YoyAnomaly && (
                <div className="p-3 bg-rose-950/80 border border-rose-600 rounded-xl text-xs text-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>YoY Anomaly Detected: Scope 1 Emissions surged by +{scope1VariancePct}% vs FY25 Baseline ({fy25Baseline} MT)!</span>
                    </div>
                    <span className="px-2 py-0.2 rounded bg-rose-900 text-[10px] font-mono border border-rose-500">
                      SEBI Audit Gate #6.1
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Mandatory SEBI Requirement: Provide an operational root-cause justification for emissions variance exceeding ±15%.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={justificationText}
                      onChange={(e) => setJustificationText(e.target.value)}
                      placeholder="Enter justification for external auditor sign-off..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => {
                        saveScope1Justification(justificationText);
                        alert('Statutory Scope 1 justification saved to audit log.');
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Save Justification
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Electricity Consumption (GJ) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      <span>Electricity Consumption (GJ)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_electricityGj',
                          label: 'Total Electricity Purchased & Consumed',
                          unit: 'GJ',
                          currentValue: brsrFormData.sectionC_p6_electricityGj,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p6_electricityGj')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p6_electricityGj}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p6_electricityGj', parseInt(e.target.value) || 0)
                    }
                    disabled={isHrLead || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>1 kWh = 0.0036 GJ</span>
                    <button
                      onClick={() => setKwhInputModal(true)}
                      className="text-sky-400 hover:underline cursor-pointer"
                    >
                      Input in kWh &rarr;
                    </button>
                  </div>
                </div>

                {/* 2. Fuel / Diesel (KL) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fuel / Diesel Consumption (KL)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_fuelDieselKl',
                          label: 'High-Speed Diesel (HSD) Consumed',
                          unit: 'KL',
                          currentValue: brsrFormData.sectionC_p6_fuelDieselKl,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p6_fuelDieselKl')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p6_fuelDieselKl}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p6_fuelDieselKl', parseInt(e.target.value) || 0)
                    }
                    disabled={isHrLead || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    DEFRA 2024 emission factor applied: 2.687 kg CO₂e / Liter.
                  </p>
                </div>

                {/* 3. Scope 1 GHG (MT) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Scope 1 GHG Emissions (MT)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_scope1Mt',
                          label: 'Scope 1 Direct GHG Emissions',
                          unit: 'MT CO2e',
                          currentValue: brsrFormData.sectionC_p6_scope1Mt,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p6_scope1Mt')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p6_scope1Mt}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p6_scope1Mt', parseInt(e.target.value) || 0)
                    }
                    disabled={isHrLead || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Gross direct emissions from stationary DGs &amp; heavy fleet.
                  </p>
                </div>

                {/* 4. Scope 2 GHG (MT) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Scope 2 GHG Emissions (MT)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_scope2Mt',
                          label: 'Scope 2 Market-Based Electricity Emissions',
                          unit: 'MT CO2e',
                          currentValue: brsrFormData.sectionC_p6_scope2Mt,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p6_scope2Mt')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p6_scope2Mt}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p6_scope2Mt', parseInt(e.target.value) || 0)
                    }
                    disabled={isHrLead || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Central Electricity Authority (CEA v20) national baseline applied.
                  </p>
                </div>

                {/* 5. Water Withdrawal */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span>Water Withdrawal (KL)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_waterWithdrawalKl',
                          label: 'Total Water Withdrawal by Source',
                          unit: 'KL',
                          currentValue: brsrFormData.sectionC_p6_waterWithdrawalKl,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p6_waterWithdrawalKl')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p6_waterWithdrawalKl}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p6_waterWithdrawalKl', parseInt(e.target.value) || 0)
                    }
                    disabled={isHrLead || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Groundwater and surface abstraction telemetry verified.
                  </p>
                </div>

                {/* 6. Water Recycled */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Water Recycled &amp; Reused (KL)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_waterRecycledKl',
                          label: 'Water Recycled & Reused',
                          unit: 'KL',
                          currentValue: brsrFormData.sectionC_p6_waterRecycledKl,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionC_p6_waterRecycledKl')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionC_p6_waterRecycledKl}
                    onChange={(e) =>
                      updateBrsrField('sectionC_p6_waterRecycledKl', parseInt(e.target.value) || 0)
                    }
                    disabled={isHrLead || isAuditor}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-base font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-emerald-400">
                    Recycling efficiency: {Math.round((brsrFormData.sectionC_p6_waterRecycledKl / brsrFormData.sectionC_p6_waterWithdrawalKl) * 100)}% circular water utilization.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================================== */}
          {/* ALL OTHER PRINCIPLES INTERACTIVE DISCLOSURE TABLES (P1, P2, P4, P5, P7, P8, P9) */}
          {/* ============================================================================== */}
          {![3, 6].includes(selectedPrinciple) && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Principle {selectedPrinciple} Statutory Disclosures &amp; Evidence Ledger
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Essential indicators compiled under SEBI circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122.
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  ISAE 3000 Stamped
                </span>
              </div>

              {/* Principle-Specific Disclosures Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead className="bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Indicator Code</th>
                      <th className="py-2.5 px-3">Statutory Disclosure Parameter</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">FY 2023-24</th>
                      <th className="py-2.5 px-3 text-right">FY 2024-25 (Reported)</th>
                      <th className="py-2.5 px-3 text-center">Evidence Voucher</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {brsrIndicators
                      .filter((ind) => ind.principle === `P${selectedPrinciple}`)
                      .map((ind) => (
                        <tr key={ind.code} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                            {ind.code}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white max-w-sm">
                            {ind.title}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                              {ind.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                            {typeof ind.previousValue === 'number' ? ind.previousValue.toLocaleString() : ind.previousValue} {ind.unit}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                            {typeof ind.currentValue === 'number' ? ind.currentValue.toLocaleString() : ind.currentValue} {ind.unit}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() =>
                                openEvidenceDrawerForKpi({
                                  key: ind.code,
                                  label: ind.title,
                                  unit: ind.unit,
                                  currentValue: ind.currentValue,
                                  isCore: ind.sebiMandatory,
                                })
                              }
                              className="text-xs text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1 cursor-pointer mx-auto"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>{getEvidenceCount(ind.code) > 0 ? `${getEvidenceCount(ind.code)} Verified` : 'Attach'}</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center text-emerald-400 text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================================== */}
      {/* RECONCILIATION CONFIRMATION & WORKFLOW MODAL */}
      {/* ============================================================================== */}
      {isReconciliationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {reconciliationAction === 'sync-insurance'
                    ? 'Confirm Reconciliation: Sync Insurance Coverage'
                    : reconciliationAction === 'update-employees'
                    ? 'Confirm Statutory Change: Update Workforce Baseline'
                    : 'Assign Contradiction for Formal Investigation'}
                </h3>
              </div>
              <button
                onClick={() => setIsReconciliationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Affected Disclosures:</span>
                  <span className="font-semibold text-white">Section A Workforce ↔ Section C (P3 Insurance)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Reporting Period:</span>
                  <span className="font-mono text-emerald-400 font-bold">FY 2024–25 (Active Statutory Filing)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Current Section C P3:</span>
                    <strong className="text-rose-400 font-mono text-sm">{brsrFormData.sectionC_p3_healthInsurance} persons</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Current Section A Baseline:</span>
                    <strong className="text-white font-mono text-sm">{brsrFormData.sectionA_employees} employees</strong>
                  </div>
                </div>
              </div>

              {/* Proposed Value Adjustment */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Proposed Reconciled Value</label>
                <input
                  type="number"
                  value={proposedValue}
                  onChange={(e) => setProposedValue(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Required Evidence Document Reference */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Statutory Evidence Reference</label>
                <input
                  type="text"
                  value={reconciliationEvidenceRef}
                  onChange={(e) => setReconciliationEvidenceRef(e.target.value)}
                  placeholder="e.g. ESIC_Group_Medical_Roster_Q2.xlsx"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Required Reason for Change */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Authorized Reconciliation Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={reconciliationReason}
                  onChange={(e) => setReconciliationReason(e.target.value)}
                  rows={3}
                  placeholder="State the justification, population attribution (permanent vs contractor), or payroll audit report..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500">Maker-Checker validation logged</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReconciliationModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReconciliation}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-all"
                >
                  Confirm &amp; Record in Audit Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* ISSUE MANAGEMENT & CONTRADICTION LEDGER DRAWER */}
      {/* ============================================================================== */}
      {isIssueDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full flex flex-col p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">BRSR Cross-Disclosure Issue Ledger</h3>
              </div>
              <button
                onClick={() => setIsIssueDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Issues List & Active Issue Inspector */}
            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              {/* Issue Selector Tabs */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Discrepancies &amp; Contradictions ({issuesList.length}):
                </span>
                {issuesList.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => setActiveIssue(issue)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      activeIssue.id === issue.id
                        ? 'bg-slate-950 border-emerald-500 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{issue.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          issue.status === 'Resolved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : issue.status === 'Under Investigation'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <div className="text-slate-300 mt-1 font-medium">{issue.title}</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                      <span>Assigned: {issue.assignedDepartment}</span>
                      <span>Due: {issue.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Issue Deep Dive */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 mt-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                  <div>
                    <h4 className="font-bold text-white text-xs">{activeIssue.title}</h4>
                    <span className="text-[10px] text-slate-500">ID: {activeIssue.id} · Priority: {activeIssue.severity}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                    {activeIssue.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Responsible User:</span>
                    <strong className="text-white">{activeIssue.responsibleUser}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Due Date:</span>
                    <span className="text-amber-400 font-mono">{activeIssue.dueDate}</span>
                  </div>
                </div>

                {activeIssue.evidenceFile && (
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activeIssue.evidenceFile}</span>
                    </span>
                    <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">
                      Inspect Evidence &rarr;
                    </span>
                  </div>
                )}

                {/* Audit Comments Trail */}
                <div className="space-y-2 pt-2 border-t border-slate-850">
                  <span className="text-[11px] font-bold text-slate-400 block">Investigation &amp; Change History:</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {activeIssue.comments.map((c, cIdx) => (
                      <div key={cIdx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-850 text-[11px] space-y-1">
                        <div className="flex justify-between items-center text-slate-400">
                          <strong className="text-slate-200">{c.author} ({c.role})</strong>
                          <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newIssueComment}
                      onChange={(e) => setNewIssueComment(e.target.value)}
                      placeholder="Add reviewer comment or investigation finding..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">Immutable audit log locked under SEBI guidelines</span>
              <button
                onClick={() => setIsIssueDrawerOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RAW KWH INPUT HELPER MODAL */}
      {kwhInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Convert Grid Electricity (kWh &rarr; GJ)</span>
              </h3>
              <button
                onClick={() => setKwhInputModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Raw Meter Reading (kWh)</label>
                <input
                  type="number"
                  value={tempKwh}
                  onChange={(e) => setTempKwh(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Equivalent Gigajoules (GJ):</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {Math.round(tempKwh * 0.0036).toLocaleString()} GJ
                  </strong>
                </div>
                <div className="text-[10px] text-slate-500">
                  Formula: kWh × 0.0036 = GJ (Central Electricity Authority Standard)
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setKwhInputModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const gjVal = Math.round(tempKwh * 0.0036);
                  updateBrsrField('sectionC_p6_electricityGj', gjVal);
                  updateBrsrField('sectionC_p6_electricityKwhRaw', 0);
                  setKwhInputModal(false);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
              >
                Apply Standardised Value
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
