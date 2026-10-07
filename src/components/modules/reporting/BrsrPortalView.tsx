import React, { useState } from 'react';
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
} from 'lucide-react';

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
  } = useEsg();

  // Subtabs within BRSR Portal: section-a | section-b | section-c
  const activeSection = ['section-a', 'section-b', 'section-c'].includes(activeSubtab)
    ? activeSubtab
    : 'section-c';

  // Principle selector for Section C
  const [selectedPrinciple, setSelectedPrinciple] = useState<number>(6); // Default Principle 6 (Environment)
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

  // Helper to check evidence attached count for KPI
  const getEvidenceCount = (key: string) => {
    return evidenceAttachments.filter((a) => a.kpiKey === key).length;
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

        {/* Right: BRSR Core Filter Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">SEBI BRSR Core Filter:</span>
            <button
              onClick={() => setBrsrCoreFilterOnly(!brsrCoreFilterOnly)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                brsrCoreFilterOnly
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{brsrCoreFilterOnly ? 'Core Only Active' : 'All Indicators'}</span>
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

      {/* KILLER FEATURE 1: CROSS-SECTION CONTRADICTION POP-UP BANNER */}
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
                Section C (Principle 3) health insurance coverage (<strong className="font-mono font-bold text-white">{brsrFormData.sectionC_p3_healthInsurance}</strong>) cannot exceed Section A total permanent employees (<strong className="font-mono font-bold text-white">{brsrFormData.sectionA_employees}</strong>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => resolveContradiction('sync-insurance')}
              className="px-3 py-2 bg-white text-rose-950 hover:bg-rose-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Sync Insurance to {brsrFormData.sectionA_employees}</span>
            </button>

            <button
              onClick={() => resolveContradiction('update-employees')}
              className="px-3 py-2 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-500"
            >
              <span>Update Employees to {brsrFormData.sectionC_p3_healthInsurance}</span>
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
                  <span className="text-right max-w-xs">S-2, Technocrat Industrial Estate, Balanagar, Hyderabad</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500">Reporting Boundary</span>
                  <span className="text-emerald-400 font-semibold">Standalone &amp; Consolidated (300+ Sites)</span>
                </div>
              </div>
            </div>

            {/* Workforce & Operations Inputs */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>II. Operational Scope &amp; Workforce Data</span>
                {isPlant1Head && <span className="text-[10px] text-amber-400 font-normal">Read-Only for Plant Head</span>}
              </h3>

              <div className="space-y-3">
                {/* Field 1: Total Permanent Employees */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold flex items-center gap-1.5">
                      <span>Total Permanent Employees</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>
                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionA_employees',
                          label: 'Section A Total Permanent Employees',
                          unit: 'Employees',
                          currentValue: brsrFormData.sectionA_employees,
                          isCore: true,
                        })
                      }
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      title="Attach HR Roster / PF Register"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{getEvidenceCount('sectionA_employees')} Bills</span>
                    </button>
                  </div>

                  <input
                    type="number"
                    value={brsrFormData.sectionA_employees}
                    onChange={(e) =>
                      updateBrsrField('sectionA_employees', parseInt(e.target.value) || 0)
                    }
                    disabled={isPlant1Head || isAuditor}
                    className={`w-full bg-slate-900 border rounded-lg px-3 py-2 font-mono text-white text-sm font-bold focus:outline-none ${
                      isContradiction
                        ? 'border-rose-500 bg-rose-950/20 text-rose-200'
                        : 'border-slate-700 focus:border-emerald-500'
                    } ${isPlant1Head || isAuditor ? 'opacity-70 cursor-not-allowed' : ''}`}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    SEBI Rule: Cross-reconciled against Section C Principle 3 wellbeing schemes.
                  </p>
                </div>

                {/* Field 2: Operating Plants */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Number of Operating Manufacturing / Project Plants
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
                  <p className="text-[11px] text-slate-500 mt-1">
                    Default 3 key plants: Plant 1 (Hyderabad), Plant 2 (Polavaram), Plant 3 (Zojila).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* SECTION B: GOVERNANCE & POLICIES */}
      {/* ============================================================================== */}
      {activeSection === 'section-b' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>SEBI BRSR Section B: Management &amp; Process Disclosures</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Board-approved ESG policies, director accountability, and stakeholder grievance mechanisms across Principles 1 through 9.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Statutory Policy Name</th>
                  <th className="py-3 px-3">Principle</th>
                  <th className="py-3 px-3 text-center">Board Approved</th>
                  <th className="py-3 px-3 text-center">Grievance Mechanism</th>
                  <th className="py-3 px-3 text-right">Weblink / Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { name: 'Anti-Bribery & Whistleblower Policy', p: 'P1', approved: true },
                  { name: 'Sustainable Procurement Charter', p: 'P2', approved: true },
                  { name: 'Human Rights & Fair Wages Policy', p: 'P3/P5', approved: true },
                  { name: 'Biodiversity, Water & Carbon Net-Zero Policy', p: 'P6', approved: true },
                  { name: 'Vision Zero Occupational Health & Safety', p: 'P8', approved: true },
                ].map((pol, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{pol.name}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{pol.p}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Approved
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
          {/* Principle Navigation Pill Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-2 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pNum) => {
              const isSelected = selectedPrinciple === pNum;
              const hasAlert = pNum === 3 && isContradiction;
              const hasYoy = pNum === 6 && isScope1YoyAnomaly;

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
                  {pNum === 3 && <span>(Wellbeing)</span>}
                  {pNum === 6 && <span>(Environment)</span>}
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

          {/* PRINCIPLE 3: EMPLOYEE WELLBEING */}
          {selectedPrinciple === 3 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Principle 3: Employee Wellbeing &amp; Occupational Safety</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Essential indicators covering health insurance coverage, workplace safety, fatalities, and lost time injury frequency rate.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SEBI BRSR Core Mandate
                </span>
              </div>

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
                      <span>
                        Contradiction: {brsrFormData.sectionC_p3_healthInsurance} &gt; Section A Workforce ({brsrFormData.sectionA_employees}).
                      </span>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                    <span>SEBI Reconciled</span>
                    <button
                      onClick={() => resolveContradiction('sync-insurance')}
                      className="text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Auto-Reconcile &rarr;
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
            </div>
          )}

          {/* PRINCIPLE 6: ENVIRONMENT (ENERGY, WATER, EMISSIONS) */}
          {selectedPrinciple === 6 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-emerald-400" />
                    <span>Principle 6: Environmental Performance (Energy, Emissions, Water)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Statutory CEA &amp; GHG Protocol calculations for Scope 1, Scope 2, Electricity, and Water withdrawal.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  SEBI BRSR Core Mandate
                </span>
              </div>

              {/* Grid of P6 Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Electricity Consumption (GJ) with Unit Warning & Converter */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Electricity Consumption (GJ)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_electricityGj',
                          label: 'P6 Electricity Consumption',
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

                  {/* KILLER FEATURE RULE 2: UNIT CONSISTENCY WARNING WITH 1-CLICK CONVERT */}
                  {isUnitWarning ? (
                    <div className="p-2 bg-amber-950/60 border border-amber-800/80 rounded-lg text-[11px] text-amber-300 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unit Warning: Entered in kWh ({brsrFormData.sectionC_p6_electricityKwhRaw?.toLocaleString()} kWh)</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        SEBI requires Gigajoules (GJ). Formula: 1 GJ = 277.78 kWh.
                      </p>
                      <button
                        onClick={convertElectricityKwhToGj}
                        className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition-colors cursor-pointer"
                      >
                        ⚡ 1-Click Convert to GJ ({(Math.round((brsrFormData.sectionC_p6_electricityKwhRaw || 0) / 277.778)).toLocaleString()} GJ)
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Standard unit: Gigajoules</span>
                      <button
                        onClick={() =>
                          updateBrsrField('sectionC_p6_electricityKwhRaw', 1144450)
                        }
                        className="text-slate-400 hover:text-amber-400 underline cursor-pointer"
                      >
                        Simulate kWh entry
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Fuel / Diesel Consumption */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>High Speed Diesel / Fuel (KL)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_fuelDieselKl',
                          label: 'High Speed Diesel (HSD)',
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
                    Emission Factor: 2.687 kg CO2e / Liter High Speed Diesel.
                  </p>
                </div>

                {/* 3. Scope 1 GHG Emissions with YoY Anomaly Check */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isScope1YoyAnomaly
                    ? 'bg-amber-950/20 border-amber-700/80'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Scope 1 Direct GHG (MT CO2e)</span>
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

                  {/* KILLER FEATURE RULE 3: YOY ANOMALY WARNING (>30%) */}
                  {isScope1YoyAnomaly ? (
                    <div className="p-2.5 bg-amber-950/80 border border-amber-700 rounded-lg text-[11px] text-amber-300 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>YoY Anomaly Detected: +{scope1VariancePct}% vs FY25 (850 MT)</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Variance exceeds statutory threshold (&gt;30%). Justification is mandatory for SEBI filing.
                      </p>

                      {brsrFormData.sectionC_p6_scope1Justification ? (
                        <div className="p-1.5 bg-slate-900 rounded text-[10px] text-emerald-300 font-mono">
                          Justification on file: "{brsrFormData.sectionC_p6_scope1Justification}"
                        </div>
                      ) : (
                        <div className="space-y-1 pt-1">
                          <input
                            type="text"
                            value={justificationText}
                            onChange={(e) => setJustificationText(e.target.value)}
                            placeholder="State reason for variance..."
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white focus:outline-none"
                          />
                          <button
                            onClick={() => saveScope1Justification(justificationText)}
                            className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition-colors cursor-pointer"
                          >
                            Save Mandatory Justification Note
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500">
                      FY25 baseline: {fy25Baseline} MT CO2e (variance within &lt;30% band).
                    </p>
                  )}
                </div>

                {/* 4. Scope 2 Emissions */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Scope 2 Indirect Grid GHG (MT CO2e)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        BRSR Core
                      </span>
                    </label>

                    <button
                      onClick={() =>
                        openEvidenceDrawerForKpi({
                          key: 'sectionC_p6_scope2Mt',
                          label: 'Scope 2 Grid Electricity GHG',
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
                      <span>0 Bills</span>
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

          {/* OTHER PRINCIPLES SUMMARY VIEW (P1, P2, P4, P5, P7, P8, P9) */}
          {![3, 6].includes(selectedPrinciple) && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm">
                  Principle {selectedPrinciple}: Statutory Performance Disclosures
                </h3>
                <span className="text-xs text-emerald-400 font-mono">100% Data Completed</span>
              </div>
              <p className="text-xs text-slate-400">
                All statutory disclosures for Principle {selectedPrinciple} have been compiled under the National Guidelines for Responsible Business Conduct (NGRBC).
              </p>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">Department Sign-off: Complete</div>
                  <div className="text-[11px] text-slate-500">Immutable audit log locked under SEBI guidelines.</div>
                </div>
                <button
                  onClick={() => setSelectedPrinciple(6)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold cursor-pointer"
                >
                  Return to Principle 6 &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
