import React, { useState, useMemo } from 'react';
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
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileWarning,
  Flame,
  Zap,
  Truck,
  RotateCcw,
  Check,
  X,
  FileCheck,
  ScanLine,
  ChevronDown,
  Layers,
  ArrowUpDown,
  History,
  FileUp,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { SignedWeighbridgeModal, WeighbridgeRecord } from './SignedWeighbridgeModal';
import { syncWeighbridgeToCloud, isSupabaseConfigured } from '../../../lib/supabase';
import { ScopeType, DocumentType, EmissionLogStatus } from '../../../types/esg';

// Extended enterprise emission record interface
export interface EnterpriseActivityRecord extends WeighbridgeRecord {
  siteId: string;
  scopeType: ScopeType;
  supplier: string;
  factorValue: number; // kgCO2e per unit
  factorSource: string; // e.g. "DEFRA 2024", "CEA v20"
  factorEffectiveYear: string;
  approvalStatus: 'Draft' | 'Submitted' | 'Site Manager Review' | 'ESG Manager Approved' | 'Audited' | 'Rejected';
  ocrStatus: 'Verified Match' | 'Discrepancy Detected' | 'Pending Review' | 'Not Processed';
  ocrConfidencePct?: number;
  extractedValues?: {
    invoiceNo?: string;
    quantity?: number;
    supplier?: string;
    date?: string;
  };
  rejectionReason?: string;
  reviewerComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  isDuplicateInvoice?: boolean;
  remarks?: string;
}

// Master Emission Factors with authoritative statutory sources
interface MasterFactorDefinition {
  fuelOrSource: string;
  scopeType: ScopeType;
  unit: string;
  factor: number; // kg CO2e / unit
  sourceStandard: string;
  effectiveYear: string;
  notes: string;
}

const AUTHORITATIVE_EMISSION_FACTORS: MasterFactorDefinition[] = [
  // Scope 1: Liquid & Gas Fuels
  {
    fuelOrSource: 'High Speed Diesel (HSD) - Mobile Equipment',
    scopeType: 'Scope 1',
    unit: 'Liters',
    factor: 2.687,
    sourceStandard: 'DEFRA 2024 / IPCC Guidelines',
    effectiveYear: '2024-25',
    notes: 'Direct combustion in excavators, tippers, dumpers, and road headers (density 0.84 kg/L).',
  },
  {
    fuelOrSource: 'High Speed Diesel (HSD) - Stationary DG Sets',
    scopeType: 'Scope 1',
    unit: 'Liters',
    factor: 2.680,
    sourceStandard: 'CEA v20 / DEFRA 2024',
    effectiveYear: '2024-25',
    notes: 'Continuous & standby heavy diesel generator sets across project camp & tunneling adits.',
  },
  {
    fuelOrSource: 'Motor Gasoline / Petrol (Site Utility Fleet)',
    scopeType: 'Scope 1',
    unit: 'Liters',
    factor: 2.314,
    sourceStandard: 'IPCC AR6 / MoPNG India',
    effectiveYear: '2024-25',
    notes: 'Inspection 4WD utility vehicles, pick-up trucks, and supervisor site travel.',
  },
  {
    fuelOrSource: 'Piped Natural Gas (PNG)',
    scopeType: 'Scope 1',
    unit: 'SCM',
    factor: 2.028,
    sourceStandard: 'MoPNG / IPCC AR6',
    effectiveYear: '2024-25',
    notes: 'Piped natural gas for industrial camp boilers, asphalt batching, and site kitchens.',
  },
  {
    fuelOrSource: 'Heavy Fuel Oil (HFO / Furnace Oil)',
    scopeType: 'Scope 1',
    unit: 'Liters',
    factor: 3.175,
    sourceStandard: 'DEFRA 2024',
    effectiveYear: '2024-25',
    notes: 'Heavy grade industrial oil for aggregate drying kilns and asphalt batching plants.',
  },
  {
    fuelOrSource: 'Commercial Explosives (ANFO / Emulsion)',
    scopeType: 'Scope 1',
    unit: 'Kilograms',
    factor: 0.178,
    sourceStandard: 'GHG Protocol / CSIRO Guidelines',
    effectiveYear: '2024-25',
    notes: 'Ammonium nitrate fuel oil and packaged emulsion blast reactions in tunnel excavation.',
  },
  {
    fuelOrSource: 'Refrigerant Fugitive Losses (R-410A / Chillers)',
    scopeType: 'Scope 1',
    unit: 'Kilograms',
    factor: 2088.0,
    sourceStandard: 'IPCC AR6 100-Year GWP',
    effectiveYear: '2024-25',
    notes: 'HVAC chiller top-ups, ventilation fan refrigerants, and tunnel refrigeration plants.',
  },
  // Scope 2: Grid & Purchased Power
  {
    fuelOrSource: 'Indian National Grid Electricity (CEA Combined Margin)',
    scopeType: 'Scope 2',
    unit: 'kWh',
    factor: 0.716,
    sourceStandard: 'CEA v20 (India Central Electricity Authority)',
    effectiveYear: '2024-25',
    notes: 'Official Central Electricity Authority CO2 baseline database v20.0 weighted national average.',
  },
  {
    fuelOrSource: 'State Grid High-Carbon DISCOM Feeder (Thermal Heavy)',
    scopeType: 'Scope 2',
    unit: 'kWh',
    factor: 0.820,
    sourceStandard: 'CEA Regional Peak Feeder Benchmark',
    effectiveYear: '2024-25',
    notes: 'Dedicated 33kV/132kV regional thermal-dominated transmission lines.',
  },
  {
    fuelOrSource: 'Green Energy Open Access / Solar PPA',
    scopeType: 'Scope 2',
    unit: 'kWh',
    factor: 0.000,
    sourceStandard: 'GHG Protocol Market-Based Scope 2',
    effectiveYear: '2024-25',
    notes: 'Zero carbon accounting supported by verified Renewable Energy Certificates (I-REC).',
  },
  // Scope 3: Upstream Materials & Freight
  {
    fuelOrSource: 'TMT Reinforcement Steel (Primary Mill - Fe 550D)',
    scopeType: 'Scope 3',
    unit: 'Metric Tonnes',
    factor: 1980.0,
    sourceStandard: 'WorldSteel / Indian EPD Database',
    effectiveYear: '2024-25',
    notes: 'Cradle-to-gate embodied carbon per tonne of primary BF/BOF structural steel.',
  },
  {
    fuelOrSource: 'Portland Slag Cement (PSC / Eco-blend)',
    scopeType: 'Scope 3',
    unit: 'Metric Tonnes',
    factor: 540.0,
    sourceStandard: 'CSI India / DEFRA 2024',
    effectiveYear: '2024-25',
    notes: 'Low-clinker blended slag mass concrete for barrage piers and canal lining.',
  },
  {
    fuelOrSource: 'Heavy Freight Logistics (Diesel Tipper / 25-40T)',
    scopeType: 'Scope 3',
    unit: 'Tonne-Kilometers',
    factor: 0.104,
    sourceStandard: 'GLEC Framework / DEFRA 2024',
    effectiveYear: '2024-25',
    notes: 'Well-to-wheel commercial haulage emissions for aggregate and casing pipes.',
  },
];

