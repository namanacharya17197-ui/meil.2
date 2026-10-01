import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Droplets,
  HardHat,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Download,
  FileText,
  Lock,
  Layers,
  Globe,
  Award,
  BarChart3,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ProjectSpotlight {
  id: string;
  name: string;
  state: string;
  category: string;
  description: string;
  capacity: string;
  dailyMetric: string;
  verification: string;
  brsrStatus: string;
  imageUrl: string;
  imageAlt: string;
}

const SPOTLIGHT_PROJECTS: Record<string, ProjectSpotlight> = {
  kaleshwaram: {
    id: 'kaleshwaram',
    name: 'Kaleshwaram Lift Irrigation (Gayatri Pumphouse)',
    state: 'Telangana, India',
    category: 'Water Infrastructure Flagship',
    description: "World's largest multi-stage lift irrigation system engineered to supply 2 TMC water daily for agriculture and drinking water across parched agrarian basins.",
    capacity: '7 x 139 MW Units',
    dailyMetric: '2.0 TMC / Day',
    verification: 'High Efficiency Standard',
    brsrStatus: 'P6 & P8 Assured',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDviEKmFDKfBjwFxsxXqrro6T2ZwB9I36s-AXHs67TaIkyFSz8wiDhtHXGh9LXRszswsNNrmie-O0Cu3cULNpTKQ8eKu3MkaT_6QlNByG3LSor3O2mSfHMyqJyzJlTOJR-NXwEd6hD5dA8Aqui7_W6sDA9yKEBDCU_dXvzG-RaUvB9HuaoCxHdRbYQxncbzyQkA78EvA9O0vCr2Jget2e8HvsXGDpUEOVOmpVdzmRYM70Wg0l08XkHhDg',
    imageAlt: 'Kaleshwaram Lift Irrigation Gayatri Pumphouse intake pipes discharging water into canal network flanked by hills',
  },
  zojila: {
    id: 'zojila',
    name: 'Zojila Strategic High-Altitude Tunnel',
    state: 'Jammu & Kashmir / Ladakh',
    category: 'Transportation & Defense Corridor',
    description: '14.15 km bi-directional tunnel at 11,578 feet, conquering extreme sub-zero avalanches to eliminate winter isolation for Ladakh civilians and defense forces.',
    capacity: '14.15 km Length',
    dailyMetric: 'Year-Round Access',
    verification: 'Border Roads Standards',
    brsrStatus: 'P2 & P3 Audited',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY4PHsWAsdSI4NmeW_gezIDi6aoqXn3tDh2idcPWQX3oU2fWhNfzOQncINMeriEl8nxWNwAeASSdD1tlfG0YI90vEehzbWF0kLeToS1r2Mni_bVBV-gGWv4g24_w_ogPm5gZvna27K9kUtqbpZxbS_yt1ALHbJJbGf4Pwmj9ep2SQ-p1mkMpGxMpeVdcdYwLkRZvYnVw9XqGj3Y63Rmh17XnQgBZ_5rcrLopudoqEWb2Ff_uCd01u1MQ',
    imageAlt: 'Zojila Tunnel portal in high Himalayan mountain range',
  },
  rajasthan: {
    id: 'rajasthan',
    name: 'Jal Jeevan Mission Rural Drinking Water Scheme',
    state: 'Rajasthan, India',
    category: 'Bulk Water Transmission',
    description: 'Comprehensive rural pipeline network delivering treated, fluoride-free potable water to 1,420 desert villages through automated solar-boosted pump stations.',
    capacity: '1,420 Villages',
    dailyMetric: '180 MLD Treated',
    verification: 'NABL Certified Water Quality',
    brsrStatus: 'P8 Community Value',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4LUrd6K37zUJ5oX9akI7mDJkBDtrTmeiRdDdu_jquLTR7I6D3aL04IWIaWt6C29WBQFvP09MCNUWv4oASwIkZgLo1MucokuRxmglxgpUUdnLrV5uvUshZ9Vlm-__zpUPln_8mzlf9SCdiQ3ieLfa7Z_r0RfJSeAq-ZZyqhywDrDc18-kAPu7Rg1N--qZjzxoZJ0Obj94IUkkYZNEwWwTrLXbp7gvESTbZo3tNSTT2T6lqxX5c2eBowQ',
    imageAlt: 'Rural drinking water treatment facility in Rajasthan village',
  },
  solar: {
    id: 'solar',
    name: 'Bhadla & Gujarat 400kV Solar Grid Integration',
    state: 'Rajasthan & Gujarat',
    category: 'Renewable Power & Substation',
    description: 'Single-axis tracking PV arrays synchronized to the national interstate transmission system with advanced SCADA telemetry and zero-tailpipe generation.',
    capacity: '750 MW Combined',
    dailyMetric: '4.2 GWh Clean Yield',
    verification: 'CEA Baseline Verified',
    brsrStatus: 'P6 Clean Energy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ua0817ke8b7lqlcSXR5y5s4S97fnrYrxJ2fYeiGGLKU5-uLtxkY-_W2-c37E7WEU2R45OllXzfV6BXuBoZSmHJimKFDyYLQdlQXqtVhjImqYN583VQW9m_WwfyqJzJgGAq7wx2JdgRMVSvLK1aWvI8-xbQYgk4z-J_8e5BifAe6ev_oySRh2UVDYqMBKsopgVk1ZiJqyIejKKfo16gw5cSBbnMS8bIXbjkx_4RmfqVgDfLWQKC889w',
    imageAlt: 'Utility scale solar farm substation with solar panels',
  },
  freight: {
    id: 'freight',
    name: 'Western Dedicated Freight Corridor (Package CTP-11)',
    state: 'Gujarat, India',
    category: 'Heavy Rail Freight',
    description: 'Electrified double-stack container freight corridor reducing logistics turnaround times and avoiding over 180,000 tCO2e of highway diesel freight emissions annually.',
    capacity: '25-Tonne Axle Load',
    dailyMetric: '100% Electrified',
    verification: 'Ministry of Railways Audit',
    brsrStatus: 'P2 Low-Carbon Transit',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY4PHsWAsdSI4NmeW_gezIDi6aoqXn3tDh2idcPWQX3oU2fWhNfzOQncINMeriEl8nxWNwAeASSdD1tlfG0YI90vEehzbWF0kLeToS1r2Mni_bVBV-gGWv4g24_w_ogPm5gZvna27K9kUtqbpZxbS_yt1ALHbJJbGf4Pwmj9ep2SQ-p1mkMpGxMpeVdcdYwLkRZvYnVw9XqGj3Y63Rmh17XnQgBZ_5rcrLopudoqEWb2Ff_uCd01u1MQ',
    imageAlt: 'Heavy haul freight rail corridor infrastructure',
  },
  refinery: {
    id: 'refinery',
    name: 'Mongol Green-Field Refinery EPC Package',
    state: 'Dornogovi, Mongolia',
    category: 'Hydrocarbons EPC',
    description: '1.5 MMTPA crude oil processing facility featuring captive wastewater recycle plants and modern desulfurization loops under international bilateral cooperation.',
    capacity: '1.5 MMTPA Crude',
    dailyMetric: '84% Water Recycled',
    verification: 'ISO 14001 Compliant',
    brsrStatus: 'P6 Environment',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDviEKmFDKfBjwFxsxXqrro6T2ZwB9I36s-AXHs67TaIkyFSz8wiDhtHXGh9LXRszswsNNrmie-O0Cu3cULNpTKQ8eKu3MkaT_6QlNByG3LSor3O2mSfHMyqJyzJlTOJR-NXwEd6hD5dA8Aqui7_W6sDA9yKEBDCU_dXvzG-RaUvB9HuaoCxHdRbYQxncbzyQkA78EvA9O0vCr2Jget2e8HvsXGDpUEOVOmpVdzmRYM70Wg0l08XkHhDg',
    imageAlt: 'Refinery infrastructure processing towers',
  },
};

