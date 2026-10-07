export type UserRole =
  | 'Group ESG Admin'
  | 'Subsidiary Approver'
  | 'Business Unit Reviewer'
  | 'Project Data Entry User'
  | 'Independent Auditor (ISAE 3000)'
  | 'Board Viewer'
  | 'Sustainability Lead (Admin)'
  | 'Plant 1 Head (Operations)'
  | 'HR Lead'
  | 'Statutory Auditor';

export interface EvidenceAttachment {
  id: string;
  kpiKey?: string;
  kpiLabel?: string;
  fileName: string;
  fileSize?: string;
  fileSizeBytes?: number;
  fileUrl?: string;
  documentType?: string;
  uploadedBy: string;
  role?: string;
  uploadedAt: string;
  invoiceNo?: string;
  meterReadingRef?: string;
  notes?: string;
  verifiedByAuditor?: boolean;
  auditedAt?: string;
  auditorName?: string;
  emissionLogId?: string;
  verificationHash?: string;
  ocrConfidencePct?: number;
}

export interface KpiAuditLog {
  id: string;
  timestamp: string;
  kpiKey: string;
  kpiLabel: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  role: string;
  reason: string;
}

export interface DepartmentWorkflow {
  id: string;
  department: string;
  head: string;
  role: string;
  assignedSections: string;
  kpisCount: number;
  completedCount: number;
  status: 'Submitted' | 'In Progress' | 'Overdue';
  deadline: string;
  lastUpdated: string;
}

export interface BrsrFormData {
  // Section A
  sectionA_employees: number;
  sectionA_operatingPlants: number;
  // Section C - Principle 3
  sectionC_p3_healthInsurance: number;
  sectionC_p3_fatalities: number;
  sectionC_p3_ltifr: number;
  // Section C - Principle 6
  sectionC_p6_electricityGj: number;
  sectionC_p6_electricityKwhRaw?: number;
  sectionC_p6_fuelDieselKl: number;
  sectionC_p6_scope1Mt: number;
  sectionC_p6_scope1Justification: string;
  sectionC_p6_scope2Mt: number;
  sectionC_p6_waterWithdrawalKl: number;
  sectionC_p6_waterRecycledKl: number;
  sectionC_p6_wasteGeneratedMt: number;
}

export type ReportingCycle = 'FY 2024-25 (Active)' | 'FY 2025-26 (Draft)' | 'FY 2023-24 (Archived)';

export interface InfrastructureSite {
  id: string;
  code: string;
  name: string;
  division: 'Hydro & Irrigation' | 'Energy & Hydrocarbons' | 'Transport & Tunnels' | 'Power & Solar' | 'Water & Urban';
  subsidiary: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  status: 'Submitted' | 'In Review' | 'Approved' | 'Pending Entry';
  scope1: number; // in tCO2e
  scope2: number; // in tCO2e
  scope3: number; // in tCO2e
  waterRecycledPct: number;
  turnoverCr: number; // in INR Crores
  workforceCount: number;
  ltifr: number;
  keyFacility: string;
  completionPct: number;
}

export interface EmissionFactor {
  id: string;
  category: 'Scope 1' | 'Scope 2' | 'Scope 3';
  fuelOrSource: string;
  unit: string;
  factor: number; // kg CO2e per unit
  sourceStandard: 'CEA v20 (India Central Electricity Authority)' | 'DEFRA 2024' | 'IPCC AR6' | 'GHG Protocol';
  effectiveYear: string;
  notes: string;
}

export interface BRSRIndicator {
  code: string;
  principle: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9';
  title: string;
  category: 'Essential (BRSR Core)' | 'Leadership';
  unit: string;
  currentValue: number | string;
  previousValue: number | string;
  targetValue: number | string;
  verified: boolean;
  sebiMandatory: boolean;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'REJECT' | 'RECALCULATE' | 'EXPORT_XBRL';
  entity: string;
  field: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  verifiedHash: string;
}

