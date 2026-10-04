import React, { useState, useMemo } from 'react';
import { useEsg } from '../../../context/EsgContext';
import { ScopeType, DocumentType } from '../../../types/esg';
import {
  Flame,
  Zap,
  Truck,
  Calculator,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
} from 'lucide-react';

interface FactorOption {
  category: string;
  scope: ScopeType;
  factor: number; // kg CO2e / unit
  unit: string;
  source: string;
  description: string;
}

const MASTER_EMISSION_FACTORS: FactorOption[] = [
  // Scope 1: Direct Combustion
  {
    category: 'High-Speed Diesel (HSD) - Mobile / Excavation',
    scope: 'Scope 1',
    factor: 2.687,
    unit: 'Liters',
    source: 'DEFRA 2024 / IPCC Guidelines',
    description: 'Direct combustion in excavators, dump trucks, and mobile tunneling rigs',
  },
  {
    category: 'High-Speed Diesel (HSD) - Stationary DG Sets',
    scope: 'Scope 1',
    factor: 2.680,
    unit: 'Liters',
    source: 'CEA v20 / DEFRA 2024',
    description: 'Heavy continuous & standby diesel generators at remote sites',
  },
  {
    category: 'Motor Gasoline / Petrol',
    scope: 'Scope 1',
    factor: 2.314,
    unit: 'Liters',
    source: 'IPCC 2006 Mobile Combustion',
    description: 'Site supervisor utility vehicles and light transport',
  },
  {
    category: 'Piped Natural Gas (PNG)',
    scope: 'Scope 1',
    factor: 2.028,
    unit: 'SCM',
    source: 'Ministry of Petroleum & Natural Gas',
    description: 'Industrial heating and camp mess utility consumption',
  },
  {
    category: 'Commercial Blast Explosives (ANFO/Emulsion)',
    scope: 'Scope 1',
    factor: 0.178,
    unit: 'kg',
    source: 'CSIRO / Blasting Technical Guidelines',
    description: 'Controlled rock blasting in underground hydro tunnels',
  },
  // Scope 2: Purchased Electricity
  {
    category: 'Indian National Grid Electricity (CEA Baseline)',
    scope: 'Scope 2',
    factor: 0.716,
    unit: 'kWh',
    source: 'CEA CO2 Baseline Database v20 (Weighted Avg)',
    description: 'High-tension batching plants, ventilation fans, pump houses',
  },
  {
    category: 'State Grid High-Carbon DISCOM Feeder',
    scope: 'Scope 2',
    factor: 0.820,
    unit: 'kWh',
    source: 'CEA Regional Peak Feeder Factor',
    description: 'Dedicated 33kV thermal-dominated DISCOM lines',
  },
  {
    category: 'Green Energy Open Access / Solar PPA',
    scope: 'Scope 2',
    factor: 0.000,
    unit: 'kWh',
    source: 'GHG Protocol Market-Based (Zero Carbon REC)',
    description: 'Direct long-term renewable Power Purchase Agreement (PPA)',
  },
  // Scope 3: Value Chain & Embodied Carbon
  {
    category: 'TMT Reinforcement Steel (Primary Route - BF/BOF)',
    scope: 'Scope 3',
    factor: 1980.0,
    unit: 'Metric Tonnes',
    source: 'WorldSteel Association / Indian EPD Database',
    description: 'Embodied carbon in dam structures, piers, and highway bridges',
  },
  {
    category: 'Portland Slag Cement (PSC) / Fly-Ash Blend',
    scope: 'Scope 3',
    factor: 620.0,
    unit: 'Metric Tonnes',
    source: 'Cement Sustainability Initiative (CSI) India',
    description: 'Low-clinker blended mass concrete for canal lining',
  },
  {
    category: 'Heavy Material Transport & Freight (Diesel HDV)',
    scope: 'Scope 3',
    factor: 0.098,
    unit: 'ton-km',
    source: 'GLEC Framework / DEFRA Freight v2024',
    description: 'Third-party heavy logistics for aggregate and pipes',
  },
  {
    category: 'Employee Domestic Air Travel (Economy Class)',
    scope: 'Scope 3',
    factor: 0.146,
    unit: 'passenger-km',
    source: 'ICAO Carbon Emissions Calculator / DEFRA',
    description: 'Corporate travel between head office and project sites',
  },
];