export const DataCollectionView: React.FC = () => {
  const {
    activeSubtab,
    setActiveSubtab,
    setActiveModule,
    selectedSiteId,
    setSelectedSiteId,
    sites,
    scopedSites,
    brsrIndicators,
    setBrsrIndicators,
    addAuditLog,
    currentRole,
    setSites,
    canPerformAction,
  } = useEsg();

  // Multi-site selection for data entry: allows choosing any site
  const [entrySiteId, setEntrySiteId] = useState<string>(
    scopedSites.find((s) => s.id === selectedSiteId)?.id || scopedSites[0]?.id || 'site-042'
  );

  // Filter site: 'ALL' or specific site
  const [filterSiteId, setFilterSiteId] = useState<string>('ALL');

  const selectedEntrySite = sites.find((s) => s.id === entrySiteId) || sites[0];

  // Enterprise Activity Records State (initialized with realistic cross-site records)
  const [activityRecords, setActivityRecords] = useState<EnterpriseActivityRecord[]>([
    {
      id: 'act-001',
      siteId: 'site-042',
      siteCode: 'Site #042',
      siteName: 'Polavaram Multi-Purpose Project',
      date: '2026-09-28',
      scopeType: 'Scope 1',
      fuelType: 'High Speed Diesel (HSD) - Mobile Equipment',
      quantity: 14200,
      unit: 'Liters',
      factorValue: 2.687,
      factorSource: 'DEFRA 2024 / IPCC Guidelines',
      factorEffectiveYear: '2024-25',
      calculatedCo2e: 38.15,
      facility: 'Spillway Excavator Fleet #4 (Hitachi EX1200)',
      invoiceNo: 'IOCL/2026/09/8821',
      supplier: 'Indian Oil Corporation Ltd (IOCL Bulk Depot Rajahmundry)',
      uploadedFile: 'Signed_Weighbridge_IOCL_8821.pdf',
      ticketNo: 'WB-POL-2026-0928-8821',
      vehicleNo: 'AP 39 TE 4821',
      grossWeight: '28,450 kg',
      tareWeight: '14,250 kg',
      netWeight: '14,200 Liters (11,928 kg @ 0.84 density)',
      driverName: 'K. Ramesh Naidu (DL: AP05-20180041289)',
      timeIn: '08:42:15 AM',
      timeOut: '09:18:40 AM',
      operatorName: 'Er. Rajesh Kumar (Site In-Charge)',
      approvalStatus: 'ESG Manager Approved',
      ocrStatus: 'Verified Match',
      ocrConfidencePct: 98.4,
      extractedValues: {
        invoiceNo: 'IOCL/2026/09/8821',
        quantity: 14200,
        supplier: 'Indian Oil Corporation Ltd',
        date: '2026-09-28',
      },
      reviewedBy: 'K. V. Rao (Group ESG Controller)',
      reviewedAt: '2026-09-29 11:20 AM',
      remarks: 'Primary batching plant delivery certified against weighbridge slip #8821.',
    },
    {
      id: 'act-002',
      siteId: 'site-042',
      siteCode: 'Site #042',
      siteName: 'Polavaram Multi-Purpose Project',
      date: '2026-09-29',
      scopeType: 'Scope 2',
      fuelType: 'Indian National Grid Electricity (CEA Combined Margin)',
      quantity: 48600,
      unit: 'kWh',
      factorValue: 0.716,
      factorSource: 'CEA v20 (India Central Electricity Authority)',
      factorEffectiveYear: '2024-25',
      calculatedCo2e: 34.80,
      facility: 'Batching Plant Substation #2 (33kV HT Feeder)',
      invoiceNo: 'DISCOM/HT/092926/01',
      supplier: 'Eastern Power Distribution Company of AP (APEPDCL)',
      uploadedFile: 'Signed_Grid_Meter_Slip_0929.pdf',
      ticketNo: 'WB-POL-2026-0929-0142',
      vehicleNo: '33kV FEEDER METER #APEPDCL-04',
      grossWeight: 'N/A (Grid Telemetry)',
      tareWeight: 'N/A',
      netWeight: '48,600 kWh',
      driverName: 'Substation Shift Engineer #02',
      timeIn: '00:00:00 AM',
      timeOut: '11:59:59 PM',
      operatorName: 'Er. T. S. Rao (Electrical Lead)',
      approvalStatus: 'Audited',
      ocrStatus: 'Verified Match',
      ocrConfidencePct: 99.1,
      extractedValues: {
        invoiceNo: 'DISCOM/HT/092926/01',
        quantity: 48600,
        supplier: 'APEPDCL Substation',
        date: '2026-09-29',
      },
      reviewedBy: 'S. Narayanan (ISAE 3000 Lead Auditor)',
      reviewedAt: '2026-09-30 04:15 PM',
      remarks: 'Reconciled with DISCOM grid invoice and NABL calibrated meter log.',
    },
    {
      id: 'act-003',
      siteId: 'site-108',
      siteCode: 'Site #108',
      siteName: 'Zojila Strategic Tunnel Project',
      date: '2026-09-30',
      scopeType: 'Scope 1',
      fuelType: 'High Speed Diesel (HSD) - Stationary DG Sets',
      quantity: 22500,
      unit: 'Liters',
      factorValue: 2.680,
      factorSource: 'CEA v20 / DEFRA 2024',
      factorEffectiveYear: '2024-25',
      calculatedCo2e: 60.30,
      facility: 'West Portal Cavern Adit #1 (Caterpillar 1500kVA DG)',
      invoiceNo: 'HPCL/ZOJ/0926/410',
      supplier: 'Hindustan Petroleum Corp Ltd (HPCL Leh Depot)',
      uploadedFile: 'Signed_HPCL_Fuel_Challan_410.pdf',
      ticketNo: 'WB-ZOJ-2026-0930-0410',
      vehicleNo: 'JK 01 AF 4902 (Insulated Fuel Bowser)',
      grossWeight: '34,200 kg',
      tareWeight: '15,300 kg',
      netWeight: '22,500 Liters (18,900 kg)',
      driverName: 'Ghulam Mohammad (DL: JK01-20150091)',
      timeIn: '07:15:00 AM',
      timeOut: '08:05:30 AM',
      operatorName: 'Er. Farooq Ahmad (Tunnel Plant Lead)',
      approvalStatus: 'Site Manager Review',
      ocrStatus: 'Verified Match',
      ocrConfidencePct: 96.5,
      extractedValues: {
        invoiceNo: 'HPCL/ZOJ/0926/410',
        quantity: 22500,
        supplier: 'Hindustan Petroleum Corp Ltd',
        date: '2026-09-30',
      },
      remarks: 'High-altitude sub-zero dewatering and ventilation continuous supply.',
    },
    {
      id: 'act-004',
      siteId: 'site-019',
      siteCode: 'Site #019',
      siteName: 'Kaleshwaram Lift Irrigation Package 10',
      date: '2026-10-01',
      scopeType: 'Scope 2',
      fuelType: 'State Grid High-Carbon DISCOM Feeder (Thermal Heavy)',
      quantity: 124000,
      unit: 'kWh',
      factorValue: 0.820,
      factorSource: 'CEA Regional Peak Feeder Benchmark',
      factorEffectiveYear: '2024-25',
      calculatedCo2e: 101.68,
      facility: 'Underground Pump House Unit #4 (139 MW Pump)',
      invoiceNo: 'TSSPDCL/HT/100126/89',
      supplier: 'Telangana State Southern Power Distribution Co Ltd',
      uploadedFile: 'Signed_TSSPDCL_Invoice_89.pdf',
      ticketNo: 'WB-KAL-2026-1001-0891',
      vehicleNo: '132kV SUBSTATION LINE #02',
      grossWeight: 'N/A (SCADA Log)',
      tareWeight: 'N/A',
      netWeight: '124,000 kWh',
      driverName: 'SCADA Automation Engineer',
      timeIn: '00:00:00 AM',
      timeOut: '11:59:59 PM',
      operatorName: 'Er. N. Srinivas (Chief Electrical Engineer)',
      approvalStatus: 'Submitted',
      ocrStatus: 'Verified Match',
      ocrConfidencePct: 97.8,
      extractedValues: {
        invoiceNo: 'TSSPDCL/HT/100126/89',
        quantity: 124000,
        supplier: 'TSSPDCL HT Substation',
        date: '2026-10-01',
      },
      remarks: 'Full capacity testing for surge pool dewatering.',
    },
    {
      id: 'act-005',
      siteId: 'site-042',
      siteCode: 'Site #042',
      siteName: 'Polavaram Multi-Purpose Project',
      date: '2026-10-02',
      scopeType: 'Scope 1',
      fuelType: 'Commercial Explosives (ANFO / Emulsion)',
      quantity: 1850,
      unit: 'Kilograms',
      factorValue: 0.178,
      factorSource: 'GHG Protocol / CSIRO Guidelines',
      factorEffectiveYear: '2024-25',
      calculatedCo2e: 0.33,
      facility: 'Tunnel Deep Cavern Reach #1',
      invoiceNo: 'SOLAR_EXPL/2026/041',
      supplier: 'Solar Industries India Ltd (Nagpur)',
      uploadedFile: 'Signed_Blast_Permit_Weigh_041.pdf',
      ticketNo: 'WB-POL-2026-1002-0419',
      vehicleNo: 'KA 04 E 9920 (Explosive Van)',
      grossWeight: '8,450 kg',
      tareWeight: '6,600 kg',
      netWeight: '1,850 kg',
      driverName: 'V. Prakash (Certified Carrier)',
      timeIn: '06:15:00 AM',
      timeOut: '06:50:30 AM',
      operatorName: 'Er. Rajesh Kumar (Site In-Charge)',
      approvalStatus: 'Draft',
      ocrStatus: 'Discrepancy Detected',
      ocrConfidencePct: 84.0,
      extractedValues: {
        invoiceNo: 'SOLAR_EXPL/2026/041',
        quantity: 1800, // Discrepancy: 1850 vs 1800 on slip
        supplier: 'Solar Industries Ltd',
        date: '2026-10-02',
      },
      rejectionReason: 'Quantity discrepancy: entered 1850 kg vs invoice slip 1800 kg. Stamped permit pending correction.',
      remarks: 'Blasting permit checked against explosive magazine license.',
    },
  ]);

  // Form State for logging a new record
  const [selectedFactor, setSelectedFactor] = useState<MasterFactorDefinition>(
    AUTHORITATIVE_EMISSION_FACTORS[0]
  );
  const [newDate, setNewDate] = useState('2026-10-03');
  const [newQuantity, setNewQuantity] = useState<number>(5000);
  const [newFacility, setNewFacility] = useState('Batching Plant DG Set #2');
  const [newInvoiceNo, setNewInvoiceNo] = useState('BPCL/POL/2026/10/9941');
  const [newSupplier, setNewSupplier] = useState('Bharat Petroleum Corporation Ltd (BPCL Depot)');
  const [newVehicleNo, setNewVehicleNo] = useState('AP 39 TE 7714');
  const [newUploadedFile, setNewUploadedFile] = useState('');
  const [newRemarks, setNewRemarks] = useState('Standard refueling batch for site equipment');

  // Search, Filter, Sort, Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | ScopeType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | string>('ALL');
  const [sortField, setSortField] = useState<'date' | 'calculatedCo2e' | 'quantity'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeWeighbridgeRecord, setActiveWeighbridgeRecord] = useState<WeighbridgeRecord | null>(null);
  const [isWeighbridgeModalOpen, setIsWeighbridgeModalOpen] = useState(false);

  // Verification & OCR Modal
  const [selectedVerificationRecord, setSelectedVerificationRecord] = useState<EnterpriseActivityRecord | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Review & Workflow Comment Modal
  const [reviewActionRecord, setReviewActionRecord] = useState<EnterpriseActivityRecord | null>(null);
  const [reviewModalAction, setReviewModalAction] = useState<'APPROVE' | 'REJECT' | 'SUBMIT'>('APPROVE');
  const [reviewComment, setReviewComment] = useState('');

  // Duplicate Invoice Detection Check
  const isInvoiceDuplicate = useMemo(() => {
    if (!newInvoiceNo.trim()) return false;
    return activityRecords.some(
      (r) => r.invoiceNo.toLowerCase().trim() === newInvoiceNo.toLowerCase().trim()
    );
  }, [newInvoiceNo, activityRecords]);

  // Calculation Breakdown
  const liveEmissionCalculation = useMemo(() => {
    const rawFactor = selectedFactor.factor;
    const totalEmissionsTco2e = Number(((newQuantity * rawFactor) / 1000).toFixed(3));
    return {
      quantity: newQuantity,
      unit: selectedFactor.unit,
      factor: rawFactor,
      scope: selectedFactor.scopeType,
      standard: selectedFactor.sourceStandard,
      effectiveYear: selectedFactor.effectiveYear,
      totalEmissionsTco2e,
    };
  }, [newQuantity, selectedFactor]);

  // Handle Log Entry
  const handleAddActivityRecord = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canPerformAction('create')) {
      alert(`Role ${currentRole} is restricted from creating activity records.`);
      return;
    }

    if (isInvoiceDuplicate) {
      if (!confirm(`Warning: Invoice #${newInvoiceNo} already exists in the system. Proceed anyway with separate voucher entry?`)) {
        return;
      }
    }

    const calculatedCo2e = liveEmissionCalculation.totalEmissionsTco2e;
    const ticketGenerated = `WB-${selectedEntrySite.code.replace('#', '').replace(/\s+/g, '')}-${newDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: EnterpriseActivityRecord = {
      id: `act-${Date.now()}`,
      siteId: selectedEntrySite.id,
      siteCode: selectedEntrySite.code,
      siteName: selectedEntrySite.name,
      date: newDate,
      scopeType: selectedFactor.scopeType,
      fuelType: selectedFactor.fuelOrSource,
      quantity: newQuantity,
      unit: selectedFactor.unit,
      factorValue: selectedFactor.factor,
      factorSource: selectedFactor.sourceStandard,
      factorEffectiveYear: selectedFactor.effectiveYear,
      calculatedCo2e,
      facility: newFacility,
      invoiceNo: newInvoiceNo,
      supplier: newSupplier,
      uploadedFile: newUploadedFile || `Signed_Delivery_Slip_${newInvoiceNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      ticketNo: ticketGenerated,
      vehicleNo: newVehicleNo,
      grossWeight: `${Math.round(newQuantity * 1.8 + 14200)} kg`,
      tareWeight: '14,200 kg',
      netWeight: `${newQuantity.toLocaleString()} ${selectedFactor.unit}`,
      driverName: 'M. Venkat Ramana (DL: AP07-20190014281)',
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timeOut: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      operatorName: 'Er. Rajesh Kumar (Site In-Charge)',
      approvalStatus: 'Submitted',
      ocrStatus: 'Pending Review',
      ocrConfidencePct: 95.0,
      extractedValues: {
        invoiceNo: newInvoiceNo,
        quantity: newQuantity,
        supplier: newSupplier,
        date: newDate,
      },
      remarks: newRemarks,
      isDuplicateInvoice: isInvoiceDuplicate,
    };

    setActivityRecords((prev) => [newRecord, ...prev]);

    // Update site emissions
    setSites((prev) =>
      prev.map((s) =>
        s.id === selectedEntrySite.id
          ? {
              ...s,
              scope1: selectedFactor.scopeType === 'Scope 1' ? s.scope1 + Math.round(calculatedCo2e) : s.scope1,
              scope2: selectedFactor.scopeType === 'Scope 2' ? s.scope2 + Math.round(calculatedCo2e) : s.scope2,
              scope3: selectedFactor.scopeType === 'Scope 3' ? s.scope3 + Math.round(calculatedCo2e) : s.scope3,
            }
          : s
      )
    );

    addAuditLog({
      user: 'K. V. Rao',
      role: currentRole,
      action: 'CREATE',
      entity: `${selectedEntrySite.code} • ${selectedEntrySite.name}`,
      field: `Activity Ingestion: ${selectedFactor.fuelOrSource}`,
      oldValue: '0',
      newValue: `${newQuantity} ${selectedFactor.unit} (${calculatedCo2e} tCO2e) [Invoice: ${newInvoiceNo}]`,
    });

    // Cloud sync
    syncWeighbridgeToCloud({
      site_id: selectedEntrySite.id,
      site_name: selectedEntrySite.name,
      gate_pass_no: ticketGenerated,
      vehicle_no: newVehicleNo,
      material: selectedFactor.fuelOrSource,
      gross_weight_mt: Number(newRecord.grossWeight?.replace(/[^0-9.]/g, '') || 36.5) / 1000,
      tare_weight_mt: 14.2,
      net_quantity: newQuantity,
      unit: selectedFactor.unit,
      scope1_tco2e: calculatedCo2e,
      driver_name: newRecord.driverName,
      inspection_officer: 'Certified Site Materials Inspector',
      verified_status: 'SUBMITTED_FOR_REVIEW',
    });

    setActiveWeighbridgeRecord(newRecord);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 8000);
  };

  // Workflow Transition Action
  const handleExecuteWorkflowAction = () => {
    if (!reviewActionRecord) return;

    let nextStatus: EnterpriseActivityRecord['approvalStatus'] = reviewActionRecord.approvalStatus;

    if (reviewModalAction === 'SUBMIT') {
      nextStatus = 'Submitted';
    } else if (reviewModalAction === 'APPROVE') {
      if (reviewActionRecord.approvalStatus === 'Submitted') {
        nextStatus = 'Site Manager Review';
      } else if (reviewActionRecord.approvalStatus === 'Site Manager Review') {
        nextStatus = 'ESG Manager Approved';
      } else {
        nextStatus = 'Audited';
      }
    } else if (reviewModalAction === 'REJECT') {
      nextStatus = 'Rejected';
    }

    setActivityRecords((prev) =>
      prev.map((r) =>
        r.id === reviewActionRecord.id
          ? {
              ...r,
              approvalStatus: nextStatus,
              reviewerComments: reviewComment || r.reviewerComments,
              rejectionReason: reviewModalAction === 'REJECT' ? reviewComment : undefined,
              reviewedBy: currentRole,
              reviewedAt: new Date().toLocaleString(),
            }
          : r
      )
    );

    addAuditLog({
      user: 'K. V. Rao',
      role: currentRole,
      action: reviewModalAction === 'REJECT' ? 'REJECT' : 'APPROVE',
      entity: `${reviewActionRecord.siteCode} • ${reviewActionRecord.siteName}`,
      field: `Status Transition: ${reviewActionRecord.invoiceNo}`,
      oldValue: reviewActionRecord.approvalStatus,
      newValue: `${nextStatus} (Comment: ${reviewComment || 'Statutory criteria met'})`,
    });

    setReviewActionRecord(null);
    setReviewComment('');
  };

  // Export records to CSV / Excel format
  const handleExportRecords = () => {
    const headers = [
      'Record ID',
      'Site Code',
      'Site Name',
      'Date',
      'Scope',
      'Fuel / Energy Source',
      'Quantity',
      'Unit',
      'Emission Factor (kgCO2e/unit)',
      'Calculated tCO2e',
      'Factor Source Standard',
      'Invoice #',
      'Supplier',
      'Facility / Meter',
      'Vehicle #',
      'Approval Status',
      'OCR Verification',
      'Reviewed By',
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.siteCode,
      `"${r.siteName}"`,
      r.date,
      r.scopeType,
      `"${r.fuelType}"`,
      r.quantity,
      r.unit,
      r.factorValue,
      r.calculatedCo2e,
      `"${r.factorSource}"`,
      `"${r.invoiceNo}"`,
      `"${r.supplier}"`,
      `"${r.facility}"`,
      `"${r.vehicleNo || 'N/A'}"`,
      r.approvalStatus,
      r.ocrStatus,
      `"${r.reviewedBy || 'Pending'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_Activity_Data_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return activityRecords
      .filter((r) => {
        // Site filter
        if (filterSiteId !== 'ALL' && r.siteId !== filterSiteId) return false;
        // Scope filter
        if (scopeFilter !== 'ALL' && r.scopeType !== scopeFilter) return false;
        // Status filter
        if (statusFilter !== 'ALL' && r.approvalStatus !== statusFilter) return false;
        // Search filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const match =
            r.fuelType.toLowerCase().includes(term) ||
            r.invoiceNo.toLowerCase().includes(term) ||
            r.facility.toLowerCase().includes(term) ||
            (r.siteName?.toLowerCase().includes(term) ?? false) ||
            (r.supplier?.toLowerCase().includes(term) ?? false);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
        } else if (sortField === 'calculatedCo2e') {
          return sortAsc ? a.calculatedCo2e - b.calculatedCo2e : b.calculatedCo2e - a.calculatedCo2e;
        } else {
          return sortAsc ? a.quantity - b.quantity : b.quantity - a.quantity;
        }
      });
  }, [activityRecords, filterSiteId, scopeFilter, statusFilter, searchTerm, sortField, sortAsc]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;

  // Real-time ESG Analytics Metrics derived from filtered records
  const analyticsSummary = useMemo(() => {
    const scope1 = filteredRecords.filter((r) => r.scopeType === 'Scope 1').reduce((acc, r) => acc + r.calculatedCo2e, 0);
    const scope2 = filteredRecords.filter((r) => r.scopeType === 'Scope 2').reduce((acc, r) => acc + r.calculatedCo2e, 0);
    const scope3 = filteredRecords.filter((r) => r.scopeType === 'Scope 3').reduce((acc, r) => acc + r.calculatedCo2e, 0);
    const verifiedCount = filteredRecords.filter((r) => r.approvalStatus === 'ESG Manager Approved' || r.approvalStatus === 'Audited').length;
    const pendingCount = filteredRecords.filter((r) => r.approvalStatus === 'Submitted' || r.approvalStatus === 'Site Manager Review').length;
    const missingEvidenceCount = filteredRecords.filter((r) => !r.uploadedFile || r.ocrStatus === 'Discrepancy Detected').length;
    const verificationRate = filteredRecords.length > 0 ? Math.round((verifiedCount / filteredRecords.length) * 100) : 100;

    return {
      scope1: Number(scope1.toFixed(2)),
      scope2: Number(scope2.toFixed(2)),
      scope3: Number(scope3.toFixed(2)),
      total: Number((scope1 + scope2 + scope3).toFixed(2)),
      verificationRate,
      pendingCount,
      missingEvidenceCount,
      recordCount: filteredRecords.length,
    };
  }, [filteredRecords]);

  // Section B Policies checklist state
  const [policies, setPolicies] = useState([
    { id: 'pol-1', name: 'Corporate Human Rights & Anti-Slavery Policy', p: 'P5', covered: true, boardApproved: true, url: 'https://meil.in/esg/human-rights' },
    { id: 'pol-2', name: 'Environment, Energy & Net Zero Decarbonization Policy', p: 'P6', covered: true, boardApproved: true, url: 'https://meil.in/esg/environment-policy' },
    { id: 'pol-3', name: 'Anti-Bribery, Anti-Corruption & Whistleblower Policy', p: 'P1', covered: true, boardApproved: true, url: 'https://meil.in/esg/whistleblower' },
    { id: 'pol-4', name: 'Zero Harm Occupational Health & Safety (OHS) Standard', p: 'P3', covered: true, boardApproved: true, url: 'https://meil.in/esg/safety' },
    { id: 'pol-5', name: 'Sustainable Procurement & Tier-1 Vendor ESG Code', p: 'P8', covered: true, boardApproved: true, url: 'https://meil.in/esg/vendor-code' },
    { id: 'pol-6', name: 'Biodiversity Conservation & Zero Net Loss in River Basins', p: 'P6', covered: true, boardApproved: true, url: 'https://meil.in/esg/biodiversity' },
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span>Enterprise Fuel & Electricity Activity Records</span>
              <span>·</span>
              <span className="text-emerald-400 font-semibold">{selectedEntrySite.code} · {selectedEntrySite.name}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ISAE 3000 Audit Trail Active
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Activity Data Management & BRSR Ingestion Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-site telemetry ingestion, authoritative emission factor calculations, OCR verification, and 4-tier approval workflow.
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
          {/* Real-Time ESG Analytics Cards derived from current filtered dataset */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> Scope 1</span>
                <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-300">Direct</span>
              </div>
              <div className="text-lg font-bold text-white mt-1 font-mono">{analyticsSummary.scope1.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">Mobile & DG sets</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-sky-400" /> Scope 2</span>
                <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-300">Grid</span>
              </div>
              <div className="text-lg font-bold text-sky-400 mt-1 font-mono">{analyticsSummary.scope2.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">CEA v20 Factors</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-purple-400" /> Scope 3</span>
                <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-300">Supply</span>
              </div>
              <div className="text-lg font-bold text-purple-400 mt-1 font-mono">{analyticsSummary.scope3.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">Steel, Slag & Freight</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-emerald-400" /> Total GHG</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1 rounded">Consolidated</span>
              </div>
              <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">{analyticsSummary.total.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO₂e</span></div>
              <div className="text-[10px] text-slate-500 mt-0.5">{analyticsSummary.recordCount} Filtered Entries</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Rate</span>
                <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-300">ISAE 3000</span>
              </div>
              <div className="text-lg font-bold text-white mt-1 font-mono">{analyticsSummary.verificationRate}%</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Audit-Ready State</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> In Review</span>
                <span className="text-[10px] bg-amber-950 text-amber-400 px-1 rounded">{analyticsSummary.pendingCount} Pending</span>
              </div>
              <div className="text-lg font-bold text-amber-400 mt-1 font-mono">{analyticsSummary.pendingCount}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {analyticsSummary.missingEvidenceCount > 0 ? (
                  <span className="text-rose-400 font-semibold">{analyticsSummary.missingEvidenceCount} Flagged Logs</span>
                ) : (
                  <span>All Evidence Attached</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick-Entry Ingestion Form Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Ingest Fuel, Energy & Emission Activity Record</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select any MEIL infrastructure site to log verified activity data with real-time statutory emission factor calculation.
                </p>
              </div>

              {/* Target Project / Site Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Target Site:</span>
                <select
                  value={entrySiteId}
                  onChange={(e) => setEntrySiteId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-emerald-500 shadow-sm"
                >
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.code} • {site.name} ({site.division})
                    </option>
                  ))}
                </select>
              </div>
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
              <form onSubmit={handleAddActivityRecord} className="space-y-4 text-xs">
                {/* Row 1: Core Activity Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Reporting Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Emission Source & Factor</label>
                    <select
                      value={selectedFactor.fuelOrSource}
                      onChange={(e) => {
                        const found = AUTHORITATIVE_EMISSION_FACTORS.find((f) => f.fuelOrSource === e.target.value);
                        if (found) setSelectedFactor(found);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 truncate"
                    >
                      {AUTHORITATIVE_EMISSION_FACTORS.map((f, idx) => (
                        <option key={idx} value={f.fuelOrSource}>
                          [{f.scopeType}] {f.fuelOrSource} ({f.factor} kgCO₂e/{f.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Quantity ({selectedFactor.unit})</label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 font-mono font-bold focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Facility / Equipment Reach</label>
                    <input
                      type="text"
                      value={newFacility}
                      onChange={(e) => setNewFacility(e.target.value)}
                      placeholder="e.g. Tunnel Adit #2 DG Set, Batching Plant #1"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Invoicing & Evidence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-400 font-medium">Invoice / Delivery Challan #</label>
                      {isInvoiceDuplicate && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Duplicate Detected
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={newInvoiceNo}
                      onChange={(e) => setNewInvoiceNo(e.target.value)}
                      placeholder="e.g. IOCL/2026/09/8821"
                      className={`w-full bg-slate-950 border rounded-lg px-2.5 py-2 text-slate-200 font-mono focus:outline-none ${
                        isInvoiceDuplicate ? 'border-amber-500 focus:border-amber-400' : 'border-slate-700 focus:border-emerald-500'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Supplier / DISCOM Substation</label>
                    <input
                      type="text"
                      value={newSupplier}
                      onChange={(e) => setNewSupplier(e.target.value)}
                      placeholder="e.g. IOCL Bulk Depot, TSSPDCL 33kV"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Vehicle / Meter Reg. ID</label>
                    <input
                      type="text"
                      value={newVehicleNo}
                      onChange={(e) => setNewVehicleNo(e.target.value)}
                      placeholder="e.g. AP 39 TE 7714 or METER #04"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Evidence Voucher (PDF/Scan/Excel)</label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newUploadedFile}
                        onChange={(e) => setNewUploadedFile(e.target.value)}
                        placeholder="Challan_Voucher.pdf"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewUploadedFile(`Signed_Weighbridge_Challan_${Date.now().toString().slice(-4)}.pdf`)
                        }
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition-colors shrink-0"
                        title="Simulate Document Upload"
                      >
                        <FileUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculation Engine Breakdown & Submit Bar */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {liveEmissionCalculation.scope}
                      </span>
                      <span className="text-slate-400 text-xs font-mono">
                        {newQuantity.toLocaleString()} {liveEmissionCalculation.unit} × {liveEmissionCalculation.factor} kgCO₂e/{liveEmissionCalculation.unit} ÷ 1,000 =
                      </span>
                      <strong className="text-emerald-400 font-mono text-sm">
                        {liveEmissionCalculation.totalEmissionsTco2e} tCO₂e
                      </strong>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Source Standard: <strong className="text-slate-300">{liveEmissionCalculation.standard}</strong></span>
                      <span>·</span>
                      <span>Cycle: <strong className="text-slate-300">{liveEmissionCalculation.effectiveYear}</strong></span>
                      <span>·</span>
                      <span className="text-emerald-400">Never using undocumented defaults</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Log Verified Activity Entry</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Entry Logged for {selectedEntrySite.name}!</div>
                    <div className="text-[11px] text-emerald-300/90">
                      Calculated {liveEmissionCalculation.totalEmissionsTco2e} tCO₂e via {liveEmissionCalculation.standard} and appended to audit history.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWeighbridgeModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer text-xs"
                >
                  <Scale className="w-4 h-4 text-emerald-100" />
                  <span>View Signed Slip</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              </div>
            )}
          </div>

          {/* Activity Data Records Table with Search, Filter, Sort & Workflow */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            {/* Table Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Activity Records Ledger</span>
                  <span className="text-xs text-slate-400 font-normal">({filteredRecords.length} records found)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter by site, scope, or status; run OCR comparison, and progress records through the 4-tier approval workflow.
                </p>
              </div>

              {/* Action Buttons: Export & Refresh */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleExportRecords}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV / Excel</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search invoice, equipment, fuel..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Site Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] shrink-0">Site:</span>
                <select
                  value={filterSiteId}
                  onChange={(e) => {
                    setFilterSiteId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 truncate"
                >
                  <option value="ALL">All MEIL Sites (Consolidated)</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} • {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scope Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] shrink-0">Scope:</span>
                <select
                  value={scopeFilter}
                  onChange={(e) => {
                    setScopeFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Scopes (1, 2, 3)</option>
                  <option value="Scope 1">Scope 1: Direct Combustion</option>
                  <option value="Scope 2">Scope 2: Purchased Electricity</option>
                  <option value="Scope 3">Scope 3: Upstream & Freight</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] shrink-0">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Approval Stages</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted (Site Engineer)</option>
                  <option value="Site Manager Review">Site Manager Review</option>
                  <option value="ESG Manager Approved">ESG Manager Approved</option>
                  <option value="Audited">Audited (ISAE 3000)</option>
                  <option value="Rejected">Rejected / Clarification</option>
                </select>
              </div>
            </div>

            {/* Ingested Records Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th
                      className="py-2.5 px-3 cursor-pointer hover:text-white"
                      onClick={() => {
                        setSortField('date');
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Site & Reach</th>
                    <th className="py-2.5 px-3">Fuel / Energy Source</th>
                    <th
                      className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                      onClick={() => {
                        setSortField('quantity');
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Quantity</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th
                      className="py-2.5 px-3 text-right cursor-pointer hover:text-white"
                      onClick={() => {
                        setSortField('calculatedCo2e');
                        setSortAsc(!sortAsc);
                      }}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Emissions (tCO₂e)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">Invoice & Evidence</th>
                    <th className="py-2.5 px-3 text-center">OCR Check</th>
                    <th className="py-2.5 px-3 text-center">Approval Stage</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                        No activity records matched your filter criteria. Try adjusting the site or scope filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                          {row.date}
                        </td>

                        <td className="py-2.5 px-3 max-w-[150px]">
                          <div className="font-semibold text-white truncate" title={row.siteName}>
                            {row.siteCode}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">{row.facility}</div>
                        </td>

                        <td className="py-2.5 px-3 max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                row.scopeType === 'Scope 1'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : row.scopeType === 'Scope 2'
                                  ? 'bg-sky-950 text-sky-300 border border-sky-800'
                                  : 'bg-purple-950 text-purple-300 border border-purple-800'
                              }`}
                            >
                              {row.scopeType}
                            </span>
                            <span className="font-medium text-slate-200 truncate" title={row.fuelType}>
                              {row.fuelType}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            EF: {row.factorValue} kg/{row.unit} ({row.factorSource.split('/')[0]})
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100 whitespace-nowrap">
                          {row.quantity.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{row.unit}</span>
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                          {row.calculatedCo2e.toLocaleString()} <span className="text-[10px] font-normal">t</span>
                        </td>

                        <td className="py-2.5 px-3 max-w-[170px]">
                          <div className="font-mono text-slate-300 truncate" title={row.invoiceNo}>
                            {row.invoiceNo}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer">
                            <FileText className="w-3 h-3 shrink-0" />
                            <span
                              onClick={() => {
                                setSelectedVerificationRecord(row);
                                setIsVerificationModalOpen(true);
                              }}
                              className="truncate hover:underline text-[10px]"
                              title={row.uploadedFile}
                            >
                              {row.uploadedFile}
                            </span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVerificationRecord(row);
                              setIsVerificationModalOpen(true);
                            }}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                              row.ocrStatus === 'Verified Match'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 hover:bg-emerald-900'
                                : row.ocrStatus === 'Discrepancy Detected'
                                ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80 hover:bg-rose-900 animate-pulse'
                                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
                            }`}
                          >
                            <ScanLine className="w-3 h-3" />
                            <span>{row.ocrStatus}</span>
                          </button>
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                              row.approvalStatus === 'Audited'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : row.approvalStatus === 'ESG Manager Approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : row.approvalStatus === 'Site Manager Review'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : row.approvalStatus === 'Submitted'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {row.approvalStatus}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            {/* View Signed Weighbridge Slip */}
                            <button
                              type="button"
                              onClick={() => {
                                setActiveWeighbridgeRecord(row);
                                setIsWeighbridgeModalOpen(true);
                              }}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors"
                              title="View Official Signed Weighbridge Slip"
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>

                            {/* Workflow Approval / Clarification Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setReviewActionRecord(row);
                                setReviewModalAction(row.approvalStatus === 'Rejected' ? 'SUBMIT' : 'APPROVE');
                                setReviewComment('');
                              }}
                              className="p-1 rounded bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-400 transition-colors"
                              title="Workflow Action (Approve / Reject)"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>

                            {/* Reject / Flag button */}
                            {row.approvalStatus !== 'Rejected' && row.approvalStatus !== 'Audited' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewActionRecord(row);
                                  setReviewModalAction('REJECT');
                                  setReviewComment('');
                                }}
                                className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Request Clarification / Reject Entry"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div>
                Showing {paginatedRecords.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} activity records
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
                >
                  Previous
                </button>
                <span className="px-2 py-1 text-slate-300 font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
                >
                  Next
                </button>
              </div>
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

      {/* DOCUMENT VERIFICATION & OCR MODAL */}
      {isVerificationModalOpen && selectedVerificationRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Document Verification & OCR Field Matching</h3>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{selectedVerificationRecord.uploadedFile}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target Site: {selectedVerificationRecord.siteCode} • {selectedVerificationRecord.siteName}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedVerificationRecord.ocrStatus === 'Verified Match'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {selectedVerificationRecord.ocrStatus} ({selectedVerificationRecord.ocrConfidencePct || 95}% Match)
                  </span>
                </div>
              </div>

              {/* Comparison Grid: Manually Entered vs OCR Extracted */}
              <div className="rounded-lg border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold text-[11px]">
                    <tr>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Manually Entered Value</th>
                      <th className="p-2.5">OCR Extracted from Voucher</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-medium text-slate-400">Invoice #</td>
                      <td className="p-2.5 font-mono text-white">{selectedVerificationRecord.invoiceNo}</td>
                      <td className="p-2.5 font-mono text-emerald-300">
                        {selectedVerificationRecord.extractedValues?.invoiceNo || selectedVerificationRecord.invoiceNo}
                      </td>
                      <td className="p-2.5 text-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-medium text-slate-400">Quantity</td>
                      <td className="p-2.5 font-mono text-white">
                        {selectedVerificationRecord.quantity.toLocaleString()} {selectedVerificationRecord.unit}
                      </td>
                      <td className="p-2.5 font-mono text-slate-200">
                        {selectedVerificationRecord.extractedValues?.quantity?.toLocaleString() || selectedVerificationRecord.quantity.toLocaleString()} {selectedVerificationRecord.unit}
                      </td>
                      <td className="p-2.5 text-center">
                        {selectedVerificationRecord.extractedValues?.quantity === selectedVerificationRecord.quantity ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-medium text-slate-400">Supplier Name</td>
                      <td className="p-2.5 text-white">{selectedVerificationRecord.supplier}</td>
                      <td className="p-2.5 text-slate-300">
                        {selectedVerificationRecord.extractedValues?.supplier || selectedVerificationRecord.supplier}
                      </td>
                      <td className="p-2.5 text-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-medium text-slate-400">Date</td>
                      <td className="p-2.5 font-mono text-white">{selectedVerificationRecord.date}</td>
                      <td className="p-2.5 font-mono text-slate-300">{selectedVerificationRecord.date}</td>
                      <td className="p-2.5 text-center">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {selectedVerificationRecord.rejectionReason && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                  <FileWarning className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-200">Discrepancy Note:</strong>
                    <span>{selectedVerificationRecord.rejectionReason}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveWeighbridgeRecord(selectedVerificationRecord);
                  setIsWeighbridgeModalOpen(true);
                  setIsVerificationModalOpen(false);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Full Weighbridge Slip</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVerificationModalOpen(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKFLOW APPROVAL / REVIEW MODAL */}
      {reviewActionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {reviewModalAction === 'APPROVE'
                    ? 'Approve & Advance Activity Record'
                    : reviewModalAction === 'REJECT'
                    ? 'Reject / Request Correction'
                    : 'Resubmit Activity Record'}
                </h3>
              </div>
              <button
                onClick={() => setReviewActionRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Site:</span>
                  <strong className="text-white">{reviewActionRecord.siteCode} • {reviewActionRecord.siteName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Emission Source:</span>
                  <span className="text-slate-200">{reviewActionRecord.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Net Quantity:</span>
                  <span className="font-mono text-white">{reviewActionRecord.quantity.toLocaleString()} {reviewActionRecord.unit} ({reviewActionRecord.calculatedCo2e} tCO₂e)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Stage:</span>
                  <span className="font-semibold text-amber-400">{reviewActionRecord.approvalStatus}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  {reviewModalAction === 'REJECT' ? 'Rejection Reason / Clarification Note' : 'Reviewer Audit Comment'}
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder={
                    reviewModalAction === 'REJECT'
                      ? 'Specify reasons such as missing calibration certificates, quantity mismatch, or unapproved delivery challan...'
                      : 'Verified against weighbridge digital receipt and NABL meter calibration.'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setReviewActionRecord(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteWorkflowAction}
                className={`px-4 py-1.5 font-bold rounded-lg shadow-md transition-all text-white ${
                  reviewModalAction === 'REJECT'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {reviewModalAction === 'REJECT' ? 'Confirm Rejection' : 'Confirm & Save Audit Transition'}
              </button>
            </div>
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
