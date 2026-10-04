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
  Sun,
  Moon,
  Lock,
  Tag,
} from 'lucide-react';

const ROLES: { role: UserRole; scopeLabel: string; desc: string }[] = [
  {
    role: 'Group ESG Admin',
    scopeLabel: 'Scope: Full MEIL Group (Unrestricted)',
    desc: 'Full access to all modules, subsidiaries, BU, projects, approvals, XBRL lock & settings',
  },
  {
    role: 'Subsidiary Approver',
    scopeLabel: 'Scope: Megha Hydro Infrastructure Ltd',
    desc: 'Assigned subsidiary sign-off, four-eyes review, approval & rejection controls',
  },
  {
    role: 'Business Unit Reviewer',
    scopeLabel: 'Scope: Hydro & Irrigation Division',
    desc: 'Assigned BU KPI verification, review ESG entries, comment & request corrections',
  },
  {
    role: 'Project Data Entry User',
    scopeLabel: 'Scope: Site #042 • Polavaram Multi-Purpose',
    desc: 'Draft telemetry entry, fuel & grid weighbridge slip uploads for assigned project only',
  },
  {
    role: 'Independent Auditor (ISAE 3000)',
    scopeLabel: 'Scope: Statutory ISAE 3000 Assurance Scope',
    desc: 'Read-only access to approved records, evidence files, recalculations & audit logs',
  },
  {
    role: 'Board Viewer',
    scopeLabel: 'Scope: Executive Board Strategic Governance',
    desc: 'Read-only access to strategic ESG dashboards, high-level KPIs, heatmaps & summaries',
  },
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
    sites,
    scopedSites,
    setIsTourOpen,
    setActiveModule,
    setActiveSubtab,
    setIsLoginModalOpen,
    anomalies,
    currentUser,
    userScope,
    logout,
    theme,
    toggleTheme,
    isDemoMode,
    switchDemoRole,
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

  const filteredSites = scopedSites.filter(
    (s) =>
      s.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.division.toLowerCase().includes(siteSearch.toLowerCase()) ||
      s.state.toLowerCase().includes(siteSearch.toLowerCase())
  );

  const divisions = Array.from(new Set(scopedSites.map((s) => s.division)));
  const openAnomaliesCount = anomalies.filter((a) => a.status === 'Open').length;
  const isSiteSelectionLocked = currentRole === 'Project Data Entry User';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-50 px-4 flex items-center justify-between shadow-lg shadow-black/20">
      {/* Left: MEIL Brand & Site Scoping */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveModule('overview')}
          className="flex items-center gap-3 text-left group focus-visible:outline-none cursor-pointer"
        >
          {/* Official MEIL Logo */}
          <div className="bg-black/80 px-2 py-1 rounded-lg border border-slate-700/80 shadow-inner flex items-center group-hover:border-slate-500 transition-colors">
            <MeilLogo height={28} showText={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-sm group-hover:text-emerald-400 transition-colors">
                ESG CONNECT PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Megha Engineering & Infrastructures Ltd · RBAC Governed
            </p>
          </div>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden lg:block" />

        {/* Global Site / Entity Switcher (Scoped by Active Role) */}
        <div className="relative" ref={siteDropdownRef}>
          <button
            onClick={() => {
              if (!isSiteSelectionLocked) {
                setSiteDropdownOpen(!siteDropdownOpen);
              }
            }}
            disabled={isSiteSelectionLocked}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs transition-all max-w-[280px] xl:max-w-[340px] ${
              isSiteSelectionLocked
                ? 'bg-slate-950/70 border-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-200 cursor-pointer'
            }`}
            title={
              isSiteSelectionLocked
                ? `Locked to assigned project: ${userScope.projectName || userScope.projectId}`
                : 'Switch Reporting Entity / Infrastructure Site'
            }
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="truncate text-left">
              <span className="font-medium text-white">
                {selectedSiteId === 'all'
                  ? currentRole === 'Subsidiary Approver'
                    ? 'Hydro Subsidiary Sites'
                    : 'All Scoped Infrastructure Sites'
                  : currentSite?.code}
              </span>
              <span className="text-slate-400 text-[11px] ml-1">
                {selectedSiteId === 'all'
                  ? `(${scopedSites.length} Sites in Scope)`
                  : `· ${currentSite?.name}`}
              </span>
            </div>
            {!isSiteSelectionLocked ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
            ) : (
              <span title="Scope Locked by RBAC" className="shrink-0 ml-auto flex items-center">
                <Lock className="w-3 h-3 text-amber-400" />
              </span>
            )}
          </button>

          {siteDropdownOpen && !isSiteSelectionLocked && (
            <div className="absolute left-0 mt-2 w-96 max-h-[480px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2.5 border-b border-slate-800 bg-slate-950/60">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={siteSearch}
                    onChange={(e) => setSiteSearch(e.target.value)}
                    placeholder="Search permitted projects..."
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
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    selectedSiteId === 'all'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                        : 'text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-white">
                          {currentRole === 'Subsidiary Approver'
                            ? 'All Subsidiary Sites (Megha Hydro)'
                            : 'Consolidated Scoped Entity'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {scopedSites.length} Sites Authorized in Current Role Scope
                        </div>
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
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
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
                                <span>{site.subsidiary}</span>
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

        {/* User Scope Pill Indicator */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/70 border border-slate-800 rounded-lg text-[11px] text-slate-300">
          <Tag className="w-3 h-3 text-indigo-400 shrink-0" />
          <span className="text-slate-500 font-mono">Scope:</span>
          <span className="font-medium text-slate-200 truncate max-w-[200px]" title={userScope.description}>
            {userScope.projectId
              ? `Site #042 Polavaram`
              : userScope.subsidiary
              ? userScope.subsidiary
              : userScope.businessUnit
              ? userScope.businessUnit
              : 'All MEIL Group'}
          </span>
        </div>
      </div>

      {/* Center / Right Controls: Cycle, Demo Simulator, Theme, Tour, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reporting Cycle Selector */}
        <div className="relative" ref={cycleDropdownRef}>
          <button
            onClick={() => setCycleDropdownOpen(!cycleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-200 transition-colors cursor-pointer"
            title="Active Statutory Cycle"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline font-medium">{selectedCycle}</span>
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
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

        {/* DEMO MODE: Role Simulator Context Switcher */}
        {isDemoMode && (
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/50 rounded-lg text-xs text-indigo-200 transition-colors cursor-pointer shadow-sm shadow-indigo-950"
              title="Simulate Enterprise Role Context"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-amber-300 font-bold uppercase tracking-wider leading-none">
                  Live Demo Role
                </div>
                <div className="font-semibold text-white truncate max-w-[140px] mt-0.5">
                  {currentRole}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-indigo-700/60 rounded-xl shadow-2xl p-2.5 z-50">
                <div className="px-2 py-1.5 border-b border-indigo-900/60 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                      Live Demo: Role Simulator
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                    Testing Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 px-2 mb-2 leading-relaxed">
                  Switch personas to verify strict RBAC filtering, menu permissions, 403 route protection, and scoped project data:
                </p>

                <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                  {ROLES.map(({ role, scopeLabel, desc }) => (
                    <button
                      key={role}
                      onClick={() => {
                        switchDemoRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                        currentRole === role
                          ? 'bg-indigo-950/80 text-indigo-100 font-semibold border border-indigo-600/70 shadow-sm'
                          : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="text-white font-bold flex items-center gap-1.5">
                          <span>{role}</span>
                          {currentRole === role && (
                            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-800">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-indigo-300 font-medium">
                          {scopeLabel}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">
                          {desc}
                        </div>
                      </div>
                      {currentRole === role && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Anomaly Quick Alert pill button if any open */}
        {openAnomaliesCount > 0 && currentRole !== 'Project Data Entry User' && (
          <button
            onClick={() => setActiveModule('analytics')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-lg text-xs text-amber-300 transition-colors cursor-pointer"
            title={`${openAnomaliesCount} Data Quality Anomalies Detected`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-semibold">{openAnomaliesCount} Flagged</span>
          </button>
        )}

        {/* Dark Mode & Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition-all shadow-sm focus-visible:outline-none cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Dark and Light Mode"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Dark</span>
            </>
          )}
        </button>

        {/* Guided Tour Trigger */}
        <button
          onClick={() => setIsTourOpen(true)}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Launch Guided Interactive Tour"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* User Profile Menu with Scope Display */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-800/80 rounded-lg transition-colors focus-visible:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-emerald-400 shadow-inner">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'KR'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-semibold text-slate-100 leading-none">
                {currentUser?.name || 'K. V. Rao'}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate max-w-[130px]">
                {currentUser?.title || currentRole}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-50">
              <div className="px-2 py-2 border-b border-slate-800 mb-2 space-y-1">
                <div className="font-bold text-xs text-white">{currentUser?.name || 'K. V. Rao'}</div>
                <div className="text-[11px] text-slate-400 font-mono">{currentUser?.email || 'cso@meilgroup.com'}</div>
                <div className="inline-block text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                  {currentRole}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 leading-snug">
                  <strong>Scope:</strong> {userScope.description}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveModule('overview');
                  setActiveSubtab('hero-landing');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public Corporate Landing Portal</span>
              </button>

              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Authentication Gateway</span>
              </button>

              <button
                onClick={() => {
                  setIsTourOpen(true);
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Product Walkthrough & Help</span>
              </button>

              <div className="border-t border-slate-800 my-1.5" />

              <button
                onClick={() => {
                  logout();
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg text-left transition-colors font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out & Terminate Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