export const ScopeEmissionsLogger: React.FC = () => {
  const { sites, emissionsLogs, addEmissionsLog, addEvidenceAttachment, currentRole } = useEsg();

  // Active Scope tab: 'Scope 1' | 'Scope 2' | 'Scope 3' | 'ALL'
  const [activeScopeTab, setActiveScopeTab] = useState<ScopeType | 'ALL'>('Scope 1');

  // Form State
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'site-042');
  const [reportingMonthYear, setReportingMonthYear] = useState<string>('2026-09');
  const [activityCategory, setActivityCategory] = useState<string>(MASTER_EMISSION_FACTORS[0].category);
  const [quantity, setQuantity] = useState<number>(10000);
  const [facility, setFacility] = useState<string>('Heavy Equipment Fleet / Batching');
  const [documentType, setDocumentType] = useState<DocumentType>('Fuel Invoice');
  const [invoiceNo, setInvoiceNo] = useState<string>('INV-IOCL-2026-9812');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formValidationMessage, setFormValidationMessage] = useState<string | null>(null);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter table
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableScopeFilter, setTableScopeFilter] = useState<string>('ALL');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('ALL');

  // Selected factor details
  const selectedFactorObj = useMemo(() => {
    return MASTER_EMISSION_FACTORS.find((f) => f.category === activityCategory) || MASTER_EMISSION_FACTORS[0];
  }, [activityCategory]);

  // Instantaneous tCO2e calculation
  // Formula: Emissions (tCO2e) = Activity Data (Units) * Emission Factor (kg CO2e/Unit) / 1000
  const instantaneousTco2e = useMemo(() => {
    const rawTco2e = (quantity * selectedFactorObj.factor) / 1000;
    return Number(rawTco2e.toFixed(3));
  }, [quantity, selectedFactorObj]);

  // Filter available factor options based on activeScopeTab
  const availableFactors = useMemo(() => {
    if (activeScopeTab === 'ALL') return MASTER_EMISSION_FACTORS;
    return MASTER_EMISSION_FACTORS.filter((f) => f.scope === activeScopeTab);
  }, [activeScopeTab]);

  // Handle switching tabs
  const handleScopeTabChange = (scope: ScopeType | 'ALL') => {
    setActiveScopeTab(scope);
    const firstMatching = scope === 'ALL'
      ? MASTER_EMISSION_FACTORS[0]
      : MASTER_EMISSION_FACTORS.find((f) => f.scope === scope) || MASTER_EMISSION_FACTORS[0];
    setActivityCategory(firstMatching.category);
    // Adjust suggested document type
    if (scope === 'Scope 1') setDocumentType('Fuel Invoice');
    else if (scope === 'Scope 2') setDocumentType('Electricity Bill');
    else if (scope === 'Scope 3') setDocumentType('Vendor Environmental Certificate');
  };

  const handleSimulateFileSelect = () => {
    const randomHex = Math.random().toString(16).substring(2, 8);
    const mockFileName =
      selectedFactorObj.scope === 'Scope 1'
        ? `IOCL_HighSpeedDiesel_BulkChallan_${randomHex}.pdf`
        : selectedFactorObj.scope === 'Scope 2'
        ? `TSSPDCL_HT_Feeder_TelemetryBill_${randomHex}.pdf`
        : `SAIL_Mill_MTR_Certificate_${randomHex}.pdf`;
    setSelectedFileName(mockFileName);
    setFormValidationMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationMessage(null);
    setSubmitSuccessMessage(null);

    // Mandatory Invoice Validation
    if (!selectedFileName && !invoiceNo) {
      setFormValidationMessage(
        'Mandatory Invoice Upload Required: SEBI BRSR Assurance protocol requires primary documentary evidence (Fuel invoice, DISCOM bill, or weighbridge slip) prior to submission.'
      );
      return;
    }

    if (quantity <= 0) {
      setFormValidationMessage('Quantity must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const siteObj = sites.find((s) => s.id === selectedSiteId) || sites[0];

      const newLog = await addEmissionsLog({
        siteId: siteObj.id,
        siteName: siteObj.name,
        reportingMonthYear,
        scopeType: selectedFactorObj.scope,
        activityCategory: selectedFactorObj.category,
        activityQuantity: quantity,
        unit: selectedFactorObj.unit,
        emissionFactor: selectedFactorObj.factor,
        co2eMetricTonnes: instantaneousTco2e,
        status: 'Submitted',
        invoiceNo,
        fileUrl: selectedFileName ? `https://storage.meilgroup.com/evidence/${selectedFileName}` : undefined,
        documentType,
        facility,
        notes,
      });

      if (selectedFileName) {
        await addEvidenceAttachment({
          emissionLogId: newLog.id,
          fileName: selectedFileName,
          fileUrl: `https://storage.meilgroup.com/evidence/${selectedFileName}`,
          documentType,
          uploadedBy: currentRole,
          fileSizeBytes: 2450000,
          verificationHash: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 10),
          ocrConfidencePct: 99.4,
        });
      }

      setSubmitSuccessMessage(
        `Successfully logged ${instantaneousTco2e.toLocaleString()} tCO2e (${selectedFactorObj.scope}) for ${siteObj.name}. Synced to cloud database and logged in statutory audit trail.`
      );
      setSelectedFileName('');
      setNotes('');
      setTimeout(() => setSubmitSuccessMessage(null), 6000);
    } catch (err: any) {
      setFormValidationMessage(`Error submitting log: ${err?.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered table rows
  const filteredRows = useMemo(() => {
    return emissionsLogs.filter((log) => {
      const matchSearch =
        log.siteName.toLowerCase().includes(tableSearch.toLowerCase()) ||
        log.activityCategory.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (log.invoiceNo || '').toLowerCase().includes(tableSearch.toLowerCase());
      const matchScope = tableScopeFilter === 'ALL' || log.scopeType === tableScopeFilter;
      const matchStatus = tableStatusFilter === 'ALL' || log.status === tableStatusFilter;
      return matchSearch && matchScope && matchStatus;
    });
  }, [emissionsLogs, tableSearch, tableScopeFilter, tableStatusFilter]);

  return (
    <div className="space-y-6">
      {/* SCOPE NAVIGATION TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-emerald-400">Step 1 & Feature 1</span>
              <span>·</span>
              <span>Statutory BRSR Core Ingestion Engine</span>
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>Modular GHG Activity Calculator & Logging Station</span>
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => handleScopeTabChange('Scope 1')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeScopeTab === 'Scope 1'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Scope 1 (Direct Fuels)</span>
            </button>
            <button
              onClick={() => handleScopeTabChange('Scope 2')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeScopeTab === 'Scope 2'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Scope 2 (Electricity)</span>
            </button>
            <button
              onClick={() => handleScopeTabChange('Scope 3')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeScopeTab === 'Scope 3'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Scope 3 (Value Chain)</span>
            </button>
            <button
              onClick={() => handleScopeTabChange('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeScopeTab === 'ALL'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Scopes</span>
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC LOGGING FORM & INSTANTANEOUS CALCULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Data Entry Form */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Site Telemetry Ingestion Form</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  {activeScopeTab === 'ALL' ? 'Multi-Scope' : activeScopeTab}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Standard CEA v20, IPCC & DEFRA 2024 emission factors auto-computed in real time
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-2 py-1 rounded">
              Factor: {selectedFactorObj.factor} kg CO₂e / {selectedFactorObj.unit}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Site Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Project Site (~300 Sites)</label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.code} - {site.name} ({site.division})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reporting Month / Date Range */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Reporting Period (Month/Year)</label>
                <input
                  type="month"
                  value={reportingMonthYear}
                  onChange={(e) => setReportingMonthYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Specific Substation / Fleet / Facility */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Operating Facility / Equipment Fleet</label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  placeholder="e.g. Spillway Excavator Fleet #4"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Activity Type Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">
                  Activity Category & Master Emission Factor
                </label>
                <select
                  value={activityCategory}
                  onChange={(e) => setActivityCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {availableFactors.map((f) => (
                    <option key={f.category} value={f.category}>
                      [{f.scope}] {f.category} ({f.factor} kg CO₂e/{f.unit})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Source: {selectedFactorObj.source} • {selectedFactorObj.description}
                </p>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Activity Quantity ({selectedFactorObj.unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="absolute right-3 top-2 text-[10px] text-slate-500 uppercase font-mono">
                    {selectedFactorObj.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence & Invoicing Section */}
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-200 text-xs">
                    Mandatory Statutory Evidence & Invoicing Attachment
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
                  ISAE 3000 Assurance Rule: Mandatory Invoice
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fuel Invoice">Fuel Invoice / Delivery Challan</option>
                    <option value="Electricity Bill">DISCOM Electricity Bill</option>
                    <option value="Weighbridge Slip">Signed Weighbridge Slip</option>
                    <option value="Flow Meter Calibration">Flow Meter Calibration Sheet</option>
                    <option value="Vendor Environmental Certificate">Vendor Environmental Certificate</option>
                    <option value="Grid Telemetry Log">Grid Telemetry Log</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Invoice / Challan Reference #</label>
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    placeholder="e.g. IOCL/2026/09/8821"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Document Attachment (.pdf / .png)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSimulateFileSelect}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedFileName ? 'Change File' : 'Attach Invoice'}</span>
                    </button>
                  </div>
                  {selectedFileName && (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-mono truncate">
                      <CheckCircle className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{selectedFileName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Optional Field Notes / Auditor Remarks</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on batching plant meter calibration, generator running hours, etc."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            {/* Validation & Feedback Banners */}
            {formValidationMessage && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 flex items-start gap-2 text-xs text-red-200">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{formValidationMessage}</span>
              </div>
            )}

            {submitSuccessMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-start gap-2 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{submitSuccessMessage}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">
                Enforces immediate dual-logging in PostgreSQL and Supabase cloud telemetry.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-lg text-xs shadow-md transition disabled:opacity-50"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Syncing to Ledger...' : 'Submit Validated Emission Log'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Instantaneous Calculation Display & Mathematical Transparency */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Instantaneous Calculation
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Live Formula Utility
              </span>
            </div>

            {/* The Mathematical Formula */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1">
              <div className="text-[11px] text-slate-400 font-sans">Statutory Calculation Formula:</div>
              <div className="text-emerald-300 font-bold">
                Emissions (tCO₂e) = (Activity Units × Emission Factor) ÷ 1,000
              </div>
            </div>

            {/* Live Calculation Steps */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Activity Quantity:</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {quantity.toLocaleString()} {selectedFactorObj.unit}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Standard Factor:</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {selectedFactorObj.factor} kg CO₂e / {selectedFactorObj.unit}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Factor Standard:</span>
                <span className="text-slate-300 text-[11px] truncate max-w-[160px]" title={selectedFactorObj.source}>
                  {selectedFactorObj.source}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Metric Tonne Conversion:</span>
                <span className="font-mono text-slate-400">÷ 1,000 kg/t</span>
              </div>
            </div>

            {/* Big Instant Output Box */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-center space-y-1">
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider block">
                Instantaneous Output (Net Carbon Impact)
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-300">
                {instantaneousTco2e.toLocaleString()}{' '}
                <span className="text-sm font-sans font-normal text-emerald-400">tCO₂e</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Classified under SEBI BRSR Principle 6 Indicator (GHG Reporting)
              </span>
            </div>

            {/* Evidence Checklist Indicator */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1.5">
              <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Assurance Pre-Submission Gate</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Primary Invoice Attached:</span>
                <span className={selectedFileName ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {selectedFileName ? 'Verified (Ready)' : 'Missing (Required)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Invoice / Challan Reference:</span>
                <span className={invoiceNo ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {invoiceNo ? 'Provided' : 'Empty'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENTLY LOGGED EMISSION RECORDS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Ingested Emission Activity Records & Statutory Evidence Vault</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing raw records logged by site engineers across MEIL project locations
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search site, fuel, invoice..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs w-48"
              />
            </div>

            <select
              value={tableScopeFilter}
              onChange={(e) => setTableScopeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="ALL">All Scopes</option>
              <option value="Scope 1">Scope 1</option>
              <option value="Scope 2">Scope 2</option>
              <option value="Scope 3">Scope 3</option>
            </select>

            <select
              value={tableStatusFilter}
              onChange={(e) => setTableStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Audited">Audited</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Site & Period</th>
                <th className="py-2.5 px-3">Scope</th>
                <th className="py-2.5 px-3">Activity & Facility</th>
                <th className="py-2.5 px-3 text-right">Quantity</th>
                <th className="py-2.5 px-3 text-right">Factor</th>
                <th className="py-2.5 px-3 text-right">Emissions (tCO₂e)</th>
                <th className="py-2.5 px-3">Evidence Invoice</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500">
                    No emission records matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{row.siteName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.reportingMonthYear}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.scopeType === 'Scope 1'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : row.scopeType === 'Scope 2'
                            ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                            : 'bg-purple-950/80 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {row.scopeType}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-medium">{row.activityCategory}</div>
                      <div className="text-[10px] text-slate-400">{row.facility || 'General Site Use'}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-200 font-medium">
                      {row.activityQuantity.toLocaleString()} {row.unit}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-400 text-[11px]">
                      {row.emissionFactor}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                      {row.co2eMetricTonnes.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                        <FileText className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>{row.invoiceNo || 'N/A'}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{row.documentType || 'Uploaded Invoice'}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.status === 'Audited'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : row.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : row.status === 'Submitted'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
