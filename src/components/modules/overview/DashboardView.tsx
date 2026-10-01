import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  TrendingDown,
  Droplets,
  HardHat,
  Award,
  Zap,
  Leaf,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeSite,
    aggregatedMetrics,
    selectedCycle,
    setActiveModule,
    setActiveSubtab,
    sites,
    setSelectedSiteId,
  } = useEsg();

  const [activeEmissionTab, setActiveEmissionTab] = useState<'all' | 'scope1' | 'scope2' | 'scope3'>('all');

  const {
    totalScope1,
    totalScope2,
    totalScope3,
    totalScope123,
    totalTurnoverCr,
    intensityTco2ePerCr,
    avgWaterRecycledPct,
    avgLtifr,
    siteCount,
    approvedCount,
    pendingCount,
  } = aggregatedMetrics;

  const scope1Pct = Math.round((totalScope1 / (totalScope123 || 1)) * 100);
  const scope2Pct = Math.round((totalScope2 / (totalScope123 || 1)) * 100);
  const scope3Pct = 100 - scope1Pct - scope2Pct;

  // Monthly trend data for FY 2024-25
  const monthlyData = [
    { month: 'Apr', s1: 11.2, s2: 4.8, s3: 54.0, target: 72 },
    { month: 'May', s1: 12.0, s2: 5.1, s3: 58.0, target: 73 },
    { month: 'Jun', s1: 13.5, s2: 5.4, s3: 62.0, target: 74 },
    { month: 'Jul', s1: 12.8, s2: 5.2, s3: 59.0, target: 73 },
    { month: 'Aug', s1: 11.9, s2: 5.0, s3: 55.0, target: 72 },
    { month: 'Sep', s1: 12.4, s2: 5.3, s3: 57.0, target: 71 },
    { month: 'Oct', s1: 13.1, s2: 5.6, s3: 60.0, target: 72 },
    { month: 'Nov', s1: 12.7, s2: 5.2, s3: 58.0, target: 70 },
    { month: 'Dec', s1: 13.6, s2: 5.5, s3: 63.0, target: 71 },
    { month: 'Jan', s1: 11.8, s2: 4.9, s3: 53.0, target: 69 },
    { month: 'Feb', s1: 10.5, s2: 4.6, s3: 49.0, target: 68 },
    { month: 'Mar', s1: 10.9, s2: 4.8, s3: 50.1, target: 67 },
  ];

  const maxVal = 85;

  return (
    <div className="space-y-6">
      {/* Top Banner / Active Entity Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>MEIL ESG Governance Hub</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">{selectedCycle}</span>
              <span>·</span>
              <span>SEBI BRSR Core Circular Compliant</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {activeSite ? `${activeSite.name} (${activeSite.code})` : 'Consolidated Group ESG Overview'}
              {activeSite ? (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  {activeSite.division}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800">
                  25 Mega Infrastructure Sites Ingested
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Real-time carbon telemetry, water circularity in sensitive basins, occupational safety metrics, and automated statutory SEBI BRSR Core assurance tracking under ISAE 3000.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveModule('copilot');
                setActiveSubtab('narratives');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Synthesis</span>
            </button>
            <button
              onClick={() => {
                setActiveModule('assurance');
                setActiveSubtab('report-generator');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>SEBI Report & XBRL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross GHG Emissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Total GHG Footprint</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums">
              {(totalScope123 / 1000).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-medium">kt CO₂e</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Scope 1: <strong className="text-white">{(totalScope1 / 1000).toFixed(1)}k</strong> · Scope 2: <strong className="text-white">{(totalScope2 / 1000).toFixed(1)}k</strong>
            </span>
            <span className="text-emerald-400 flex items-center font-semibold">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              -6.8% YoY
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden flex">
            <div style={{ width: `${scope1Pct}%` }} className="bg-amber-500 h-full" title={`Scope 1: ${scope1Pct}%`} />
            <div style={{ width: `${scope2Pct}%` }} className="bg-sky-500 h-full" title={`Scope 2: ${scope2Pct}%`} />
            <div style={{ width: `${scope3Pct}%` }} className="bg-emerald-500 h-full" title={`Scope 3: ${scope3Pct}%`} />
          </div>
        </div>

        {/* KPI 2: GHG Intensity per INR Cr */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">BRSR Carbon Intensity</span>
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums">
              {intensityTco2ePerCr}
            </span>
            <span className="text-xs text-slate-400 font-medium">tCO₂e / ₹ Cr Turnover</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Baseline: <strong className="text-white">4.50</strong> · Target: <strong className="text-white">&lt;4.00</strong>
            </span>
            <span className="text-emerald-400 flex items-center font-semibold">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              -8.4%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, (intensityTco2ePerCr / 5) * 100)}%` }} />
          </div>
        </div>

        {/* KPI 3: Water Recycled & Reused */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Water Recycled %</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-300 tabular-nums">
              {avgWaterRecycledPct}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Zero Liquid Discharge</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Infiltration & Slurry Treatment
            </span>
            <span className="text-emerald-400 flex items-center font-semibold">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +5.5% vs FY24
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${avgWaterRecycledPct}%` }} />
          </div>
        </div>

        {/* KPI 4: Safety & LTIFR */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Safety LTIFR (per 1M Hrs)</span>
            <HardHat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300 tabular-nums">
              {avgLtifr}
            </span>
            <span className="text-xs text-slate-400 font-medium">Global Benchmark &lt; 0.50</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Toolbox Hours: <strong className="text-white">420,000+</strong>
            </span>
            <span className="text-emerald-400 flex items-center font-semibold">
              Zero Fatalities
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, avgLtifr * 200)}%` }} />
          </div>
        </div>
      </div>

      {/* Chart Section: Monthly Trajectory & Scope Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Emissions & Target Trajectory */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Monthly GHG Emissions Trajectory (kt CO₂e)
              </h2>
              <p className="text-xs text-slate-400">
                FY 2024–25 monthly telemetry vs. statutory decarbonization glidepath
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs">
              <button
                onClick={() => setActiveEmissionTab('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeEmissionTab === 'all'
                    ? 'bg-slate-700 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Scopes
              </button>
              <button
                onClick={() => setActiveEmissionTab('scope1')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeEmissionTab === 'scope1'
                    ? 'bg-amber-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scope 1
              </button>
              <button
                onClick={() => setActiveEmissionTab('scope2')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeEmissionTab === 'scope2'
                    ? 'bg-sky-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scope 2
              </button>
              <button
                onClick={() => setActiveEmissionTab('scope3')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeEmissionTab === 'scope3'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scope 3
              </button>
            </div>
          </div>

          {/* Custom Responsive SVG Chart */}
          <div className="h-64 w-full relative flex flex-col justify-end pt-6">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-slate-600 w-full" />
              <div className="border-b border-slate-600 w-full" />
              <div className="border-b border-slate-600 w-full" />
              <div className="border-b border-slate-600 w-full" />
            </div>

            {/* Bars container */}
            <div className="relative flex items-end justify-between h-48 gap-2 z-10 px-2">
              {monthlyData.map((d) => {
                const s1Height = (d.s1 / maxVal) * 100;
                const s2Height = (d.s2 / maxVal) * 100;
                const s3Height = (d.s3 / maxVal) * 100;
                const totalMonth = d.s1 + d.s2 + d.s3;

                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-slate-950 border border-slate-700 text-slate-100 text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <strong>{d.month}</strong>: {totalMonth.toFixed(1)} kt (S1: {d.s1}k, S2: {d.s2}k, S3: {d.s3}k)
                    </div>

                    {/* Stacked bar */}
                    <div className="w-full max-w-[28px] flex flex-col-reverse rounded-t overflow-hidden bg-slate-800/40">
                      {(activeEmissionTab === 'all' || activeEmissionTab === 'scope1') && (
                        <div
                          style={{ height: `${s1Height * 1.8}%` }}
                          className="w-full bg-amber-500 transition-all hover:bg-amber-400"
                          title={`Scope 1: ${d.s1} kt`}
                        />
                      )}
                      {(activeEmissionTab === 'all' || activeEmissionTab === 'scope2') && (
                        <div
                          style={{ height: `${s2Height * 1.8}%` }}
                          className="w-full bg-sky-500 transition-all hover:bg-sky-400"
                          title={`Scope 2: ${d.s2} kt`}
                        />
                      )}
                      {(activeEmissionTab === 'all' || activeEmissionTab === 'scope3') && (
                        <div
                          style={{ height: `${s3Height * 1.8}%` }}
                          className="w-full bg-emerald-500 transition-all hover:bg-emerald-400"
                          title={`Scope 3: ${d.s3} kt`}
                        />
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400 mt-2 font-medium">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Scope 1 (Direct Fuel)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Scope 2 (Grid Electricity)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Scope 3 (Supply Chain & Steel)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Formula: DEFRA 2024 / CEA v20</span>
          </div>
        </div>

        {/* Right Col: Scope Distribution Ring & Statutory Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight mb-1">
              Scope Composition & Audit Readiness
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Consolidated emission boundary breakdown
            </p>

            <div className="space-y-4">
              {/* Scope 1 bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Scope 1 (Direct Operations)</span>
                  <span className="text-amber-400 font-bold">{scope1Pct}% · {(totalScope1 / 1000).toFixed(1)}k t</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${scope1Pct}%` }} />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Heavy earthmoving fleet, captive DG sets, tunnel ventilation</div>
              </div>

              {/* Scope 2 bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Scope 2 (Purchased Electricity)</span>
                  <span className="text-sky-400 font-bold">{scope2Pct}% · {(totalScope2 / 1000).toFixed(1)}k t</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${scope2Pct}%` }} />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">33kV grid substations, pump houses (CEA 0.716 kg CO2e/kWh)</div>
              </div>

              {/* Scope 3 bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Scope 3 (Value Chain / Embodied)</span>
                  <span className="text-emerald-400 font-bold">{scope3Pct}% · {(totalScope3 / 1000).toFixed(1)}k t</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${scope3Pct}%` }} />
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">TMT structural steel, low-carbon slag cement, heavy freight haulage</div>
              </div>
            </div>
          </div>

          {/* Submission and Approval Progress Tile */}
          <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-950/40 p-3 rounded-lg">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">Site Assurance Sign-Off</span>
              <span className="text-emerald-400 font-bold">
                {approvedCount} / {siteCount} Sites Approved
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${(approvedCount / siteCount) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{pendingCount} Pending Independent Review</span>
              <button
                onClick={() => {
                  setActiveModule('assurance');
                  setActiveSubtab('approvals');
                }}
                className="text-emerald-400 hover:underline flex items-center font-medium"
              >
                Open Workflow <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Mega Projects Quick Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Flagship Infrastructure Mega Projects (Live Ingestion Status)
            </h2>
            <p className="text-xs text-slate-400">
              Select any project to focus reporting context and telemetry
            </p>
          </div>
          <button
            onClick={() => {
              setActiveModule('overview');
              setActiveSubtab('gis-map');
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>View All on GIS Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sites.slice(0, 6).map((site) => (
            <div
              key={site.id}
              onClick={() => setSelectedSiteId(site.id)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                activeSite?.id === site.id
                  ? 'bg-emerald-950/40 border-emerald-600/80 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{site.code}</span>
                    <span>·</span>
                    <span>{site.state}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-0.5 truncate max-w-[200px]">
                    {site.name}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    site.status === 'Approved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : site.status === 'In Review'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-sky-950 text-sky-300 border border-sky-800'
                  }`}
                >
                  {site.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Scope 1+2</span>
                  <span className="font-bold text-slate-200">
                    {site.scope1 + site.scope2} t
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Water Recycled</span>
                  <span className="font-bold text-cyan-300">{site.waterRecycledPct}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Progress</span>
                  <span className="font-bold text-emerald-400">{site.completionPct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
