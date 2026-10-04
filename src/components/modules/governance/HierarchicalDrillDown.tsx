import React, { useState, useMemo } from 'react';
import { useEsg } from '../../../context/EsgContext';
import { GroupNode, CompanyNode, BusinessUnitNode, InfrastructureSite } from '../../../types/esg';
import {
  Layers,
  Building2,
  FolderTree,
  ChevronRight,
  Database,
  ArrowUpRight,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const HierarchicalDrillDown: React.FC = () => {
  const {
    organizationHierarchy,
    sites,
    setSelectedSiteId,
    setActiveModule,
    setActiveSubtab,
    currentRole,
    userScope,
  } = useEsg();

  // Navigation State
  // Level: 'group' | 'company' | 'bu' | 'site'
  const [currentLevel, setCurrentLevel] = useState<'group' | 'company' | 'bu'>('group');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedBuId, setSelectedBuId] = useState<string | null>(null);
  const [siteSearch, setSiteSearch] = useState<string>('');
  const [lastRefreshedAt] = useState<string>('Just now (Cached Materialized View)');

  // Selected company and BU objects
  const activeCompany: CompanyNode | null = useMemo(() => {
    if (!selectedCompanyId) return null;
    return organizationHierarchy.companies.find((c) => c.id === selectedCompanyId) || null;
  }, [selectedCompanyId, organizationHierarchy]);

  const activeBu: BusinessUnitNode | null = useMemo(() => {
    if (!activeCompany || !selectedBuId) return null;
    return activeCompany.businessUnits.find((b) => b.id === selectedBuId) || null;
  }, [activeCompany, selectedBuId]);

  // Handlers for breadcrumb & drill-down
  const handleSelectGroup = () => {
    setCurrentLevel('group');
    setSelectedCompanyId(null);
    setSelectedBuId(null);
  };

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedBuId(null);
    setCurrentLevel('company');
  };

  const handleSelectBu = (buId: string) => {
    setSelectedBuId(buId);
    setCurrentLevel('bu');
  };

  // Sites belonging to active BU or all sites
  const displayedSites = useMemo(() => {
    let list: InfrastructureSite[] = [];
    if (activeBu) {
      list = activeBu.sites && activeBu.sites.length > 0
        ? activeBu.sites
        : sites.filter((s) => s.division.toLowerCase().includes(activeBu.name.toLowerCase().split(' ')[0]));
    } else if (activeCompany) {
      const buNames = activeCompany.businessUnits.map((b) => b.name.toLowerCase().split(' ')[0]);
      list = sites.filter((s) => buNames.some((bName) => s.division.toLowerCase().includes(bName)));
    } else {
      list = sites;
    }

    if (!siteSearch) return list;
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
        s.code.toLowerCase().includes(siteSearch.toLowerCase()) ||
        s.state.toLowerCase().includes(siteSearch.toLowerCase())
    );
  }, [activeBu, activeCompany, sites, siteSearch]);

  const companiesToDisplay = useMemo(() => {
    if (currentRole === 'Subsidiary Approver' && userScope.subsidiary) {
      return organizationHierarchy.companies.filter((c) =>
        c.name.toLowerCase().includes('hydro') || userScope.subsidiary!.toLowerCase().includes(c.name.toLowerCase())
      );
    }
    return organizationHierarchy.companies;
  }, [organizationHierarchy, currentRole, userScope]);

  // Intensity calculations
  const calculateIntensity = (scope12: number, turnoverCr: number) => {
    if (!turnoverCr) return '0.00';
    return (scope12 / turnoverCr).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & ROLLUP STATUS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span className="text-emerald-400 font-semibold">Step 2 & Feature 2</span>
              <span>·</span>
              <span>Hierarchical Rollup Engine (~300 Sites → BU → Company → Group)</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-950/80 text-sky-300 border border-sky-800">
                <Database className="w-3 h-3 text-sky-400" />
                PostgreSQL Materialized View Active
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Multi-Tier Aggregation & Drill-Down Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Statutory aggregation rollup: Individual project sites raw telemetry rolling up to Operating Business Units, Subsidiary Legal Entities, and Consolidated MEIL Group.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Cache: {lastRefreshedAt}</span>
          </div>
        </div>

        {/* INTERACTIVE BREADCRUMB NAVIGATION */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs flex-wrap font-medium">
          <span className="text-slate-500">Drill Path:</span>
          
          <button
            onClick={handleSelectGroup}
            className={`px-2.5 py-1 rounded transition-colors ${
              currentLevel === 'group'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            MEIL Group Holding (Consolidated)
          </button>

          {(activeCompany || currentLevel === 'company' || currentLevel === 'bu') && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button
                onClick={() => activeCompany && handleSelectCompany(activeCompany.id)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentLevel === 'company'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {activeCompany?.name || 'Company Level'}
              </button>
            </>
          )}

          {activeBu && currentLevel === 'bu' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold">
                {activeBu.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* METRIC ROLLUP BANNER (Current Active Level) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Energy GJ */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Energy (GJ)</div>
          <div className="text-lg font-extrabold text-white font-mono mt-1">
            {currentLevel === 'bu' && activeBu
              ? activeBu.energyGj.toLocaleString()
              : currentLevel === 'company' && activeCompany
              ? activeCompany.energyGj.toLocaleString()
              : organizationHierarchy.totalEnergyGj.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Electricity + Fuels</span>
        </div>

        {/* Scope 1 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[11px] text-amber-400 uppercase font-semibold">Scope 1 (Direct)</div>
          <div className="text-lg font-extrabold text-amber-300 font-mono mt-1">
            {currentLevel === 'bu' && activeBu
              ? activeBu.scope1.toLocaleString()
              : currentLevel === 'company' && activeCompany
              ? activeCompany.scope1.toLocaleString()
              : organizationHierarchy.scope1.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <span className="text-[10px] text-slate-500">DG Diesel & Fleet</span>
        </div>

        {/* Scope 2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[11px] text-blue-400 uppercase font-semibold">Scope 2 (Grid Power)</div>
          <div className="text-lg font-extrabold text-blue-300 font-mono mt-1">
            {currentLevel === 'bu' && activeBu
              ? activeBu.scope2.toLocaleString()
              : currentLevel === 'company' && activeCompany
              ? activeCompany.scope2.toLocaleString()
              : organizationHierarchy.scope2.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <span className="text-[10px] text-slate-500">CEA Grid Baseline</span>
        </div>

        {/* Scope 3 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[11px] text-purple-400 uppercase font-semibold">Scope 3 (Value Chain)</div>
          <div className="text-lg font-extrabold text-purple-300 font-mono mt-1">
            {currentLevel === 'bu' && activeBu
              ? activeBu.scope3.toLocaleString()
              : currentLevel === 'company' && activeCompany
              ? activeCompany.scope3.toLocaleString()
              : organizationHierarchy.scope3.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">tCO₂e</span>
          </div>
          <span className="text-[10px] text-slate-500">Steel, Cement, Freight</span>
        </div>

        {/* Total GHG */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 shadow-sm">
          <div className="text-[11px] text-emerald-400 uppercase font-semibold">Total GHG (S1+S2+S3)</div>
          <div className="text-lg font-extrabold text-emerald-300 font-mono mt-1">
            {currentLevel === 'bu' && activeBu
              ? activeBu.totalScope.toLocaleString()
              : currentLevel === 'company' && activeCompany
              ? activeCompany.totalScope.toLocaleString()
              : organizationHierarchy.totalScope.toLocaleString()}{' '}
            <span className="text-xs font-normal text-emerald-400">tCO₂e</span>
          </div>
          <span className="text-[10px] text-emerald-400/70">Consolidated</span>
        </div>

        {/* Intensity */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Intensity (tCO₂e/Cr)</div>
          <div className="text-lg font-extrabold text-white font-mono mt-1">
            {currentLevel === 'bu' && activeBu
              ? activeBu.intensityTco2ePerCr
              : currentLevel === 'company' && activeCompany
              ? activeCompany.intensityTco2ePerCr
              : organizationHierarchy.intensityTco2ePerCr}
          </div>
          <span className="text-[10px] text-slate-500">Per ₹1 Cr Turnover</span>
        </div>
      </div>

      {/* LEVEL 0 / 1: DRILL CARDS (If at Group or Company Level) */}
      {currentLevel === 'group' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Operating Subsidiary Entities (Rollup Tier 2)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any legal entity to drill down into its operating Business Units
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {organizationHierarchy.companies.length} Companies
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companiesToDisplay.map((company) => (
              <div
                key={company.id}
                onClick={() => handleSelectCompany(company.id)}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/40 cursor-pointer transition group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{company.code}</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {company.siteCount} Sites
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition mb-1">
                    {company.name}
                  </h4>

                  <div className="text-xs text-slate-400 mb-4 font-mono">
                    Turnover: ₹{company.turnoverCr.toLocaleString()} Cr • {company.buCount} Business Units
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Scope 1 (Direct):</span>
                      <span className="font-mono text-amber-300 font-semibold">{company.scope1.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Scope 2 (Electricity):</span>
                      <span className="font-mono text-blue-300 font-semibold">{company.scope2.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Scope 3 (Value Chain):</span>
                      <span className="font-mono text-purple-300 font-semibold">{company.scope3.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800 font-bold">
                      <span>Total GHG:</span>
                      <span className="font-mono text-emerald-400">{company.totalScope.toLocaleString()} tCO₂e</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Drill down to BUs</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEVEL 1: BUSINESS UNITS GRID (When a Company is Selected) */}
      {currentLevel === 'company' && activeCompany && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-emerald-400" />
                <span>Business Units under {activeCompany.name} (Rollup Tier 3)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any Business Unit to inspect individual project sites ranking and live status
              </p>
            </div>
            <button
              onClick={handleSelectGroup}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              ← Back to Group View
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCompany.businessUnits.map((bu) => (
              <div
                key={bu.id}
                onClick={() => handleSelectBu(bu.id)}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/40 cursor-pointer transition group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{bu.code}</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {bu.siteCount} Sites
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition mb-1">
                    {bu.name}
                  </h4>

                  <div className="text-xs text-slate-400 mb-3 font-mono">
                    Turnover: ₹{bu.turnoverCr.toLocaleString()} Cr • Energy: {bu.energyGj.toLocaleString()} GJ
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Scope 1:</span>
                      <span className="font-mono text-amber-300 font-semibold">{bu.scope1.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Scope 2:</span>
                      <span className="font-mono text-blue-300 font-semibold">{bu.scope2.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Scope 3:</span>
                      <span className="font-mono text-purple-300 font-semibold">{bu.scope3.toLocaleString()} tCO₂e</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800 font-bold">
                      <span>Intensity:</span>
                      <span className="font-mono text-emerald-400">{bu.intensityTco2ePerCr} tCO₂e/Cr</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>View Project Sites (~300 Sites)</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEVEL 2 & 3: PROJECT SITES TABLE (~300 Sites Ranking & Live Status) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>
                {activeBu
                  ? `Project Sites in ${activeBu.name} (${displayedSites.length} Sites)`
                  : activeCompany
                  ? `Project Sites in ${activeCompany.name} (${displayedSites.length} Sites)`
                  : `All Infrastructure Project Sites (${displayedSites.length} Active Sites)`}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live ranking by GHG footprint, energy intensity, and statutory assurance sign-off status
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter site name, code, state..."
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs w-56"
            />
          </div>
        </div>

        {/* Sites Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Site Code & Name</th>
                <th className="py-2.5 px-3">Division / State</th>
                <th className="py-2.5 px-3 text-right">Scope 1 (tCO₂e)</th>
                <th className="py-2.5 px-3 text-right">Scope 2 (tCO₂e)</th>
                <th className="py-2.5 px-3 text-right">Scope 3 (tCO₂e)</th>
                <th className="py-2.5 px-3 text-right">Intensity (t/Cr)</th>
                <th className="py-2.5 px-3 text-right">Turnover (Cr)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {displayedSites.map((site) => {
                const totalSiteScope12 = site.scope1 + site.scope2;
                const siteIntensity = calculateIntensity(totalSiteScope12, site.turnoverCr);
                return (
                  <tr key={site.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{site.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">{site.code}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-300">{site.division}</div>
                      <div className="text-[10px] text-slate-500">{site.state}, India</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-amber-300 font-medium">
                      {site.scope1.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-blue-300 font-medium">
                      {site.scope2.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-purple-300 font-medium">
                      {site.scope3.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                      {siteIntensity}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      ₹{site.turnoverCr.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          site.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : site.status === 'Submitted'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : site.status === 'In Review'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {site.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedSiteId(site.id);
                          setActiveModule('collection');
                          setActiveSubtab('scope-calculator');
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline"
                      >
                        Log Data
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
