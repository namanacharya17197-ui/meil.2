import React from 'react';
import { useEsg } from '../../../context/EsgContext';
import { MeilLogo } from '../../common/MeilLogo';
import {
  ShieldCheck,
  Leaf,
  Globe,
  Award,
  Lock,
  ArrowRight,
  TrendingDown,
  Droplets,
  HardHat,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setActiveModule, setActiveSubtab, setIsGatewayOpen, setIsTourOpen } = useEsg();

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-center shadow-2xl">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Official MEIL Logo Showcase */}
          <div className="inline-block p-3 rounded-2xl bg-black/90 border border-slate-700/80 shadow-2xl shadow-black/80">
            <MeilLogo height={48} showText={true} />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs text-emerald-300 font-semibold shadow-inner block mx-auto w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SEBI BRSR Core Active · Statutory Assurance Ready (ISAE 3000)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            MEIL ESG CONNECT <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Enterprise Sustainability & Carbon Engine
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The statutory ESG reporting and carbon accounting nerve center for Megha Engineering & Infrastructures Limited. Powering decarbonization, water stewardship, and four-eyes assurance across 25+ national infrastructure mega projects.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveModule('overview');
                setActiveSubtab('dashboard');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all text-sm"
            >
              <span>Launch ESG Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGatewayOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all text-sm"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Enterprise Gateway / SSO</span>
            </button>
            <button
              onClick={() => setIsTourOpen(true)}
              className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Interactive Platform Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* Corporate Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-white tabular-nums">4.12</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            tCO₂e / ₹ Cr Turnover
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1">
            -8.4% YoY Intensity Reduction
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-cyan-300 tabular-nums">64.2%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            Water Recycled & Reused
          </div>
          <div className="text-[11px] text-cyan-400 font-bold mt-1">
            Zero Liquid Discharge Standards
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-amber-300 tabular-nums">0.14</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            Lost Time Injury Rate (LTIFR)
          </div>
          <div className="text-[11px] text-amber-400 font-bold mt-1">
            Zero Fatalities across 60k+ Workers
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-black text-emerald-400 tabular-nums">100%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">
            SEBI BRSR Core Assured
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1">
            ISAE 3000 Reasonable Assurance
          </div>
        </div>
      </div>

      {/* Three Pillars: Engineering, Governance, AI Copilot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">DEFRA & CEA Carbon Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automated carbon accounting applying India Central Electricity Authority (CEA v20) grid factors and DEFRA fuel factors across fuel dispensary meters, heavy excavators, and 33kV substations.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Four-Eyes Assurance & XBRL</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-tier statutory approval hierarchy with immutable audit logs, hash verification, and instant export to SEBI-compliant BRSR Core PDF reports and XBRL taxonomy files.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-700/60 flex items-center justify-center text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Gemini AI ESG Copilot</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Auto-synthesizes Director report narratives, explains root cause of &gt;20% data anomalies, verifies SEBI gap analysis, and enables conversational querying over enterprise telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
