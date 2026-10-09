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
    activeModule,
    setActiveModule,
    setActiveSubtab,
    setIsLoginModalOpen,
    anomalies,
    currentUser,
    userScope,
    logout,
    theme,
    toggleTheme,
  } = useEsg();

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [siteSearch, setSiteSearch] = useState('');
  const [cycleDropdownOpen, setCycleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const siteDropdownRef = useRef<HTMLDivElement>(null);
  const cycleDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (siteDropdownRef.current && !siteDropdownRef.current.contains(event.target as Node)) {
        setSiteDropdownOpen(false);
      }
      if (cycleDropdownRef.current && !cycleDropdownRef.current.contains(event.target as Node)) {
        setCycleDropdownOpen(false);
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
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 z-50 px-3 xl:px-4 flex items-center justify-between gap-2 xl:gap-3 shadow-lg shadow-black/20">
      {/* Left: MEIL Brand & Site Scoping */}
      <div className="flex items-center gap-2 xl:gap-3 shrink-0">
        <button
          onClick={() => setActiveModule('dashboard')}
          className="flex items-center gap-2 text-left group focus-visible:outline-none cursor-pointer shrink-0"
        >
          {/* Official MEIL Logo */}
          <div className="bg-black/80 px-1.5 py-1 rounded-lg border border-slate-700/80 shadow-inner flex items-center group-hover:border-slate-500 transition-colors">
            <MeilLogo height={24} showText={true} />
          </div>
          <div className="hidden xl:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-xs group-hover:text-emerald-400 transition-colors">
                ESG CONNECT
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              MEIL · BRSR
            </p>
          </div>
        </button>

        <div className="h-5 w-px bg-slate-800 hidden md:block shrink-0" />

        {/* Global Site / Entity Switcher (Scoped by Active Role) */}
        <div className="relative shrink-0" ref={siteDropdownRef}>
          <button
            onClick={() => {
              if (!isSiteSelectionLocked) {
                setSiteDropdownOpen(!siteDropdownOpen);
              }
            }}
            disabled={isSiteSelectionLocked}
            className={`flex items-center gap-1.5 px-2 py-1 border rounded-lg text-[11px] transition-all max-w-[125px] sm:max-w-[145px] shrink-0 ${
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
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <div className="truncate text-left min-w-0">
              <span className="font-semibold text-white">
                {selectedSiteId === 'all'
                  ? `Sites (${scopedSites.length})`
                  : currentSite?.code}
              </span>
            </div>
            {!isSiteSelectionLocked ? (
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-auto" />
            ) : (
              <span title="Scope Locked by RBAC" className="shrink-0 ml-auto flex items-center">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
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
      </div>

      {/* Right Controls: Cycle, Alerts, Theme, Tour, Profile */}
      <div className="flex items-center gap-1.5 xl:gap-2.5 shrink-0">
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
