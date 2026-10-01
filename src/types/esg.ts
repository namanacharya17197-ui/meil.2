export type UserRole =
  | 'Group ESG Admin'
  | 'Subsidiary Approver'
  | 'Business Unit Reviewer'
  | 'Project Data Entry User'
  | 'Independent Auditor (ISAE 3000)'
  | 'Board Viewer';

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
