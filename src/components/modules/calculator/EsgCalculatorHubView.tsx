import React, { useState, useMemo } from 'react';
import { useEsg } from '../../../context/EsgContext';
import { ScopeEmissionsLogger } from '../collection/ScopeEmissionsLogger';
import {
  Calculator,
  Flame,
  Zap,
  Truck,
  Sparkles,
  Droplets,
  Layers,
  TrendingDown,
  Gauge,
  Sliders,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Building2,
  Leaf,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Clock,
  Compass,
} from 'lucide-react';

export const EsgCalculatorHubView: React.FC = () => {
  const { sites, aggregatedMetrics, selectedSiteId, activeSubtab, setActiveSubtab } = useEsg();

  // Active Calculator Section Tab (synchronized with sidebar activeSubtab):
  const [internalSection, setInternalSection] = useState<
    'scope-emissions' | 'decarbonization' | 'water-stewardship' | 'embodied-materials' | 'intensity-benchmarks'
  >('scope-emissions');

  const activeCalcSection = useMemo(() => {
    if (activeSubtab === 'decarbonization-simulator') return 'decarbonization';
    if (activeSubtab === 'water-calculator') return 'water-stewardship';
    if (activeSubtab === 'material-embodied') return 'embodied-materials';
    if (activeSubtab === 'intensity-benchmarking') return 'intensity-benchmarks';
    if (activeSubtab === 'scope-emissions') return 'scope-emissions';
    return internalSection;
  }, [activeSubtab, internalSection]);

  const handleSelectSection = (
    sec: 'scope-emissions' | 'decarbonization' | 'water-stewardship' | 'embodied-materials' | 'intensity-benchmarks'
  ) => {
    setInternalSection(sec);
    if (sec === 'decarbonization') setActiveSubtab('decarbonization-simulator');
    else if (sec === 'water-stewardship') setActiveSubtab('water-calculator');
    else if (sec === 'embodied-materials') setActiveSubtab('material-embodied');
    else if (sec === 'intensity-benchmarks') setActiveSubtab('intensity-benchmarking');
    else setActiveSubtab('scope-emissions');
  };

  // ============================================================================
  // SECTION 2: DECARBONIZATION & ABATEMENT SIMULATOR STATE
  // ============================================================================
  const [dieselBaselineLiters, setDieselBaselineLiters] = useState<number>(3500000); // 3.5 Million Liters
  const [gridBaselineKwh, setGridBaselineKwh] = useState<number>(18500000); // 18.5 Million kWh
  const [solarPpaAdoptionPct, setSolarPpaAdoptionPct] = useState<number>(45); // 45% Solar PPA
  const [biodieselB20Pct, setBiodieselB20Pct] = useState<number>(30); // 30% Biodiesel replacement
  const [fleetElectrificationPct, setFleetElectrificationPct] = useState<number>(25); // 25% EV excavators
  const [internalCarbonPriceInr, setInternalCarbonPriceInr] = useState<number>(2400); // ₹2,400 per tCO2e

  // Decarbonization Computations
  const simBaselineScope1 = useMemo(() => (dieselBaselineLiters * 2.687) / 1000, [dieselBaselineLiters]);
  const simBaselineScope2 = useMemo(() => (gridBaselineKwh * 0.716) / 1000, [gridBaselineKwh]);
  const simBaselineTotal = useMemo(() => simBaselineScope1 + simBaselineScope2, [simBaselineScope1, simBaselineScope2]);

  // Abatement impacts
  // Biodiesel B20 saves ~18% net lifecycle carbon on the replaced portion
  const biodieselAbatement = useMemo(
    () => (simBaselineScope1 * (biodieselB20Pct / 100) * 0.18),
    [simBaselineScope1, biodieselB20Pct]
  );
  // Fleet electrification replaces diesel with green power (net ~70% saving)
  const electrificationAbatement = useMemo(
    () => (simBaselineScope1 * (fleetElectrificationPct / 100) * 0.70),
    [simBaselineScope1, fleetElectrificationPct]
  );
  // Solar PPA replaces 0.716 kg/kWh grid electricity with 0.000 kg/kWh solar
  const solarPpaAbatement = useMemo(
    () => (simBaselineScope2 * (solarPpaAdoptionPct / 100)),
    [simBaselineScope2, solarPpaAdoptionPct]
  );

  const totalCarbonAbatedTco2e = useMemo(
    () => Number((biodieselAbatement + electrificationAbatement + solarPpaAbatement).toFixed(1)),
    [biodieselAbatement, electrificationAbatement, solarPpaAbatement]
  );

  const abatedProjectedEmissions = useMemo(
    () => Number(Math.max(simBaselineTotal - totalCarbonAbatedTco2e, 0).toFixed(1)),
    [simBaselineTotal, totalCarbonAbatedTco2e]
  );

  const abatementPercentage = useMemo(
    () => (simBaselineTotal > 0 ? Number(((totalCarbonAbatedTco2e / simBaselineTotal) * 100).toFixed(1)) : 0),
    [totalCarbonAbatedTco2e, simBaselineTotal]
  );

  const statutoryFinancialSavingsLakhs = useMemo(
    () => Number(((totalCarbonAbatedTco2e * internalCarbonPriceInr) / 100000).toFixed(2)),
    [totalCarbonAbatedTco2e, internalCarbonPriceInr]
  );

  // ============================================================================
  // SECTION 3: WATER BALANCE & ZERO LIQUID DISCHARGE (ZLD) CALCULATOR STATE
  // ============================================================================
  const [surfaceWaterWithdrawalKl, setSurfaceWaterWithdrawalKl] = useState<number>(450000);
  const [groundWaterWithdrawalKl, setGroundWaterWithdrawalKl] = useState<number>(180000);
  const [thirdPartyWaterKl, setThirdPartyWaterKl] = useState<number>(45000);
  const [recycledTreatedWaterKl, setRecycledTreatedWaterKl] = useState<number>(550000);
  const [turnoverBaseCr, setTurnoverBaseCr] = useState<number>(1250);

  // Water Computations
  const totalWaterWithdrawalKl = useMemo(
    () => surfaceWaterWithdrawalKl + groundWaterWithdrawalKl + thirdPartyWaterKl,
    [surfaceWaterWithdrawalKl, groundWaterWithdrawalKl, thirdPartyWaterKl]
  );

  const totalWaterManagedKl = useMemo(
    () => totalWaterWithdrawalKl + recycledTreatedWaterKl,
    [totalWaterWithdrawalKl, recycledTreatedWaterKl]
  );

  const waterRecyclingRatePct = useMemo(
    () => (totalWaterManagedKl > 0 ? Number(((recycledTreatedWaterKl / totalWaterManagedKl) * 100).toFixed(1)) : 0),
    [recycledTreatedWaterKl, totalWaterManagedKl]
  );

  const waterIntensityKlPerCr = useMemo(
    () => (turnoverBaseCr > 0 ? Number((totalWaterWithdrawalKl / turnoverBaseCr).toFixed(1)) : 0),
    [totalWaterWithdrawalKl, turnoverBaseCr]
  );

  const waterNeutralityScore = useMemo(() => {
    const ratio = recycledTreatedWaterKl / (totalWaterWithdrawalKl || 1);
    if (ratio >= 0.9) return { rating: 'Positive / Net Zero Water Ready', color: 'text-emerald-400', badge: 'Tier A+' };
    if (ratio >= 0.7) return { rating: 'High Water Efficiency (ZLD Compliant)', color: 'text-teal-400', badge: 'Tier A' };
    if (ratio >= 0.5) return { rating: 'Moderate Efficiency (Recycling Active)', color: 'text-blue-400', badge: 'Tier B' };
    return { rating: 'High Freshwater Reliance (Improvement Required)', color: 'text-amber-400', badge: 'Tier C' };
  }, [recycledTreatedWaterKl, totalWaterWithdrawalKl]);

  // ============================================================================
  // SECTION 4: EMBODIED CARBON & MATERIAL LCA CALCULATOR STATE
  // ============================================================================
  const [virginSteelTonnes, setVirginSteelTonnes] = useState<number>(4500); // BF-BOF route
  const [greenRecycledSteelTonnes, setGreenRecycledSteelTonnes] = useState<number>(2200); // EAF route
  const [opcCementTonnes, setOpcCementTonnes] = useState<number>(12000); // High clinker
  const [pscSlagCementTonnes, setPscSlagCementTonnes] = useState<number>(18000); // Low clinker slag
  const [hotMixAsphaltTonnes, setHotMixAsphaltTonnes] = useState<number>(8500); // Bitumen

  // Embodied Carbon Factors (EPD standard)
  // BF-BOF Steel: 2.15 tCO2e/T, EAF Green Steel: 0.68 tCO2e/T
  // OPC Cement: 0.86 tCO2e/T, PSC Cement: 0.42 tCO2e/T
  // Asphalt: 0.052 tCO2e/T
  const steelEmbodiedCo2e = useMemo(
    () => virginSteelTonnes * 2.15 + greenRecycledSteelTonnes * 0.68,
    [virginSteelTonnes, greenRecycledSteelTonnes]
  );

  const cementEmbodiedCo2e = useMemo(
    () => opcCementTonnes * 0.86 + pscSlagCementTonnes * 0.42,
    [opcCementTonnes, pscSlagCementTonnes]
  );

  const asphaltEmbodiedCo2e = useMemo(
    () => hotMixAsphaltTonnes * 0.052,
    [hotMixAsphaltTonnes]
  );

  const totalEmbodiedCo2e = useMemo(
    () => Number((steelEmbodiedCo2e + cementEmbodiedCo2e + asphaltEmbodiedCo2e).toFixed(1)),
    [steelEmbodiedCo2e, cementEmbodiedCo2e, asphaltEmbodiedCo2e]
  );

  // Carbon Avoided via Green Materials Substitution
  // Baseline without green materials:
  const baselineSteelCo2e = useMemo(() => (virginSteelTonnes + greenRecycledSteelTonnes) * 2.15, [virginSteelTonnes, greenRecycledSteelTonnes]);
  const baselineCementCo2e = useMemo(() => (opcCementTonnes + pscSlagCementTonnes) * 0.86, [opcCementTonnes, pscSlagCementTonnes]);
  const baselineMaterialCo2e = useMemo(() => baselineSteelCo2e + baselineCementCo2e + asphaltEmbodiedCo2e, [baselineSteelCo2e, baselineCementCo2e, asphaltEmbodiedCo2e]);

  const avoidedEmbodiedCo2e = useMemo(
    () => Number(Math.max(baselineMaterialCo2e - totalEmbodiedCo2e, 0).toFixed(1)),
    [baselineMaterialCo2e, totalEmbodiedCo2e]
  );

  const greenMaterialRatioPct = useMemo(() => {
    const totalMat = virginSteelTonnes + greenRecycledSteelTonnes + opcCementTonnes + pscSlagCementTonnes;
    const greenMat = greenRecycledSteelTonnes + pscSlagCementTonnes;
    return totalMat > 0 ? Number(((greenMat / totalMat) * 100).toFixed(1)) : 0;
  }, [virginSteelTonnes, greenRecycledSteelTonnes, opcCementTonnes, pscSlagCementTonnes]);

  // ============================================================================
  // SECTION 5: SECTORAL INTENSITY & PHYSICAL BENCHMARK CALCULATOR STATE
  // ============================================================================
  const [projectSector, setProjectSector] = useState<'roads' | 'tunnel' | 'solar' | 'hydro' | 'water'>('roads');
  const [sectorOutputUnits, setSectorOutputUnits] = useState<number>(140); // 140 km
  const [sectorScope12Co2e, setSectorScope12Co2e] = useState<number>(24500); // 24,500 tCO2e
  const [sectorCapexCr, setSectorCapexCr] = useState<number>(1850); // ₹1,850 Cr

  const physicalIntensity = useMemo(() => {
    if (sectorOutputUnits <= 0) return 0;
    return Number((sectorScope12Co2e / sectorOutputUnits).toFixed(1));
  }, [sectorScope12Co2e, sectorOutputUnits]);

  const economicIntensity = useMemo(() => {
    if (sectorCapexCr <= 0) return 0;
    return Number((sectorScope12Co2e / sectorCapexCr).toFixed(2));
  }, [sectorScope12Co2e, sectorCapexCr]);

  const sectorBenchmarkComparison = useMemo(() => {
    switch (projectSector) {
      case 'roads':
        return {
          unitLabel: 'tCO₂e / km of Highway',
          benchmarkVal: 210.0,
          status: physicalIntensity <= 210.0 ? 'Top Quartile (Cleaner than NHAI Avg)' : 'Above Average Intensity',
          isSuperior: physicalIntensity <= 210.0,
        };
      case 'tunnel':
        return {
          unitLabel: 'tCO₂e / km of Underground Tunnel',
          benchmarkVal: 480.0,
          status: physicalIntensity <= 480.0 ? 'Leading Standard (Optimized TBM / Cryo)' : 'Elevated Energy Requirement',
          isSuperior: physicalIntensity <= 480.0,
        };
      case 'solar':
        return {
          unitLabel: 'tCO₂e / MW Solar Farm Installed',
          benchmarkVal: 16.5,
          status: physicalIntensity <= 16.5 ? 'Ultra-Clean Solar Farm Benchmark' : 'Above Average Site Logistics',
          isSuperior: physicalIntensity <= 16.5,
        };
      case 'hydro':
        return {
          unitLabel: 'tCO₂e / MW Hydro Power Dam',
          benchmarkVal: 38.0,
          status: physicalIntensity <= 38.0 ? 'Eco-Hydro Design Benchmark' : 'High Concrete Footprint',
          isSuperior: physicalIntensity <= 38.0,
        };
      case 'water':
        return {
          unitLabel: 'tCO₂e / MLD Water Capacity Treated',
          benchmarkVal: 3.2,
          status: physicalIntensity <= 3.2 ? 'High-Efficiency ZLD Pump Standard' : 'Higher Pump Energy Usage',
          isSuperior: physicalIntensity <= 3.2,
        };
    }
  }, [projectSector, physicalIntensity]);

  return (
    <div className="space-y-6">
      {/* TOP HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span className="text-emerald-400 font-semibold">MEIL ESG Engine</span>
              <span>·</span>
              <span>Multi-Dimensional Carbon, Water & Material Computation Station</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                DEFRA 2024 / CEA v20 Master Factors Active
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>ESG Carbon & Sustainability Calculator Hub</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Interactive calculators for Scope 1-2-3 emissions, net-zero decarbonization abatement, water balance ZLD stewardship, embodied infrastructure materials, and sectoral intensity benchmarking.
            </p>
          </div>

          {/* Section Segmented Navigation Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs flex-wrap">
            <button
              onClick={() => handleSelectSection('scope-emissions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeCalcSection === 'scope-emissions'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>1. Scope 1, 2, 3 Emissions</span>
            </button>

            <button
              onClick={() => handleSelectSection('decarbonization')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeCalcSection === 'decarbonization'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>2. Decarbonization & Abatement</span>
            </button>

            <button
              onClick={() => handleSelectSection('water-stewardship')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeCalcSection === 'water-stewardship'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-300" />
              <span>3. Water Balance & ZLD</span>
            </button>

            <button
              onClick={() => handleSelectSection('embodied-materials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeCalcSection === 'embodied-materials'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>4. Embodied Carbon (EPD)</span>
            </button>

            <button
              onClick={() => handleSelectSection('intensity-benchmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeCalcSection === 'intensity-benchmarks'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-teal-300" />
              <span>5. Sectoral Benchmarks</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: SCOPE 1, 2, 3 EMISSION ACTIVITY LOGGING & CALCULATOR
          ========================================================================= */}
      {activeCalcSection === 'scope-emissions' && (
        <div className="space-y-4">
          <ScopeEmissionsLogger />
        </div>
      )}

      {/* =========================================================================
          SECTION 2: NET-ZERO DECARBONIZATION & CARBON ABATEMENT SIMULATOR
          ========================================================================= */}
      {activeCalcSection === 'decarbonization' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Transition Sliders & Levers (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Decarbonization & Abatement Levers Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Model transition pathways, fuel switching, green PPA adoption, and statutory carbon cost savings
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                  Target: 2030 Net-Zero Pathway
                </span>
              </div>

              {/* Baseline Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Annual Baseline Diesel Consumption (Liters)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={dieselBaselineLiters}
                    onChange={(e) => setDieselBaselineLiters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Scope 1 Baseline: {simBaselineScope1.toLocaleString()} tCO₂e
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Annual Baseline Grid Electricity (kWh)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={gridBaselineKwh}
                    onChange={(e) => setGridBaselineKwh(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Scope 2 Baseline: {simBaselineScope2.toLocaleString()} tCO₂e
                  </span>
                </div>
              </div>

              {/* Decarbonization Levers (Sliders) */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                {/* Lever 1: Solar PPA Adoption */}
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Green Power Purchase Agreement (Solar PPA) Adoption</span>
                    </span>
                    <span className="font-mono text-blue-400 font-bold">{solarPpaAdoptionPct}% PPA</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={solarPpaAdoptionPct}
                    onChange={(e) => setSolarPpaAdoptionPct(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Replaces 0.716 kg/kWh Grid Power with 0.000 kg/kWh Solar PPA</span>
                    <span className="font-mono text-blue-300 font-bold">
                      -{solarPpaAbatement.toLocaleString()} tCO₂e Abated
                    </span>
                  </div>
                </div>

                {/* Lever 2: Biodiesel (B20/B100) Replacement */}
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Biodiesel (B20 / B100 Blends) Substitution in Excavator Fleet</span>
                    </span>
                    <span className="font-mono text-amber-400 font-bold">{biodieselB20Pct}% Substituted</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={biodieselB20Pct}
                    onChange={(e) => setBiodieselB20Pct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Lowers lifecycle fuel carbon via ISCC certified biofuel</span>
                    <span className="font-mono text-amber-300 font-bold">
                      -{biodieselAbatement.toLocaleString()} tCO₂e Abated
                    </span>
                  </div>
                </div>

                {/* Lever 3: Fleet Electrification */}
                <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Heavy Excavation & Utility Vehicle Electrification</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{fleetElectrificationPct}% Electric</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fleetElectrificationPct}
                    onChange={(e) => setFleetElectrificationPct(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Replaces heavy diesel engines with zero tailpipe emission drives</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      -{electrificationAbatement.toLocaleString()} tCO₂e Abated
                    </span>
                  </div>
                </div>

                {/* Lever 4: Internal Carbon Price */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-300 font-semibold block">Internal Corporate Shadow Carbon Price</span>
                    <span className="text-[10px] text-slate-500">Used for project NPV & statutory liability avoidance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">₹</span>
                    <input
                      type="number"
                      step="100"
                      value={internalCarbonPriceInr}
                      onChange={(e) => setInternalCarbonPriceInr(Number(e.target.value))}
                      className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-right font-bold"
                    />
                    <span className="text-[10px] text-slate-400">/ tCO₂e</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Abatement Outputs & ROI Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Abatement Output & Savings
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Net Abatement: {abatementPercentage}%
                  </span>
                </div>

                {/* Large Carbon Abated Box */}
                <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-center space-y-1">
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
                    Total Avoided Carbon Emissions
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-emerald-300">
                    {totalCarbonAbatedTco2e.toLocaleString()}{' '}
                    <span className="text-base font-sans font-normal text-emerald-400">tCO₂e / yr</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    Reduces annual footprint from {simBaselineTotal.toLocaleString()} t down to{' '}
                    <strong className="text-white">{abatedProjectedEmissions.toLocaleString()} tCO₂e</strong>
                  </span>
                </div>

                {/* Financial Savings Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Internal Carbon Cost Saved:</span>
                    <span className="font-mono text-emerald-400 font-bold text-base">
                      ₹{statutoryFinancialSavingsLakhs.toLocaleString()} Lakhs / yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Equivalent Carbon Credits Value:</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      {(totalCarbonAbatedTco2e).toLocaleString()} C-Credits
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                    <span className="text-slate-400">SEBI BRSR Core Decarbonization Score:</span>
                    <span className="font-bold text-emerald-400">Top Decile (Industry Leader)</span>
                  </div>
                </div>

                {/* Progress Bar towards 2030 MEIL Net-Zero Target */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Alignment with 2030 45% Carbon Abatement Target:</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      {Math.min(Math.round((abatementPercentage / 45) * 100), 100)}% on track
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${Math.min((abatementPercentage / 45) * 100, 100)}%` }}
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: WATER BALANCE & ZERO LIQUID DISCHARGE (ZLD) CALCULATOR
          ========================================================================= */}
      {activeCalcSection === 'water-stewardship' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Water Inputs (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>Water Balance, Withdrawal & Zero Liquid Discharge (ZLD) Calculator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculates surface vs groundwater withdrawals, recycling efficiency, and specific water consumption
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  SEBI Principle 6 Indicator 3
                </span>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    (i) Surface Water Withdrawal (River / Reservoir) (KL)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={surfaceWaterWithdrawalKl}
                    onChange={(e) => setSurfaceWaterWithdrawalKl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Irrigation Canals, Godavari/Krishna River</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    (ii) Ground Water Extraction (Borewells) (KL)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={groundWaterWithdrawalKl}
                    onChange={(e) => setGroundWaterWithdrawalKl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">CGWA NOC permitted site wells</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    (iii) Third-Party Municipal / Tanker Supply (KL)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={thirdPartyWaterKl}
                    onChange={(e) => setThirdPartyWaterKl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500 font-semibold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">External industrial water supply</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    (iv) Recycled & Reused Water (STP / ETP / Settling) (KL)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={recycledTreatedWaterKl}
                    onChange={(e) => setRecycledTreatedWaterKl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Batching washouts & dust suppression reuse</span>
                </div>
              </div>

              {/* Revenue base for intensity */}
              <div className="pt-3 border-t border-slate-800 text-xs">
                <label className="block text-slate-300 font-medium mb-1">
                  Project Turnover / Base Revenue (₹ Crores)
                </label>
                <input
                  type="number"
                  step="50"
                  value={turnoverBaseCr}
                  onChange={(e) => setTurnoverBaseCr(Number(e.target.value))}
                  className="w-48 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Right: Water Balance Outputs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Water Balance & ZLD KPI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {waterNeutralityScore.badge}
                  </span>
                </div>

                {/* Big Water Recycling Metric */}
                <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-700/60 text-center space-y-1">
                  <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider block">
                    Water Recycled Proportion Rate
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-cyan-300">
                    {waterRecyclingRatePct}%
                  </div>
                  <span className={`text-[11px] font-semibold block pt-1 ${waterNeutralityScore.color}`}>
                    {waterNeutralityScore.rating}
                  </span>
                </div>

                {/* Breakdown List */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Gross Withdrawal:</span>
                    <span className="font-mono text-white font-bold">{totalWaterWithdrawalKl.toLocaleString()} KL</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Total Water Treated & Reused:</span>
                    <span className="font-mono text-cyan-300 font-bold">{recycledTreatedWaterKl.toLocaleString()} KL</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Water Consumption Intensity:</span>
                    <span className="font-mono text-emerald-400 font-bold">{waterIntensityKlPerCr} KL / ₹ Cr</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-slate-400">Zero Liquid Discharge (ZLD) Compliance:</span>
                    <span className="font-bold text-emerald-400">100% (Batching Effluent Sealed)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: EMBODIED CARBON & MATERIAL LCA CALCULATOR
          ========================================================================= */}
      {activeCalcSection === 'embodied-materials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Materials Inputs (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Embodied Infrastructure Material Carbon (EPD LCA) Calculator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    EPD carbon coefficients for reinforcement steel, low-clinker slag cement, and bitumen mixes
                  </p>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  ISO 14025 / EN 15804 EPDs
                </span>
              </div>

              {/* Steel Mix */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-slate-200 block">1. Structural & Reinforcement Steel Mix</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Primary BF-BOF Steel (Tonnes) [2.15 tCO₂e/T]</label>
                    <input
                      type="number"
                      step="100"
                      value={virginSteelTonnes}
                      onChange={(e) => setVirginSteelTonnes(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Green EAF Recycled Steel (Tonnes) [0.68 tCO₂e/T]</label>
                    <input
                      type="number"
                      step="100"
                      value={greenRecycledSteelTonnes}
                      onChange={(e) => setGreenRecycledSteelTonnes(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-emerald-300 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Cement Mix */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-slate-200 block">2. Concrete Cementitious Binder Mix</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Ordinary Portland Cement (OPC) [0.86 tCO₂e/T]</label>
                    <input
                      type="number"
                      step="500"
                      value={opcCementTonnes}
                      onChange={(e) => setOpcCementTonnes(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Portland Slag (PSC) / Fly-Ash [0.42 tCO₂e/T]</label>
                    <input
                      type="number"
                      step="500"
                      value={pscSlagCementTonnes}
                      onChange={(e) => setPscSlagCementTonnes(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-emerald-300 font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Asphalt / Bitumen */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block">3. Pavement Bitumen & Hot-Mix Asphalt</span>
                <div>
                  <label className="block text-slate-400 mb-1">Hot-Mix Asphalt Quantity (Tonnes) [0.052 tCO₂e/T]</label>
                  <input
                    type="number"
                    step="500"
                    value={hotMixAsphaltTonnes}
                    onChange={(e) => setHotMixAsphaltTonnes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Right: Embodied Carbon Outputs (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Material Embodied Impact
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                    Scope 3 Cat 1
                  </span>
                </div>

                {/* Big Embodied Metric */}
                <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-700/60 text-center space-y-1">
                  <span className="text-[11px] text-purple-400 font-semibold uppercase tracking-wider block">
                    Net Embodied Carbon Footprint
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-purple-300">
                    {totalEmbodiedCo2e.toLocaleString()}{' '}
                    <span className="text-base font-sans font-normal text-purple-400">tCO₂e</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold block pt-1">
                    ✓ Avoided {avoidedEmbodiedCo2e.toLocaleString()} tCO₂e via Slag & Recycled Steel Substitution
                  </span>
                </div>

                {/* Breakdown List */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Steel Embodied Carbon:</span>
                    <span className="font-mono text-white font-bold">{steelEmbodiedCo2e.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Cement Embodied Carbon:</span>
                    <span className="font-mono text-white font-bold">{cementEmbodiedCo2e.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Asphalt Embodied Carbon:</span>
                    <span className="font-mono text-white font-bold">{asphaltEmbodiedCo2e.toLocaleString()} tCO₂e</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-slate-400">Green Material Substitution Ratio:</span>
                    <span className="font-mono text-emerald-400 font-bold">{greenMaterialRatioPct}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: SECTORAL INTENSITY & PHYSICAL BENCHMARK CALCULATOR
          ========================================================================= */}
      {activeCalcSection === 'intensity-benchmarks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Sector Parameters (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-teal-400" />
                    <span>Sectoral Physical Intensity & National Benchmark Calculator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Compare project emissions per physical output unit against national statutory norms
                  </p>
                </div>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                  NHAI / CEA / CPCB Benchmarks
                </span>
              </div>

              {/* Sector Selection */}
              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-medium">Select Infrastructure Vertical</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'roads', label: 'Highways & Roads (km)' },
                    { id: 'tunnel', label: 'Underground Tunnels (km)' },
                    { id: 'solar', label: 'Solar Parks (MW)' },
                    { id: 'hydro', label: 'Hydro Power Dams (MW)' },
                    { id: 'water', label: 'Urban Water Plants (MLD)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setProjectSector(s.id as any)}
                      className={`p-2.5 rounded-lg border text-left font-semibold transition ${
                        projectSector === s.id
                          ? 'bg-teal-950/80 border-teal-500 text-teal-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Output Units ({projectSector === 'roads' || projectSector === 'tunnel' ? 'km' : projectSector === 'solar' || projectSector === 'hydro' ? 'MW' : 'MLD'})
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={sectorOutputUnits}
                    onChange={(e) => setSectorOutputUnits(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Gross Scope 1+2 Emissions (tCO₂e)
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={sectorScope12Co2e}
                    onChange={(e) => setSectorScope12Co2e(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Project Capex / Turnover (₹ Cr)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={sectorCapexCr}
                    onChange={(e) => setSectorCapexCr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Right: Benchmark Output Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Benchmark Comparison Result
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${sectorBenchmarkComparison.isSuperior ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
                    {sectorBenchmarkComparison.isSuperior ? 'Outperforming' : 'Baseline'}
                  </span>
                </div>

                {/* Big Physical Intensity */}
                <div className="p-5 rounded-xl bg-teal-950/40 border border-teal-700/60 text-center space-y-1">
                  <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider block">
                    Calculated Physical Intensity
                  </span>
                  <div className="text-4xl font-extrabold font-mono text-teal-300">
                    {physicalIntensity.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400 block pt-1">
                    {sectorBenchmarkComparison.unitLabel}
                  </span>
                </div>

                {/* Benchmark Comparison Table */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Industry / Statutory Benchmark:</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      {sectorBenchmarkComparison.benchmarkVal} {sectorBenchmarkComparison.unitLabel.split('/')[1]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Financial Revenue Intensity:</span>
                    <span className="font-mono text-emerald-400 font-bold">{economicIntensity} tCO₂e / ₹ Cr</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-slate-400">Statutory Performance Tier:</span>
                    <span className={`font-bold ${sectorBenchmarkComparison.isSuperior ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {sectorBenchmarkComparison.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
