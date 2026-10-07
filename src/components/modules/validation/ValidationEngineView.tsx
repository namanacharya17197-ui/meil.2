import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  AlertTriangle,
  CheckCircle2,
  Scale,
  RefreshCw,
  Zap,
  TrendingUp,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const ValidationEngineView: React.FC = () => {
  const {
    brsrFormData,
    resolveContradiction,
    convertElectricityKwhToGj,
    saveScope1Justification,
    setActiveModule,
    setActiveSubtab,
    currentRole,
  } = useEsg();

  const [justificationInput, setJustificationInput] = useState<string>(
    brsrFormData.sectionC_p6_scope1Justification ||
      'Phase 2 excavation power outage required emergency mobile diesel gen-sets for deep tunnel ventilation.'
  );

  // Exception 1: Cross-Section Contradiction (P3 > Sec A)
  const isContradiction =
    brsrFormData.sectionC_p3_healthInsurance > brsrFormData.sectionA_employees;

  // Exception 2: Unit Warning (Raw kWh entered)
  const isUnitWarning = (brsrFormData.sectionC_p6_electricityKwhRaw || 0) > 0;

  // Exception 3: YoY Scope 1 Anomaly
  const fy25Baseline = 850;
  const scope1VariancePct = Math.round(
    ((brsrFormData.sectionC_p6_scope1Mt - fy25Baseline) / fy25Baseline) * 100
  );
  const isScope1YoyAnomaly = scope1VariancePct > 30;
  const isScope1Justified = Boolean(brsrFormData.sectionC_p6_scope1Justification);

  // Total active count
  const activeExceptionsCount =
    (isContradiction ? 1 : 0) +
    (isUnitWarning ? 1 : 0) +
    (isScope1YoyAnomaly && !isScope1Justified ? 1 : 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              SEBI Statutory Pre-Filing Quality Gate
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Validation &amp; Cross-Section Reconciliation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automated statutory rules detect contradictions between Section A and Section C, enforce Gigajoule unit standardization, and mandate justifications for YoY anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              activeExceptionsCount > 0
                ? 'bg-amber-950/80 border-amber-800 text-amber-300 animate-pulse'
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
            }`}
          >
            {activeExceptionsCount > 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{activeExceptionsCount} Unresolved Exceptions</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All Quality Gates Clean (100% Pass)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exception 1: Cross-Section Contradiction (The Monday Morning Problem) */}
      <div
        className={`p-5 rounded-xl border transition-all space-y-4 ${
          isContradiction
            ? 'bg-rose-950/20 border-rose-600 shadow-lg'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl text-white shrink-0 mt-0.5 ${
                isContradiction ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              {isContradiction ? (
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Rule 1: Cross-Section Reconciliation (Workforce vs Health Insurance)
                </span>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isContradiction
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isContradiction ? 'Critical Blocker' : 'Reconciled ✓'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SEBI Reconciliation Mandate: Employees enrolled in health insurance schemes (Section C Principle 3) must never exceed total permanent headcount reported in Section A.
              </p>
            </div>
          </div>
        </div>

        {isContradiction ? (
          <div className="p-4 bg-slate-950 rounded-xl border border-rose-900/60 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Section A: Reported Permanent Workforce</span>
                <span className="text-lg font-mono font-bold text-white">
                  {brsrFormData.sectionA_employees.toLocaleString()} Employees
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Reported by HR Lead</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-rose-800 bg-rose-950/20">
                <span className="text-[10px] text-rose-400 uppercase block">Section C (P3): Health Insurance Claims</span>
                <span className="text-lg font-mono font-bold text-rose-300">
                  {brsrFormData.sectionC_p3_healthInsurance.toLocaleString()} Personnel
                </span>
                <span className="text-[10px] text-rose-400 block mt-0.5">Enrolled with TPA / Policy Roster</span>
              </div>
            </div>

            <div className="p-3 bg-rose-950/80 border border-rose-700 rounded-lg text-rose-200">
              <strong className="text-white">Contradiction Detected:</strong> Health insurance coverage ({brsrFormData.sectionC_p3_healthInsurance}) is greater than permanent workforce ({brsrFormData.sectionA_employees}). Resolve contradiction before filing.
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => resolveContradiction('sync-insurance')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Option A: Sync Insurance Coverage to match Section A ({brsrFormData.sectionA_employees})</span>
              </button>

              <button
                onClick={() => resolveContradiction('update-employees')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Option B: Update Section A Headcount to ({brsrFormData.sectionC_p3_healthInsurance})</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Workforce headcount (<strong className="text-emerald-400">{brsrFormData.sectionA_employees}</strong>) matches or covers health insurance coverage (<strong className="text-emerald-400">{brsrFormData.sectionC_p3_healthInsurance}</strong>).
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">No Audit Exception</span>
          </div>
        )}
      </div>

      {/* Exception 2: Unit Consistency Check (kWh to GJ) */}
      <div
        className={`p-5 rounded-xl border transition-all space-y-4 ${
          isUnitWarning
            ? 'bg-amber-950/20 border-amber-700 shadow-md'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl text-white shrink-0 mt-0.5 ${
                isUnitWarning ? 'bg-amber-600' : 'bg-emerald-600'
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Rule 2: Unit Consistency &amp; Metric Normalization (Electricity in GJ)
                </span>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isUnitWarning
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isUnitWarning ? 'Unit Warning' : 'Standardized (GJ) ✓'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SEBI BRSR Core mandates reporting energy in <strong>Gigajoules (GJ)</strong> rather than electrical kilowatt-hours (kWh). Conversion: 1 GJ = 277.78 kWh.
              </p>
            </div>
          </div>
        </div>

        {isUnitWarning ? (
          <div className="p-4 bg-slate-950 rounded-xl border border-amber-900/60 space-y-3 text-xs">
            <div className="p-3 bg-amber-950/60 border border-amber-700/80 rounded-lg text-amber-200">
              User entered electricity consumption as{' '}
              <strong className="text-white font-mono">
                {brsrFormData.sectionC_p6_electricityKwhRaw?.toLocaleString()} kWh
              </strong>
              . This must be converted into Gigajoules (GJ) before submission.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={convertElectricityKwhToGj}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>⚡ 1-Click Convert to Gigajoules ({(Math.round((brsrFormData.sectionC_p6_electricityKwhRaw || 0) / 277.778)).toLocaleString()} GJ)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Electricity metric is normalized in Gigajoules: <strong className="text-emerald-400 font-mono">{brsrFormData.sectionC_p6_electricityGj.toLocaleString()} GJ</strong>.
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">Compliant</span>
          </div>
        )}
      </div>

      {/* Exception 3: YoY Anomaly (>30% Variance) */}
      <div
        className={`p-5 rounded-xl border transition-all space-y-4 ${
          isScope1YoyAnomaly && !isScope1Justified
            ? 'bg-amber-950/20 border-amber-700 shadow-md'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl text-white shrink-0 mt-0.5 ${
                isScope1YoyAnomaly && !isScope1Justified ? 'bg-amber-600' : 'bg-emerald-600'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Rule 3: Year-on-Year (YoY) Anomaly Radar (&gt;30% Variance Threshold)
                </span>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isScope1YoyAnomaly && !isScope1Justified
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {isScope1YoyAnomaly && !isScope1Justified ? 'Justification Required' : 'Justified on File ✓'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                SEBI Top-1000 Listed guidelines require formal statutory disclosure notes whenever direct emissions or energy fluctuate by more than 30% YoY.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">FY25 Historical Baseline</span>
              <span className="text-base font-mono font-bold text-slate-300">850 MT CO2e</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">FY26 Reported Scope 1</span>
              <span className="text-base font-mono font-bold text-white">
                {brsrFormData.sectionC_p6_scope1Mt.toLocaleString()} MT CO2e
              </span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-amber-800/80 bg-amber-950/20">
              <span className="text-[10px] text-amber-400 uppercase block">YoY Variance Percentage</span>
              <span className="text-base font-mono font-bold text-amber-300">
                +{scope1VariancePct}% (Exceeds 30%)
              </span>
            </div>
          </div>

          {brsrFormData.sectionC_p6_scope1Justification ? (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-200">
              <strong className="text-emerald-400">Statutory Justification on Record:</strong>
              <p className="mt-1 font-mono text-[11px] text-slate-200">
                "{brsrFormData.sectionC_p6_scope1Justification}"
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-slate-300 font-bold">
                Mandatory Operational Justification for Scope 1 Spike:
              </label>
              <textarea
                rows={2}
                value={justificationInput}
                onChange={(e) => setJustificationInput(e.target.value)}
                placeholder="State project expansion, diesel generator usage, or grid power outages..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => saveScope1Justification(justificationInput)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-md"
              >
                Save Justification Note &amp; Clear Exception
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
