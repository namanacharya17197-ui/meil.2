import React, { useState, useRef, useEffect } from 'react';
import { useEsg } from '../../context/EsgContext';
import { UserRole, ReportingCycle } from '../../types/esg';
import { MeilLogo } from './MeilLogo';
import {
  Building2,
  ChevronDown,
  Search,
  ShieldCheck,
  Calendar,
  UserCheck,
  Compass,
  Sparkles,
  LogOut,
  Layers,
  MapPin,
  Check,
  AlertTriangle,
  Globe,
} from 'lucide-react';

const ROLES: UserRole[] = [
  'Group ESG Admin',
  'Subsidiary Approver',
  'Business Unit Reviewer',
  'Project Data Entry User',
  'Independent Auditor (ISAE 3000)',
  'Board Viewer',
];

const REPORTING_CYCLES: ReportingCycle[] = [
  'FY 2024-25 (Active)',
  'FY 2025-26 (Draft)',
  'FY 2023-24 (Archived)',
];

export const Header: React.FC = () => {
  const {
    selectedSiteId,
    setSelectedSiteId,
    selectedCycle,
    setSelectedCycle,
    currentRole,
    setCurrentRole,
    sites,
    setIsTourOpen,
    setActiveModule,
    setActiveSubtab,
    setIsGatewayOpen,
    anomalies,
  } = useEsg();

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [siteSearch, setSiteSearch] = useState('');
  const [cycleDropdownOpen, setCycleDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const siteDropdownRef = useRef<HTMLDivElement>(null);
  const cycleDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(event.target as Node)) {
        setSiteDropdownOpen(false);
      }
      if (cycleDropdownRef.current && !cycleDropdownRef.current.contains(event.target as Node)) {
        setCycleDropdownOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSite = sites.find((s) => s.id === selectedSiteId);

  const filteredSites = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.division.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.state.toLowerCase().includes(siteSearch.toLowerCase())
  );

  // Group sites by division for clear hierarchy in dropdown
  const divisions = Array.from(new Set(sites.map((s) => s.division)));

  const openAnomaliesCount = anomalies.filter((a) => a.status === 'Open').length;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-50 px-4 flex items-center justify-between shadow-lg shadow-black/20">
      {/* Left: MEIL Brand & Core Badge */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveModule('overview')}
          className="flex items-center gap-3 text-left group focus-visible:outline-none"
        >
          {/* Official MEIL Logo (Red emblem + Blue meil wordmark) */}
          <div className="bg-black/80 px-2 py-1 rounded-lg border border-slate-700/80 shadow-inner flex items-center group-hover:border-slate-500 transition-colors">
            <MeilLogo height={28} showText={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-sm group-hover:text-emerald-400 transition-colors">
                ESG CONNECT PLATFORM
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                SEBI BRSR Core Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Megha Engineering & Infrastructures Ltd · ISAE 3000 Ready
            </p>
          </div>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden lg:block" />

        {/* Global Site / Entity Switcher */}
        <div className="relative" ref={siteDropdownRef}>
          <button
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-200 transition-all max-w-[280px] xl:max-w-[340px]"
            title="Switch Reporting Entity / Infrastructure Site"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="truncate text-left">
              <span className="font-medium text-white">
                {selectedSiteId === 'all' ? 'All Infrastructure Sites (Group)' : currentSite?.code}
              </span>
              <span className="text-slate-400 text-[11px] ml-1">
                {selectedSiteId === 'all' ? `(${sites.length} Active Sites)` : `· ${currentSite?.name}`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {siteDropdownOpen && (
            <div className="absolute left-0 mt-2 w-96 max-h-[480px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2.5 border-b border-slate-800 bg-slate-950/60">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={siteSearch}
                    onChange={(e) => setSiteSearch(e.target.value)}
                    placeholder="Search 25+ mega projects, dams, tunnels..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-[380px] p-2 space-y-2">
                <button
                  onClick={() => {
                    setSelectedSiteId('all');
                    setSiteDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    selectedSiteId === 'all'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">MEIL Consolidated Group</div>
                      <div className="text-[10px] text-slate-400">All 25+ Sites · 100% Core Scope Ingestion</div>
                    </div>
                  </div>
                  {selectedSiteId === 'all' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>

                {divisions.map((div) => {
                  const divSites = filteredSites.filter((s) => s.division === div);
                  if (divSites.length === 0) return null;
                  return (
                    <div key={div} className="pt-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-slate-500" />
                        <span>{div}</span>
                        <span className="text-slate-600">({divSites.length})</span>
                      </div>
                      <div className="space-y-1">
                        {divSites.map((site) => (
                          <button
                            key={site.id}
                            onClick={() => {
                              setSelectedSiteId(site.id);
                              setSiteDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                              selectedSiteId === site.id
                                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                                : 'text-slate-300 hover:bg-slate-800/70'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="font-medium text-slate-100 flex items-center gap-1.5">
                                <span>{site.code}</span>
                                <span className="text-slate-400 font-normal">· {site.name}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{site.state}, {site.country}</span>
                                <span>·</span>
                                <span className="text-emerald-400/90">{site.scope1 + site.scope2} tCO2e</span>
                              </div>
                            </div>
                            {selectedSiteId === site.id && (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center / Right: Cycle Selector, Role Simulator, AI Tour, Profile */}
      <div className="flex items-center gap-3">
        {/* Reporting Cycle Selector */}
        <div className="relative" ref={cycleDropdownRef}>
          <button
            onClick={() => setCycleDropdownOpen(!cycleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-200 transition-colors"
            title="Select Financial Year Reporting Cycle"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-medium">{selectedCycle}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {cycleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-1.5 z-50">
              <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Statutory Reporting Cycle
              </div>
              {REPORTING_CYCLES.map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => {
                    setSelectedCycle(cycle);
                    setCycleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                    selectedCycle === cycle
                      ? 'bg-sky-950/60 text-sky-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{cycle}</span>
                  {selectedCycle === cycle && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role Simulator Context Switcher */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-700/50 rounded-lg text-xs text-indigo-200 transition-colors"
            title="Simulate Enterprise Role Context"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] text-indigo-400/80 leading-none">Role View</div>
              <div className="font-medium text-white truncate max-w-[130px]">{currentRole}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-300" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[10px] font-semibold text-indigo-400 px-2 py-1 uppercase tracking-wider flex items-center justify-between">
                <span>Enterprise Role Simulator</span>
                <span className="text-[9px] bg-indigo-900/60 text-indigo-300 px-1 rounded">Live Demo</span>
              </div>
              <div className="space-y-1 mt-1">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                      currentRole === role
                        ? 'bg-indigo-900/40 text-indigo-200 font-semibold border border-indigo-700/50'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div>{role}</div>
                      <div className="text-[10px] text-slate-500">
                        {role === 'Group ESG Admin' && 'Full executive access, approvals & XBRL lock'}
                        {role === 'Subsidiary Approver' && 'Division level four-eyes sign-off'}
                        {role === 'Business Unit Reviewer' && 'Site KPI verification & memo drafting'}
                        {role === 'Project Data Entry User' && 'Quick-entry spreadsheet & invoice upload'}
                        {role === 'Independent Auditor (ISAE 3000)' && 'Assurance checks, recalculate & audit logs'}
                        {role === 'Board Viewer' && 'Read-only strategic heatmaps & ESG summaries'}
                      </div>
                    </div>
                    {currentRole === role && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Anomaly Quick Alert pill button if any open */}
        {openAnomaliesCount > 0 && (
          <button
            onClick={() => {
              setActiveModule('analytics');
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-lg text-xs text-amber-300 transition-colors"
            title={`${openAnomaliesCount} Data Quality Anomalies Detected`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-semibold">{openAnomaliesCount} Flagged</span>
          </button>
        )}

        {/* AI Copilot Quick Launch */}
        <button
          onClick={() => setActiveModule('copilot')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-emerald-950 to-teal-950 hover:from-emerald-900 hover:to-teal-900 border border-emerald-700/50 rounded-lg text-xs text-emerald-300 transition-all shadow-sm"
          title="Open AI Copilot for Narratives, Anomaly Explanations & Gap Analysis"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline font-medium">AI Copilot</span>
        </button>

        {/* Public Corporate Landing Portal */}
        <button
          onClick={() => {
            setActiveModule('overview');
            setActiveSubtab('hero-landing');
          }}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 transition-colors"
          title="Open Public ESG & Impact Portal"
        >
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>Public Portal</span>
        </button>

        {/* Guided Tour Trigger */}
        <button
          onClick={() => setIsTourOpen(true)}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          title="Launch Guided Interactive Tour"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* User Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-800/80 rounded-lg transition-colors focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-emerald-400 shadow-inner">
              KR
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-100 leading-none">K. V. Rao</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5">Chief Sustainability Officer</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-1">
                <div className="font-semibold text-xs text-white">K. V. Rao</div>
                <div className="text-[11px] text-slate-400">cso@meilgroup.com</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Megha Engineering & Infrastructures Ltd</div>
              </div>
              <button
                onClick={() => {
                  setIsGatewayOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enterprise Gateway / Access Keys</span>
              </button>
              <button
                onClick={() => {
                  setIsTourOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Product Walkthrough & Help</span>
              </button>
              <div className="border-t border-slate-800 my-1" />
              <button
                onClick={() => {
                  setIsGatewayOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg text-left transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
