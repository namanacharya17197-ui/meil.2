import React, { useState, useMemo } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  Zap,
  Truck,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
  Search,
} from 'lucide-react';

interface OutlierAlert {
  id: string;
  siteCode: string;
  siteName: string;
  division: string;
  metric: string;
  variancePct: number;
  direction: 'SURGE' | 'DROP';
  explanation: string;
  thresholdRule: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export const CustomAnalyticsOutlierDashboard: React.FC = () => {
  const { sites, aggregatedMetrics, selectedCycle } = useEsg();

  // Filters State
  const [selectedFy, setSelectedFy] = useState<string>('FY 2024-25');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('ALL');

  // Dismissed / Investigated alerts state
  const [investigatedAlerts, setInvestigatedAlerts] = useState<Record<string, boolean>>({});

  // Outlier Rules Detection System (>25% MoM variance or >2x SD)
  const outlierAlerts: OutlierAlert[] = useMemo(() => {
    return [
      {
        id: 'outlier-1',
        siteCode: 'Site #042',
        siteName: 'Polavaram Multi-Purpose Irrigation Project',
        division: 'Hydro & Irrigation',
        metric: 'Scope 1 High-Speed Diesel',
        variancePct: 34.2,
        direction: 'SURGE',
        explanation: 'Diesel consumption surged 34.2% MoM due to 24/7 unmetered dewatering pump fleet during Godavari River spate alert.',
        thresholdRule: '>25% MoM Variance Rule (Detected +34.2%)',
        severity: 'CRITICAL',
      },
      {
        id: 'outlier-2',
        siteCode: 'Site #108',
        siteName: 'Zojila Pass High-Altitude Tunnel Reach-2',
        division: 'Transport & Tunnels',
        metric: 'Scope 2 High-Tension Grid Power',
        variancePct: 28.5,
        direction: 'SURGE',
        explanation: 'Electricity consumption spiked 28.5% MoM due to sub-zero cryogenic rock freeze ventilation systems.',
        thresholdRule: '>25% MoM Variance Rule (Detected +28.5%)',
        severity: 'HIGH',
      },
      {
        id: 'outlier-3',
        siteCode: 'Site #089',
        siteName: 'Kaleshwaram Lift Irrigation Package-8',
        division: 'Hydro & Irrigation',
        metric: 'Scope 2 Dedicated 400kV Pumping Substation',
        variancePct: 31.0,
        direction: 'SURGE',
        explanation: 'High-head surge pumping operations exceeded monthly baseline by 31.0% (>2.1 standard deviations above BU mean).',
        thresholdRule: '>2 Standard Deviations Rule (Z-Score = 2.41)',
        severity: 'CRITICAL',
      },
      {
        id: 'outlier-4',
        siteCode: 'Site #204',
        siteName: 'Ananthapuramu Ultra Mega Solar Park',
        division: 'Power & Solar',
        metric: 'Scope 1 Diesel Utility Transport',
        variancePct: -26.4,
        direction: 'DROP',
        explanation: 'Mobile fleet fuel dropped 26.4% MoM after full transition of site inspection vans to electric utility buggies.',
        thresholdRule: '>25% MoM Efficiency Variance (-26.4%)',
        severity: 'MEDIUM',
      },
    ];
  }, []);

  // Filtered sites based on division
  const filteredSites = useMemo(() => {
    if (selectedDivision === 'ALL') return sites;
    return sites.filter((s) => s.division === selectedDivision);
  }, [sites, selectedDivision]);

  // Aggregate metrics adjusted by filters
  const metrics = useMemo(() => {
    const s1 = filteredSites.reduce((acc, s) => acc + s.scope1, 0);
    const s2 = filteredSites.reduce((acc, s) => acc + s.scope2, 0);
    const s3 = filteredSites.reduce((acc, s) => acc + s.scope3, 0);
    const total = s1 + s2 + s3;
    const turnover = filteredSites.reduce((acc, s) => acc + s.turnoverCr, 0);
    const intensity = turnover > 0 ? Number(((s1 + s2) / turnover).toFixed(2)) : 0;
    return { s1, s2, s3, total, turnover, intensity };
  }, [filteredSites]);

  // Scope Donut Percentage Calculation
  const scope1Pct = metrics.total > 0 ? Number(((metrics.s1 / metrics.total) * 100).toFixed(1)) : 28.4;
  const scope2Pct = metrics.total > 0 ? Number(((metrics.s2 / metrics.total) * 100).toFixed(1)) : 22.3;
  const scope3Pct = metrics.total > 0 ? Number(((metrics.s3 / metrics.total) * 100).toFixed(1)) : 49.3;

  // Monthly Stacked Trend Data (Apr to Mar)
  const monthlyData = [
    { month: 'Apr', s1: 4200, s2: 3100, s3: 6500 },
    { month: 'May', s1: 4500, s2: 3400, s3: 7100 },
    { month: 'Jun', s1: 4800, s2: 3200, s3: 7400 },
    { month: 'Jul', s1: 3900, s2: 2900, s3: 5800 },
    { month: 'Aug', s1: 3700, s2: 3000, s3: 5900 },
    { month: 'Sep', s1: 5200, s2: 3800, s3: 8200 },
    { month: 'Oct', s1: 5400, s2: 3900, s3: 8500 },
    { month: 'Nov', s1: 5100, s2: 3700, s3: 8100 },
    { month: 'Dec', s1: 4900, s2: 3600, s3: 7900 },
    { month: 'Jan', s1: 4700, s2: 3500, s3: 7600 },
    { month: 'Feb', s1: 4600, s2: 3400, s3: 7400 },
    { month: 'Mar', s1: 5600, s2: 4100, s3: 8900 },
  ];

  const maxMonthTotal = Math.max(...monthlyData.map((d) => d.s1 + d.s2 + d.s3));

  // Top 10 Emitting Sites (Ranked)
  const top10Sites = useMemo(() => {
    return [...sites]
      .sort((a, b) => b.scope1 + b.scope2 + b.scope3 - (a.scope1 + a.scope2 + a.scope3))
      .slice(0, 10);
  }, [sites]);

  const maxSiteEmissions = top10Sites[0]
    ? top10Sites[0].scope1 + top10Sites[0].scope2 + top10Sites[0].scope3
    : 100000;

  return (
    <div className="space-y-6">
      {/* FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="text-emerald-400 font-semibold">Step 5 & Feature 5</span>
              <span>·</span>
              <span>Statutory Telemetry Analytics & Outlier Engine</span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Custom Analytics, Intensity Benchmarks & Outlier Radar</span>
            </h2>
          </div>

          {/* Filters Controls */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Financial Year */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedFy}
                onChange={(e) => setSelectedFy(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="FY 2024-25" className="bg-slate-900">FY 2024-25 (Current)</option>
                <option value="FY 2023-24" className="bg-slate-900">FY 2023-24 (Prior)</option>
                <option value="FY 2022-23" className="bg-slate-900">FY 2022-23 (Baseline)</option>
              </select>
            </div>

            {/* Business Unit / Division */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Business Units (300 Sites)</option>
                <option value="Hydro & Irrigation" className="bg-slate-900">Hydro & Irrigation</option>
                <option value="Transport & Tunnels" className="bg-slate-900">Transport & Tunnels</option>
                <option value="Energy & Hydrocarbons" className="bg-slate-900">Energy & Hydrocarbons</option>
                <option value="Power & Solar" className="bg-slate-900">Power & Solar</option>
                <option value="Water & Urban" className="bg-slate-900">Water & Urban</option>
              </select>
            </div>

            {/* Fuel / Emission Type */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Fuels & Scopes</option>
                <option value="HSD" className="bg-slate-900">High-Speed Diesel (Scope 1)</option>
                <option value="Grid" className="bg-slate-900">CEA Grid Power (Scope 2)</option>
                <option value="Embodied" className="bg-slate-900">Steel & Cement (Scope 3)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* OUTLIER & ANOMALY DETECTION ALERT BANNER (>25% MoM / >2 SD) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Automated Outlier Detection Radar (MoM &gt;25% &amp; &gt;2x Standard Deviation)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
            {outlierAlerts.filter((a) => !investigatedAlerts[a.id]).length} Active Outliers Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {outlierAlerts.map((alert) => {
            const isInvestigated = investigatedAlerts[alert.id];
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isInvestigated
                    ? 'bg-slate-950/50 border-slate-800 opacity-60'
                    : alert.severity === 'CRITICAL'
                    ? 'bg-red-950/20 border-red-800/60 shadow-sm'
                    : 'bg-amber-950/20 border-amber-800/60 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-slate-200">
                      {alert.siteCode} • {alert.siteName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        alert.direction === 'SURGE'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {alert.direction === 'SURGE' ? `+${alert.variancePct}% MoM` : `${alert.variancePct}% MoM`}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-2">
                    <span className="text-slate-300 font-semibold">{alert.metric}</span>
                    <span className="text-slate-500 ml-1">({alert.division})</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                    {alert.explanation}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono text-[10px]">{alert.thresholdRule}</span>
                  <button
                    onClick={() =>
                      setInvestigatedAlerts((prev) => ({ ...prev, [alert.id]: !prev[alert.id] }))
                    }
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {isInvestigated ? '✓ Marked Investigated' : 'Acknowledge & Flag'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMPARATIVE INTENSITY BENCHMARKING CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Economic Intensity: tCO2e / Cr */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 uppercase font-semibold">BRSR Core Economic Intensity</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {metrics.intensity} <span className="text-xs font-normal text-slate-400">tCO₂e / ₹ Cr</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Total Scope 1+2 per Crore of Revenue ({metrics.turnover.toLocaleString()} Cr base)
          </div>
        </div>

        {/* Physical Infrastructure Benchmark: Roads & Tunnels (tCO2e / km) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-blue-400 uppercase font-semibold">Linear Infrastructure Intensity</div>
          <div className="text-2xl font-extrabold font-mono text-blue-300">
            184.2 <span className="text-xs font-normal text-slate-400">tCO₂e / km</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Highways & Underground Tunnels (Industry Avg: 215.0 tCO₂e/km)
          </div>
        </div>

        {/* Renewable Generation Benchmark: Solar & Hydro (tCO2e / MW) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-amber-400 uppercase font-semibold">Clean Power Generation Benchmark</div>
          <div className="text-2xl font-extrabold font-mono text-amber-300">
            12.8 <span className="text-xs font-normal text-slate-400">tCO₂e / MW</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Hydro & Solar Farm Installed Capacity (Megha Solar / Hydro Parks)
          </div>
        </div>

        {/* Water Treatment Benchmark: Urban Water (tCO2e / MLD) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-1">
          <div className="text-xs text-cyan-400 uppercase font-semibold">Urban Water Treatment Intensity</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-300">
            2.4 <span className="text-xs font-normal text-slate-400">tCO₂e / MLD</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Million Liters per Day Treated & Piped (ZLD Compliant)
          </div>
        </div>
      </div>

      {/* INTERACTIVE VISUALIZATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: SCOPE 1 VS 2 VS 3 BREAKDOWN DONUT CHART (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scope 1, 2, 3 Footprint Donut</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Proportional GHG Protocol breakdown</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {metrics.total.toLocaleString()} tCO₂e
            </span>
          </div>

          {/* Donut Graphic (SVG Responsive) */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="16" />
                {/* Scope 1 Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="16"
                  strokeDasharray={`${scope1Pct * 2.387} 238.7`}
                  strokeDashoffset="0"
                />
                {/* Scope 2 Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="16"
                  strokeDasharray={`${scope2Pct * 2.387} 238.7`}
                  strokeDashoffset={`-${scope1Pct * 2.387}`}
                />
                {/* Scope 3 Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="16"
                  strokeDasharray={`${scope3Pct * 2.387} 238.7`}
                  strokeDashoffset={`-${(scope1Pct + scope2Pct) * 2.387}`}
                />
              </svg>

              {/* Donut Center Display */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Net</span>
                <span className="text-sm font-extrabold text-white font-mono">
                  {metrics.total > 1000 ? `${(metrics.total / 1000).toFixed(1)}k` : metrics.total}
                </span>
                <span className="text-[9px] text-emerald-400">tCO₂e</span>
              </div>
            </div>

            {/* Legend & Percentages */}
            <div className="w-full mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-slate-300 font-medium">Scope 1 (Fuels & Fleet)</span>
                </div>
                <div className="font-mono text-amber-300 font-bold">
                  {scope1Pct}% <span className="text-[10px] text-slate-400">({metrics.s1.toLocaleString()} t)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-300 font-medium">Scope 2 (CEA Grid Power)</span>
                </div>
                <div className="font-mono text-blue-300 font-bold">
                  {scope2Pct}% <span className="text-[10px] text-slate-400">({metrics.s2.toLocaleString()} t)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-slate-300 font-medium">Scope 3 (Supply Chain)</span>
                </div>
                <div className="font-mono text-purple-300 font-bold">
                  {scope3Pct}% <span className="text-[10px] text-slate-400">({metrics.s3.toLocaleString()} t)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 2: MONTHLY EMISSIONS TREND STACKED BAR CHART (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Monthly Emissions Trend Stacked Bar Chart ({selectedFy})</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Seasonal consumption variation across Scope 1, Scope 2, and Scope 3
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span> Scope 1
              </span>
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span> Scope 2
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block"></span> Scope 3
              </span>
            </div>
          </div>

          {/* Stacked Bars Graphic */}
          <div className="h-60 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-slate-800">
            {monthlyData.map((d) => {
              const total = d.s1 + d.s2 + d.s3;
              const heightPct = Math.round((total / maxMonthTotal) * 100);
              const s1Pct = Math.round((d.s1 / total) * 100);
              const s2Pct = Math.round((d.s2 / total) * 100);
              const s3Pct = 100 - s1Pct - s2Pct;

              return (
                <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition mb-1">
                    {(total / 1000).toFixed(1)}k
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[28px] rounded-t flex flex-col-reverse overflow-hidden transition-all duration-300 group-hover:brightness-110"
                  >
                    <div style={{ height: `${s1Pct}%` }} className="bg-amber-500 w-full" title={`Scope 1: ${d.s1} t`}></div>
                    <div style={{ height: `${s2Pct}%` }} className="bg-blue-500 w-full" title={`Scope 2: ${d.s2} t`}></div>
                    <div style={{ height: `${s3Pct}%` }} className="bg-purple-600 w-full" title={`Scope 3: ${d.s3} t`}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-2 font-medium">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Peak Month: March (Financial year closure construction acceleration)</span>
            <span>Trough Month: August (Monsoon season activity stabilization)</span>
          </div>
        </div>
      </div>

      {/* CHART 3: TOP 10 EMITTING SITES RANKING (Horizontal Bars) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top 10 GHG Emitting Sites Ranking (~300 Sites Benchmarked)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sites requiring focused decarbonization initiatives under MEIL Net-Zero roadmap
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Analyzed: {sites.length} Sites</span>
        </div>

        <div className="space-y-3">
          {top10Sites.map((site, idx) => {
            const siteTotal = site.scope1 + site.scope2 + site.scope3;
            const barWidthPct = Math.round((siteTotal / maxSiteEmissions) * 100);

            return (
              <div key={site.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[11px] font-mono font-bold text-slate-500">#{idx + 1}</span>
                    <span className="font-semibold text-slate-200">{site.name}</span>
                    <span className="text-[10px] text-slate-400">({site.division} • {site.state})</span>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold text-xs">
                    {siteTotal.toLocaleString()}{' '}
                    <span className="text-[10px] font-normal text-slate-400">tCO₂e</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${barWidthPct}%` }}
                    className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