export interface ApprovalItem {
  id: string;
  siteCode: string;
  siteName: string;
  period: string;
  submittedBy: string;
  submittedAt: string;
  division: string;
  status: 'Pending Review' | 'Clarification Requested' | 'Approved' | 'Rejected';
  scope1: number;
  scope2: number;
  scope3: number;
  waterWithdrawalKl: number;
  wasteGeneratedMt: number;
  varianceFlag: boolean;
  comments: {
    author: string;
    role: string;
    text: string;
    timestamp: string;
  }[];
  attachments: string[];
}

export interface AnomalyItem {
  id: string;
  siteId: string;
  siteName: string;
  metric: string;
  previousValue: string;
  currentValue: string;
  variancePct: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
  probableCause: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Clarification Sent';
  aiAnalysis?: string;
}

export interface DataEntryRecord {
  id: string;
  siteId: string;
  date: string;
  dieselLiters: number;
  gridElectricityKwh: number;
  naturalGasScm: number;
  explosivesKg: number;
  waterWithdrawalKl: number;
  waterRecycledKl: number;
  hazardousWasteKg: number;
  safeManHours: number;
  lostTimeIncidents: number;
  invoiceFile?: string;
  verifiedBySiteHead: boolean;
}

// ==============================================================================
// STEP 1: SYSTEM ARCHITECTURE & DATA SCHEMA INTERFACES
// ==============================================================================

export type ScopeType = 'Scope 1' | 'Scope 2' | 'Scope 3';
export type EmissionLogStatus = 'Draft' | 'Submitted' | 'Approved' | 'Audited' | 'Flagged';
export type DocumentType =
  | 'Fuel Invoice'
  | 'Electricity Bill'
  | 'Weighbridge Slip'
  | 'Flow Meter Calibration'
  | 'Vendor Environmental Certificate'
  | 'Grid Telemetry Log';

export interface EmissionsLog {
  id: string;
  siteId: string;
  siteName: string;
  reportingMonthYear: string; // e.g. "2026-09" or "Sep 2026"
  scopeType: ScopeType;
  activityCategory: string; // e.g. "DG Set Diesel", "Grid Power DISCOM", "Steel TMT Rebar"
  activityQuantity: number;
  unit: string; // "Liters", "kWh", "Metric Tonnes", "passenger-km"
  emissionFactor: number; // kg CO2e / unit
  co2eMetricTonnes: number; // (Quantity * Factor) / 1000
  status: EmissionLogStatus;
  invoiceNo?: string;
  fileUrl?: string;
  documentType?: DocumentType;
  uploadedBy?: string;
  uploadedAt?: string;
  facility?: string;
  notes?: string;
  auditorComments?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface AuditTrailRecord {
  id: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'VERIFY' | 'FLAG' | 'REJECT' | 'APPROVE';
  actorId: string;
  role: UserRole;
  previousValue: string;
  newValue: string;
  timestamp: string;
  comments: string;
  verifiedHash?: string;
}

export interface BusinessUnitNode {
  id: string;
  code: string;
  name: string;
  division: string;
  companyId: string;
  companyName: string;
  siteCount: number;
  scope1: number;
  scope2: number;
  scope3: number;
  totalScope: number;
  energyGj: number;
  turnoverCr: number;
  intensityTco2ePerCr: number;
  sites: InfrastructureSite[];
}

export interface CompanyNode {
  id: string;
  code: string;
  name: string;
  groupId: string;
  buCount: number;
  siteCount: number;
  scope1: number;
  scope2: number;
  scope3: number;
  totalScope: number;
  energyGj: number;
  turnoverCr: number;
  intensityTco2ePerCr: number;
  businessUnits: BusinessUnitNode[];
}

export interface GroupNode {
  id: string;
  code: string;
  name: string;
  turnoverCr: number;
  totalEnergyGj: number;
  scope1: number;
  scope2: number;
  scope3: number;
  totalScope: number;
  intensityTco2ePerCr: number;
  companies: CompanyNode[];
}
