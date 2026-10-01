import React, { useState } from 'react';
import { useEsg } from '../../context/EsgContext';
import { UserRole } from '../../types/esg';
import { MeilLogo } from './MeilLogo';
import {
  ShieldCheck,
  X,
  Lock,
  Building2,
  KeyRound,
  CheckCircle2,
  User,
} from 'lucide-react';

export const GatewayModal: React.FC = () => {
  const { isGatewayOpen, setIsGatewayOpen, currentRole, setCurrentRole, addAuditLog } = useEsg();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [ssoDomain, setSsoDomain] = useState('meilgroup.com');
  const [mfaVerified, setMfaVerified] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isGatewayOpen) return null;

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    addAuditLog({
      user: 'K. V. Rao',
      role: selectedRole,
      action: 'APPROVE',
      entity: 'Enterprise Gateway SSO',
      field: 'Session Token / Role Assignment',
      oldValue: `Role: ${currentRole}`,
      newValue: `Role: ${selectedRole} (PKI Multi-Factor Validated)`,
    });
    setSuccessMsg(`Session established as ${selectedRole}`);
    setTimeout(() => {
      setSuccessMsg('');
      setIsGatewayOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={() => setIsGatewayOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-black/90 border border-slate-700 rounded-xl shadow-inner">
            <MeilLogo height={26} showText={true} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">MEIL Identity Gateway</h3>
            <p className="text-[11px] text-slate-400">SAML 2.0 / Azure AD Single Sign-On</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-sm font-semibold text-emerald-300">{successMsg}</div>
            <p className="text-xs text-slate-400">Syncing role permissions and statutory audit logs...</p>
          </div>
        ) : (
          <form onSubmit={handleAuthenticate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Corporate Domain Identity</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
                <Building2 className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={ssoDomain}
                  onChange={(e) => setSsoDomain(e.target.value)}
                  className="bg-transparent border-none text-slate-200 focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Active User</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
                <User className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <span className="font-semibold text-white">K. V. Rao</span>
                <span className="text-slate-400 ml-2 text-[11px]">(cso@meilgroup.com)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Select Active Operational Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Group ESG Admin">Group ESG Admin (Full Governance & SEBI Submission)</option>
                <option value="Subsidiary Approver">Subsidiary Approver (Division Level Sign-Off)</option>
                <option value="Business Unit Reviewer">Business Unit Reviewer (Data Quality Check)</option>
                <option value="Project Data Entry User">Project Data Entry User (Site Quick-Entry)</option>
                <option value="Independent Auditor (ISAE 3000)">Independent Auditor (ISAE 3000 Assurance)</option>
                <option value="Board Viewer">Board Viewer (Executive Read-Only)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-medium text-slate-200">FIDO2 / Hardware Security Token</div>
                  <div className="text-[10px] text-slate-400">ISAE 3000 Hardware Key Enforced</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={mfaVerified}
                onChange={(e) => setMfaVerified(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsGatewayOpen(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Establish Enterprise Context</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
