import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  Cpu,
  BarChart3,
  Network,
  ShieldAlert,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ChevronRight,
  Zap,
  Droplets,
  HardHat,
} from 'lucide-react';
import { CustomAnalyticsOutlierDashboard } from './CustomAnalyticsOutlierDashboard';

export const AnalyticsEngineView: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    selectedSiteId,
    sites,
    aggregatedMetrics,
    anomalies,
    updateAnomalyStatus,
    setActiveModule,
    addAuditLog,
    currentRole,
  } = useEsg();

  const currentSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  // Interactive Live Calculation Simulator State
  const [calcDieselLiters, setCalcDieselLiters] = useState(250000); // 250,000 L
  const [calcGridKwh, setCalcGridKwh] = useState(600000); // 600,000 kWh
  const [calcRenewablePct, setCalcRenewablePct] = useState(25); // 25% Green PPA
  const [calcSteelTonnes, setCalcSteelTonnes] = useState(150); // 150 Tonnes TMT Rebar

  // Factors: DEFRA HSD: 2.687 kg/L, CEA Grid: 0.716 kg/kWh, Steel: 1980 kg/T
  const simScope1 = Number(((calcDieselLiters * 2.687) / 1000).toFixed(1));
  const gridFactorLocation = 0.716;
  const simScope2Location = Number(((calcGridKwh * gridFactorLocation) / 1000).toFixed(1));
  const simScope2Market = Number((((calcGridKwh * (1 - calcRenewablePct / 100)) * gridFactorLocation) / 1000).toFixed(1));
  const simScope3 = Number(((calcSteelTonnes * 1980) / 1000).toFixed(1));
  const simTotalScope123 = Number((simScope1 + simScope2Market + simScope3).toFixed(1));

  // Anomaly investigation modal / explanation state
  const [selectedAnomalyForAi, setSelectedAnomalyForAi] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const handleRunAiAnomalyExplainer = async (anomaly: (typeof anomalies)[0]) => {
    setSelectedAnomalyForAi(anomaly.id);
    setAiGenerating(true);
    setAiExplanation(null);

    try {
      const res = await fetch('/api/ai/anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: anomaly.siteName,
          metric: anomaly.metric,
          variance: `${anomaly.variancePct}%`,
          previousValue: anomaly.previousValue,
          currentValue: anomaly.currentValue,
          probableCause: anomaly.probableCause,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.text || 'Analysis completed.');
      updateAnomalyStatus(anomaly.id, 'Investigating', data.text);
    } catch (err) {
      console.error(err);
      setAiExplanation('Fallback Analysis: Significant deviation detected. Request verified pump dispensing calibration certificate and SAP gate receipts within 48 hours.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>MEIL GHG & Statutory Telemetry Engine</span>
              <span>·</span>
              <span>DEFRA 2024 / CEA v20 Standard Compliant</span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>ESG Analytics & Carbon Computation Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live factor modeling, SEBI BRSR Core intensity indicators, multi-tier meter consolidation, and automated anomaly radar.
            </p>
          </div>

          {/* Subtab Segmented Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveSubtab('outlier-analytics')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors shrink-0 ${
                activeSubtab === 'outlier-analytics' || !['emission-engine', 'brsr-attributes', 'drilldown', 'anomaly-radar'].includes(activeSubtab)
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Analytics & Outlier Radar
            </button>
            <button
              onClick={() => setActiveSubtab('emission-engine')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 ${
                activeSubtab === 'emission-engine'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Calculation & Simulator
            </button>
            <button
              onClick={() => setActiveSubtab('brsr-attributes')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 ${
                activeSubtab === 'brsr-attributes'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BRSR Core 9 Intensities
            </button>
            <button
              onClick={() => setActiveSubtab('drilldown')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 ${
                activeSubtab === 'drilldown'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Level Drill-Down
            </button>
            <button
              onClick={() => setActiveSubtab('anomaly-radar')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                activeSubtab === 'anomaly-radar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Anomaly Radar</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 5: CUSTOM ANALYTICS, INTENSITY BENCHMARKING & OUTLIER DETECTION */}
      {(activeSubtab === 'outlier-analytics' || !['emission-engine', 'brsr-attributes', 'drilldown', 'anomaly-radar'].includes(activeSubtab)) && (
        <CustomAnalyticsOutlierDashboard />
      )}

      {/* 1. EMISSION ENGINE & INTERACTIVE CALCULATOR */}
      {activeSubtab === 'emission-engine' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls: Left 2 Cols */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Scope 1, 2, 3 GHG Computation Engine</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Simulate fuel shifts, equipment electrification, or Green Power PPA adoption in real-time.
                </p>
              </div>
              <button
                onClick={() => {
                  setCalcDieselLiters(250000);
                  setCalcGridKwh(600000);
                  setCalcRenewablePct(25);
                  setCalcSteelTonnes(150);
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Baseline</span>
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Slider 1: Diesel */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    High Speed Diesel (Scope 1 Fleet & DG Sets)
                  </label>
                  <span className="font-mono text-white font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {calcDieselLiters.toLocaleString()} Liters
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="10000"
                  value={calcDieselLiters}
                  onChange={(e) => setCalcDieselLiters(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Factor: 2.687 kg CO₂e/L (DEFRA 2024)</span>
                  <span className="text-amber-400 font-bold">{simScope1} tCO₂e</span>
                </div>
              </div>

              {/* Slider 2: Electricity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    Grid Electricity Consumption (Scope 2)
                  </label>
                  <span className="font-mono text-white font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {calcGridKwh.toLocaleString()} kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="3000000"
                  step="50000"
                  value={calcGridKwh}
                  onChange={(e) => setCalcGridKwh(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>CEA Baseline: 0.716 kg CO₂e/kWh</span>
                  <span className="text-sky-400 font-bold">{simScope2Location} tCO₂e (Location-based)</span>
                </div>
              </div>

              {/* Slider 3: Renewable PPA % */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                    Green Energy Open Access / Renewable PPA Proportion
                  </label>
                  <span className="font-mono text-teal-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {calcRenewablePct}% Renewable
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={calcRenewablePct}
                  onChange={(e) => setCalcRenewablePct(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>GHG Protocol Scope 2 Market-Based Rule</span>
                  <span className="text-teal-400 font-bold">{simScope2Market} tCO₂e (Market-based)</span>
                </div>
              </div>

              {/* Slider 4: Structural Steel (Scope 3) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Purchased Structural Steel TMT Rebar (Scope 3 Cat 1)
                  </label>
                  <span className="font-mono text-white font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {calcSteelTonnes.toLocaleString()} Metric Tonnes
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={calcSteelTonnes}
                  onChange={(e) => setCalcSteelTonnes(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Cradle-to-gate Factor: 1,980 kg CO₂e/T (DEFRA 2024)</span>
                  <span className="text-emerald-400 font-bold">{simScope3} tCO₂e</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Card: Right 1 Col */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                Real-Time GHG Engine Output
              </span>
              <h3 className="text-base font-bold text-white mb-4">
                Statutory Emissions Ledger
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 mb-0.5">Scope 1 (Direct Fuel)</div>
                  <div className="text-xl font-black text-amber-400 font-mono">
                    {simScope1.toLocaleString()} <span className="text-xs text-slate-400 font-sans">tCO₂e</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 mb-0.5">Scope 2 (Market-based)</div>
                  <div className="text-xl font-black text-sky-400 font-mono">
                    {simScope2Market.toLocaleString()} <span className="text-xs text-slate-400 font-sans">tCO₂e</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Location-based: {simScope2Location.toLocaleString()} tCO₂e ({calcRenewablePct}% avoided)
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 mb-0.5">Scope 3 (Cat 1 Steel Rebar)</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {simScope3.toLocaleString()} <span className="text-xs text-slate-400 font-sans">tCO₂e</span>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-br from-emerald-950/60 to-slate-950 rounded-xl border border-emerald-700/60">
                  <div className="text-xs text-emerald-300 font-semibold mb-0.5">Total Modeled Carbon Footprint</div>
                  <div className="text-2xl font-black text-white font-mono">
                    {simTotalScope123.toLocaleString()} <span className="text-xs text-slate-400 font-sans">tCO₂e</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModule('copilot');
                setActiveSubtab('narratives');
              }}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Synthesize AI Variance Narrative</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. BRSR CORE 9 ATTRIBUTES & INTENSITY COMPUTATION */}
      {activeSubtab === 'brsr-attributes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase">GHG Intensity (Core 1)</span>
              <div className="text-2xl font-extrabold text-white mt-1">
                {aggregatedMetrics.intensityTco2ePerCr} <span className="text-xs text-slate-400 font-normal">tCO₂e / ₹ Cr</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 flex items-center">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                -8.4% reduction vs FY 2023-24 (4.50)
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase">Water Recycled % (Core 2)</span>
              <div className="text-2xl font-extrabold text-cyan-300 mt-1">
                {aggregatedMetrics.avgWaterRecycledPct}% <span className="text-xs text-slate-400 font-normal">Recycled Proportion</span>
              </div>
              <div className="text-[11px] text-cyan-400 mt-2">
                100% Zero Liquid Discharge on 21 of 25 sites
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <span className="text-slate-400 text-xs font-semibold uppercase">Occupational LTIFR (Core 3)</span>
              <div className="text-2xl font-extrabold text-amber-300 mt-1">
                {aggregatedMetrics.avgLtifr} <span className="text-xs text-slate-400 font-normal">per 1M Man-Hours</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 font-semibold">
                Zero Fatalities Across 60,000+ Workers
              </div>
            </div>
          </div>

          {/* Statutory formula reference card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">
              SEBI BRSR Core Circular Attribute Formulas & Methodology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-emerald-400 block">Attribute 1: GHG Intensity</strong>
                <p className="text-slate-400 text-[11px]">
                  Formula: <code>(Scope 1 [tCO₂e] + Scope 2 [tCO₂e]) ÷ Total Turnover [₹ Crore]</code>
                </p>
                <p className="text-slate-500 text-[10px]">
                  Requires third-party assurance of fuel meter logs & electricity billing meters.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <strong className="text-cyan-400 block">Attribute 2: Water Intensity</strong>
                <p className="text-slate-400 text-[11px]">
                  Formula: <code>Total Water Consumed (Withdrawal - Discharge) [kL] ÷ Turnover [₹ Crore]</code>
                </p>
                <p className="text-slate-500 text-[10px]">
                  Mandatory surface vs groundwater source segregation per SEBI P6.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-LEVEL CONSOLIDATION & DRILL-DOWN */}
      {activeSubtab === 'drilldown' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Multi-Level Carbon Telemetry Drill-Down
            </h2>
            <p className="text-xs text-slate-400">
              Interactive consolidation drilling from Group apex down to project divisions, site reaches, and telemetry meters.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Level 0 */}
            <div className="p-3 bg-slate-950 border border-emerald-600 rounded-lg flex items-center justify-between text-white font-bold">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">[LEVEL 0]</span>
                <span>MEIL Group Consolidated Apex (SEBI Reporting Entity)</span>
              </div>
              <span className="text-emerald-400">
                {(aggregatedMetrics.totalScope123 / 1000).toFixed(1)}k tCO₂e
              </span>
            </div>

            {/* Level 1: Divisions */}
            <div className="pl-6 space-y-2 border-l-2 border-slate-800 ml-4">
              <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-sky-400">[DIV 1]</span>
                  <span>Hydro & Irrigation Division (Polavaram, Kaleshwaram, Kundah)</span>
                </div>
                <span className="text-sky-400 font-bold">186,400 tCO₂e</span>
              </div>

              {/* Level 2: Sites under Hydro */}
              <div className="pl-6 space-y-1.5 border-l-2 border-slate-800 ml-4">
                <div className="p-2 bg-slate-950 border border-slate-800/80 rounded flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">[SITE #042]</span>
                    <span>Polavaram Multi-Purpose Dam Works</span>
                  </div>
                  <span className="text-amber-400">32,700 tCO₂e (Scope 1+2)</span>
                </div>

                {/* Level 3: Meters / Equipment */}
                <div className="pl-6 space-y-1 border-l-2 border-slate-800 ml-4 text-[11px] text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span>Meter #POL-DG-01: Caterpillar 2000kVA Heavy DG Unit #1</span>
                    <span className="text-slate-200">12,400 tCO₂e</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span>Meter #POL-GRID-02: 33kV Spillway Substation TSSPDCL Feeder</span>
                    <span className="text-slate-200">8,200 tCO₂e</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Meter #POL-FLEET-03: Komatsu Hydraulic Excavator Dispatch Batch #4</span>
                    <span className="text-slate-200">12,100 tCO₂e</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-sky-400">[DIV 2]</span>
                  <span>Transport & Strategic Tunnels Division (Zojila, WDFC, Char Dham)</span>
                </div>
                <span className="text-sky-400 font-bold">142,800 tCO₂e</span>
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-sky-400">[DIV 3]</span>
                  <span>Energy & Hydrocarbons EPC (Mongol Refinery, Cross-country Pipelines)</span>
                </div>
                <span className="text-sky-400 font-bold">174,000 tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DATA QUALITY & ANOMALY RADAR */}
      {activeSubtab === 'anomaly-radar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Automated Data Quality & Anomaly Radar</span>
              </h2>
              <p className="text-xs text-slate-400">
                Continuous pre-assurance engine scanning 25+ sites for &gt;20% MoM spikes, missing calibration certificates, and meter discrepancies.
              </p>
            </div>

            <div className="text-xs px-2.5 py-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-semibold">
              {anomalies.filter((a) => a.status === 'Open').length} Active Flags Requiring Auditor Attention
            </div>
          </div>

          <div className="space-y-4">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        anom.severity === 'HIGH'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {anom.severity} VARIANCE
                    </span>
                    <h3 className="text-sm font-bold text-white">{anom.siteName}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      anom.status === 'Open'
                        ? 'bg-rose-950/80 text-rose-300'
                        : anom.status === 'Investigating'
                        ? 'bg-sky-950/80 text-sky-300'
                        : 'bg-emerald-950/80 text-emerald-300'
                    }`}
                  >
                    Status: {anom.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Metric Flagged</span>
                    <span className="font-semibold text-white">{anom.metric}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Prior vs Reported</span>
                    <span className="font-mono text-slate-300">
                      {anom.previousValue} → <strong className="text-amber-400">{anom.currentValue}</strong>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Variance Shift</span>
                    <span className="font-mono font-bold text-rose-400">
                      {anom.variancePct > 0 ? `+${anom.variancePct}%` : `${anom.variancePct}%`}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Operational Cause:</strong> {anom.probableCause}
                </div>

                {anom.aiAnalysis && (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Independent Auditor AI Assessment</span>
                    </div>
                    <div className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                      {anom.aiAnalysis}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                  <span className="text-[11px] text-slate-500">Detected: {anom.detectedAt}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunAiAnomalyExplainer(anom)}
                      disabled={aiGenerating && selectedAnomalyForAi === anom.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {aiGenerating && selectedAnomalyForAi === anom.id
                          ? 'Analyzing Root Cause...'
                          : 'AI Root-Cause Explainer'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        updateAnomalyStatus(anom.id, 'Resolved');
                        addAuditLog({
                          user: 'K. V. Rao',
                          role: currentRole,
                          action: 'UPDATE',
                          entity: anom.siteName,
                          field: `Anomaly Cleared (${anom.metric})`,
                          oldValue: 'Open',
                          newValue: 'Resolved (Site Memo Stamped)',
                        });
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Clear Anomaly
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
