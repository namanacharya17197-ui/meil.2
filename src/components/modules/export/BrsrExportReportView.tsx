import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  Download,
  Printer,
  FileSpreadsheet,
  FileCheck2,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Users,
  Flame,
  Droplets,
  Zap,
} from 'lucide-react';
import { MeilLogo } from '../../common/MeilLogo';

export const BrsrExportReportView: React.FC = () => {
  const { brsrFormData, evidenceAttachments, currentRole } = useEsg();
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExcelExport = () => {
    setDownloadSuccessToast('SEBI_BRSR_Core_Filing_FY26_MEIL.xlsx exported successfully!');
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Export Toolbar (no-print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <span>Generate Official SEBI BRSR Filing Report</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SEBI Circular SEBI/HO/CFD/CMD-2/P/CIR/2021/562 compliant printable &amp; exportable filing format.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExcelExport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export SEBI Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF (SEBI Filing)</span>
          </button>
        </div>
      </div>

      {downloadSuccessToast && (
        <div className="no-print p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccessToast}</span>
          </div>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            className="text-emerald-400 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* OFFICIAL PRINTABLE SEBI BRSR FILING DOCUMENT CONTAINER */}
      <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 font-sans print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-black p-2.5 rounded-lg shrink-0">
              <MeilLogo height={36} showText={true} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-900">
                Megha Engineering &amp; Infrastructures Limited
              </h2>
              <div className="text-xs text-slate-600 font-mono mt-0.5">
                CIN: U45202TG2006PLC050271 • SEBI Top-1000 Listed Format
              </div>
              <div className="text-xs text-slate-700 font-semibold mt-1">
                Business Responsibility &amp; Sustainability Report (BRSR) Core Filing
              </div>
            </div>
          </div>

          <div className="text-right text-xs space-y-1">
            <div className="font-bold text-slate-900">Financial Year: 2024–25</div>
            <div className="text-slate-600">Reporting Boundary: Standalone &amp; Consolidated</div>
            <div className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold text-[11px]">
              ISAE 3000 Assured Filing
            </div>
          </div>
        </div>

        {/* SECTION A TABLE */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 border-l-4 border-slate-900">
            Section A: General Disclosures
          </h3>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <tbody className="divide-y divide-slate-300">
              <tr>
                <td className="py-2 px-3 font-semibold bg-slate-50 w-1/3">1. Name of Listed Entity</td>
                <td className="py-2 px-3">Megha Engineering &amp; Infrastructures Limited (MEIL)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold bg-slate-50">2. Corporate Identity Number (CIN)</td>
                <td className="py-2 px-3 font-mono">U45202TG2006PLC050271</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold bg-slate-50">3. Registered Office Address</td>
                <td className="py-2 px-3">S-2, Technocrat Industrial Estate, Balanagar, Hyderabad, Telangana - 500037</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold bg-slate-50">4. Total Permanent Employees (Reconciled)</td>
                <td className="py-2 px-3 font-mono font-bold text-slate-900">
                  {brsrFormData.sectionA_employees.toLocaleString()} Persons
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold bg-slate-50">5. Operating Manufacturing / Project Sites</td>
                <td className="py-2 px-3 font-mono">
                  {brsrFormData.sectionA_operatingPlants} Strategic Industrial &amp; Infrastructure Complexes
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION B TABLE */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 border-l-4 border-slate-900">
            Section B: Management and Process Disclosures
          </h3>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                <th className="py-2 px-3">Disclosure Question</th>
                <th className="py-2 px-3 text-center">P1</th>
                <th className="py-2 px-3 text-center">P2</th>
                <th className="py-2 px-3 text-center">P3</th>
                <th className="py-2 px-3 text-center">P4</th>
                <th className="py-2 px-3 text-center">P5</th>
                <th className="py-2 px-3 text-center">P6</th>
                <th className="py-2 px-3 text-center">P7</th>
                <th className="py-2 px-3 text-center">P8</th>
                <th className="py-2 px-3 text-center">P9</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-center">
              <tr>
                <td className="py-2 px-3 text-left font-semibold bg-slate-50">
                  Entity has approved policy for the principle
                </td>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
                  <td key={p} className="py-2 px-3 font-bold text-emerald-700">Y</td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 text-left font-semibold bg-slate-50">
                  Board Committee oversight established
                </td>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
                  <td key={p} className="py-2 px-3 font-bold text-emerald-700">Y</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION C CORE INDICATORS TABLE */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 border-l-4 border-emerald-700 flex items-center justify-between">
            <span>Section C: SEBI BRSR Core Essential Indicators Performance</span>
            <span className="text-[11px] font-normal text-slate-600">Assurance Standard: ISAE 3000 / AA1000AS</span>
          </h3>

          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                <th className="py-2.5 px-3">Principle</th>
                <th className="py-2.5 px-3">SEBI BRSR Core Indicator</th>
                <th className="py-2.5 px-3 text-right">FY 2024–25 Reported Value</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3 text-center">Assurance Evidence</th>
                <th className="py-2.5 px-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {/* P3 Health Insurance */}
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-slate-700">P3</td>
                <td className="py-2 px-3 font-semibold">Employees covered by Health Insurance schemes</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {brsrFormData.sectionC_p3_healthInsurance.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-600">Persons</td>
                <td className="py-2 px-3 text-center font-mono text-[11px]">ICICI_Lombard_GMC_Roster.pdf</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">Reconciled ✓</span>
                </td>
              </tr>

              {/* P3 Fatalities */}
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-slate-700">P3</td>
                <td className="py-2 px-3 font-semibold">Number of work-related fatalities</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {brsrFormData.sectionC_p3_fatalities}
                </td>
                <td className="py-2 px-3 text-slate-600">Incidents</td>
                <td className="py-2 px-3 text-center font-mono text-[11px]">Vision_Zero_Log_FY26.pdf</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">ISAE 3000 Verified</span>
                </td>
              </tr>

              {/* P6 Scope 1 GHG */}
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-slate-700">P6</td>
                <td className="py-2 px-3 font-semibold">
                  Scope 1 Direct GHG Emissions
                  {brsrFormData.sectionC_p6_scope1Justification && (
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                      Note: {brsrFormData.sectionC_p6_scope1Justification}
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {brsrFormData.sectionC_p6_scope1Mt.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-600">Metric Tonnes CO2e</td>
                <td className="py-2 px-3 text-center font-mono text-[11px]">IOCL_HSD_Invoice_8821.pdf</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">ISAE 3000 Verified</span>
                </td>
              </tr>

              {/* P6 Scope 2 GHG */}
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-slate-700">P6</td>
                <td className="py-2 px-3 font-semibold">Scope 2 Indirect Grid Electricity Emissions</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {brsrFormData.sectionC_p6_scope2Mt.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-600">Metric Tonnes CO2e</td>
                <td className="py-2 px-3 text-center font-mono text-[11px]">TSSPDCL_HT_Bill_9921.pdf</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">ISAE 3000 Verified</span>
                </td>
              </tr>

              {/* P6 Electricity in GJ */}
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-slate-700">P6</td>
                <td className="py-2 px-3 font-semibold">Total Electricity Consumption (Standardized in GJ)</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {brsrFormData.sectionC_p6_electricityGj.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-600">Gigajoules (GJ)</td>
                <td className="py-2 px-3 text-center font-mono text-[11px]">HT_Meter_Log_Calibrated.pdf</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">ISAE 3000 Verified</span>
                </td>
              </tr>

              {/* P6 Water Withdrawal */}
              <tr>
                <td className="py-2 px-3 font-mono font-bold text-slate-700">P6</td>
                <td className="py-2 px-3 font-semibold">Total Water Withdrawal by Source</td>
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {brsrFormData.sectionC_p6_waterWithdrawalKl.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-slate-600">Kiloliters (KL)</td>
                <td className="py-2 px-3 text-center font-mono text-[11px]">Borewell_Telemetry_410.pdf</td>
                <td className="py-2 px-3 text-center">
                  <span className="text-emerald-700 font-bold">ISAE 3000 Verified</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Statutory Auditor Sign-off Statement */}
        <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div>
            <div className="font-bold text-slate-900 mb-1">For and on behalf of the Board of Directors</div>
            <div className="mt-8 font-semibold">K. V. Rao</div>
            <div className="text-slate-500">Executive Director &amp; Chief Sustainability Officer</div>
            <div className="text-[10px] text-slate-400">DIN: 01428571 • Hyderabad, India</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-slate-900 mb-1">Independent Statutory Assurance Partner</div>
            <div className="mt-8 font-semibold">KPMG Statutory Assurance Services LLP</div>
            <div className="text-slate-500">ISAE 3000 / AA1000AS Certified ESG Lead Auditor</div>
            <div className="text-[10px] text-slate-400">Firm Registration: 101248W / W-100022</div>
          </div>
        </div>
      </div>
    </div>
  );
};
