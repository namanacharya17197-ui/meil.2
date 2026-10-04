import React from 'react';
import { useEsg } from '../../context/EsgContext';
import { ROLE_CONFIGS } from '../../lib/rbac';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  AlertOctagon,
  Building2,
  UserCheck,
  CheckCircle,
} from 'lucide-react';

interface AccessDenied403Props {
  attemptedModule: string;
  attemptedSubtab?: string;
  onNavigateHome?: () => void;
}

export const AccessDenied403: React.FC<AccessDenied403Props> = ({
  attemptedModule,
  attemptedSubtab,
  onNavigateHome,
}) => {
  const { currentRole, currentUser, setActiveModule, setActiveSubtab } = useEsg();
  const roleConfig = ROLE_CONFIGS[currentRole];

  const handleReturnToSafeDashboard = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      setActiveModule(roleConfig.defaultModule);
      setActiveSubtab(roleConfig.defaultSubtab);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Ambient Security Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security Shield Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-inner">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 text-white" />
          </div>
        </div>

        {/* Status Code & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono font-bold uppercase tracking-widest">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>HTTP 403 · Access Denied</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Restricted Authorization Area
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your authenticated user identity lacks statutory permission to access the requested resource{' '}
            <span className="font-mono text-rose-300 font-semibold bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40">
              {attemptedModule}{attemptedSubtab ? ` / ${attemptedSubtab}` : ''}
            </span>. Zero operational data has been disclosed.
          </p>
        </div>

        {/* User Scope Details Card */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Authenticated Identity:</span>
            <span className="font-semibold text-white flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              {currentUser?.name || 'Authorized Personnel'} ({currentUser?.email || 'session@meilgroup.com'})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">Assigned Enterprise Role:</span>
            <span className="font-bold text-indigo-300 font-mono">
              {currentRole}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-slate-400 shrink-0">Permitted Data Scope:</span>
            <span className="text-slate-300 text-right font-medium text-[11px] max-w-[280px]">
              {roleConfig.defaultScope.description}
            </span>
          </div>
        </div>

        {/* Permitted Modules Summary */}
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 text-left text-xs">
          <div className="text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modules Authorized for {currentRole}:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roleConfig.allowedModules.map((mod) => (
              <span
                key={mod}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px] capitalize"
              >
                {mod}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleReturnToSafeDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Permitted Role Dashboard</span>
          </button>
        </div>

        {/* Security Audit Footnote */}
        <div className="text-[10px] text-slate-500 font-mono">
          Security Event Stamped · ISAE 3000 RBAC Enforcement Policy · Protocol MEIL-SEC-BRSR
        </div>
      </div>
    </div>
  );
};
