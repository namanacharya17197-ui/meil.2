import React, { useState, useMemo } from 'react';
import { useEsg } from '../../context/EsgContext';
import {
  LayoutDashboard,
  Network,
  FileSpreadsheet,
  Cpu,
  ShieldAlert,
  Sparkles,
  Settings,
  ChevronRight,
  Globe,
  Lock,
  BarChart3,
  Flame,
  CheckSquare,
  FileText,
  FileCheck2,
  BrainCircuit,
  Database,
  Sliders,
  PanelLeftClose,
  PanelLeft,
  Calculator,
  Droplets,
  Gauge,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface NavModule {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  subtabs: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[];
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    activeSubtab,
    setActiveSubtab,
    approvals,
    anomalies,
    setIsLoginModalOpen,
    currentRole,
    isModuleAuthorized,
    isSubtabAuthorized,
    userScope,
  } = useEsg();

  const [collapsed, setCollapsed] = useState(false);

  const pendingApprovalsCount = approvals.filter(
    (a) => a.status === 'Pending Review' || a.status === 'Clarification Requested'
  ).length;
  const openAnomaliesCount = anomalies.filter((a) => a.status === 'Open').length;

  const rawModules: NavModule[] = [
    {
      id: 'overview',
      title: 'Overview & Home',
      icon: LayoutDashboard,
      subtabs: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3 },
        { id: 'gis-map', label: 'Infrastructure GIS Map', icon: Globe },
        { id: 'sdg-heatmap', label: 'SDG Heatmap & Targets', icon: Flame },
        { id: 'hero-landing', label: 'Public Portal / Landing', icon: Globe },
        { id: 'gateway', label: 'Enterprise Gateway / Login', icon: Lock },
      ],
    },
    {
      id: 'governance',
      title: 'Governance & Structure',
      icon: Network,
      subtabs: [
        { id: 'org-tree', label: 'Hierarchy Tree & Assets', icon: Network },
        { id: 'submission-matrix', label: 'Reporting Matrix & Cycles', icon: CheckSquare },
      ],
    },
    {
      id: 'collection',
      title: 'Data Collection (BRSR)',
      icon: FileSpreadsheet,
      subtabs: [
        { id: 'quick-entry', label: 'Site Quick-Entry Sheet', icon: FileSpreadsheet },
        { id: 'section-a', label: 'Section A: General', icon: FileText },
        { id: 'section-b', label: 'Section B: Management', icon: FileCheck2 },
        { id: 'section-c', label: 'Section C: Principles (P1-P9)', icon: BarChart3 },
      ],
    },
    {
      id: 'calculator',
      title: 'ESG Calculator Hub',
      icon: Calculator,
      badge: '5 Tools',
      subtabs: [
        { id: 'scope-emissions', label: 'Scope 1, 2, 3 Emissions', icon: Flame },
        { id: 'decarbonization-simulator', label: 'Decarbonization Abatement', icon: Sparkles },
        { id: 'water-calculator', label: 'Water Balance & ZLD', icon: Droplets },
        { id: 'material-embodied', label: 'Embodied Carbon (EPD)', icon: Layers },
        { id: 'intensity-benchmarking', label: 'Sectoral Benchmarks', icon: Gauge },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics & Engine',
      icon: Cpu,
      badge: openAnomaliesCount > 0 ? `${openAnomaliesCount} Anomaly` : undefined,
      subtabs: [
        { id: 'emission-engine', label: 'DEFRA/CEA Engine & Scope 1-3', icon: Cpu },
        { id: 'brsr-attributes', label: 'BRSR Core 9 Intensities', icon: BarChart3 },
        { id: 'drilldown', label: 'Multi-Level Consolidation', icon: Network },
        { id: 'anomaly-radar', label: 'Data Quality & Anomaly Radar', icon: ShieldAlert, badge: openAnomaliesCount },
      ],
    },
    {
      id: 'assurance',
      title: 'Assurance & Compliance',
      icon: ShieldAlert,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Review` : undefined,
      subtabs: [
        { id: 'approvals', label: 'Four-Eyes Approvals', icon: CheckSquare, badge: pendingApprovalsCount },
        { id: 'audit-trail', label: 'Immutable Audit Trail', icon: Lock },
        { id: 'report-generator', label: 'BRSR Report & XBRL Export', icon: FileText },
      ],
    },
    {
      id: 'copilot',
      title: 'AI Copilot (Gemini)',
      icon: Sparkles,
      subtabs: [
        { id: 'narratives', label: 'Draft Narratives & Statements', icon: BrainCircuit },
        { id: 'anomaly-explainer', label: 'Anomaly Root-Cause Explainer', icon: ShieldAlert },
        { id: 'gap-analysis', label: 'SEBI BRSR Gap Analysis', icon: CheckSquare },
        { id: 'ask-chat', label: 'Ask ESG Natural Language Chat', icon: Sparkles },
      ],
    },
    {
      id: 'admin',
      title: 'Administration & Masters',
      icon: Settings,
      subtabs: [
        { id: 'emission-library', label: 'Emission Library (Factors)', icon: Database },
        { id: 'indicator-master', label: 'BRSR Indicator Master', icon: Sliders },
        { id: 'system-settings', label: 'Settings & Security', icon: Settings },
      ],
    },
  ];

  // Dynamically filter modules and subtabs strictly matching the user's role authorization
  const permittedModules = useMemo(() => {
    return rawModules
      .filter((mod) => isModuleAuthorized(mod.id))
      .map((mod) => ({
        ...mod,
        subtabs: mod.subtabs.filter((sub) => isSubtabAuthorized(mod.id, sub.id)),
      }))
      .filter((mod) => mod.subtabs.length > 0);
  }, [currentRole, isModuleAuthorized, isSubtabAuthorized]);

  const handleSelectSubtab = (moduleId: string, subtabId: string) => {
    setActiveModule(moduleId);
    setActiveSubtab(subtabId);
    if (subtabId === 'gateway') {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-40 bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header with Collapse toggle */}
      <div className="h-12 border-b border-slate-800 px-3 flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
        {!collapsed && <span>Operations Navigation</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-100 transition-colors ml-auto cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Pill in Sidebar */}
      {!collapsed && (
        <div className="mx-2 mt-2 p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Active Role Clearance</span>
          </div>
          <div className="text-xs font-bold text-white truncate mt-0.5">
            {currentRole}
          </div>
          <div className="text-[10px] text-slate-400 truncate mt-0.5" title={userScope.description}>
            {userScope.projectId
              ? `Site: ${userScope.projectName || userScope.projectId}`
              : userScope.businessUnit
              ? `BU: ${userScope.businessUnit}`
              : userScope.subsidiary
              ? `Subsidiary: ${userScope.subsidiary}`
              : 'Scope: Full MEIL Conglomerate'}
          </div>
        </div>
      )}

      {/* Filtered Modules List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {permittedModules.map((mod) => {
          const isModActive = activeModule === mod.id;
          const Icon = mod.icon;

          return (
            <div key={mod.id} className="space-y-0.5">
              <button
                onClick={() => {
                  if (activeModule !== mod.id) {
                    setActiveModule(mod.id);
                    setActiveSubtab(mod.subtabs[0].id);
                  }
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isModActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700/60 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
                title={mod.title}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isModActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{mod.title}</span>}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-1.5">
                    {mod.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                        {mod.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        isModActive ? 'rotate-90 text-emerald-400' : ''
                      }`}
                    />
                  </div>
                )}
              </button>

              {/* Subtabs rendered if module active and not collapsed */}
              {!collapsed && isModActive && (
                <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-3.5">
                  {mod.subtabs.map((sub) => {
                    const isSubActive = activeSubtab === sub.id;
                    const SubIcon = sub.icon;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubtab(mod.id, sub.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                          isSubActive
                            ? 'bg-emerald-950/40 text-emerald-300 font-medium border border-emerald-800/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="truncate">{sub.label}</span>
                        </div>
                        {sub.badge && sub.badge > 0 && (
                          <span className="text-[10px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-300">RBAC Policy Engine</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Active
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            CEA Grid 20.0 · DEFRA 2024 · ISAE 3000
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400" title="System Operational" />
        </div>
      )}
    </aside>
  );
};
