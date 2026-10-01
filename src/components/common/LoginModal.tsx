import React, { useState } from 'react';
import { useEsg } from '../../context/EsgContext';
import { UserRole } from '../../types/esg';
import { MeilLogo } from './MeilLogo';
import {
  ShieldCheck,
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  KeyRound,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  User,
  Shield,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

/* ========================================================================= */
/* MEIL ENTERPRISE AUTHENTICATION MODAL & DUMMY LOGIN COMPONENT             */
/* Note for User: When you provide your custom login page code, you can      */
/* easily embed or replace the form section below.                           */
/* ========================================================================= */

interface DemoAccount {
  name: string;
  role: UserRole;
  title: string;
  email: string;
  badge: string;
  division: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'K. V. Rao',
    role: 'Group ESG Admin',
    title: 'Chief Sustainability Officer',
    email: 'cso@meilgroup.com',
    badge: 'Full Access · SEBI BRSR Core',
    division: 'Corporate HQ Hyderabad',
  },
  {
    name: 'P. Sharma',
    role: 'Subsidiary Approver',
    title: 'VP - Infrastructure Projects',
    email: 'approver@meilinfra.com',
    badge: '4-Eyes Reviewer',
    division: 'Kaleshwaram Lift Irrigation',
  },
  {
    name: 'R. Verma',
    role: 'Project Data Entry User',
    title: 'Senior Site Engineer',
    email: 'site.engineer@meil.in',
    badge: 'Data Entry & Weighbridge OCR',
    division: 'Zojila Strategic Tunnel',
  },
  {
    name: 'S. Narayanan',
    role: 'Independent Auditor (ISAE 3000)',
    title: 'Lead ESG Assurance Partner',
    email: 'auditor@kpmg-assurance.com',
    badge: 'Third-Party Verification',
    division: 'Statutory Assurance & Audit',
  },
  {
    name: 'Dr. B. Reddy',
    role: 'Board Viewer',
    title: 'Independent Board Director',
    email: 'board@meil.in',
    badge: 'Executive Read-Only',
    division: 'MEIL Board Governance',
  },
];

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useEsg();

  // Active form state
  const [email, setEmail] = useState('cso@meilgroup.com');
  const [password, setPassword] = useState('meil@2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Group ESG Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [mfaToken, setMfaToken] = useState('849-204');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSelectDemo = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword('meil@2026');
    setSelectedRole(acc.role);
  };

  const handleQuickLoginAsCSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        login('cso@meilgroup.com', 'meil@2026', 'Group ESG Admin');
        setSuccess(false);
      }, 700);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        login(email, password, selectedRole);
        setSuccess(false);
      }, 700);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative my-6 text-slate-100 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-3 right-3 z-10 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
          title="Close / Return to Landing Page"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Branding & Demo Quick-Pick Info */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1f33] p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
          <div>
            <div className="bg-white/95 px-3 py-2 rounded-xl border border-slate-700 inline-block shadow-md mb-4">
              <MeilLogo height={28} showText={true} />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                SEBI BRSR Core Active
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Enterprise ESG Gateway</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Megha Engineering &amp; Infrastructures Ltd · Unified Sustainability &amp; Statutory Assurance Architecture
              </p>
            </div>

            {/* Dummy Account Notice */}
            <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Dummy Login Ready</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-tight">
                Use our pre-configured credentials or choose any persona on the right. You can swap in your custom login code anytime!
              </p>
              <div className="mt-2 text-[10px] font-mono bg-black/40 p-1.5 rounded border border-amber-500/20 text-slate-300">
                Email: <span className="text-emerald-300 font-bold">cso@meilgroup.com</span><br/>
                Password: <span className="text-emerald-300 font-bold">meil@2026</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISAE 3000 Ready
            </span>
            <span className="text-slate-500 font-mono">v2.8 SSL</span>
          </div>
        </div>

        {/* Right Side: Login Form & Instant 1-Click Persona Pickers */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between bg-slate-900">
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Access Granted</h3>
                <p className="text-xs text-emerald-300 mt-1">
                  Authenticated as <span className="font-semibold">{selectedRole}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Redirecting to Enterprise ESG Dashboard...</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Top Banner: Quick Instant Login Button */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleQuickLoginAsCSO}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </span>
                    <div className="text-left">
                      <div className="leading-none text-xs">🚀 1-Click Sign In (CSO / Admin)</div>
                      <div className="text-[10px] text-emerald-100 font-normal">Instant access with full privileges</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Persona Selector Tabs */}
              <div className="mb-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Demo Persona
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const isSelected = selectedRole === acc.role;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleSelectDemo(acc)}
                        className={`text-left p-2 rounded-lg border transition-all text-xs ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 text-white'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="font-semibold truncate text-[11px] flex items-center justify-between">
                          <span>{acc.name}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{acc.role}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Code Integration Slot */}
              {/* ========================================================= */}
              {/* [SLOT]: User can replace this form with custom login code */}
              {/* ========================================================= */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Corporate Email Address</label>
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus-within:border-emerald-500 transition-colors">
                    <Mail className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@meilgroup.com"
                      className="bg-transparent border-none text-slate-200 focus:outline-none w-full text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-medium">Password</label>
                    <span className="text-[10px] text-slate-400 font-mono">Demo: meil@2026</span>
                  </div>
                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus-within:border-emerald-500 transition-colors">
                    <Lock className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent border-none text-slate-200 focus:outline-none w-full text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <KeyRound className="w-3 h-3" /> FIDO2 Active
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Back to Landing
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-[#00050e] hover:bg-[#346385] text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    {loading ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
