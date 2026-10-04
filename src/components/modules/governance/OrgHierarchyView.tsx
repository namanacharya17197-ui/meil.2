import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import { MeilLogo } from '../../common/MeilLogo';
import {
  Network,
  Building2,
  Layers,
  ChevronDown,
  ChevronRight,
  MapPin,
  Leaf,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { HierarchicalDrillDown } from './HierarchicalDrillDown';

export const OrgHierarchyView: React.FC = () => {
  const {
    sites,
    scopedSites,
    selectedSiteId,
    setSelectedSiteId,
    setActiveModule,
    setActiveSubtab,
    activeSubtab,
    currentRole,
    setSites,
    addAuditLog,
  } = useEsg();

  const [expandedDivisions, setExpandedDivisions] = useState<Record<string, boolean>>({
    'Hydro & Irrigation': true,
    'Transport & Tunnels': true,
    'Energy & Hydrocarbons': true,
    'Power & Solar': true,
    'Water & Urban': true,
  });

  const [matrixFilterStatus, setMatrixFilterStatus] = useState<string>('All');

  const divisions = ['Hydro & Irrigation', 'Transport & Tunnels', 'Energy & Hydrocarbons', 'Power & Solar', 'Water & Urban'];

  const toggleDivision = (div: string) => {
    setExpandedDivisions((prev) => ({ ...prev, [div]: !prev[div] }));
  };

  const handleBulkApprove = () => {
    setSites((prev) =>
      prev.map((s) => (s.status === 'Submitted' || s.status === 'In Review' ? { ...s, status: 'Approved' } : s))
    );
    addAuditLog({
      user: 'K. V. Rao',
      role: currentRole,
      action: 'APPROVE',
      entity: 'All Pending Infrastructure Sites',
      field: 'Statutory Submission Status',
      oldValue: 'In Review / Submitted',
      newValue: 'Approved (Batch Verification)',
    });
  };

  const isMatrixView = activeSubtab === 'submission-matrix';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>MEIL Corporate ESG Governance</span>
              <span>·</span>
              <span>Consolidated Statutory Boundaries</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              <span>{isMatrixView ? 'Reporting Cycles & Submission Progress Matrix' : 'Enterprise Organization Hierarchy Tree'}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isMatrixView
                ? 'Statutory tracking of site-level ESG data submissions across FY 2024-25 quarters, verification stages, and independent audit sign-offs.'
                : 'Consolidated reporting boundary: Group Holding -> Operating Divisions -> Project Subsidiaries -> 25+ Mega Asset Sites.'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSubtab('drilldown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSubtab === 'drilldown' || !['org-tree', 'submission-matrix'].includes(activeSubtab)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Rollup Engine (~300 Sites)
            </button>
            <button
              onClick={() => setActiveSubtab('org-tree')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSubtab === 'org-tree'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Hierarchy Tree
            </button>
            <button
              onClick={() => setActiveSubtab('submission-matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeSubtab === 'submission-matrix'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Submission Matrix
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 2: HIERARCHICAL DRILL-DOWN & ROLLUP ENGINE */}
      {(activeSubtab === 'drilldown' || !['org-tree', 'submission-matrix'].includes(activeSubtab)) && (
        <HierarchicalDrillDown />
      )}

      {activeSubtab === 'submission-matrix' && (
        /* SUBMISSION MATRIX VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase">Filter Status:</span>
              {['All', 'Approved', 'In Review', 'Submitted', 'Pending Entry'].map((st) => (
                <button
                  key={st}
                  onClick={() => setMatrixFilterStatus(st)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    matrixFilterStatus === st
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {currentRole === 'Group ESG Admin' && (
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bulk Sign-Off Pending Sites</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Site Code & Name</th>
                  <th className="py-3 px-3">Operating Division</th>
                  <th className="py-3 px-3 text-center">Q1 Data</th>
                  <th className="py-3 px-3 text-center">Q2 Data</th>
                  <th className="py-3 px-3 text-center">Q3 Data</th>
                  <th className="py-3 px-3 text-center">Q4 (Live)</th>
                  <th className="py-3 px-3 text-right">Scope 1+2 tCO₂e</th>
                  <th className="py-3 px-3 text-right">Statutory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scopedSites
                  .filter((s) => matrixFilterStatus === 'All' || s.status === matrixFilterStatus)
                  .map((site) => (
                    <tr
                      key={site.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedSiteId(site.id)}
                    >
                      <td className="py-3 px-3 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-mono text-emerald-400 font-bold">{site.code}</span>
                            <div className="text-slate-300 font-semibold truncate max-w-[200px]">{site.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{site.division}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {site.status === 'Approved' ? (
                          <span className="inline-flex items-center text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-amber-400 font-medium">
                            <Clock className="w-3.5 h-3.5 mr-1" /> In Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center text-sky-400 font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1" /> Telemetry Live
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-white">
                        {(site.scope1 + site.scope2).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            site.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : site.status === 'In Review'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : site.status === 'Submitted'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {site.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubtab === 'org-tree' && (
        /* HIERARCHY TREE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          {/* Level 0: Group Apex */}
          <div className="bg-slate-950 border-2 border-emerald-600/70 rounded-xl p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-black/90 border border-slate-700 rounded-xl shadow-md">
                  <MeilLogo height={32} showText={true} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400">
                    Group Holding Entity (SEBI BRSR Reporting Boundary)
                  </div>
                  <h2 className="text-base font-extrabold text-white">
                    Megha Engineering & Infrastructures Limited (MEIL)
                  </h2>
                  <div className="text-xs text-slate-400">
                    CIN: U45202TG2006PLC050271 · Corporate HQ: Hyderabad, India
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Subsidiaries</span>
                  <span className="font-bold text-white">14 Operating Companies</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Active Mega Projects</span>
                  <span className="font-bold text-emerald-400">25+ Ingested Sites</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Turnover</span>
                  <span className="font-bold text-white">₹ 38,500+ Cr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level 1: Operating Divisions */}
          <div className="space-y-4 pl-4 border-l-2 border-slate-800 ml-6">
            {divisions.map((div) => {
              const divSites = sites.filter((s) => s.division === div);
              const isExpanded = !!expandedDivisions[div];
              const divTurnover = divSites.reduce((a, b) => a + b.turnoverCr, 0);
              const divScope12 = divSites.reduce((a, b) => a + b.scope1 + b.scope2, 0);

              return (
                <div key={div} className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  {/* Division Header Accordion */}
                  <div
                    onClick={() => toggleDivision(div)}
                    className="p-3.5 bg-slate-900/90 hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-white">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-sm text-white">{div}</span>
                        <span className="text-xs text-slate-400 ml-2">({divSites.length} Infrastructure Assets)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-400">
                        Turnover: <strong className="text-slate-200">₹ {divTurnover.toLocaleString()} Cr</strong>
                      </span>
                      <span className="text-slate-400">
                        Emissions: <strong className="text-emerald-400">{divScope12.toLocaleString()} tCO₂e</strong>
                      </span>
                    </div>
                  </div>

                  {/* Level 2: Project Sites under this division */}
                  {isExpanded && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-950">
                      {divSites.map((site) => {
                        const isSelected = selectedSiteId === site.id;
                        return (
                          <div
                            key={site.id}
                            onClick={() => setSelectedSiteId(site.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-emerald-950/40 border-emerald-600/80 shadow-md'
                                : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="font-mono text-[10px] font-bold text-emerald-400">
                                  {site.code}
                                </span>
                                <h4 className="text-xs font-bold text-white mt-0.5 truncate max-w-[190px]">
                                  {site.name}
                                </h4>
                                <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[190px]">
                                  {site.subsidiary}
                                </div>
                              </div>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  site.status === 'Approved'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {site.status}
                              </span>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] flex justify-between text-slate-400">
                              <span>Scope 1+2: <strong className="text-white">{site.scope1 + site.scope2} t</strong></span>
                              <span>Water: <strong className="text-cyan-300">{site.waterRecycledPct}%</strong></span>
                              <span className="text-emerald-400 font-semibold">{site.completionPct}% Done</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
