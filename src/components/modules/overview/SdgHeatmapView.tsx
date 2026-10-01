import React from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  Droplets,
  Sun,
  HardHat,
  Leaf,
  Layers,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';

export const SdgHeatmapView: React.FC = () => {
  const { setActiveModule, setActiveSubtab } = useEsg();

  const sdgGoals = [
    {
      number: 6,
      name: 'Clean Water and Sanitation',
      color: 'bg-cyan-600',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/30',
      icon: Droplets,
      brsrPrinciple: 'Principle 6 (Environment & Natural Resources)',
      kpi: '64.2% Water Recycled across all sites',
      target: '75.0% by FY 2026',
      progressPct: 85,
      impact: 'Zero liquid discharge at Kaleshwaram pump houses; treated 1.4M kL slurry water at Polavaram.',
      capexAllocated: '₹ 145 Cr',
    },
    {
      number: 7,
      name: 'Affordable and Clean Energy',
      color: 'bg-yellow-600',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/40',
      bgColor: 'bg-yellow-950/30',
      icon: Sun,
      brsrPrinciple: 'Principle 2 (Product Lifecycle) & Principle 6',
      kpi: '1,200 MW Bikaner Ultra Mega Solar commissioned',
      target: '3,500 MW Renewable Portfolio',
      progressPct: 92,
      impact: 'Avoided 1.8M tCO₂e annual grid emissions; installed 18MW captive rooftop and microgrids.',
      capexAllocated: '₹ 3,420 Cr',
    },
    {
      number: 9,
      name: 'Industry, Innovation and Infrastructure',
      color: 'bg-orange-600',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/40',
      bgColor: 'bg-orange-950/30',
      icon: Layers,
      brsrPrinciple: 'Principle 2 (Sustainable Infrastructure)',
      kpi: 'Zojila All-Weather Corridor (14.15 km)',
      target: '100% BIM & Low-Carbon Slag Concrete',
      progressPct: 78,
      impact: 'Reduces transit time across Zojila Pass from 3.5 hours to 15 minutes, slashing freight idling emissions.',
      capexAllocated: '₹ 6,800 Cr',
    },
    {
      number: 13,
      name: 'Climate Action',
      color: 'bg-emerald-600',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/30',
      icon: Leaf,
      brsrPrinciple: 'Principle 6 (GHG Intensity & Transition Plan)',
      kpi: '4.12 tCO₂e / ₹ Cr Carbon Intensity',
      target: '<3.80 tCO₂e / ₹ Cr by 2030 (Net Zero 2045)',
      progressPct: 88,
      impact: 'SEBI BRSR Core verified Scope 1, 2, 3 disclosures with CEA and DEFRA baseline factors.',
      capexAllocated: '₹ 410 Cr',
    },
    {
      number: 8,
      name: 'Decent Work and Economic Growth',
      color: 'bg-rose-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/30',
      icon: HardHat,
      brsrPrinciple: 'Principle 3 (Employee & Contractor Well-being)',
      kpi: '0.14 LTIFR (Zero Fatalities)',
      target: 'Vision Zero & 100% Certified Safety',
      progressPct: 96,
      impact: '100% health & accident insurance for 60,000+ direct & contractual site personnel.',
      capexAllocated: '₹ 85 Cr',
    },
    {
      number: 12,
      name: 'Responsible Consumption and Production',
      color: 'bg-amber-600',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/30',
      icon: Award,
      brsrPrinciple: 'Principle 8 (Local Sourcing & Value Chain)',
      kpi: '71.8% Local Procurement within 50km',
      target: '75.0% Sustainable SCM Standard',
      progressPct: 84,
      impact: '100% fly ash and blast furnace slag utilization in dam and embankment backfilling.',
      capexAllocated: '₹ 220 Cr',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span>United Nations Sustainable Development Goals (SDG) Heatmap</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Alignment of MEIL infrastructure mega assets against UN 2030 Agenda and statutory SEBI BRSR Core Principles.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveModule('copilot');
              setActiveSubtab('gap-analysis');
            }}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Audit Alignment Gaps
          </button>
        </div>
      </div>

      {/* Grid of SDGs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sdgGoals.map((sdg) => {
          const Icon = sdg.icon;
          return (
            <div
              key={sdg.number}
              className={`border rounded-xl p-5 relative overflow-hidden transition-all hover:scale-[1.01] ${sdg.bgColor} ${sdg.borderColor}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-lg ${sdg.color} flex items-center justify-center text-white font-extrabold text-lg shadow-md`}
                  >
                    {sdg.number}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      SDG {sdg.number}: {sdg.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {sdg.brsrPrinciple}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Primary Metric (FY 2024-25)
                  </span>
                  <span className={`font-bold text-sm ${sdg.textColor}`}>
                    {sdg.kpi}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Target Glidepath: {sdg.target}</span>
                    <span className="font-bold text-white">{sdg.progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${sdg.progressPct}%` }}
                      className={`h-full rounded-full ${sdg.color}`}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 mt-2">
                  <strong className="text-white block mb-0.5">Operational Footprint:</strong>
                  {sdg.impact}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Cumulative Capex: <strong className="text-white">{sdg.capexAllocated}</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Assured Ready
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
