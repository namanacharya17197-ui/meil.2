import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  Settings,
  Database,
  Sliders,
  Compass,
  Plus,
  Edit,
  Save,
  CheckCircle2,
  Lock,
  Layers,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { EmissionFactor } from '../../../types/esg';

export const AdminMastersView: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    emissionFactors,
    setEmissionFactors,
    brsrIndicators,
    setIsTourOpen,
    addAuditLog,
    currentRole,
  } = useEsg();

  const [editingFactorId, setEditingFactorId] = useState<string | null>(null);
  const [editFactorValue, setEditFactorValue] = useState<number>(0);
  const [saveToast, setSaveToast] = useState(false);

  const handleEditFactor = (factor: EmissionFactor) => {
    setEditingFactorId(factor.id);
    setEditFactorValue(factor.factor);
  };

  const handleSaveFactor = (factor: EmissionFactor) => {
    setEmissionFactors((prev) =>
      prev.map((f) => (f.id === factor.id ? { ...f, factor: editFactorValue } : f))
    );
    addAuditLog({
      user: 'K. V. Rao',
      role: currentRole,
      action: 'RECALCULATE',
      entity: 'Emission Library Factor Master',
      field: factor.fuelOrSource,
      oldValue: `${factor.factor} kg CO2e/${factor.unit}`,
      newValue: `${editFactorValue} kg CO2e/${factor.unit}`,
    });
    setEditingFactorId(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>MEIL Enterprise Configuration</span>
              <span>·</span>
              <span>Statutory Emission Standards & Master KPI Dictionary</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Administration & Factor Masters</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Maintain CEA baseline grid emission factors, DEFRA transport and fuel factors, BRSR KPI dictionaries, and audit security policies.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSubtab('emission-library')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'emission-library'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Emission Library
            </button>
            <button
              onClick={() => setActiveSubtab('indicator-master')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'indicator-master'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Indicator Master
            </button>
            <button
              onClick={() => setActiveSubtab('system-settings')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'system-settings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System & Security
            </button>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Factor master successfully updated and logged into immutable audit ledger.</span>
        </div>
      )}

      {/* 1. EMISSION LIBRARY FACTOR MASTER */}
      {activeSubtab === 'emission-library' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Statutory Emission Factors Master Table</span>
              </h2>
              <p className="text-xs text-slate-400">
                Official emission factors applied in Scope 1, Scope 2, and Scope 3 telemetry calculations.
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Last Synced: CEA Baseline Database v20.0 (Official GoI)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Scope</th>
                  <th className="py-3 px-3">Fuel / Emission Source</th>
                  <th className="py-3 px-3">Unit</th>
                  <th className="py-3 px-3 text-right">Factor (kg CO₂e / unit)</th>
                  <th className="py-3 px-3">Standard Authority</th>
                  <th className="py-3 px-3">Effective Cycle</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {emissionFactors.map((factor) => {
                  const isEditing = editingFactorId === factor.id;
                  return (
                    <tr key={factor.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            factor.category === 'Scope 1'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : factor.category === 'Scope 2'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {factor.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        <div>{factor.fuelOrSource}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{factor.notes}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">{factor.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.001"
                            value={editFactorValue}
                            onChange={(e) => setEditFactorValue(Number(e.target.value))}
                            className="bg-slate-950 border border-emerald-500 rounded px-2 py-1 text-right text-emerald-400 w-28 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-emerald-400">{factor.factor.toFixed(3)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400">{factor.sourceStandard}</td>
                      <td className="py-3 px-3 text-slate-400">{factor.effectiveYear}</td>
                      <td className="py-3 px-3 text-center">
                        {currentRole !== 'Group ESG Admin' ? (
                          <span className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>Admin Only</span>
                          </span>
                        ) : isEditing ? (
                          <button
                            onClick={() => handleSaveFactor(factor)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Save className="w-3 h-3" /> Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditFactor(factor)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. INDICATOR MASTER */}
      {activeSubtab === 'indicator-master' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>BRSR Core Indicator Dictionary</span>
              </h2>
              <p className="text-xs text-slate-400">
                Official KPI metadata mapping to SEBI BRSR Core Principles P1 through P9.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-800 font-semibold">
              SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brsrIndicators.map((ind) => (
              <div key={ind.code} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{ind.code}</span>
                    <span className="text-slate-500 font-semibold">({ind.principle})</span>
                  </div>
                  <span className="text-[10px] text-sky-300 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                    {ind.category}
                  </span>
                </div>

                <div className="font-semibold text-white text-sm">{ind.title}</div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Unit: <strong className="text-slate-200">{ind.unit}</strong></span>
                  <span>Target: <strong className="text-slate-200">{ind.targetValue} {ind.unit}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Mandatory
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SYSTEM & SECURITY SETTINGS */}
      {activeSubtab === 'system-settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Assurance Security & System Governance</span>
            </h2>
            <p className="text-xs text-slate-400">
              Audit logging enforcement, cryptographic signing keys, and interactive user assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>ISAE 3000 Digital Signature Cryptography</span>
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All statutory approvals and XBRL exports are signed with SHA-256 RSA keys to guarantee non-repudiation during SEBI stock exchange verification.
              </p>
              <div className="p-2.5 bg-slate-900 rounded font-mono text-[10px] text-emerald-400 truncate">
                Active Certificate Fingerprint: 0x8f2d49e1...b14c77aa9
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Interactive Enterprise Onboarding Tour</span>
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Re-launch the step-by-step interactive onboarding walkthrough to guide new auditors, site engineers, and executive reviewers.
              </p>
              <button
                onClick={() => setIsTourOpen(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Launch Interactive Tour</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
