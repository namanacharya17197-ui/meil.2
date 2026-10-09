import React from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Users,
  Factory,
  TrendingUp,
  Clock,
  Sparkles,
  Paperclip,
  CheckSquare,
  FileSpreadsheet,
  Download,
  AlertCircle,
} from 'lucide-react';

export const BrsrExecutiveDashboardView: React.FC = () => {
  const {
    brsrFormData,
    evidenceAttachments,
    departmentWorkflows,
    setActiveModule,
    setActiveSubtab,
    currentRole,
    switchDemoRole,
  } = useEsg();

  // 1. Calculate Overall Completion %
  const totalIndicatorsCount = 96; // Standard SEBI BRSR Essential Indicators count
  const filledIndicatorsCount = 84; // 84 filled
  const completionPct = Math.round((filledIndicatorsCount / totalIndicatorsCount) * 100);

  // 2. Assurance Readiness Score (% of 9 BRSR Core mandatory KPIs with evidence attached)
  const coreKpiKeys = [
    'sectionC_p6_scope1Mt',
    'sectionC_p6_scope2Mt',
    'sectionC_p6_electricityGj',
    'sectionC_p6_waterWithdrawalKl',
    'sectionC_p3_healthInsurance',
    'sectionC_p3_fatalities',
    'sectionC_p3_ltifr',
    'sectionC_p6_fuelDieselKl',
    'sectionC_p6_wasteGeneratedMt',
  ];

  const coreWithEvidence = coreKpiKeys.filter((key) =>
    evidenceAttachments.some((att) => att.kpiKey === key)
  ).length;

  const assuranceReadinessScore = Math.round((coreWithEvidence / coreKpiKeys.length) * 100);

  // 3. Validation Exceptions count:
  // Contradiction: P3 Health insurance (1450) > Section A Employees (1200)
  const isContradictionActive = brsrFormData.sectionC_p3_healthInsurance > brsrFormData.sectionA_employees;
  // Unit Warning: Raw kWh present
  const isUnitWarningActive = (brsrFormData.sectionC_p6_electricityKwhRaw || 0) > 0;
  // YoY Anomaly: Scope 1 MT > 850 * 1.3 (= 1105) and no justification
  const isYoyAnomalyActive =
    brsrFormData.sectionC_p6_scope1Mt > 850 * 1.3 && !brsrFormData.sectionC_p6_scope1Justification;

  const activeExceptionsCount =
    (isContradictionActive ? 1 : 0) +
    (isUnitWarningActive ? 1 : 0) +
    (isYoyAnomalyActive ? 1 : 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Executive Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_70%)] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-[11px] font-mono text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SEBI BRSR Core Mandate · FY 2024-25 Statutory Cycle</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive ESG &amp; Assurance Readiness Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Consolidated ESG reporting portal for Megha Engineering &amp; Infrastructures Ltd (MEIL) with automated cross-section reconciliation, ISAE 3000 evidence lockers, and SEBI filing automation.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveModule('reporting');
                setActiveSubtab('section-c');
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Enter BRSR Data</span>
            </button>

            <button
              onClick={() => setActiveModule('validation')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Review Exceptions ({activeExceptionsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* KPI 1: Overall BRSR Completion */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Overall BRSR Completion
            </span>
            <span className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{completionPct}%</span>
            <span className="text-xs text-slate-400">({filledIndicatorsCount} / {totalIndicatorsCount} KPIs)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
            <span>Essential Indicators</span>
            <span className="text-emerald-400 font-medium">87.5% Complete</span>
          </div>
        </div>

        {/* KPI 2: Assurance Readiness Score */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assurance Readiness (ISAE 3000)
            </span>
            <span className="p-2 bg-sky-950 text-sky-400 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{assuranceReadinessScore}%</span>
            <span className="text-xs text-sky-400 font-semibold">Evidence Attached</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${assuranceReadinessScore}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
            <span>{coreWithEvidence} of {coreKpiKeys.length} Core KPIs Verified</span>
            <button
              onClick={() => setActiveModule('audit')}
              className="text-sky-400 hover:underline font-semibold cursor-pointer"
            >
              Open Locker &rarr;
            </button>
          </div>
        </div>

        {/* KPI 3: Open Exceptions / Anomalies */}
        <div className={`p-5 rounded-xl shadow-sm relative overflow-hidden border transition-all ${
          activeExceptionsCount > 0
            ? 'bg-amber-950/20 border-amber-800/80'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Open Validation Exceptions
            </span>
            <span className={`p-2 rounded-lg ${
              activeExceptionsCount > 0 ? 'bg-amber-950 text-amber-400' : 'bg-slate-800 text-slate-400'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${activeExceptionsCount > 0 ? 'animate-pulse' : ''}`} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${
              activeExceptionsCount > 0 ? 'text-amber-400' : 'text-white'
            }`}>
              {activeExceptionsCount}
            </span>
            <span className="text-xs text-slate-400">Action Required</span>
          </div>
          <div className="mt-3">
            {isContradictionActive ? (
              <span className="inline-block text-[11px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/80">
                ⚠️ P3 Insurance &gt; Sec A Headcount Contradiction
              </span>
            ) : isYoyAnomalyActive ? (
              <span className="inline-block text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                Scope 1 YoY (+45.9%) justification needed
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 font-medium">All cross-section checks clean ✓</span>
            )}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
            <span>Reconciliation Engine</span>
            <button
              onClick={() => setActiveModule('validation')}
              className="text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              Resolve Now &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Department Workflow Matrix & BRSR Section Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Department Delegation Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Multi-Department Delegation &amp; Submission Status</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Department-wise assignments, status &amp; statutory deadlines
              </p>
            </div>
            <button
              onClick={() => setActiveModule('workflow')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              View Full Workflow &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {departmentWorkflows.map((dept) => {
              const pct = Math.round((dept.completedCount / dept.kpisCount) * 100);
              return (
                <div key={dept.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{dept.department}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({dept.head})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{dept.assignedSections}</div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-24 text-right">
                      <div className="font-mono text-slate-200 font-bold">{dept.completedCount}/{dept.kpisCount} KPIs</div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.status === 'Submitted'
                              ? 'bg-emerald-500'
                              : dept.status === 'Overdue'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        dept.status === 'Submitted'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          : dept.status === 'Overdue'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 animate-pulse'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                      }`}
                    >
                      {dept.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Section-wise BRSR Progress (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>SEBI BRSR Sections Health</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Section A, Section B, Section C (P1 - P9)
              </p>
            </div>
            <button
              onClick={() => setActiveModule('reporting')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              Open BRSR Portal &rarr;
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Section A Card */}
            <div
              onClick={() => {
                setActiveModule('reporting');
                setActiveSubtab('section-a');
              }}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Section A: General Disclosures</span>
                <span className="text-emerald-400 font-mono font-bold">100% Complete</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Workforce: {brsrFormData.sectionA_employees.toLocaleString()} permanent personnel · {brsrFormData.sectionA_operatingPlants} operating plants
              </p>
            </div>

            {/* Section B Card */}
            <div
              onClick={() => {
                setActiveModule('reporting');
                setActiveSubtab('section-b');
              }}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Section B: Management Disclosures</span>
                <span className="text-emerald-400 font-mono font-bold">100% Complete</span>
              </div>
              <p className="text-[11px] text-slate-400">
                All 9 statutory ESG policies Board-approved &amp; director accountable
              </p>
            </div>

            {/* Section C Card */}
            <div
              onClick={() => {
                setActiveModule('reporting');
                setActiveSubtab('section-c');
              }}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Section C: Principles 1 to 9 (NGRBC)</span>
                <span className="text-amber-400 font-mono font-bold">82% (Reviewing P3 &amp; P6)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                P3 Wellbeing ({brsrFormData.sectionC_p3_healthInsurance} insured) · P6 Environment ({brsrFormData.sectionC_p6_scope1Mt} t Scope 1)
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Filter: SEBI BRSR Core Mandate (9 KPIs)</span>
            </div>
            <button
              onClick={() => {
                setActiveModule('reporting');
                setActiveSubtab('section-c');
              }}
              className="font-bold text-indigo-200 hover:underline cursor-pointer"
            >
              Inspect Core &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
