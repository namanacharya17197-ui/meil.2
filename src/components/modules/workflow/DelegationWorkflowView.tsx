import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  Calendar,
  FileSpreadsheet,
  Building2,
  CheckSquare,
  ShieldCheck,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const DelegationWorkflowView: React.FC = () => {
  const {
    departmentWorkflows,
    updateWorkflowStatus,
    setActiveModule,
    setActiveSubtab,
    currentRole,
    switchDemoRole,
  } = useEsg();

  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const handleSendReminder = (deptName: string, head: string) => {
    setReminderToast(`Statutory escalation reminder sent to ${head} (${deptName}) with 48h deadline!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Statutory Delegation &amp; SLA Management
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Multi-Department Assignment &amp; Approval Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Department-wise KPI ownership across Human Resources, Plant Operations, Legal Governance, and Procurement with automated deadline reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span>Overall Workflow Progress: </span>
            <strong className="text-emerald-400 font-mono">82% Completed</strong>
          </div>
        </div>
      </div>

      {reminderToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>{reminderToast}</span>
          </div>
          <button
            onClick={() => setReminderToast(null)}
            className="text-emerald-400 hover:text-white font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departmentWorkflows.map((dept) => {
          const completionPct = Math.round((dept.completedCount / dept.kpisCount) * 100);

          return (
            <div
              key={dept.id}
              className={`p-5 rounded-xl border transition-all space-y-4 shadow-sm ${
                dept.status === 'Overdue'
                  ? 'bg-rose-950/20 border-rose-800/80'
                  : dept.status === 'Submitted'
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-amber-950/20 border-amber-800/70'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      {dept.department}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        dept.status === 'Submitted'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : dept.status === 'Overdue'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {dept.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Assigned Lead: <strong className="text-slate-200">{dept.head}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-indigo-400">{dept.role}</span>
                  </div>
                </div>

                {/* Quick Simulation Button */}
                {dept.role === 'Plant 1 Head (Operations)' && (
                  <button
                    onClick={() => switchDemoRole('Plant 1 Head (Operations)')}
                    className="px-2.5 py-1 bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    title="Simulate this role"
                  >
                    Simulate Plant 1 Head
                  </button>
                )}
                {dept.role === 'HR Lead' && (
                  <button
                    onClick={() => switchDemoRole('HR Lead')}
                    className="px-2.5 py-1 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    title="Simulate this role"
                  >
                    Simulate HR Lead
                  </button>
                )}
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-2">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mandated Scope:</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  {dept.assignedSections}
                </div>
              </div>

              {/* Progress Bar & Counts */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>KPI Completion Progress</span>
                  <span className="font-mono font-bold text-white">
                    {dept.completedCount} / {dept.kpisCount} KPIs ({completionPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.status === 'Submitted'
                        ? 'bg-emerald-500'
                        : dept.status === 'Overdue'
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>

              {/* Bottom Meta & Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Deadline: <strong className="text-slate-300">{dept.deadline}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {dept.status !== 'Submitted' ? (
                    <>
                      <button
                        onClick={() => handleSendReminder(dept.department, dept.head)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3 text-sky-400" />
                        <span>Send Reminder</span>
                      </button>

                      <button
                        onClick={() => {
                          updateWorkflowStatus(dept.id, 'Submitted');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Sign &amp; Submit
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => updateWorkflowStatus(dept.id, 'In Progress')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md text-[11px] transition-colors cursor-pointer"
                    >
                      Reopen for Revision
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
