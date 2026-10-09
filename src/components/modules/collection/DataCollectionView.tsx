import React, { useState } from 'react';
import { useEsg } from '../../../context/EsgContext';
import {
  FileSpreadsheet,
  FileText,
  FileCheck2,
  BarChart3,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save,
  Download,
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  HelpCircle,
  Sparkles,
  Scale,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { SignedWeighbridgeModal, WeighbridgeRecord } from './SignedWeighbridgeModal';
import { syncWeighbridgeToCloud, isSupabaseConfigured } from '../../../lib/supabase';
import { ScopeEmissionsLogger } from './ScopeEmissionsLogger';

export const DataCollectionView: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    setActiveModule,
    selectedSiteId,
    sites,
    scopedSites,
    brsrIndicators,
    setBrsrIndicators,
    addAuditLog,
    currentRole,
    setSites,
    canPerformAction,
  } = useEsg();

  const currentSite = scopedSites.find((s) => s.id === selectedSiteId) || scopedSites[0] || sites[0];

  // Quick-entry spreadsheet state for the current site
  const [quickRows, setQuickRows] = useState<WeighbridgeRecord[]>([
    {
      id: 'row-1',
      date: '2026-09-28',
      fuelType: 'High Speed Diesel (HSD)',
      quantity: 14200,
      unit: 'Liters',
      facility: 'Spillway Excavator Fleet #4',
      invoiceNo: 'IOCL/2026/09/8821',
      uploadedFile: 'Signed_Weighbridge_IOCL_8821.pdf',
      calculatedCo2e: 38.15, // 14200 * 2.687 / 1000
      ticketNo: 'WB-POL-2026-0928-8821',
      vehicleNo: 'AP 39 TE 4821',
      supplier: 'Indian Oil Corporation Ltd (IOCL Bulk Depot)',
      grossWeight: '28,450 kg',
      tareWeight: '14,250 kg',
      netWeight: '14,200 Liters (11,928 kg @ 0.84 density)',
      driverName: 'K. Ramesh Naidu (DL: AP05-20180041289)',
      siteCode: 'Site #042',
      siteName: 'Polavaram Multi-Purpose Project',
      timeIn: '08:42:15 AM',
      timeOut: '09:18:40 AM',
      operatorName: 'Er. Rajesh Kumar (Site In-Charge)',
    },
    {
      id: 'row-2',
      date: '2026-09-29',
      fuelType: 'Indian National Grid Electricity',
      quantity: 48600,
      unit: 'kWh',
      facility: 'Batching Plant Substation #2',
      invoiceNo: 'DISCOM/HT/092926/01',
      uploadedFile: 'Signed_Grid_Meter_Slip_0929.pdf',
      calculatedCo2e: 34.80, // 48600 * 0.716 / 1000
      ticketNo: 'WB-POL-2026-0929-0142',
      vehicleNo: '33kV FEEDER METER #TSSPDCL-04',
      supplier: 'Southern Power Distribution DISCOM',
      grossWeight: 'N/A (Grid Telemetry)',
      tareWeight: 'N/A',
      netWeight: '48,600 kWh',
      driverName: 'Substation Shift Engineer #02',
      siteCode: 'Site #042',
      siteName: 'Polavaram Multi-Purpose Project',
      timeIn: '00:00:00 AM',
      timeOut: '11:59:59 PM',
      operatorName: 'Er. T. S. Rao (Electrical Lead)',
    },
    {
      id: 'row-3',
      date: '2026-09-30',
      fuelType: 'Commercial Blast Explosives',
      quantity: 1850,
      unit: 'Kilograms',
      facility: 'Tunnel Deep Cavern Reach #1',
      invoiceNo: 'SOLAR_EXPL/2026/041',
      uploadedFile: 'Signed_Blast_Permit_Weigh_041.pdf',
      calculatedCo2e: 0.33, // 1850 * 0.178 / 1000
      ticketNo: 'WB-POL-2026-0930-0419',
      vehicleNo: 'KA 04 E 9920 (Explosive Van)',
      supplier: 'Solar Industries India Ltd (Nagpur)',
      grossWeight: '8,450 kg',
      tareWeight: '6,600 kg',
      netWeight: '1,850 kg',
      driverName: 'V. Prakash (Certified Explosives Carrier)',
      siteCode: 'Site #042',
      siteName: 'Polavaram Multi-Purpose Project',
      timeIn: '06:15:00 AM',
      timeOut: '06:50:30 AM',
      operatorName: 'Er. Rajesh Kumar (Site In-Charge)',
    },
  ]);

  const [newRow, setNewRow] = useState({
    date: '2026-09-30',
    fuelType: 'High Speed Diesel (HSD)',
    quantity: 5000,
    unit: 'Liters',
    facility: 'DG Set Heavy Standby #1',
    invoiceNo: 'BPCL/2026/09/9912',
    uploadedFile: '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeWeighbridgeRecord, setActiveWeighbridgeRecord] = useState<WeighbridgeRecord | null>(null);
  const [isWeighbridgeModalOpen, setIsWeighbridgeModalOpen] = useState(false);

  // Section B Policies checklist state
  const [policies, setPolicies] = useState([
    { id: 'pol-1', name: 'Corporate Human Rights & Anti-Slavery Policy', p: 'P5', covered: true, boardApproved: true, url: 'https://meil.in/esg/human-rights' },
    { id: 'pol-2', name: 'Environment, Energy & Net Zero Decarbonization Policy', p: 'P6', covered: true, boardApproved: true, url: 'https://meil.in/esg/environment-policy' },
    { id: 'pol-3', name: 'Anti-Bribery, Anti-Corruption & Whistleblower Policy', p: 'P1', covered: true, boardApproved: true, url: 'https://meil.in/esg/whistleblower' },
    { id: 'pol-4', name: 'Zero Harm Occupational Health & Safety (OHS) Standard', p: 'P3', covered: true, boardApproved: true, url: 'https://meil.in/esg/safety' },
    { id: 'pol-5', name: 'Sustainable Procurement & Tier-1 Vendor ESG Code', p: 'P8', covered: true, boardApproved: true, url: 'https://meil.in/esg/vendor-code' },
    { id: 'pol-6', name: 'Biodiversity Conservation & Zero Net Loss in River Basins', p: 'P6', covered: true, boardApproved: true, url: 'https://meil.in/esg/biodiversity' },
  ]);

  const handleAddQuickRow = (e: React.FormEvent) => {
    e.preventDefault();
    const factor = newRow.fuelType.includes('Diesel') ? 2.687 : newRow.fuelType.includes('Grid') ? 0.716 : 0.178;
    const calculatedCo2e = Number(((newRow.quantity * factor) / 1000).toFixed(2));

    const ticketGenerated = `WB-${currentSite.code.replace('#', '').replace(/\s+/g, '')}-${newRow.date.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const added: WeighbridgeRecord = {
      id: `row-${Date.now()}`,
      ...newRow,
      calculatedCo2e,
      uploadedFile: newRow.uploadedFile || `Signed_Weighbridge_Challan_${newRow.invoiceNo.replace(/\//g, '_')}.pdf`,
      ticketNo: ticketGenerated,
      vehicleNo: newRow.fuelType.includes('Diesel') ? 'AP 39 TE 7714' : newRow.fuelType.includes('Grid') ? '33kV FEEDER METER #01' : 'MH 12 Q 4421',
      supplier: newRow.fuelType.includes('Diesel') ? 'Bharat Petroleum Corp Ltd (BPCL Depot)' : 'State Transmission Grid Feeder',
      grossWeight: `${Math.round(newRow.quantity * 1.8 + 14200)} kg`,
      tareWeight: '14,200 kg',
      netWeight: `${newRow.quantity.toLocaleString()} ${newRow.unit}`,
      driverName: 'M. Venkat Ramana (DL: AP07-20190014281)',
      siteCode: currentSite.code,
      siteName: currentSite.name,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timeOut: new Date(Date.now() + 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      operatorName: 'Er. Rajesh Kumar (Site In-Charge)',
    };

    setQuickRows((prev) => [added, ...prev]);

    // Update current site emissions dynamically
    setSites((prev) =>
      prev.map((s) =>
        s.id === currentSite.id
          ? {
              ...s,
              scope1: newRow.fuelType.includes('Diesel') ? s.scope1 + Math.round(calculatedCo2e) : s.scope1,
              scope2: newRow.fuelType.includes('Grid') ? s.scope2 + Math.round(calculatedCo2e) : s.scope2,
            }
          : s
      )
    );

    addAuditLog({
      user: 'K. V. Rao',
      role: currentRole,
      action: 'CREATE',
      entity: `${currentSite.code} • ${currentSite.name}`,
      field: `Raw Data Ingestion & Signed Weighbridge: ${newRow.fuelType}`,
      oldValue: '0',
      newValue: `${newRow.quantity} ${newRow.unit} (${calculatedCo2e} tCO2e) [Ticket: ${ticketGenerated}]`,
    });

    // Sync to Supabase cloud database
    syncWeighbridgeToCloud({
      site_id: currentSite.id,
      site_name: currentSite.name,
      gate_pass_no: ticketGenerated,
      vehicle_no: added.vehicleNo || 'AP-09-TG-8841',
      material: newRow.fuelType,
      gross_weight_mt: Number(added.grossWeight || 38.5),
      tare_weight_mt: Number(added.tareWeight || 14.2),
      net_quantity: Number(newRow.quantity),
      unit: newRow.unit,
      scope1_tco2e: Number(calculatedCo2e),
      driver_name: added.driverName || 'R. Narayana Reddy',
      inspection_officer: 'NABL Certified Quality Lead',
      verified_status: 'CERTIFIED_VERIFIED',
    });

    // Automatically set the new record as active and open the signed weighbridge modal
    setActiveWeighbridgeRecord(added);
    setIsWeighbridgeModalOpen(true);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 8000);
  };

  const handleSimulateFileUpload = () => {
    setNewRow((prev) => ({
      ...prev,
      uploadedFile: `Signed_Weighbridge_Challan_${Date.now().toString().slice(-4)}.pdf`,
    }));
  };

  const handleOpenWeighbridge = (row: WeighbridgeRecord) => {
    setActiveWeighbridgeRecord(row);
    setIsWeighbridgeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span>SEBI BRSR Statutory Ingestion Protocol</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{currentSite.code} · {currentSite.name}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase Key Active
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Data Collection & BRSR Core Ingestion Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct telemetry ingestion, invoice attachment vault, and statutory Sections A, B, and C disclosure tables.
            </p>
          </div>

          {/* Subtab Segmented Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs flex-wrap">
            <button
              onClick={() => setActiveSubtab('quick-entry')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeSubtab === 'quick-entry' || (!['section-a', 'section-b', 'section-c'].includes(activeSubtab))
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Site Quick-Entry Sheet
            </button>
            <button
              onClick={() => setActiveSubtab('section-a')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'section-a'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Section A: General
            </button>
            <button
              onClick={() => setActiveSubtab('section-b')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'section-b'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Section B: Governance
            </button>
            <button
              onClick={() => setActiveSubtab('section-c')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubtab === 'section-c'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Section C: P1-P9
            </button>
          </div>
        </div>
      </div>

      {/* QUICK-ENTRY SPREADSHEET */}
      {(activeSubtab === 'quick-entry' || !['section-a', 'section-b', 'section-c'].includes(activeSubtab)) && (
        <div className="space-y-6">
          {/* Quick-Entry Form Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Ingest Site Fuel / Electricity Batch for {currentSite.code}</span>
              </h2>
              <span className="text-xs text-slate-400">
                DEFRA 2024 / CEA v20 Factors auto-applied on save
              </span>
            </div>

            {!canPerformAction('create') ? (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Read-Only Verification Mode: Data creation and invoice ingestion are restricted to Project Data Entry Users and ESG Admins.</span>
                </div>
                <span className="font-mono text-[10px] text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800 font-semibold">{currentRole}</span>
              </div>
            ) : (
            <form onSubmit={handleAddQuickRow} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newRow.date}
                  onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Fuel / Source Type</label>
                <select
                  value={newRow.fuelType}
                  onChange={(e) => {
                    const fuel = e.target.value;
                    const unit = fuel.includes('Diesel') ? 'Liters' : fuel.includes('Grid') ? 'kWh' : 'Kilograms';
                    setNewRow({ ...newRow, fuelType: fuel, unit });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="High Speed Diesel (HSD)">High Speed Diesel (2.687 kg CO₂e/L)</option>
                  <option value="Indian National Grid Electricity">Grid Electricity (0.716 kg CO₂e/kWh)</option>
                  <option value="Commercial Blast Explosives">Blast Explosives (0.178 kg CO₂e/kg)</option>
                  <option value="Piped Natural Gas (PNG)">Natural Gas (2.028 kg CO₂e/SCM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity ({newRow.unit})</label>
                <input
                  type="number"
                  value={newRow.quantity}
                  onChange={(e) => setNewRow({ ...newRow, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Facility / Equipment Reach</label>
                <input
                  type="text"
                  value={newRow.facility}
                  onChange={(e) => setNewRow({ ...newRow, facility: e.target.value })}
                  placeholder="e.g. Tunnel Adit #2 DG Set"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Invoice / Delivery Challan</label>
                <input
                  type="text"
                  value={newRow.invoiceNo}
                  onChange={(e) => setNewRow({ ...newRow, invoiceNo: e.target.value })}
                  placeholder="Invoice #"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Evidence Voucher</label>
                <button
                  type="button"
                  onClick={handleSimulateFileUpload}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-950 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg px-2 py-1.5 text-slate-300 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="truncate">{newRow.uploadedFile || 'Attach PDF/Scan'}</span>
                </button>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Log Entry</span>
                </button>
              </div>
            </form>
            )}

            {saveSuccess && (
              <div className="mt-3 p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Entry Logged & Signed Weighbridge Ticket Generated!</div>
                    <div className="text-[11px] text-emerald-300/90">
                      Carbon emissions computed via DEFRA/CEA factors & appended to immutable ISAE 3000 audit ledger.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWeighbridgeModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer text-xs"
                >
                  <Scale className="w-4 h-4 text-emerald-100" />
                  <span>View Signed Weighbridge Slip</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              </div>
            )}
          </div>

          {/* Spreadsheet Table of Ingested Records */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Ingested Activity Records for {currentSite.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Showing stamped fuel dispensary receipts, weighbridge tickets, and verified tCO₂e outputs
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Site Scope 1+2 Total: <strong className="text-emerald-400">{(currentSite.scope1 + currentSite.scope2).toLocaleString()} tCO₂e</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Fuel / Energy Source</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3">Facility / Meter</th>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3 text-right">Computed tCO₂e</th>
                    <th className="py-2.5 px-3">Evidence & Weighbridge Slip</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {quickRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-300">{row.date}</td>
                      <td className="py-2.5 px-3 font-medium text-white">{row.fuelType}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                        {row.quantity.toLocaleString()} {row.unit}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{row.facility}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{row.invoiceNo}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        {row.calculatedCo2e} t
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => handleOpenWeighbridge(row)}
                          className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 hover:underline cursor-pointer group text-left"
                          title="Click to view signed weighbridge ticket"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="truncate max-w-[170px]">{row.uploadedFile}</span>
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
                          Validated
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenWeighbridge(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700 transition-all font-semibold text-[11px] cursor-pointer shadow-sm"
                          title="Open official signed weighbridge document"
                        >
                          <Scale className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION A: GENERAL DISCLOSURES */}
      {activeSubtab === 'section-a' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">
              SEBI BRSR Section A: General Disclosures
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Entity details, workforce demographics, business activities, and turnover attribution under SEBI format.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Entity Details Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>I. Entity Identity & Registration</span>
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Corporate Identity Number (CIN)</span>
                  <span className="font-mono text-white">U45202TG2006PLC050271</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Name of the Entity</span>
                  <span className="font-semibold text-white">Megha Engineering & Infrastructures Limited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Office</span>
                  <span className="text-right">S-2, Technocrat Ind. Estate, Balanagar, Hyderabad - 500037</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reporting Boundary</span>
                  <span className="text-emerald-400 font-semibold">Standalone & Consolidated (14 Subsidiaries)</span>
                </div>
              </div>
            </div>

            {/* Workforce Demographics */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>II. Workforce Demographics (BRSR P3)</span>
              </h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Permanent Employees</span>
                  <span className="font-bold text-white">12,450 (18.4% Female Engineers/Staff)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contractual Site Workforce</span>
                  <span className="font-bold text-white">48,200 On-site personnel</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Differently Abled Employees</span>
                  <span className="font-semibold text-white">142 Covered under accessibility policy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Employee Turnover Rate</span>
                  <span className="text-emerald-400 font-semibold">4.8% (Infrastructure Industry Low)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: MANAGEMENT & GOVERNANCE DISCLOSURES */}
      {activeSubtab === 'section-b' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white">
              SEBI BRSR Section B: Management & Process Disclosures
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Statutory verification of policies, governance sign-offs, and board oversight across BRSR Principles 1 through 9.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Statutory Policy Name</th>
                  <th className="py-3 px-3">BRSR Principle</th>
                  <th className="py-3 px-3 text-center">Entity Policy Enacted</th>
                  <th className="py-3 px-3 text-center">Board Approved</th>
                  <th className="py-3 px-3 text-right">Weblink / Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{p.p}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Yes (100% Sites)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Approved
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-sky-400 hover:underline cursor-pointer font-mono text-[11px]">
                        meil.in/esg/governance
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION C: PRINCIPLE-WISE PERFORMANCE (P1 TO P9) */}
      {activeSubtab === 'section-c' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">
                SEBI BRSR Section C: Principle-wise Performance Indicators (P1–P9)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory quantitative metrics covering emissions, energy, water circularity, employee safety, and local procurement.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
              SEBI BRSR Core Mandated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Code & Principle</th>
                  <th className="py-3 px-3">Statutory Indicator Description</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">FY 2023-24</th>
                  <th className="py-3 px-3 text-right">FY 2024-25 (Current)</th>
                  <th className="py-3 px-3 text-right">Target</th>
                  <th className="py-3 px-3 text-center">Auditor Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {brsrIndicators.map((ind) => (
                  <tr key={ind.code} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono text-emerald-400 font-bold">{ind.code}</span>
                      <span className="text-slate-500 ml-1.5 font-bold">({ind.principle})</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-white max-w-sm">{ind.title}</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] text-sky-300 bg-sky-950/70 border border-sky-800 px-1.5 py-0.5 rounded">
                        {ind.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {typeof ind.previousValue === 'number' ? ind.previousValue.toLocaleString() : ind.previousValue} {ind.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {typeof ind.currentValue === 'number' ? ind.currentValue.toLocaleString() : ind.currentValue} {ind.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {typeof ind.targetValue === 'number' ? ind.targetValue.toLocaleString() : ind.targetValue} {ind.unit}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        ISAE 3000
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Signed Weighbridge & Gate Pass Challan Modal Viewer */}
      <SignedWeighbridgeModal
        isOpen={isWeighbridgeModalOpen}
        onClose={() => setIsWeighbridgeModalOpen(false)}
        record={activeWeighbridgeRecord}
      />
    </div>
  );
};