export const LandingView: React.FC = () => {
  const {
    setActiveModule,
    setActiveSubtab,
    setIsGatewayOpen,
    setIsTourOpen,
    isAuthenticated,
    currentUser,
    setIsLoginModalOpen,
    logout,
  } = useEsg();

  // Interactive UI States
  const [activeDashboardTab, setActiveDashboardTab] = useState<'env' | 'soc' | 'gov' | 'summary'>('env');
  const [selectedHotspot, setSelectedHotspot] = useState<string>('kaleshwaram');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');

  const spotlight = SPOTLIGHT_PROJECTS[selectedHotspot] || SPOTLIGHT_PROJECTS.kaleshwaram;

  const navigateSecure = (module: string, subtab?: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setActiveModule(module);
    if (subtab) setActiveSubtab(subtab);
  };

  return (
    <div className="w-full bg-[#f8faf9] text-[#191c1c] font-sans antialiased overflow-x-hidden">
      {/* ============================================================================== */}
      {/* 0. ENTERPRISE ACCESS ANNOUNCEMENT RIBBON */}
      {/* ============================================================================== */}
      <div className="bg-[#0b1f33] text-slate-200 border-b border-slate-800 text-[11px] py-2 px-6 lg:px-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            ENTERPRISE ESG CONNECT READY
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Demo Account Pre-configured: <strong className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">cso@meilgroup.com</strong> · Password: <strong className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded">meil@2026</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-1 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 rounded-md"
            >
              <span>⚡ 1-Click Sign In (CSO / Admin)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-300">
                Logged in as: <strong className="text-emerald-400">{currentUser?.name}</strong> ({currentUser?.role})
              </span>
              <button
                onClick={() => logout()}
                className="text-rose-400 hover:text-rose-300 font-semibold underline text-xs ml-2 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================================== */}
      {/* 1. TOP CORPORATE STICKY HEADER */}
      {/* ============================================================================== */}
      <header className="sticky top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#c4c6cd]/50 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-[76px] w-full max-w-[1680px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-4">
          {/* Logo & Corporate Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              alt="Official MEIL Corporate Brand Logo"
              className="h-11 w-auto max-w-[220px] object-contain cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAr5lNKDPcVohmt_GZsmYqRT1Rum9LsMvfrdUrofJTVE4cJkSWnUeFkOszB4tgWYd680FCKM3L0NTwuP4OtOEVmq5zJVwBKOfKox_tF9k-wl1jndPxtbQAg1lXG8nlyPYBPVkBgRwGmXC1GPf52ESfFzZVw2PurBi-lfyu1wY8LIZAnU-mFUuH-ZGi9VwIOmztutlyApF8NX2FP2hWnjiL41V5OzblftjIarcAryR6GxeFIaSwG9otbCsRSKCggedJ2oI"
              onClick={() => {
                setActiveModule('overview');
                setActiveSubtab('hero-landing');
              }}
            />
            <div className="h-6 w-px bg-[#c4c6cd]/70 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#44474c] font-bold">
                ESG &amp; IMPACT
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#346385] font-semibold">
                INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6 text-[13px] font-semibold uppercase tracking-wider text-[#44474c]">
            <a
              href="#hero"
              className="text-[#00050e] font-bold border-b-2 border-[#00050e] pb-1 transition-colors"
            >
              Home
            </a>
            <a href="#about-meil" className="hover:text-[#00050e] transition-colors py-2">
              About
            </a>
            <a href="#business-sectors" className="hover:text-[#00050e] transition-colors py-2">
              Businesses
            </a>
            <a href="#projects" className="hover:text-[#00050e] transition-colors py-2">
              Projects
            </a>
            <a href="#esg-glance" className="hover:text-[#00050e] transition-colors py-2">
              ESG
            </a>
            <a href="#brsr-framework" className="hover:text-[#00050e] transition-colors py-2">
              BRSR
            </a>
            <a href="#sdg-impact" className="hover:text-[#00050e] transition-colors py-2">
              SDG Impact
            </a>
            <a href="#csr-impact" className="hover:text-[#00050e] transition-colors py-2">
              CSR
            </a>
            <a href="#reports" className="hover:text-[#00050e] transition-colors py-2">
              Reports
            </a>
          </nav>

          {/* Actions & Log In / Dashboard Switcher */}
          <div className="flex items-center space-x-3 shrink-0">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setActiveModule('overview');
                    setActiveSubtab('dashboard');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span>Enter Platform &rarr;</span>
                </button>

                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-300 text-xs">
                  <div className="text-right">
                    <div className="font-bold text-[#00050e] leading-none">{currentUser?.name || 'K. V. Rao'}</div>
                    <div className="text-[10px] text-[#44474c]">{currentUser?.role || 'Admin'}</div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Log Out"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* PROMINENT LOG IN BUTTON REQUESTED BY USER */}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-[#00050e] hover:bg-[#346385] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-md border border-[#00050e]"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setIsLoginModalOpen(true);
                    } else {
                      setActiveModule('overview');
                      setActiveSubtab('dashboard');
                    }
                  }}
                  className="bg-[#b0f0ce]/40 text-[#0e5138] border border-[#0e5138]/20 hover:bg-[#0e5138] hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hidden sm:flex items-center gap-1.5 shadow-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0e5138] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0e5138]"></span>
                  </span>
                  <span>Live Dashboard</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-8 h-8 rounded-full bg-[#00050e] flex items-center justify-center text-white hover:bg-[#346385] transition-colors shadow-sm"
              title="Enterprise Login / Role Simulator"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================================== */}
      {/* 2. HERO SECTION */}
      {/* ============================================================================== */}
      <section id="hero" className="relative w-full overflow-hidden bg-white border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f2f4f3] rounded-full border border-[#c4c6cd]/40">
                <span className="w-2 h-2 rounded-full bg-[#346385] animate-pulse"></span>
                <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">
                  MEIL Unified ESG Architecture
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[44px] text-[#00050e] tracking-tight font-extrabold leading-tight">
                Engineering Progress.<br />
                <span className="text-[#346385]">Measuring Impact.</span>
              </h1>

              <p className="text-base text-[#44474c] max-w-xl leading-relaxed">
                A unified ESG, BRSR and sustainability intelligence platform for monitoring projects, measuring impact and transforming infrastructure data into transparent, actionable insights.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigateSecure('overview', 'dashboard')}
                  className="px-6 py-3.5 bg-[#00050e] text-white font-bold rounded-lg shadow-md hover:bg-[#346385] transition-all flex items-center gap-2 text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  <span>Explore ESG Dashboard</span>
                </button>

                <button
                  onClick={() => navigateSecure('collection', 'section-c')}
                  className="px-6 py-3.5 bg-[#f2f4f3] text-[#191c1c] font-bold rounded-lg hover:bg-[#e6e9e8] transition-all flex items-center gap-2 text-sm border border-[#c4c6cd]/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">fact_check</span>
                  <span>View BRSR Disclosures</span>
                </button>
              </div>

              {/* 3 Mini Status Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#c4c6cd]/40">
                <div className="bg-[#f2f4f3] p-3.5 rounded-lg border border-[#c4c6cd]/30">
                  <div className="flex items-center gap-2 text-[#0e5138] mb-1">
                    <span className="material-symbols-outlined text-base">water_drop</span>
                    <span className="text-[11px] font-bold uppercase">P6: Environment</span>
                  </div>
                  <p className="text-xs font-bold text-[#191c1c]">Net-Zero Water Footprint</p>
                  <p className="text-[11px] text-[#44474c]">Active circular flow audit</p>
                </div>

                <div className="bg-[#f2f4f3] p-3.5 rounded-lg border border-[#c4c6cd]/30">
                  <div className="flex items-center gap-2 text-[#346385] mb-1">
                    <span className="material-symbols-outlined text-base">safety_check</span>
                    <span className="text-[11px] font-bold uppercase">P3/P8: Social</span>
                  </div>
                  <p className="text-xs font-bold text-[#191c1c]">64,200+ Personnel</p>
                  <p className="text-[11px] text-[#44474c]">Vision Zero safety record</p>
                </div>

                <div className="bg-[#f2f4f3] p-3.5 rounded-lg border border-[#c4c6cd]/30">
                  <div className="flex items-center gap-2 text-[#081d30] mb-1">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    <span className="text-[11px] font-bold uppercase">P1: Governance</span>
                  </div>
                  <p className="text-xs font-bold text-[#191c1c]">100% Compliance</p>
                  <p className="text-[11px] text-[#44474c]">Statutory SEBI BRSR Core</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Backdrop / Telemetry Panel */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-[#eceeed] border border-[#c4c6cd]/50">
                <img
                  alt="Zojila Tunnel Himalayan Mega Project portal under engineering execution at dawn"
                  className="w-full h-[460px] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY4PHsWAsdSI4NmeW_gezIDi6aoqXn3tDh2idcPWQX3oU2fWhNfzOQncINMeriEl8nxWNwAeASSdD1tlfG0YI90vEehzbWF0kLeToS1r2Mni_bVBV-gGWv4g24_w_ogPm5gZvna27K9kUtqbpZxbS_yt1ALHbJJbGf4Pwmj9ep2SQ-p1mkMpGxMpeVdcdYwLkRZvYnVw9XqGj3Y63Rmh17XnQgBZ_5rcrLopudoqEWb2Ff_uCd01u1MQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00050e]/90 via-[#00050e]/30 to-transparent"></div>

                {/* Telemetry Pill Top Right */}
                <div className="absolute top-4 right-4 bg-[#0b1f33]/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-white/10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b0f0ce] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#b0f0ce]"></span>
                  </span>
                  <span className="text-[11px] font-bold tracking-wide uppercase">
                    Active Telemetry • 99.4% Complete
                  </span>
                </div>

                {/* Bottom Live Telemetry Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#c4c6cd]/60">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c4c6cd]/30 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#346385] text-sm">sensors</span>
                      <span className="text-xs uppercase font-bold text-[#191c1c]">
                        LIVE ESG MONITORING PORTAL
                      </span>
                    </div>
                    <span className="text-xs text-[#346385] font-bold">48 Project Sites Connected</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[11px] text-[#44474c]">Active Load Monitored</p>
                      <p className="text-lg font-bold text-[#00050e]">3,420 MW</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#44474c]">Daily Recycled Water</p>
                      <p className="text-lg font-bold text-[#0e5138]">18.4 MLD</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#44474c]">Audit Assurance</p>
                      <p className="text-lg font-bold text-[#346385]">ISO 14064</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 3. ESG AT A GLANCE (ILLUSTRATIVE DASHBOARD DATA) */}
      {/* ============================================================================== */}
      <section id="esg-glance" className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#346385] text-base">assessment</span>
                <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">
                  Statutory High-Level Metrics
                </span>
              </div>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight">ESG at a Glance</h2>
              <p className="text-sm text-[#44474c] max-w-2xl mt-1">
                Integrated quarterly environmental indicators, workforce safety benchmarks, and SEBI-aligned corporate governance disclosures across enterprise engineering sites.
              </p>
            </div>
            <div className="inline-flex items-center px-3 py-1.5 bg-[#e1e3e2] rounded-lg text-[#44474c] text-xs font-medium">
              <span className="material-symbols-outlined text-sm mr-1">info</span>
              Sample telemetry data labeled as Illustrative Dashboard Data for regulatory demonstration.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Environmental Column */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#0e5138] border-x border-b border-[#c4c6cd]/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0e5138]">eco</span>
                  <h3 className="text-base font-bold text-[#191c1c]">Environment</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#b0f0ce] text-[#0e5138] text-[11px] font-bold rounded">
                  P6 Verified
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-[#44474c]">Monitored Energy Consumption</span>
                    <span className="text-base font-bold text-[#00050e]">184.2 GWh</span>
                  </div>
                  <div className="w-full bg-[#e6e9e8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0e5138] h-full rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-[#44474c]">Renewable Energy Share</span>
                    <span className="text-base font-bold text-[#346385]">38.4%</span>
                  </div>
                  <div className="w-full bg-[#e6e9e8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#346385] h-full rounded-full" style={{ width: '38.4%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">GHG Scope 1 &amp; 2 Intensity</span>
                  <span className="font-bold text-[#0e5138] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">trending_down</span> -12.8% YoY
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">Water Recycling Rate</span>
                  <span className="font-bold text-[#00050e]">84.2%</span>
                </div>
              </div>
            </div>

            {/* Social Column */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#346385] border-x border-b border-[#c4c6cd]/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#346385]">groups</span>
                  <h3 className="text-base font-bold text-[#191c1c]">Social</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#cbe6ff] text-[#174b6c] text-[11px] font-bold rounded">
                  P3/P8 Audited
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-[#44474c]">Lost Time Injury Rate (LTIFR)</span>
                    <span className="text-base font-bold text-[#00050e]">0.12</span>
                  </div>
                  <p className="text-[11px] text-[#0e5138] font-medium">Industry Benchmark &lt; 0.20 (Vision Zero)</p>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">Total Safety Training</span>
                  <span className="font-bold text-[#00050e]">382,400+ hrs</span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">Community CSR Reach</span>
                  <span className="font-bold text-[#346385]">2.4M+ Beneficiaries</span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">Active Workforce Strength</span>
                  <span className="font-bold text-[#00050e]">45,000+ Personnel</span>
                </div>
              </div>
            </div>

            {/* Governance Column */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#00050e] border-x border-b border-[#c4c6cd]/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00050e]">policy</span>
                  <h3 className="text-base font-bold text-[#191c1c]">Governance</h3>
                </div>
                <span className="px-2 py-0.5 bg-[#d1e4ff] text-[#081d30] text-[11px] font-bold rounded">
                  P1 Standard
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-[#44474c]">BRSR Core Readiness</span>
                    <span className="text-base font-bold text-[#0e5138]">100%</span>
                  </div>
                  <div className="w-full bg-[#e6e9e8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0e5138] h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">Policy Governance Coverage</span>
                  <span className="font-bold text-[#00050e]">9 / 9 Principles</span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">Vendor ESG Due Diligence</span>
                  <span className="font-bold text-[#00050e]">92.6% Cleared</span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#c4c6cd]/30 text-xs">
                  <span className="text-[#44474c]">External Limited Assurance</span>
                  <span className="font-bold text-[#0e5138] flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span> Third-party Signed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 4. LIVE ESG DASHBOARD (CORE INTERACTIVE PRODUCT MODULE) */}
      {/* ============================================================================== */}
      <section id="live-dashboard" className="w-full bg-white py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">
                Operational Command Center
              </span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">Live ESG Dashboard</h2>
              <p className="text-sm text-[#44474c] mt-1">
                Real-time SCADA and IoT field monitoring metrics stream across MEIL engineering complexes.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#0e5138] font-bold bg-[#f2f4f3] px-3 py-1.5 rounded-lg border border-[#c4c6cd]/40">
                <span className="w-2 h-2 rounded-full bg-[#0e5138] animate-ping"></span>
                SCADA Streaming: SYNCED
              </span>
              <button
                onClick={() => {
                  setActiveModule('overview');
                  setActiveSubtab('dashboard');
                }}
                className="px-4 py-2 bg-[#00050e] text-white text-xs font-semibold rounded-lg hover:bg-[#346385] transition-colors"
              >
                Open Full Interactive Portal →
              </button>
            </div>
          </div>

          {/* Filter Controls Strip */}
          <div className="bg-[#f2f4f3] p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4 border border-[#c4c6cd]/40">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveDashboardTab('env')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDashboardTab === 'env'
                    ? 'bg-[#00050e] text-white shadow-sm'
                    : 'bg-white text-[#44474c] hover:bg-[#e6e9e8]'
                }`}
              >
                Environment
              </button>
              <button
                onClick={() => setActiveDashboardTab('soc')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDashboardTab === 'soc'
                    ? 'bg-[#00050e] text-white shadow-sm'
                    : 'bg-white text-[#44474c] hover:bg-[#e6e9e8]'
                }`}
              >
                Social
              </button>
              <button
                onClick={() => setActiveDashboardTab('gov')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDashboardTab === 'gov'
                    ? 'bg-[#00050e] text-white shadow-sm'
                    : 'bg-white text-[#44474c] hover:bg-[#e6e9e8]'
                }`}
              >
                Governance
              </button>
              <button
                onClick={() => setActiveDashboardTab('summary')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeDashboardTab === 'summary'
                    ? 'bg-[#00050e] text-white shadow-sm'
                    : 'bg-white text-[#44474c] hover:bg-[#e6e9e8]'
                }`}
              >
                Cross-Functional Summary
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cd]/40 shadow-xs">
                <span className="material-symbols-outlined text-sm text-[#74777d]">calendar_today</span>
                <span className="font-semibold text-[#191c1c]">FY 2024-25 Q3</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cd]/40 shadow-xs">
                <span className="material-symbols-outlined text-sm text-[#74777d]">location_on</span>
                <span className="font-semibold text-[#191c1c]">Pan-India Sites</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-[#c4c6cd]/40 shadow-xs">
                <span className="material-symbols-outlined text-sm text-[#74777d]">dataset</span>
                <span className="font-semibold text-[#191c1c]">Real-Time SCADA</span>
              </div>
            </div>
          </div>

          {/* Dynamic Tab Panels */}
          {activeDashboardTab === 'env' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Scope 1 Direct GHG</span>
                  <span className="material-symbols-outlined text-[#346385]">factory</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">28,420</p>
                <p className="text-xs text-[#44474c] mt-1">tCO2e across civil equipment</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>vs Baseline FY23</span>
                  <span>-8.4% reduction</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Scope 2 Grid Emissions</span>
                  <span className="material-symbols-outlined text-[#346385]">electric_bolt</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">14,890</p>
                <p className="text-xs text-[#44474c] mt-1">tCO2e from purchased power</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>Renewable offset</span>
                  <span>42% self-generated</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Gayatri Pumphouse Water</span>
                  <span className="material-symbols-outlined text-[#0e5138]">water_pump</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">2.0 TMC</p>
                <p className="text-xs text-[#44474c] mt-1">Daily controlled river discharge</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#346385]">
                  <span>Pumping efficiency</span>
                  <span>94.8% rating</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Heavy Fleet Electrification</span>
                  <span className="material-symbols-outlined text-[#346385]">local_shipping</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">31.4%</p>
                <p className="text-xs text-[#44474c] mt-1">Active e-tippers &amp; battery haulers</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>Net diesel saved</span>
                  <span>480k L / month</span>
                </div>
              </div>
            </div>
          )}

          {activeDashboardTab === 'soc' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Shift Safety Audits</span>
                  <span className="material-symbols-outlined text-[#346385]">checklist</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">1,480</p>
                <p className="text-xs text-[#44474c] mt-1">Monthly site EHS evaluations</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>Resolution rate</span>
                  <span>98.2% within 24h</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Hazard Reporting Index</span>
                  <span className="material-symbols-outlined text-[#346385]">warning</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">99.1%</p>
                <p className="text-xs text-[#44474c] mt-1">Near-miss capture frequency</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#346385]">
                  <span>App-reported</span>
                  <span>100% digitalized</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Local Sourcing &amp; Hiring</span>
                  <span className="material-symbols-outlined text-[#346385]">badge</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">68%</p>
                <p className="text-xs text-[#44474c] mt-1">Workforce recruited locally</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>Skilled apprentices</span>
                  <span>12,400 certified</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Healthcare Camps</span>
                  <span className="material-symbols-outlined text-[#346385]">medical_services</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">420+</p>
                <p className="text-xs text-[#44474c] mt-1">Site mobile dispensaries</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#346385]">
                  <span>Workers screened</span>
                  <span>64,000+ checks</span>
                </div>
              </div>
            </div>
          )}

          {activeDashboardTab === 'gov' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Statutory Clearances</span>
                  <span className="material-symbols-outlined text-[#346385]">verified</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">100%</p>
                <p className="text-xs text-[#44474c] mt-1">34 active major projects clear</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>MoEF&amp;CC Status</span>
                  <span>Zero pending notices</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Anti-Bribery &amp; Ethics</span>
                  <span className="material-symbols-outlined text-[#346385]">gavel</span>
                </div>
                <p className="text-3xl font-extrabold text-[#00050e] tabular-nums">100%</p>
                <p className="text-xs text-[#44474c] mt-1">Code of conduct signoff</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#346385]">
                  <span>Vendor adherence</span>
                  <span>98.6% audited</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Board ESG Oversight</span>
                  <span className="material-symbols-outlined text-[#346385]">balance</span>
                </div>
                <p className="text-2xl font-extrabold text-[#00050e] mt-1">Quarterly</p>
                <p className="text-xs text-[#44474c] mt-1">Independent director reviews</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#00050e]">
                  <span>Audit committee</span>
                  <span>100% attendance</span>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-5 rounded-xl border border-[#c4c6cd]/40 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#44474c]">Data Privacy &amp; SCADA</span>
                  <span className="material-symbols-outlined text-[#346385]">security</span>
                </div>
                <p className="text-2xl font-extrabold text-[#00050e] mt-1">ISO 27001</p>
                <p className="text-xs text-[#44474c] mt-1">Industrial network resilience</p>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs font-bold text-[#0e5138]">
                  <span>Threat status</span>
                  <span>Zero breach incidents</span>
                </div>
              </div>
            </div>
          )}

          {activeDashboardTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
              <div className="bg-[#f2f4f3] p-6 rounded-xl md:col-span-2 border border-[#c4c6cd]/40 shadow-xs">
                <h4 className="text-base font-bold text-[#00050e] mb-2">Enterprise ESG Composite Performance</h4>
                <p className="text-xs text-[#44474c] leading-relaxed mb-4">
                  Aggregated real-time metrics across all 48 infrastructure projects show superior operational health compared to national engineering peers. Environmental footprint intensity is declining steadily while zero-harm protocols maintain sub-0.15 LTIFR across high-altitude tunnels and lift irrigation projects.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#c4c6cd]/30">
                  <div>
                    <p className="text-[11px] text-[#44474c] uppercase font-bold">EHS Compliance</p>
                    <p className="text-xl font-extrabold text-[#00050e] mt-0.5">99.8%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#44474c] uppercase font-bold">Carbon Reduction</p>
                    <p className="text-xl font-extrabold text-[#0e5138] mt-0.5">-14.2%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#44474c] uppercase font-bold">Social Value Index</p>
                    <p className="text-xl font-extrabold text-[#346385] mt-0.5">9.4 / 10</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f2f4f3] p-6 rounded-xl flex flex-col justify-between border border-[#c4c6cd]/40 shadow-xs">
                <div>
                  <h4 className="text-base font-bold text-[#00050e] mb-1">Auditor Assurance Log</h4>
                  <p className="text-xs text-[#44474c]">
                    Last limited assurance update completed by independent accredited auditor for SEBI filing compliance.
                  </p>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-[#c4c6cd]/40 text-xs">
                    <span className="text-[11px] font-bold text-[#346385] uppercase">ASSURANCE OPINION</span>
                    <p className="text-[#191c1c] font-medium mt-1">
                      Unqualified Clean Report on Scope 1, 2 &amp; Workforce Safety Metrics.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveModule('assurance');
                    setActiveSubtab('report');
                  }}
                  className="mt-4 w-full py-2.5 bg-[#00050e] text-white text-xs font-bold rounded-lg hover:bg-[#346385] transition-colors"
                >
                  Download Assurance Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 5. PROJECTS & SITES (INTERACTIVE INDIA MAP & SPOTLIGHT) */}
      {/* ============================================================================== */}
      <section id="projects" className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">
                Strategic Assets &amp; Facilities
              </span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
                Projects &amp; Operational Sites
              </h2>
              <p className="text-sm text-[#44474c] mt-1">
                Nationwide infrastructure modernizations mapped with real-time ESG metrics.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'water', label: 'Water & Irrigation' },
                { id: 'transport', label: 'Transportation' },
                { id: 'power', label: 'Power & Grid' },
                { id: 'renewable', label: 'Renewable Energy' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedSectorFilter(btn.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSectorFilter === btn.id
                      ? 'bg-[#00050e] text-white shadow-sm'
                      : 'bg-[#e1e3e2] text-[#44474c] hover:bg-[#eceeed]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* India Vector Map Schematic (Left Column) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-[#c4c6cd]/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-[#00050e]">Pan-India Deployment Hotspots</span>
                <span className="text-xs text-[#346385] font-bold">6 Critical Corridors</span>
              </div>

              {/* Schematic Interactive Hotspot Map */}
              <div className="relative w-full h-[380px] bg-[#f2f4f3] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#c4c6cd]/30">
                <svg
                  className="w-full h-full text-[#c4c6cd]/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 400 480"
                >
                  <path
                    d="M 180,20 L 220,40 L 230,80 L 260,110 L 280,105 L 320,130 L 300,160 L 330,170 L 360,200 L 320,220 L 270,220 L 250,250 L 260,300 L 240,350 L 210,400 L 190,460 L 180,430 L 170,380 L 150,330 L 140,280 L 110,250 L 80,220 L 90,180 L 130,170 L 140,120 L 160,80 Z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  ></path>
                </svg>

                {/* Hotspot Pins */}
                <button
                  onClick={() => setSelectedHotspot('zojila')}
                  className={`absolute top-[12%] left-[45%] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-all ${
                    selectedHotspot === 'zojila'
                      ? 'bg-[#00050e] text-white ring-4 ring-black/20'
                      : 'bg-white text-[#00050e] border border-[#c4c6cd]'
                  }`}
                  title="Zojila Tunnel"
                >
                  <span className="material-symbols-outlined text-sm">hardware</span>
                </button>

                <button
                  onClick={() => setSelectedHotspot('kaleshwaram')}
                  className={`absolute top-[62%] left-[52%] w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    selectedHotspot === 'kaleshwaram'
                      ? 'bg-[#0e5138] text-white ring-4 ring-[#b0f0ce]'
                      : 'bg-white text-[#0e5138] border border-[#0e5138]'
                  }`}
                  title="Kaleshwaram Lift Irrigation"
                >
                  <span className="material-symbols-outlined text-base">water_pump</span>
                </button>

                <button
                  onClick={() => setSelectedHotspot('rajasthan')}
                  className={`absolute top-[36%] left-[34%] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-all ${
                    selectedHotspot === 'rajasthan'
                      ? 'bg-[#346385] text-white ring-4 ring-[#cbe6ff]'
                      : 'bg-white text-[#346385] border border-[#c4c6cd]'
                  }`}
                  title="Jal Jeevan Rajasthan"
                >
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                </button>

                <button
                  onClick={() => setSelectedHotspot('solar')}
                  className={`absolute top-[44%] left-[28%] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-all ${
                    selectedHotspot === 'solar'
                      ? 'bg-[#346385] text-white ring-4 ring-[#cbe6ff]'
                      : 'bg-white text-[#346385] border border-[#c4c6cd]'
                  }`}
                  title="Gujarat Solar Grid"
                >
                  <span className="material-symbols-outlined text-sm">solar_power</span>
                </button>

                <button
                  onClick={() => setSelectedHotspot('freight')}
                  className={`absolute top-[32%] left-[48%] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-all ${
                    selectedHotspot === 'freight'
                      ? 'bg-[#00050e] text-white ring-4 ring-black/20'
                      : 'bg-white text-[#00050e] border border-[#c4c6cd]'
                  }`}
                  title="Western Dedicated Freight Corridor"
                >
                  <span className="material-symbols-outlined text-sm">train</span>
                </button>

                <button
                  onClick={() => setSelectedHotspot('refinery')}
                  className={`absolute top-[52%] left-[72%] w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-all ${
                    selectedHotspot === 'refinery'
                      ? 'bg-[#00050e] text-white ring-4 ring-black/20'
                      : 'bg-white text-[#00050e] border border-[#c4c6cd]'
                  }`}
                  title="Paradip Hydrocarbon Facility"
                >
                  <span className="material-symbols-outlined text-sm">local_gas_station</span>
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#44474c]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0e5138]"></span> Water Infrastructure
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#346385]"></span> Clean Power / JJM
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00050e]"></span> Heavy Civil
                </span>
              </div>
            </div>

            {/* Spotlight Project Card (Right Column) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-[#c4c6cd]/40">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 rounded-xl overflow-hidden shadow-md">
                  <img
                    alt={spotlight.imageAlt}
                    className="w-full h-64 object-cover"
                    src={spotlight.imageUrl}
                  />
                </div>
                <div className="md:col-span-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#b0f0ce] text-[#0e5138] text-[11px] font-bold rounded">
                      {spotlight.category}
                    </span>
                    <span className="text-[11px] text-[#44474c]">{spotlight.state}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#00050e] leading-snug">{spotlight.name}</h3>
                  <p className="text-xs text-[#44474c] leading-relaxed">{spotlight.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#c4c6cd]/30 text-xs">
                    <div>
                      <span className="text-[#44474c] text-[11px]">Capacity:</span>
                      <p className="font-bold text-[#00050e]">{spotlight.capacity}</p>
                    </div>
                    <div>
                      <span className="text-[#44474c] text-[11px]">Daily Discharge:</span>
                      <p className="font-bold text-[#0e5138]">{spotlight.dailyMetric}</p>
                    </div>
                    <div>
                      <span className="text-[#44474c] text-[11px]">ESG Verification:</span>
                      <p className="font-bold text-[#346385]">{spotlight.verification}</p>
                    </div>
                    <div>
                      <span className="text-[#44474c] text-[11px]">BRSR Filing:</span>
                      <p className="font-bold text-[#191c1c]">{spotlight.brsrStatus}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Preview Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#c4c6cd]/30">
                <div
                  onClick={() => setSelectedHotspot('zojila')}
                  className="p-3 bg-[#f2f4f3] rounded-lg hover:bg-[#e6e9e8] transition-colors cursor-pointer border border-[#c4c6cd]/30"
                >
                  <img
                    alt="Zojila tunnel"
                    className="w-full h-24 object-cover rounded mb-2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY4PHsWAsdSI4NmeW_gezIDi6aoqXn3tDh2idcPWQX3oU2fWhNfzOQncINMeriEl8nxWNwAeASSdD1tlfG0YI90vEehzbWF0kLeToS1r2Mni_bVBV-gGWv4g24_w_ogPm5gZvna27K9kUtqbpZxbS_yt1ALHbJJbGf4Pwmj9ep2SQ-p1mkMpGxMpeVdcdYwLkRZvYnVw9XqGj3Y63Rmh17XnQgBZ_5rcrLopudoqEWb2Ff_uCd01u1MQ"
                  />
                  <p className="text-xs font-bold text-[#00050e] truncate">Zojila Himalayan Tunnel</p>
                  <p className="text-[11px] text-[#44474c]">14.15 km • All-weather passage</p>
                </div>

                <div
                  onClick={() => setSelectedHotspot('rajasthan')}
                  className="p-3 bg-[#f2f4f3] rounded-lg hover:bg-[#e6e9e8] transition-colors cursor-pointer border border-[#c4c6cd]/30"
                >
                  <img
                    alt="Rural drinking water plant in Rajasthan village"
                    className="w-full h-24 object-cover rounded mb-2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4LUrd6K37zUJ5oX9akI7mDJkBDtrTmeiRdDdu_jquLTR7I6D3aL04IWIaWt6C29WBQFvP09MCNUWv4oASwIkZgLo1MucokuRxmglxgpUUdnLrV5uvUshZ9Vlm-__zpUPln_8mzlf9SCdiQ3ieLfa7Z_r0RfJSeAq-ZZyqhywDrDc18-kAPu7Rg1N--qZjzxoZJ0Obj94IUkkYZNEwWwTrLXbp7gvESTbZo3tNSTT2T6lqxX5c2eBowQ"
                  />
                  <p className="text-xs font-bold text-[#00050e] truncate">Jal Jeevan Rajasthan</p>
                  <p className="text-[11px] text-[#44474c]">1,420 Villages • Tap Water</p>
                </div>

                <div
                  onClick={() => setSelectedHotspot('solar')}
                  className="p-3 bg-[#f2f4f3] rounded-lg hover:bg-[#e6e9e8] transition-colors cursor-pointer border border-[#c4c6cd]/30"
                >
                  <img
                    alt="Solar substation"
                    className="w-full h-24 object-cover rounded mb-2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-ua0817ke8b7lqlcSXR5y5s4S97fnrYrxJ2fYeiGGLKU5-uLtxkY-_W2-c37E7WEU2R45OllXzfV6BXuBoZSmHJimKFDyYLQdlQXqtVhjImqYN583VQW9m_WwfyqJzJgGAq7wx2JdgRMVSvLK1aWvI8-xbQYgk4z-J_8e5BifAe6ev_oySRh2UVDYqMBKsopgVk1ZiJqyIejKKfo16gw5cSBbnMS8bIXbjkx_4RmfqVgDfLWQKC889w"
                  />
                  <p className="text-xs font-bold text-[#00050e] truncate">Gujarat Solar Substation</p>
                  <p className="text-[11px] text-[#44474c]">Renewable Grid • 400 kV</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 6. BUSINESS SECTORS (12 SECTOR CARDS) */}
      {/* ============================================================================== */}
      <section id="business-sectors" className="w-full bg-white py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Industrial Capability</span>
            <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
              Engineering Excellence Across Sectors
            </h2>
            <p className="text-sm text-[#44474c] mt-2">
              MEIL operates across twelve interconnected industrial sectors driving nation-building, decarbonization, and statutory sustainability governance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'water_pump',
                title: 'Irrigation',
                desc: 'Mega lift irrigation, barrages, canals, and pumping stations ensuring agrarian food security.',
                tag: 'ESG: Water Circularity',
                color: 'bg-[#b0f0ce] text-[#0e5138]',
              },
              {
                icon: 'water_drop',
                title: 'Drinking Water',
                desc: 'Bulk water pipelines, water treatment plants, and rural piped networks under Jal Jeevan Mission.',
                tag: 'ESG: SDG 6 Clean Tap Access',
                color: 'bg-[#cbe6ff] text-[#174b6c]',
              },
              {
                icon: 'directions_car',
                title: 'Transportation',
                desc: 'Access-controlled expressways, high-altitude mountain tunnels, and elevated corridors.',
                tag: 'ESG: Eco-Corridors',
                color: 'bg-[#d1e4ff] text-[#081d30]',
              },
              {
                icon: 'electrical_services',
                title: 'Power Transmission',
                desc: 'Extra high-voltage (EHV) substations, transmission lines, and national grid synchronization.',
                tag: 'ESG: Grid Efficiency',
                color: 'bg-[#e6e9e8] text-[#00050e]',
              },
              {
                icon: 'solar_power',
                title: 'Renewable Energy',
                desc: 'Utility-scale solar power plants, onshore wind farms, and hybrid battery energy storage.',
                tag: 'ESG: Net-Zero Generation',
                color: 'bg-[#b0f0ce] text-[#0e5138]',
              },
              {
                icon: 'local_gas_station',
                title: 'Hydrocarbons',
                desc: 'Refinery process units, cross-country oil & gas trunk lines, and city gas distribution networks.',
                tag: 'ESG: Leak Detection SCADA',
                color: 'bg-[#e6e9e8] text-[#00050e]',
              },
              {
                icon: 'precision_manufacturing',
                title: 'Manufacturing',
                desc: 'Automated oil drilling rigs, hydraulic components, defense hardware, and industrial skids.',
                tag: 'ESG: Lean Circular Factory',
                color: 'bg-[#d1e4ff] text-[#081d30]',
              },
              {
                icon: 'construction',
                title: 'Heavy Engineering',
                desc: 'Custom mega-scale structural steel fabrication, penstocks, and heavy industrial machinery.',
                tag: 'ESG: Steel Scrap Reuse',
                color: 'bg-[#cbe6ff] text-[#174b6c]',
              },
              {
                icon: 'apartment',
                title: 'Buildings & Industrial',
                desc: 'Smart campuses, high-capacity hospital facilities, data centres, and industrial logistic hubs.',
                tag: 'ESG: Green Building IGBC',
                color: 'bg-[#e6e9e8] text-[#00050e]',
              },
              {
                icon: 'qr_code_2',
                title: 'Electric Mobility',
                desc: 'Electric public transit buses (Olectra Greentech partnership) and high-power depot chargers.',
                tag: 'ESG: Zero Tailpipe Emission',
                color: 'bg-[#b0f0ce] text-[#0e5138]',
              },
              {
                icon: 'cell_tower',
                title: 'Communications',
                desc: 'Optical fiber ground networks (OFC), telemetry backbones, and mission-critical networks.',
                tag: 'ESG: Digital Equity',
                color: 'bg-[#d1e4ff] text-[#081d30]',
              },
              {
                icon: 'settings_suggest',
                title: 'O&M Asset Life',
                desc: 'Long-term concession management, predictive maintenance, and operational efficiency upgrades.',
                tag: 'ESG: Asset Longevity',
                color: 'bg-[#cbe6ff] text-[#174b6c]',
              },
            ].map((sector, index) => (
              <div
                key={index}
                className="p-5 bg-[#f2f4f3] rounded-xl hover:bg-[#e6e9e8] transition-all border border-[#c4c6cd]/30 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg ${sector.color} flex items-center justify-center mb-3 shadow-xs`}>
                    <span className="material-symbols-outlined text-xl">{sector.icon}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#00050e]">{sector.title}</h4>
                  <p className="text-xs text-[#44474c] mt-1.5 leading-relaxed">{sector.desc}</p>
                </div>
                <span className="mt-3 inline-block px-2.5 py-1 bg-white rounded text-[11px] text-[#346385] font-semibold border border-[#c4c6cd]/30 w-fit">
                  {sector.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 7. BRSR REPORTING WORKFLOW & 9 PRINCIPLES */}
      {/* ============================================================================== */}
      <section id="brsr-framework" className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">
                SEBI Mandated Architecture
              </span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
                BRSR Reporting Workflow &amp; 9 Principles
              </h2>
              <p className="text-sm text-[#44474c] mt-1 max-w-2xl">
                Complete audit-traceable reporting mechanism complying with National Guidelines on Responsible Business Conduct (NGRBC).
              </p>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg shadow-xs text-xs border border-[#c4c6cd]/40">
              <span className="text-[#44474c]">Core Readiness: </span>
              <span className="font-bold text-[#0e5138]">100% Essential</span> |{' '}
              <span className="font-bold text-[#346385]">86% Leadership</span>
            </div>
          </div>

          {/* Visual 6-Step Reporting Engine */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {[
              { num: '1', title: 'Collect', desc: 'IoT SCADA & site logs' },
              { num: '2', title: 'Validate', desc: 'Algorithmic anomaly flags' },
              { num: '3', title: 'Map', desc: 'SEBI BRSR Core taxonomy' },
              { num: '4', title: 'Review', desc: 'EHS & Departmental heads' },
              { num: '5', title: 'Assure', desc: 'Independent certifier signoff' },
              { num: '6', title: 'Report', desc: 'XBRL & PDF Filing to SEBI', active: true },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl text-center shadow-xs border border-[#c4c6cd]/30"
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-xs mb-2 ${
                    step.active ? 'bg-[#0e5138] text-white' : 'bg-[#e6e9e8] text-[#00050e]'
                  }`}
                >
                  {step.num}
                </div>
                <h5 className="text-xs font-bold text-[#00050e]">{step.title}</h5>
                <p className="text-[11px] text-[#44474c] mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Interactive Grid of 9 Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                tag: 'P1',
                title: 'Ethics, Transparency & Accountability',
                desc: 'Zero bribery incidents, statutory anti-corruption policies across all operational ventures.',
                ev: 42,
              },
              {
                tag: 'P2',
                title: 'Safe & Sustainable Goods and Services',
                desc: 'Life-cycle assessments (LCA) on concrete mix designs and recyclable steel utilization.',
                ev: 28,
              },
              {
                tag: 'P3',
                title: 'Employee Well-being & Zero Harm',
                desc: 'Zero fatalities protocol, comprehensive health insurance, continuous site skilling modules.',
                ev: 56,
              },
              {
                tag: 'P4',
                title: 'Stakeholder Responsiveness',
                desc: 'Grievance redressal mechanisms for local communities, clients, subcontractors, and staff.',
                ev: 19,
              },
              {
                tag: 'P5',
                title: 'Human Rights Stewardship',
                desc: 'Zero tolerance for child or forced labor, contractual fair wages guarantee across contractors.',
                ev: 34,
              },
              {
                tag: 'P6',
                title: 'Protection & Restoration of Environment',
                desc: 'Scope 1, 2, 3 carbon accounting, 18.4 MLD water recycling, afforestation around corridors.',
                ev: 82,
                featured: true,
              },
              {
                tag: 'P7',
                title: 'Public & Regulatory Policy Advocacy',
                desc: 'Active representation in national infrastructure councils, clean energy policy inputs.',
                ev: 15,
              },
              {
                tag: 'P8',
                title: 'Inclusive Growth & Community CSR',
                desc: '2.4 Million community beneficiaries via drinking water ATMs, primary healthcare, rural schooling.',
                ev: 64,
              },
              {
                tag: 'P9',
                title: 'Customer Value & Asset Integrity',
                desc: 'Strict quality certifications, on-time project completion covenants, defect liability records.',
                ev: 22,
              },
            ].map((p, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-xl shadow-xs border border-[#c4c6cd]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                        p.featured
                          ? 'bg-[#b0f0ce] text-[#0e5138]'
                          : 'bg-[#d1e4ff] text-[#081d30]'
                      }`}
                    >
                      {p.tag}
                    </span>
                    <span className="text-[11px] text-[#0e5138] font-bold">100% Documented</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#00050e]">{p.title}</h4>
                  <p className="text-xs text-[#44474c] mt-1 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-[#c4c6cd]/30 flex justify-between text-xs text-[#44474c]">
                  <span>Evidence Items: {p.ev}</span>
                  <span className="font-semibold text-[#346385]">Verified ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 8. ESG THREE-PILLAR FRAMEWORK */}
      {/* ============================================================================== */}
      <section className="w-full bg-white py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Strategic Pillars</span>
            <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
              Enterprise ESG Governance Architecture
            </h2>
            <p className="text-sm text-[#44474c] mt-2">
              Structured execution framework aligning heavy infrastructure operations with global climate goals and corporate ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pillar 1: Environment */}
            <div className="p-6 bg-[#f2f4f3] rounded-xl border-t-4 border-[#0e5138] border-x border-b border-[#c4c6cd]/40 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#b0f0ce] text-[#0e5138] flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">park</span>
                </div>
                <h3 className="text-lg font-bold text-[#00050e]">Environment</h3>
                <p className="text-xs text-[#44474c] mt-2 mb-4 leading-relaxed">
                  Preserving ecosystems and minimizing industrial extraction across high-impact civil operations.
                </p>
                <ul className="space-y-2.5 text-xs text-[#191c1c]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#0e5138]">check_circle</span>
                    Scope 1, Scope 2, and monitored Scope 3 emissions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#0e5138]">check_circle</span>
                    Closed-loop water recycling on tunneling &amp; batching
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#0e5138]">check_circle</span>
                    Topsoil preservation and mountain biodiversity buffers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#0e5138]">check_circle</span>
                    100% reuse of crushed excavated rock aggregate
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c4c6cd]/30 text-xs font-bold text-[#0e5138]">
                ISO 14001:2015 Environmental Systems
              </div>
            </div>

            {/* Pillar 2: Social */}
            <div className="p-6 bg-[#f2f4f3] rounded-xl border-t-4 border-[#346385] border-x border-b border-[#c4c6cd]/40 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#cbe6ff] text-[#174b6c] flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">diversity_3</span>
                </div>
                <h3 className="text-lg font-bold text-[#00050e]">Social</h3>
                <p className="text-xs text-[#44474c] mt-2 mb-4 leading-relaxed">
                  Prioritizing human safety, dignity, community prosperity, and technical capacity-building.
                </p>
                <ul className="space-y-2.5 text-xs text-[#191c1c]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#346385]">check_circle</span>
                    Vision Zero safety culture with daily pre-shift briefings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#346385]">check_circle</span>
                    MEIL Skill Academy technical vocational certifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#346385]">check_circle</span>
                    Local job creation and fair contractor compensation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#346385]">check_circle</span>
                    Clean water, maternal care, and schooling CSR
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c4c6cd]/30 text-xs font-bold text-[#346385]">
                ISO 45001:2018 Occupational Health &amp; Safety
              </div>
            </div>

            {/* Pillar 3: Governance */}
            <div className="p-6 bg-[#f2f4f3] rounded-xl border-t-4 border-[#00050e] border-x border-b border-[#c4c6cd]/40 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d1e4ff] text-[#081d30] flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <h3 className="text-lg font-bold text-[#00050e]">Governance</h3>
                <p className="text-xs text-[#44474c] mt-2 mb-4 leading-relaxed">
                  Rigorous oversight, board independence, and data transparency across all statutory entities.
                </p>
                <ul className="space-y-2.5 text-xs text-[#191c1c]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#00050e]">check_circle</span>
                    Independent ESG &amp; Sustainability Board Committee
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#00050e]">check_circle</span>
                    Encrypted anonymous whistleblower grievance channel
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#00050e]">check_circle</span>
                    Tier-1 vendor supply chain ESG due diligence audits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#00050e]">check_circle</span>
                    Cryptographically audited telemetry records
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#c4c6cd]/30 text-xs font-bold text-[#00050e]">
                SEBI BRSR Core Mandated Compliance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 9. SDG IMPACT MAPPING */}
      {/* ============================================================================== */}
      <section id="sdg-impact" className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Global Commitments</span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
                Mapping Megaprojects to Global Goals
              </h2>
              <p className="text-sm text-[#44474c] mt-1">
                Connecting core engineering deliveries directly to the United Nations Sustainable Development Goals.
              </p>
            </div>
          </div>

          {/* SDG Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
            {[
              { num: 'SDG 3', label: 'Good Health', color: 'text-[#00050e]' },
              { num: 'SDG 4', label: 'Education', color: 'text-[#00050e]' },
              { num: 'SDG 6', label: 'Clean Water', color: 'text-[#346385]' },
              { num: 'SDG 7', label: 'Clean Energy', color: 'text-[#0e5138]' },
              { num: 'SDG 8', label: 'Decent Work', color: 'text-[#00050e]' },
              { num: 'SDG 9', label: 'Industry', color: 'text-[#346385]' },
              { num: 'SDG 11', label: 'Communities', color: 'text-[#00050e]' },
              { num: 'SDG 12', label: 'Responsible Cons.', color: 'text-[#0e5138]' },
              { num: 'SDG 13', label: 'Climate Action', color: 'text-[#0e5138]' },
              { num: 'SDG 16', label: 'Peace & Justice', color: 'text-[#00050e]' },
              { num: 'SDG 17', label: 'Partnerships', color: 'text-[#346385]' },
            ].map((sdg, index) => (
              <div
                key={index}
                className="p-2.5 bg-white rounded-lg text-center shadow-xs border border-[#c4c6cd]/30"
              >
                <span className={`block font-bold text-xs ${sdg.color}`}>{sdg.num}</span>
                <span className="text-[10px] text-[#44474c]">{sdg.label}</span>
              </div>
            ))}
          </div>

          {/* Impact Mapping Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-xs border border-[#c4c6cd]/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#346385]">water_drop</span>
                <h4 className="text-base font-bold text-[#00050e]">Water Infrastructure → Public Health</h4>
              </div>
              <p className="text-xs text-[#44474c] mb-4 leading-relaxed">
                Kaleshwaram Lift Irrigation &amp; Jal Jeevan Mission projects distribute over 18.4 million liters daily to previously arid rural belts.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 bg-[#f2f4f3] rounded text-[#191c1c]">BRSR P6 &amp; P8</span>
                <span>→</span>
                <span className="px-2.5 py-1 bg-[#cbe6ff] text-[#174b6c] rounded">SDG 6: Clean Water</span>
                <span className="px-2.5 py-1 bg-[#f2f4f3] rounded text-[#191c1c]">SDG 3: Good Health</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-xs border border-[#c4c6cd]/40">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#00050e]">alt_route</span>
                <h4 className="text-base font-bold text-[#00050e]">Zojila Tunnel → Resilient Transit</h4>
              </div>
              <p className="text-xs text-[#44474c] mb-4 leading-relaxed">
                Constructing 14.15 km high-altitude passage across treacherous Himalayan terrain, terminating 6-month winter isolation for Ladakh.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="px-2.5 py-1 bg-[#f2f4f3] rounded text-[#191c1c]">BRSR P2 &amp; P8</span>
                <span>→</span>
                <span className="px-2.5 py-1 bg-[#d1e4ff] text-[#081d30] rounded">SDG 9: Resilient Infra</span>
                <span className="px-2.5 py-1 bg-[#f2f4f3] rounded text-[#191c1c]">SDG 11: Sustainable Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 10. CSR & COMMUNITY IMPACT */}
      {/* ============================================================================== */}
      <section id="csr-impact" className="w-full bg-white py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Grassroots Engagement</span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight">Impact. Dignity. Empowerment.</h2>
              <p className="text-sm text-[#44474c] leading-relaxed">
                Beyond commercial engineering milestones, MEIL’s corporate social responsibility initiatives build resilient village ecosystems through drinking water ATMs, mobile clinics, and modern learning centres.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="p-3 bg-[#f2f4f3] rounded-xl border border-[#c4c6cd]/30">
                  <p className="text-2xl font-extrabold text-[#00050e]">420+</p>
                  <p className="text-xs text-[#44474c]">Village Centers</p>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-xl border border-[#c4c6cd]/30">
                  <p className="text-2xl font-extrabold text-[#346385]">2.4M</p>
                  <p className="text-xs text-[#44474c]">Lives Impacted</p>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-xl border border-[#c4c6cd]/30">
                  <p className="text-2xl font-extrabold text-[#0e5138]">180+</p>
                  <p className="text-xs text-[#44474c]">Water ATMs</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#346385] text-sm">check_box</span>
                  <span>
                    <strong>Jal Daan Initiative:</strong> Providing purified drinking water across fluoride-affected belts.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#346385] text-sm">check_box</span>
                  <span>
                    <strong>Rural Health Vans:</strong> Free specialized screenings, primary diagnostic tests, and medicine.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#346385] text-sm">check_box</span>
                  <span>
                    <strong>Vocational Skilling:</strong> Training local youth in heavy machinery operation and electrical setups.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-[#eceeed] border border-[#c4c6cd]/40">
                <img
                  alt="Rural women and children gathering purified tap water under Jal Jeevan Mission"
                  className="w-full h-[400px] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4LUrd6K37zUJ5oX9akI7mDJkBDtrTmeiRdDdu_jquLTR7I6D3aL04IWIaWt6C29WBQFvP09MCNUWv4oASwIkZgLo1MucokuRxmglxgpUUdnLrV5uvUshZ9Vlm-__zpUPln_8mzlf9SCdiQ3ieLfa7Z_r0RfJSeAq-ZZyqhywDrDc18-kAPu7Rg1N--qZjzxoZJ0Obj94IUkkYZNEwWwTrLXbp7gvESTbZo3tNSTT2T6lqxX5c2eBowQ"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl text-xs shadow-lg border border-[#c4c6cd]/60">
                  <span className="text-[11px] font-bold text-[#346385] uppercase">Field Dispatch • Kheri Village</span>
                  <p className="text-[#191c1c] font-medium mt-1">
                    Community water treatment installation supplying 4,200 villagers with safe reverse-osmosis drinking water.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 11. EVIDENCE & ASSURANCE ENGINE (DATA TRACEABILITY) */}
      {/* ============================================================================== */}
      <section className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Immutable Audit Trail</span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">Evidence &amp; Assurance Engine</h2>
              <p className="text-sm text-[#44474c] mt-1">
                Traceability chain from field sensors to third-party auditor signatures and SEBI compliance filings.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-white px-3 py-2 rounded-lg shadow-xs border border-[#c4c6cd]/40">
              <span className="material-symbols-outlined text-[#346385] text-sm">fingerprint</span>
              <span>SHA-256 Ledger Verification: Active</span>
            </div>
          </div>

          {/* Traceability Chain Pipeline */}
          <div className="p-4 bg-white rounded-xl shadow-xs mb-6 overflow-x-auto border border-[#c4c6cd]/40">
            <div className="flex items-center justify-between min-w-[700px] text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#346385]"></span> Site SCADA / Field Log
              </span>
              <span className="text-[#c4c6cd]">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00050e]"></span> Cryptographic Hash
              </span>
              <span className="text-[#c4c6cd]">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#346385]"></span> Internal ESG Signoff
              </span>
              <span className="text-[#c4c6cd]">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0e5138]"></span> Third-Party Certification
              </span>
              <span className="text-[#c4c6cd]">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0e5138]"></span> SEBI BRSR Filing
              </span>
            </div>
          </div>

          {/* Evidence Table */}
          <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-[#c4c6cd]/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#e6e9e8] text-[#191c1c] text-[11px] uppercase font-bold">
                <tr>
                  <th className="p-3.5">Document ID</th>
                  <th className="p-3.5">Asset &amp; Parameter</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Reported Value</th>
                  <th className="p-3.5">Assurance Status</th>
                  <th className="p-3.5 text-right">Audit Trail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c6cd]/30 text-[#191c1c]">
                <tr className="hover:bg-[#f2f4f3] transition-colors">
                  <td className="p-3.5 font-mono text-xs font-bold text-[#00050e]">#EV-2024-892</td>
                  <td className="p-3.5 font-medium">Substation Solar Yield Log</td>
                  <td className="p-3.5 text-[#44474c]">Gujarat Charanka Site</td>
                  <td className="p-3.5 font-bold text-[#00050e]">14.2 GWh</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-[#b0f0ce] text-[#0e5138] rounded text-[11px] font-bold">
                      EY/KPMG Assured
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveModule('assurance');
                        setActiveSubtab('audit-trail');
                      }}
                      className="text-[#346385] hover:underline font-bold text-xs"
                    >
                      Verify Hash →
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#f2f4f3] transition-colors">
                  <td className="p-3.5 font-mono text-xs font-bold text-[#00050e]">#EV-2024-814</td>
                  <td className="p-3.5 font-medium">Tunnel Ambient Dust &amp; Air Monitoring</td>
                  <td className="p-3.5 text-[#44474c]">Zojila Pass Portal</td>
                  <td className="p-3.5 font-bold text-[#00050e]">42 μg/m³ (Normal)</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-[#b0f0ce] text-[#0e5138] rounded text-[11px] font-bold">
                      Independent Verified
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveModule('assurance');
                        setActiveSubtab('audit-trail');
                      }}
                      className="text-[#346385] hover:underline font-bold text-xs"
                    >
                      Verify Hash →
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#f2f4f3] transition-colors">
                  <td className="p-3.5 font-mono text-xs font-bold text-[#00050e]">#EV-2024-762</td>
                  <td className="p-3.5 font-medium">Workforce Safety Training Hours</td>
                  <td className="p-3.5 text-[#44474c]">All 48 Sites (Consolidated)</td>
                  <td className="p-3.5 font-bold text-[#00050e]">382,400 Hours</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-[#b0f0ce] text-[#0e5138] rounded text-[11px] font-bold">
                      DNV Assured
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveModule('assurance');
                        setActiveSubtab('audit-trail');
                      }}
                      className="text-[#346385] hover:underline font-bold text-xs"
                    >
                      Verify Hash →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 12. ESG ACTION CENTER */}
      {/* ============================================================================== */}
      <section className="w-full bg-white py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Operational Remediation</span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">ESG Action Center</h2>
              <p className="text-sm text-[#44474c] mt-1">
                Real-time tracking of site environmental anomalies, corrective actions, and stakeholder reviews.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#f2f4f3] text-[#191c1c] text-xs font-bold rounded-lg border border-[#c4c6cd]/30">
                Active Alerts: 3
              </span>
              <span className="px-2.5 py-1 bg-[#b0f0ce] text-[#0e5138] text-xs font-bold rounded-lg">
                100% Remediated on SLA
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-[#f2f4f3] rounded-xl border border-[#c4c6cd]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-lg">warning</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#00050e]">
                      Batching Plant #4 Cement Slag Water pH Level Deviation
                    </span>
                    <span className="px-2 py-0.5 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase rounded">
                      High Severity
                    </span>
                  </div>
                  <p className="text-xs text-[#44474c] mt-0.5">
                    Detected pH 9.4 in effluent basin. Automated dosing neutralizer triggered; secondary settlement confirmed.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-xs">
                <div>
                  <span className="text-[#44474c] block text-[11px]">Owner</span>
                  <span className="font-semibold text-[#191c1c]">Site EHS Lead</span>
                </div>
                <div>
                  <span className="text-[#44474c] block text-[11px]">Status</span>
                  <span className="font-bold text-[#0e5138]">Corrected &amp; Logged</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f2f4f3] rounded-xl border border-[#c4c6cd]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#cbe6ff] text-[#174b6c] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#00050e]">
                      BRSR Principle 3 Diversity Gender Ratio Data Submission - Q3
                    </span>
                    <span className="px-2 py-0.5 bg-[#cbe6ff] text-[#174b6c] text-[10px] font-bold uppercase rounded">
                      Medium Severity
                    </span>
                  </div>
                  <p className="text-xs text-[#44474c] mt-0.5">
                    Regional subcontractor employee rosters pending final human resources digital verification.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-xs">
                <div>
                  <span className="text-[#44474c] block text-[11px]">Owner</span>
                  <span className="font-semibold text-[#191c1c]">Corporate HR Desk</span>
                </div>
                <div>
                  <span className="text-[#44474c] block text-[11px]">Status</span>
                  <span className="font-bold text-[#346385]">In Review (88% done)</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f2f4f3] rounded-xl border border-[#c4c6cd]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#b0f0ce] text-[#0e5138] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#00050e]">
                      Quarterly Ambient Noise Report - Urban Flyover Project
                    </span>
                    <span className="px-2 py-0.5 bg-[#e1e3e2] text-[#44474c] text-[10px] font-bold uppercase rounded">
                      Low Severity
                    </span>
                  </div>
                  <p className="text-xs text-[#44474c] mt-0.5">
                    Acoustic baffles adjusted to maintain day/night limits within Central Pollution Control Board (CPCB) norms.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-xs">
                <div>
                  <span className="text-[#44474c] block text-[11px]">Owner</span>
                  <span className="font-semibold text-[#191c1c]">Environmental QA</span>
                </div>
                <div>
                  <span className="text-[#44474c] block text-[11px]">Status</span>
                  <span className="font-bold text-[#0e5138]">Resolved &amp; Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 13. EDITORIAL MEGAPROJECT STORIES */}
      {/* ============================================================================== */}
      <section className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Case Studies</span>
            <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
              Engineering That Touches Lives
            </h2>
            <p className="text-sm text-[#44474c] mt-2">
              Transforming challenging landscapes into corridors of prosperity, clean energy, and sustainable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col justify-between border border-[#c4c6cd]/40">
              <div>
                <img
                  alt="Zojila Tunnel portal"
                  className="w-full h-56 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY4PHsWAsdSI4NmeW_gezIDi6aoqXn3tDh2idcPWQX3oU2fWhNfzOQncINMeriEl8nxWNwAeASSdD1tlfG0YI90vEehzbWF0kLeToS1r2Mni_bVBV-gGWv4g24_w_ogPm5gZvna27K9kUtqbpZxbS_yt1ALHbJJbGf4Pwmj9ep2SQ-p1mkMpGxMpeVdcdYwLkRZvYnVw9XqGj3Y63Rmh17XnQgBZ_5rcrLopudoqEWb2Ff_uCd01u1MQ"
                />
                <div className="p-6">
                  <span className="px-2.5 py-0.5 bg-[#d1e4ff] text-[#081d30] text-[11px] font-bold rounded">
                    Civil Triumph
                  </span>
                  <h3 className="text-lg font-bold text-[#00050e] mt-2">Breaking Winter Isolation at Zojila</h3>
                  <p className="text-xs text-[#44474c] mt-2 leading-relaxed">
                    Conquering extreme sub-zero temperatures and avalanche risks at 11,578 feet to construct the longest bi-directional road tunnel in Asia, securing year-round civilian and medical transit.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-[#c4c6cd]/30 flex justify-between items-center text-xs">
                <span className="font-semibold text-[#346385]">SDG 9 • BRSR P2</span>
                <button
                  onClick={() => {
                    setActiveModule('overview');
                    setActiveSubtab('gis-map');
                  }}
                  className="text-[#00050e] font-bold hover:underline"
                >
                  View on GIS Map →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col justify-between border border-[#c4c6cd]/40">
              <div>
                <img
                  alt="Kaleshwaram Lift Irrigation"
                  className="w-full h-56 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDviEKmFDKfBjwFxsxXqrro6T2ZwB9I36s-AXHs67TaIkyFSz8wiDhtHXGh9LXRszswsNNrmie-O0Cu3cULNpTKQ8eKu3MkaT_6QlNByG3LSor3O2mSfHMyqJyzJlTOJR-NXwEd6hD5dA8Aqui7_W6sDA9yKEBDCU_dXvzG-RaUvB9HuaoCxHdRbYQxncbzyQkA78EvA9O0vCr2Jget2e8HvsXGDpUEOVOmpVdzmRYM70Wg0l08XkHhDg"
                />
                <div className="p-6">
                  <span className="px-2.5 py-0.5 bg-[#b0f0ce] text-[#0e5138] text-[11px] font-bold rounded">
                    Water Stewardship
                  </span>
                  <h3 className="text-lg font-bold text-[#00050e] mt-2">Lifting Rivers to Parched Fields</h3>
                  <p className="text-xs text-[#44474c] mt-2 leading-relaxed">
                    Harnessing Godavari floods to lift billions of cubic feet of water up 500 meters of elevation, reviving thousands of lakes and nourishing 4.5 million acres of farmland.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-[#c4c6cd]/30 flex justify-between items-center text-xs">
                <span className="font-semibold text-[#346385]">SDG 6 • BRSR P6</span>
                <button
                  onClick={() => {
                    setActiveModule('overview');
                    setActiveSubtab('gis-map');
                  }}
                  className="text-[#00050e] font-bold hover:underline"
                >
                  View on GIS Map →
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col justify-between border border-[#c4c6cd]/40">
              <div>
                <img
                  alt="Gujarat solar grid"
                  className="w-full h-56 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-ua0817ke8b7lqlcSXR5y5s4S97fnrYrxJ2fYeiGGLKU5-uLtxkY-_W2-c37E7WEU2R45OllXzfV6BXuBoZSmHJimKFDyYLQdlQXqtVhjImqYN583VQW9m_WwfyqJzJgGAq7wx2JdgRMVSvLK1aWvI8-xbQYgk4z-J_8e5BifAe6ev_oySRh2UVDYqMBKsopgVk1ZiJqyIejKKfo16gw5cSBbnMS8bIXbjkx_4RmfqVgDfLWQKC889w"
                />
                <div className="p-6">
                  <span className="px-2.5 py-0.5 bg-[#cbe6ff] text-[#174b6c] text-[11px] font-bold rounded">
                    Clean Energy
                  </span>
                  <h3 className="text-lg font-bold text-[#00050e] mt-2">Powering the Grid with Clean Electrons</h3>
                  <p className="text-xs text-[#44474c] mt-2 leading-relaxed">
                    Synchronizing large-scale solar arrays into the interstate transmission grid with automated SCADA systems, displacing thousands of metric tons of fossil combustion every day.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-[#c4c6cd]/30 flex justify-between items-center text-xs">
                <span className="font-semibold text-[#346385]">SDG 7 • BRSR P6</span>
                <button
                  onClick={() => {
                    setActiveModule('overview');
                    setActiveSubtab('gis-map');
                  }}
                  className="text-[#00050e] font-bold hover:underline"
                >
                  View on GIS Map →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 14. REPORTS & STATUTORY DISCLOSURES */}
      {/* ============================================================================== */}
      <section id="reports" className="w-full bg-white py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">
                Public Transparency Repository
              </span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight mt-1">
                Reports &amp; Statutory Disclosures
              </h2>
              <p className="text-sm text-[#44474c] mt-1">
                Download certified sustainability reports, statutory SEBI filings, and third-party assurance letters.
              </p>
            </div>
            <div className="text-xs text-[#44474c]">
              Regulatory Year: <span className="font-bold text-[#00050e]">FY 2024-25 (Active)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'MEIL-AIR-24',
                title: 'MEIL Annual Integrated Report FY 2023-24',
                desc: 'Comprehensive integrated disclosure combining audited financials, ESG governance, and operational scorecards.',
                date: 'Published: Aug 2024',
                icon: 'picture_as_pdf',
                color: 'text-[#346385]',
              },
              {
                id: 'SEBI-BRSR-24',
                title: 'SEBI BRSR Comprehensive Disclosure FY 2023-24',
                desc: 'Formal Business Responsibility & Sustainability Report covering Principles 1 to 9 with XBRL tagging.',
                date: 'Published: Sep 2024',
                icon: 'fact_check',
                color: 'text-[#0e5138]',
              },
              {
                id: 'NET-ZERO-30',
                title: 'Climate Action & Decarbonization Roadmap 2030',
                desc: 'Strategic pathway detailing heavy equipment electrification and renewable energy integration targets.',
                date: 'Published: Jul 2024',
                icon: 'energy_savings_leaf',
                color: 'text-[#346385]',
              },
              {
                id: 'ISO-14064',
                title: 'Third-Party GHG Limited Assurance Statement',
                desc: 'Independent certifier signoff verifying Scope 1, Scope 2, and monitored Scope 3 emissions calculations.',
                date: 'Published: Sep 2024',
                icon: 'verified',
                color: 'text-[#0e5138]',
              },
              {
                id: 'CSR-ANN-24',
                title: 'Corporate CSR Policy & Committee Minutes',
                desc: 'Statutory annual report on CSR allocations, project expenditure proofs, and direct beneficiary impacts.',
                date: 'Published: Oct 2024',
                icon: 'volunteer_activism',
                color: 'text-[#346385]',
              },
              {
                id: 'GOV-CHARTER',
                title: 'Code of Conduct & Whistleblower Charters',
                desc: 'Statutory governance principles, anti-bribery policies, and vendor integrity guidelines.',
                date: 'Published: Jan 2024',
                icon: 'gavel',
                color: 'text-[#00050e]',
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="p-5 bg-[#f2f4f3] rounded-xl shadow-xs hover:bg-[#e6e9e8] transition-all flex flex-col justify-between border border-[#c4c6cd]/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`material-symbols-outlined text-3xl ${doc.color}`}>{doc.icon}</span>
                    <span className="font-mono text-xs text-[#44474c]">{doc.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#00050e]">{doc.title}</h4>
                  <p className="text-xs text-[#44474c] mt-1.5 leading-relaxed">{doc.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#c4c6cd]/30 flex justify-between items-center">
                  <span className="text-[11px] text-[#44474c]">{doc.date}</span>
                  <button
                    onClick={() => {
                      setActiveModule('assurance');
                      setActiveSubtab('report');
                    }}
                    className="px-3 py-1 bg-[#00050e] text-white text-[11px] font-bold rounded-md hover:bg-[#346385] transition-colors"
                  >
                    View in App →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 15. ABOUT MEIL & VALUES COMMITMENT */}
      {/* ============================================================================== */}
      <section id="about-meil" className="w-full bg-[#f2f4f3] py-16 border-b border-[#e1e3e2]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs uppercase tracking-wider text-[#346385] font-bold">Institutional Heritage</span>
              <h2 className="text-3xl text-[#00050e] font-extrabold tracking-tight">
                Megha Engineering &amp; Infrastructures Ltd.
              </h2>
              <p className="text-xs sm:text-sm text-[#44474c] leading-relaxed">
                Established in 1989, MEIL has grown into one of India’s foremost infrastructure conglomerates. Guided by precision engineering, technical resilience, and environmental stewardship, MEIL delivers nation-critical infrastructure projects that uplift communities and sustain future generations.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-2xl font-extrabold text-[#00050e]">1989</p>
                  <p className="text-xs text-[#44474c]">Year Established</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#00050e]">18+</p>
                  <p className="text-xs text-[#44474c]">Indian States</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#00050e]">45,000+</p>
                  <p className="text-xs text-[#44474c]">Direct Personnel</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-xl shadow-sm border border-[#c4c6cd]/40">
              <h3 className="text-base font-bold text-[#00050e] mb-4">Core Organizational Commitments</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#f2f4f3] rounded-lg border border-[#c4c6cd]/30">
                  <span className="font-bold text-[#00050e] block">Safety First</span>
                  <span className="text-[#44474c] text-[11px]">Uncompromising adherence to Vision Zero protocols.</span>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-lg border border-[#c4c6cd]/30">
                  <span className="font-bold text-[#00050e] block">Quality &amp; Rigour</span>
                  <span className="text-[#44474c] text-[11px]">Precision engineering built for centuries of operation.</span>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-lg border border-[#c4c6cd]/30">
                  <span className="font-bold text-[#00050e] block">Ecological Care</span>
                  <span className="text-[#44474c] text-[11px]">Decarbonization, water circularity &amp; biodiversity buffers.</span>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-lg border border-[#c4c6cd]/30">
                  <span className="font-bold text-[#00050e] block">Social Value</span>
                  <span className="text-[#44474c] text-[11px]">Direct community empowerment and inclusive local hiring.</span>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-lg border border-[#c4c6cd]/30">
                  <span className="font-bold text-[#00050e] block">Ethical Governance</span>
                  <span className="text-[#44474c] text-[11px]">Zero tolerance for corruption, 100% statutory transparency.</span>
                </div>
                <div className="p-3 bg-[#f2f4f3] rounded-lg border border-[#c4c6cd]/30">
                  <span className="font-bold text-[#00050e] block">Audited Integrity</span>
                  <span className="text-[#44474c] text-[11px]">Independent verification for all sustainability indicators.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================== */}
      {/* 16. CORPORATE FOOTER */}
      {/* ============================================================================== */}
      <footer className="w-full bg-[#0b1f33] text-white border-t border-[#00050e]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
            {/* Brand column */}
            <div className="space-y-4 lg:pr-4">
              <div className="p-2.5 bg-white rounded-xl inline-block shadow-sm">
                <img
                  alt="Official MEIL Corporate Brand Logo"
                  className="h-9 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXHa_r26uT0PK47f9Dg29f-nsNkZ2P1gdZM0aUovv1KCnLCD5xN1m3rF9RPBBDgs7jU9zxc_dF6k8rrFCRzTaG6wWaAQ4FnbeSP865TVGTuudBYTCw39rJd3XjbVYSjtRrtS0iK8p5FZcwCRSRLGDxt_4cbAqJf0EXcBlRFJnRaBsMNOgWQ6uWzJitKPmsg29NyelmiqHknTifk5ZFb6AIEgi9vOHCVxWYbnXlLk5k1J1WuZXF0lEjx4MFgKcOgayadAk"
                />
              </div>
              <p className="text-base text-white font-bold tracking-tight">Engineering Progress. Measuring Impact.</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Leading India's sustainable infrastructure modernization across bulk water transmission, clean energy grids, heavy civil engineering, and statutory BRSR transparency.
              </p>
              <div className="flex items-center gap-2 pt-2 text-slate-300 text-xs">
                <span className="material-symbols-outlined text-base text-[#b0f0ce]">verified_user</span>
                <span>Audited Statutory Entity</span>
              </div>
            </div>

            {/* Links 1 */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4 pb-2 border-b border-white/10">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setIsGatewayOpen(true)}>About MEIL</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('overview'); setActiveSubtab('gis-map'); }}>Businesses &amp; Sectors</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('overview'); setActiveSubtab('gis-map'); }}>Engineering Projects</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('governance'); }}>Board of Directors</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setIsTourOpen(true)}>Interactive Tour</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('assurance'); setActiveSubtab('report'); }}>Corporate Disclosures</li>
              </ul>
            </div>

            {/* Links 2 */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4 pb-2 border-b border-white/10">
                ESG &amp; Sustainability
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('overview'); setActiveSubtab('dashboard'); }}>ESG Governance Framework</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('collection'); setActiveSubtab('section-c'); }}>BRSR Core Principles P1–P9</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('overview'); setActiveSubtab('sdg-heatmap'); }}>SDG Mapping Matrix</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('overview'); setActiveSubtab('dashboard'); }}>CSR &amp; Community Impact</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('analytics'); }}>Clean Energy Transition</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('analytics'); }}>Emissions &amp; Scope 1, 2, 3</li>
              </ul>
            </div>

            {/* Links 3 */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4 pb-2 border-b border-white/10">
                Intelligence &amp; Disclosures
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('overview'); setActiveSubtab('dashboard'); }}>Live Telemetry Portal</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('assurance'); setActiveSubtab('audit-trail'); }}>Evidence &amp; Assurance Trail</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('analytics'); }}>Remediation Action Center</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('assurance'); setActiveSubtab('report'); }}>Statutory BRSR Filing 2024</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('assurance'); setActiveSubtab('report'); }}>Integrated Annual Reports</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setActiveModule('copilot'); }}>AI Statutory Copilot</li>
              </ul>
            </div>

            {/* Headquarters */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white font-bold mb-4 pb-2 border-b border-white/10">
                Corporate Headquarters
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <p className="text-white font-semibold">Megha Engineering &amp; Infrastructures Ltd.</p>
                <p className="leading-relaxed">
                  S-2, Technocrat Industrial Estate, Balanagar, Hyderabad – 500037, Telangana, India.
                </p>
                <p className="text-slate-400 font-mono text-[11px] pt-1">CIN: U45202TG1989PLC009991</p>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-[11px] text-white uppercase font-bold">Statutory Desk</p>
                  <p className="text-slate-400">esg.compliance@meilgroup.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2024 Megha Engineering &amp; Infrastructures Limited (MEIL). All Rights Reserved.</p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <span className="text-white/20">|</span>
              <a className="hover:text-white transition-colors" href="#">Terms of Use</a>
              <span className="text-white/20">|</span>
              <a className="hover:text-white transition-colors" href="#">BRSR Statutory Disclaimer</a>
              <span className="text-white/20">|</span>
              <span className="text-[#b0f0ce] font-semibold">ISO 14001 &amp; ISO 45001 Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
