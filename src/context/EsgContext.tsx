import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  UserRole,
  ReportingCycle,
  InfrastructureSite,
  EmissionFactor,
  BRSRIndicator,
  AuditTrailEntry,
  ApprovalItem,
  AnomalyItem,
  EmissionsLog,
  EvidenceAttachment,
  AuditTrailRecord,
  EmissionLogStatus,
  GroupNode,
  BrsrFormData,
  KpiAuditLog,
  DepartmentWorkflow,
} from '../types/esg';
import {
  PermissionAction,
  UserScope,
  UserAccount,
  RbacAuditLog,
} from '../types/rbac';
import {
  ROLE_CONFIGS,
  PREDEFINED_USER_ACCOUNTS,
  isModuleAllowed,
  isSubtabAllowed,
  hasActionPermission,
  canModifyRecordStatus,
  isSiteInScope,
} from '../lib/rbac';
import {
  INFRASTRUCTURE_SITES,
  EMISSION_FACTORS,
  BRSR_CORE_INDICATORS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_APPROVALS,
  INITIAL_ANOMALIES,
  INITIAL_EMISSIONS_LOGS,
  INITIAL_EVIDENCE_ATTACHMENTS,
  INITIAL_AUDIT_TRAIL_RECORDS,
  ORGANIZATION_HIERARCHY,
} from '../data/mockData';
import {
  syncEmissionLogToCloud,
  syncEvidenceToCloud,
  syncAuditTrailToCloud,
} from '../lib/supabase';

interface EsgContextType {
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  selectedCycle: ReportingCycle;
  setSelectedCycle: (cycle: ReportingCycle) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  activeSubtab: string;
  setActiveSubtab: (subtab: string) => void;
  sites: InfrastructureSite[];
  scopedSites: InfrastructureSite[];
  setSites: React.Dispatch<React.SetStateAction<InfrastructureSite[]>>;
  emissionFactors: EmissionFactor[];
  setEmissionFactors: React.Dispatch<React.SetStateAction<EmissionFactor[]>>;
  brsrIndicators: BRSRIndicator[];
  setBrsrIndicators: React.Dispatch<React.SetStateAction<BRSRIndicator[]>>;
  auditTrail: AuditTrailEntry[];
  addAuditLog: (entry: {
    user: string;
    role: UserRole;
    action: AuditTrailEntry['action'];
    entity: string;
    field: string;
    oldValue: string;
    newValue: string;
  }) => void;
  approvals: ApprovalItem[];
  scopedApprovals: ApprovalItem[];
  updateApprovalStatus: (id: string, status: ApprovalItem['status'], comment?: string) => void;
  anomalies: AnomalyItem[];
  updateAnomalyStatus: (id: string, status: AnomalyItem['status'], aiAnalysis?: string) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  searchFilter: string;
  setSearchFilter: (term: string) => void;
  isGatewayOpen: boolean;
  setIsGatewayOpen: (open: boolean) => void;
  // Authentication & Access Controls
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  currentUser: UserAccount | null;
  userScope: UserScope;
  login: (email?: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
  // RBAC Controls & Live Demo Simulator
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  switchDemoRole: (role: UserRole) => void;
  canPerformAction: (action: PermissionAction) => boolean;
  canModifyRecord: (status: string) => { allowed: boolean; reason?: string };
  isModuleAuthorized: (moduleId: string) => boolean;
  isSubtabAuthorized: (moduleId: string, subtabId: string) => boolean;
  rbacAuditLogs: RbacAuditLog[];
  logRbacAction: (log: Omit<RbacAuditLog, 'id' | 'timestamp' | 'verifiedHash'>) => void;
  // Computed aggregates
  activeSite: InfrastructureSite | null;
  aggregatedMetrics: {
    totalScope1: number;
    totalScope2: number;
    totalScope3: number;
    totalScope123: number;
    totalTurnoverCr: number;
    intensityTco2ePerCr: number;
    avgWaterRecycledPct: number;
    totalWorkforce: number;
    avgLtifr: number;
    siteCount: number;
    approvedCount: number;
    pendingCount: number;
  };
  // Enterprise Emissions Logging & Evidence
  emissionsLogs: EmissionsLog[];
  scopedEmissionsLogs: EmissionsLog[];
  setEmissionsLogs: React.Dispatch<React.SetStateAction<EmissionsLog[]>>;
  addEmissionsLog: (entry: Omit<EmissionsLog, 'id'>) => Promise<EmissionsLog>;
  updateEmissionsLogStatus: (id: string, status: EmissionLogStatus, comments?: string) => Promise<void>;
  evidenceAttachments: EvidenceAttachment[];
  setEvidenceAttachments: React.Dispatch<React.SetStateAction<EvidenceAttachment[]>>;
  addEvidenceAttachment: (att: Omit<EvidenceAttachment, 'id' | 'uploadedAt'> & { uploadedAt?: string }) => Promise<EvidenceAttachment>;
  auditTrailRecords: AuditTrailRecord[];
  addAuditTrailRecord: (record: Omit<AuditTrailRecord, 'id' | 'timestamp'>) => Promise<AuditTrailRecord>;
  organizationHierarchy: GroupNode;
  // Theme Controls
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  // SEBI BRSR Finale Killer Features & Interactive Engine
  brsrFormData: BrsrFormData;
  setBrsrFormData: React.Dispatch<React.SetStateAction<BrsrFormData>>;
  updateBrsrField: (field: keyof BrsrFormData, value: number | string, reason?: string) => void;
  resolveContradiction: (resolution: 'sync-insurance' | 'update-employees') => void;
  convertElectricityKwhToGj: () => void;
  saveScope1Justification: (justification: string) => void;
  kpiAuditLogs: KpiAuditLog[];
  addKpiAuditLog: (entry: Omit<KpiAuditLog, 'id' | 'timestamp'>) => void;
  departmentWorkflows: DepartmentWorkflow[];
  updateWorkflowStatus: (id: string, status: DepartmentWorkflow['status']) => void;
  isEvidenceDrawerOpen: boolean;
  setIsEvidenceDrawerOpen: (open: boolean) => void;
  activeKpiForEvidence: { key: string; label: string; unit: string; currentValue: number | string; isCore: boolean } | null;
  openEvidenceDrawerForKpi: (kpi: { key: string; label: string; unit: string; currentValue: number | string; isCore: boolean }) => void;
  toggleAuditorVerification: (attachmentId: string) => void;
  brsrCoreFilterOnly: boolean;
  setBrsrCoreFilterOnly: (val: boolean) => void;
  isContradictionModalOpen: boolean;
  setIsContradictionModalOpen: (open: boolean) => void;
}

const EsgContext = createContext<EsgContextType | undefined>(undefined);

export const EsgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [selectedCycle, setSelectedCycle] = useState<ReportingCycle>('FY 2024-25 (Active)');
  const [currentRole, setCurrentRole] = useState<UserRole>('Group ESG Admin');
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [activeSubtab, setActiveSubtab] = useState<string>('dashboard');
  const [sites, setSites] = useState<InfrastructureSite[]>(INFRASTRUCTURE_SITES);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>(EMISSION_FACTORS);
  const [brsrIndicators, setBrsrIndicators] = useState<BRSRIndicator[]>(BRSR_CORE_INDICATORS);
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>(INITIAL_AUDIT_TRAIL);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(INITIAL_ANOMALIES);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [rbacAuditLogs, setRbacAuditLogs] = useState<RbacAuditLog[]>([]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('meil_esg_authenticated') === 'true';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('meil_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('meil_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = sessionStorage.getItem('meil_esg_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Keep currentRole in sync with currentUser if restored
  useEffect(() => {
    if (currentUser?.role) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  const userScope: UserScope = useMemo(() => {
    if (currentUser?.scope) return currentUser.scope;
    return ROLE_CONFIGS[currentRole]?.defaultScope || ROLE_CONFIGS['Group ESG Admin'].defaultScope;
  }, [currentUser, currentRole]);

  const [emissionsLogs, setEmissionsLogs] = useState<EmissionsLog[]>(INITIAL_EMISSIONS_LOGS);

  // Initial Seed for BRSR Core Evidence Attachments
  const DEFAULT_BRSR_ATTACHMENTS: EvidenceAttachment[] = [
    {
      id: 'att-01',
      kpiKey: 'sectionC_p6_scope1Mt',
      kpiLabel: 'Scope 1 GHG Direct Emissions',
      fileName: 'IOCL_HSD_Bulk_Bunker_Invoice_FY26.pdf',
      fileSize: '1.4 MB',
      fileUrl: '#',
      uploadedBy: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      uploadedAt: 'Today, 09:15 AM',
      invoiceNo: 'IOCL/POL/2026/09/8821',
      meterReadingRef: 'Dispenser Flow Totalizer #4',
      notes: 'Primary diesel receipt for excavators and auxiliary generator sets.',
      verifiedByAuditor: true,
      auditedAt: 'Today, 11:45 AM',
      auditorName: 'S. Narayanan, KPMG Assurance',
    },
    {
      id: 'att-02',
      kpiKey: 'sectionC_p6_scope2Mt',
      kpiLabel: 'Scope 2 Market-Based Electricity Emissions',
      fileName: 'TSSPDCL_Substation_Energy_Bill_Q3.pdf',
      fileSize: '2.8 MB',
      fileUrl: '#',
      uploadedBy: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      uploadedAt: 'Yesterday, 02:40 PM',
      invoiceNo: 'DISCOM-HT-2026-9921',
      meterReadingRef: 'Substation Feeder 132kV',
      notes: 'CEA baseline grid factor (0.716 kg CO2e/kWh) applied.',
      verifiedByAuditor: true,
      auditedAt: 'Today, 12:10 PM',
      auditorName: 'S. Narayanan, KPMG Assurance',
    },
    {
      id: 'att-03',
      kpiKey: 'sectionC_p6_electricityGj',
      kpiLabel: 'Total Electricity Purchased & Consumed',
      fileName: 'HT_Energy_Meter_Calibrated_Log.pdf',
      fileSize: '890 KB',
      fileUrl: '#',
      uploadedBy: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      uploadedAt: '02 Oct 2026, 04:30 PM',
      invoiceNo: 'CAL-MET-2026-08',
      meterReadingRef: 'NABL Accredited Calibration Bench',
      notes: 'Quarterly telemetry check matching CEA baseline norms.',
      verifiedByAuditor: false,
    },
    {
      id: 'att-04',
      kpiKey: 'sectionC_p6_waterWithdrawalKl',
      kpiLabel: 'Total Water Withdrawal by Source',
      fileName: 'Industrial_Borewell_Telemetry_Log.pdf',
      fileSize: '1.2 MB',
      fileUrl: '#',
      uploadedBy: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      uploadedAt: '03 Oct 2026, 11:00 AM',
      invoiceNo: 'CGWA/NOC/2026/410',
      meterReadingRef: 'Ultrasonic Flowmeter #B1',
      notes: 'Groundwater abstraction telemetry within statutory CGWA limits.',
      verifiedByAuditor: true,
      auditedAt: 'Today, 01:20 PM',
      auditorName: 'S. Narayanan, KPMG Assurance',
    },
    {
      id: 'att-05',
      kpiKey: 'sectionC_p3_healthInsurance',
      kpiLabel: 'Employees Covered by Health Insurance',
      fileName: 'ICICI_Lombard_Group_Health_Policy_Roster.pdf',
      fileSize: '3.4 MB',
      fileUrl: '#',
      uploadedBy: 'Pooja Sundaram',
      role: 'HR Lead',
      uploadedAt: 'Today, 11:15 AM',
      invoiceNo: 'POL-GMC-2026-778',
      meterReadingRef: 'Policy Roster Schedule C',
      notes: 'Includes temporary tunnel fabrication crew (1,450 enrolled).',
      verifiedByAuditor: false,
    },
  ];

  const [evidenceAttachments, setEvidenceAttachments] = useState<EvidenceAttachment[]>([
    ...DEFAULT_BRSR_ATTACHMENTS,
    ...INITIAL_EVIDENCE_ATTACHMENTS,
  ]);
  const [auditTrailRecords, setAuditTrailRecords] = useState<AuditTrailRecord[]>(INITIAL_AUDIT_TRAIL_RECORDS);
  const organizationHierarchy = ORGANIZATION_HIERARCHY;

  // SEBI BRSR Interactive Data State (Finale Killer Features)
  const [brsrFormData, setBrsrFormData] = useState<BrsrFormData>({
    sectionA_employees: 1200,
    sectionA_operatingPlants: 3,
    sectionC_p3_healthInsurance: 1450, // Triggers Monday Morning Contradiction vs 1200!
    sectionC_p3_fatalities: 0,
    sectionC_p3_ltifr: 0.14,
    sectionC_p6_electricityGj: 4120,
    sectionC_p6_electricityKwhRaw: 1144450,
    sectionC_p6_fuelDieselKl: 320,
    sectionC_p6_scope1Mt: 1240, // FY26 vs FY25 (850 MT) -> +45.9% YoY anomaly (>30%)!
    sectionC_p6_scope1Justification: '',
    sectionC_p6_scope2Mt: 820,
    sectionC_p6_waterWithdrawalKl: 45200,
    sectionC_p6_waterRecycledKl: 18400,
    sectionC_p6_wasteGeneratedMt: 1860,
  });

  const [brsrCoreFilterOnly, setBrsrCoreFilterOnly] = useState<boolean>(false);
  const [isContradictionModalOpen, setIsContradictionModalOpen] = useState<boolean>(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);
  const [activeKpiForEvidence, setActiveKpiForEvidence] = useState<{
    key: string;
    label: string;
    unit: string;
    currentValue: number | string;
    isCore: boolean;
  } | null>(null);

  const [kpiAuditLogs, setKpiAuditLogs] = useState<KpiAuditLog[]>([
    {
      id: 'log-01',
      timestamp: 'Today, 02:15 PM IST',
      kpiKey: 'sectionC_p6_scope1Mt',
      kpiLabel: 'P6 Scope 1 Direct GHG Emissions',
      previousValue: '850 MT CO2e (FY25)',
      newValue: '1,240 MT CO2e (FY26)',
      changedBy: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      reason: 'Commissioned additional diesel gen-sets during Phase 2 excavation grid outage.',
    },
    {
      id: 'log-02',
      timestamp: 'Today, 11:30 AM IST',
      kpiKey: 'sectionC_p3_healthInsurance',
      kpiLabel: 'P3 Employees Covered by Health Insurance',
      previousValue: '1,180',
      newValue: '1,450',
      changedBy: 'Pooja Sundaram',
      role: 'HR Lead',
      reason: 'Enrolled contractual tunnel safety crew under corporate health policy.',
    },
    {
      id: 'log-03',
      timestamp: 'Yesterday, 04:45 PM IST',
      kpiKey: 'sectionC_p6_electricityGj',
      kpiLabel: 'P6 Electricity Consumption',
      previousValue: '3,920 GJ',
      newValue: '4,120 GJ',
      changedBy: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      reason: 'Reconciled monthly electricity meter invoice from TSSPDCL substation.',
    },
  ]);

  const [departmentWorkflows, setDepartmentWorkflows] = useState<DepartmentWorkflow[]>([
    {
      id: 'wf-1',
      department: 'Human Resources & Wellbeing',
      head: 'Pooja Sundaram',
      role: 'HR Lead',
      assignedSections: 'Section A (Workforce) · Principle 3 (Wellbeing) · Principle 5 (Human Rights)',
      kpisCount: 14,
      completedCount: 14,
      status: 'Submitted',
      deadline: '15 Oct 2026',
      lastUpdated: 'Today, 11:30 AM',
    },
    {
      id: 'wf-2',
      department: 'Plant Operations & Infrastructure',
      head: 'Rajesh Sharma',
      role: 'Plant 1 Head (Operations)',
      assignedSections: 'Principle 6 (Energy, GHG Emissions, Water, Circularity)',
      kpisCount: 18,
      completedCount: 14,
      status: 'In Progress',
      deadline: '20 Oct 2026',
      lastUpdated: 'Today, 02:15 PM',
    },
    {
      id: 'wf-3',
      department: 'Legal, Compliance & Ethics',
      head: 'Adv. V. Ramanathan',
      role: 'Head of Legal & Statutory Affairs',
      assignedSections: 'Section B (Policies) · Principle 1 (Anti-Bribery & Ethics)',
      kpisCount: 12,
      completedCount: 12,
      status: 'Submitted',
      deadline: '10 Oct 2026',
      lastUpdated: '01 Oct 2026',
    },
    {
      id: 'wf-4',
      department: 'Procurement & Supply Chain',
      head: 'Sunil Nair',
      role: 'Chief Procurement Officer',
      assignedSections: 'Principle 2 (Sustainable Inputs) · Principle 8 (Inclusive Growth & Scope 3)',
      kpisCount: 10,
      completedCount: 4,
      status: 'Overdue',
      deadline: '05 Oct 2026',
      lastUpdated: '04 Oct 2026',
    },
  ]);

  const addKpiAuditLog = (entry: Omit<KpiAuditLog, 'id' | 'timestamp'>) => {
    const newLog: KpiAuditLog = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };
    setKpiAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateBrsrField = (field: keyof BrsrFormData, value: number | string, reason?: string) => {
    setBrsrFormData((prev) => {
      const prevVal = prev[field];
      addKpiAuditLog({
        kpiKey: String(field),
        kpiLabel: String(field),
        previousValue: String(prevVal),
        newValue: String(value),
        changedBy: currentUser?.name || 'Authorized User',
        role: currentRole,
        reason: reason || 'Direct value update via SEBI BRSR Data Entry form',
      });
      return { ...prev, [field]: value };
    });
  };

  const resolveContradiction = (resolution: 'sync-insurance' | 'update-employees') => {
    if (resolution === 'sync-insurance') {
      const targetVal = brsrFormData.sectionA_employees;
      setBrsrFormData((prev) => ({
        ...prev,
        sectionC_p3_healthInsurance: targetVal,
      }));
      addKpiAuditLog({
        kpiKey: 'sectionC_p3_healthInsurance',
        kpiLabel: 'P3 Health Insurance Coverage (Reconciled)',
        previousValue: `${brsrFormData.sectionC_p3_healthInsurance}`,
        newValue: `${targetVal}`,
        changedBy: currentUser?.name || 'Sustainability Lead',
        role: currentRole,
        reason: `Cross-Section Reconciliation: Synced P3 health insurance to match Section A permanent workforce (${targetVal}).`,
      });
    } else {
      const targetVal = brsrFormData.sectionC_p3_healthInsurance;
      setBrsrFormData((prev) => ({
        ...prev,
        sectionA_employees: targetVal,
      }));
      addKpiAuditLog({
        kpiKey: 'sectionA_employees',
        kpiLabel: 'Section A Total Permanent Employees (Reconciled)',
        previousValue: `${brsrFormData.sectionA_employees}`,
        newValue: `${targetVal}`,
        changedBy: currentUser?.name || 'Sustainability Lead',
        role: currentRole,
        reason: `Cross-Section Reconciliation: Updated Section A employee headcount to match verified health insurance roll (${targetVal}).`,
      });
    }
    setIsContradictionModalOpen(false);
  };

  const convertElectricityKwhToGj = () => {
    const rawKwh = brsrFormData.sectionC_p6_electricityKwhRaw || 1144450;
    const gjVal = Math.round(rawKwh / 277.778);
    setBrsrFormData((prev) => ({
      ...prev,
      sectionC_p6_electricityGj: gjVal,
      sectionC_p6_electricityKwhRaw: 0,
    }));
    addKpiAuditLog({
      kpiKey: 'sectionC_p6_electricityGj',
      kpiLabel: 'P6 Electricity Unit Standardisation',
      previousValue: `${rawKwh.toLocaleString()} kWh`,
      newValue: `${gjVal.toLocaleString()} GJ`,
      changedBy: currentUser?.name || 'Plant 1 Operations',
      role: currentRole,
      reason: 'Statutory unit conversion from kWh to Gigajoules (GJ) using standard SEBI BRSR formula (1 GJ = 277.78 kWh).',
    });
  };

  const saveScope1Justification = (justification: string) => {
    setBrsrFormData((prev) => ({
      ...prev,
      sectionC_p6_scope1Justification: justification,
    }));
    addKpiAuditLog({
      kpiKey: 'sectionC_p6_scope1Mt',
      kpiLabel: 'P6 Scope 1 YoY Anomaly Justification',
      previousValue: 'Unjustified (+45.9% YoY)',
      newValue: 'Justified & Documented',
      changedBy: currentUser?.name || 'Plant 1 Head (Operations)',
      role: currentRole,
      reason: justification,
    });
  };

  const openEvidenceDrawerForKpi = (kpi: { key: string; label: string; unit: string; currentValue: number | string; isCore: boolean }) => {
    setActiveKpiForEvidence(kpi);
    setIsEvidenceDrawerOpen(true);
  };

  const toggleAuditorVerification = (attachmentId: string) => {
    setEvidenceAttachments((prev) =>
      prev.map((att) => {
        if (att.id === attachmentId) {
          const nextVerified = !att.verifiedByAuditor;
          return {
            ...att,
            verifiedByAuditor: nextVerified,
            auditedAt: nextVerified ? 'Today, ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : undefined,
            auditorName: nextVerified ? (currentUser?.name || 'KPMG Statutory Assurance') : undefined,
          };
        }
        return att;
      })
    );
  };

  const updateWorkflowStatus = (id: string, status: DepartmentWorkflow['status']) => {
    setDepartmentWorkflows((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, status, lastUpdated: 'Just now' } : wf))
    );
  };

  // RBAC Action Permission Checker
  const canPerformAction = (action: PermissionAction): boolean => {
    return hasActionPermission(currentRole, action);
  };

  // RBAC Record Modification Checker (Locks approved records from modification)
  const canModifyRecord = (status: string): { allowed: boolean; reason?: string } => {
    return canModifyRecordStatus(currentRole, status);
  };

  const isModuleAuthorized = (modId: string): boolean => {
    return isModuleAllowed(currentRole, modId);
  };

  const isSubtabAuthorized = (modId: string, subId: string): boolean => {
    return isSubtabAllowed(currentRole, modId, subId);
  };

  const logRbacAction = (log: Omit<RbacAuditLog, 'id' | 'timestamp' | 'verifiedHash'>) => {
    const hash = '0x' + Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6);
    const newLog: RbacAuditLog = {
      id: `rbac-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      verifiedHash: hash,
      ...log,
    };
    setRbacAuditLogs((prev) => [newLog, ...prev]);
  };

  // Scoped Sites according to Role and Assigned Hierarchy
  const scopedSites = useMemo(() => {
    return sites.filter((site) => isSiteInScope(currentRole, userScope, site));
  }, [sites, currentRole, userScope]);

  // Adjust selectedSiteId if current selection is out of scope
  useEffect(() => {
    if (currentRole === 'Project Data Entry User') {
      const targetProjectId = userScope.projectId || 'site-042';
      if (selectedSiteId !== targetProjectId) {
        setSelectedSiteId(targetProjectId);
      }
    } else if (selectedSiteId !== 'all') {
      const isStillInScope = scopedSites.some((s) => s.id === selectedSiteId);
      if (!isStillInScope && scopedSites.length > 0) {
        setSelectedSiteId(scopedSites[0].id);
      }
    }
  }, [currentRole, userScope, scopedSites, selectedSiteId]);

  // Scoped Emissions Logs according to Role and Permissions
  const scopedEmissionsLogs = useMemo(() => {
    return emissionsLogs.filter((log) => {
      // 1. Check site scope
      const siteObj = sites.find((s) => s.id === log.siteId);
      if (siteObj && !isSiteInScope(currentRole, userScope, siteObj)) {
        return false;
      }
      if (currentRole === 'Project Data Entry User') {
        const allowedProjectId = userScope.projectId || 'site-042';
        if (log.siteId !== allowedProjectId) return false;
      }

      // 2. Board Viewer only sees Approved or Audited strategic records
      if (currentRole === 'Board Viewer') {
        return log.status === 'Approved' || log.status === 'Audited';
      }

      return true;
    });
  }, [emissionsLogs, sites, currentRole, userScope]);

  // Scoped Approvals according to Role
  const scopedApprovals = useMemo(() => {
    if (currentRole === 'Project Data Entry User' || currentRole === 'Board Viewer') {
      return []; // No access to operational approval workflow
    }

    return approvals.filter((appr) => {
      const matchingSite = sites.find((s) => s.code === appr.siteCode);
      if (matchingSite) {
        return isSiteInScope(currentRole, userScope, matchingSite);
      }
      return true;
    });
  }, [approvals, sites, currentRole, userScope]);

  const addAuditTrailRecord = async (record: Omit<AuditTrailRecord, 'id' | 'timestamp'>): Promise<AuditTrailRecord> => {
    const newRec: AuditTrailRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...record,
    };
    setAuditTrailRecords((prev) => [newRec, ...prev]);
    try {
      await syncAuditTrailToCloud({
        record_id: newRec.recordId,
        action: newRec.action,
        actor_id: newRec.actorId,
        role: newRec.role,
        previous_value: newRec.previousValue,
        new_value: newRec.newValue,
        comments: newRec.comments,
        verified_hash: newRec.verifiedHash,
      });
    } catch (e) {
      console.warn('Cloud audit trail sync warning:', e);
    }
    return newRec;
  };

  const addEmissionsLog = async (entry: Omit<EmissionsLog, 'id'>): Promise<EmissionsLog> => {
    // RBAC Security Validation
    if (!canPerformAction('create')) {
      logRbacAction({
        actorId: currentUser?.email || 'unauthorized@meil.in',
        userName: currentUser?.name || 'Anonymous',
        role: currentRole,
        action: 'create',
        module: 'collection',
        result: 'DENIED',
        reason: `${currentRole} lacks statutory permission to create emission activity entries.`,
        scopeContext: userScope.description,
      });
      throw new Error(`Access Denied: ${currentRole} cannot create emission logs.`);
    }

    if (currentRole === 'Project Data Entry User' && userScope.projectId && entry.siteId !== userScope.projectId) {
      logRbacAction({
        actorId: currentUser?.email || 'site.engineer@meil.in',
        userName: currentUser?.name || 'Site Engineer',
        role: currentRole,
        action: 'create',
        module: 'collection',
        result: 'DENIED',
        reason: `Attempted to log emission for site ${entry.siteId} outside assigned project ${userScope.projectId}.`,
        scopeContext: userScope.description,
      });
      throw new Error(`Scope Violation: You can only log data for assigned project ${userScope.projectName || userScope.projectId}.`);
    }

    const newLog: EmissionsLog = {
      id: `em-log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...entry,
    };
    setEmissionsLogs((prev) => [newLog, ...prev]);

    try {
      await syncEmissionLogToCloud({
        site_id: newLog.siteId,
        reporting_month_year: newLog.reportingMonthYear,
        scope_type: newLog.scopeType,
        activity_category: newLog.activityCategory,
        activity_quantity: newLog.activityQuantity,
        unit: newLog.unit,
        emission_factor: newLog.emissionFactor,
        co2e_metric_tonnes: newLog.co2eMetricTonnes,
        status: newLog.status,
        facility: newLog.facility,
        invoice_no: newLog.invoiceNo,
        notes: newLog.notes,
      });
    } catch (e) {
      console.warn('Cloud emission log sync warning:', e);
    }

    await addAuditTrailRecord({
      recordId: newLog.id,
      action: 'CREATE',
      actorId: currentUser?.email || 'operator@meilgroup.com',
      role: currentRole,
      previousValue: 'None',
      newValue: `${newLog.activityQuantity} ${newLog.unit} (${newLog.co2eMetricTonnes} tCO2e)`,
      comments: `New ${newLog.scopeType} emission entry submitted for ${newLog.siteName || newLog.siteId}`,
    });

    logRbacAction({
      actorId: currentUser?.email || 'operator@meilgroup.com',
      userName: currentUser?.name || 'Site In-Charge',
      role: currentRole,
      action: 'create',
      module: 'collection',
      recordId: newLog.id,
      result: 'SUCCESS',
      scopeContext: userScope.description,
    });

    return newLog;
  };

  const updateEmissionsLogStatus = async (id: string, status: EmissionLogStatus, comments?: string): Promise<void> => {
    const existing = emissionsLogs.find((l) => l.id === id);
    if (!existing) return;

    // RBAC Security Validation: Check record status locking
    const statusCheck = canModifyRecord(existing.status);
    if (!statusCheck.allowed && currentRole !== 'Group ESG Admin') {
      logRbacAction({
        actorId: currentUser?.email || 'actor@meilgroup.com',
        userName: currentUser?.name || 'User',
        role: currentRole,
        action: 'edit',
        module: 'assurance',
        recordId: id,
        result: 'DENIED',
        reason: statusCheck.reason,
        scopeContext: userScope.description,
      });
      alert(`Access Denied: ${statusCheck.reason}`);
      return;
    }

    // Role-specific action validation
    if (status === 'Approved' && !canPerformAction('approve')) {
      alert(`Access Denied: Role ${currentRole} cannot approve emission logs.`);
      return;
    }

    const oldStatus = existing.status;
    const updated: EmissionsLog = {
      ...existing,
      status,
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      verifiedBy: currentUser?.name || 'Auditor',
      auditorComments: comments,
    };
    setEmissionsLogs((prev) => prev.map((l) => (l.id === id ? updated : l)));

    try {
      await syncEmissionLogToCloud({
        site_id: updated.siteId,
        reporting_month_year: updated.reportingMonthYear,
        scope_type: updated.scopeType,
        activity_category: updated.activityCategory,
        activity_quantity: updated.activityQuantity,
        unit: updated.unit,
        emission_factor: updated.emissionFactor,
        co2e_metric_tonnes: updated.co2eMetricTonnes,
        status: updated.status,
        facility: updated.facility,
        invoice_no: updated.invoiceNo,
        notes: updated.notes,
      });
    } catch (e) {
      console.warn('Cloud emission log status sync warning:', e);
    }

    await addAuditTrailRecord({
      recordId: id,
      action: status === 'Approved' ? 'VERIFY' : status === 'Audited' ? 'APPROVE' : status === 'Flagged' ? 'FLAG' : 'UPDATE',
      actorId: currentUser?.email || 'auditor@meilgroup.com',
      role: currentRole,
      previousValue: oldStatus,
      newValue: status,
      comments: comments || `Status transitioned from ${oldStatus} to ${status}`,
    });

    logRbacAction({
      actorId: currentUser?.email || 'auditor@meilgroup.com',
      userName: currentUser?.name || 'Assurance Auditor',
      role: currentRole,
      action: 'approve',
      module: 'assurance',
      recordId: id,
      result: 'SUCCESS',
      scopeContext: userScope.description,
    });
  };

  const addEvidenceAttachment = async (
    att: Omit<EvidenceAttachment, 'id' | 'uploadedAt'> & { uploadedAt?: string }
  ): Promise<EvidenceAttachment> => {
    if (!canPerformAction('upload')) {
      throw new Error(`Access Denied: ${currentRole} cannot upload evidence documents.`);
    }

    const newAtt: EvidenceAttachment = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadedAt: att.uploadedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...att,
    };
    setEvidenceAttachments((prev) => [newAtt, ...prev]);

    try {
      await syncEvidenceToCloud({
        emission_log_id: newAtt.emissionLogId,
        file_url: newAtt.fileUrl,
        file_name: newAtt.fileName,
        document_type: newAtt.documentType,
        uploaded_by: newAtt.uploadedBy,
        verification_hash: newAtt.verificationHash,
      });
    } catch (e) {
      console.warn('Cloud evidence attachment sync warning:', e);
    }

    logRbacAction({
      actorId: currentUser?.email || 'engineer@meil.in',
      userName: currentUser?.name || 'Engineer',
      role: currentRole,
      action: 'upload',
      module: 'collection',
      recordId: newAtt.id,
      result: 'SUCCESS',
      scopeContext: userScope.description,
    });

    return newAtt;
  };

  const activeSite = useMemo(() => {
    if (selectedSiteId === 'all') return null;
    return scopedSites.find((s) => s.id === selectedSiteId) || scopedSites[0] || null;
  }, [selectedSiteId, scopedSites]);

  const aggregatedMetrics = useMemo(() => {
    const list = activeSite ? [activeSite] : scopedSites;
    const totalScope1 = list.reduce((acc, s) => acc + s.scope1, 0);
    const totalScope2 = list.reduce((acc, s) => acc + s.scope2, 0);
    const totalScope3 = list.reduce((acc, s) => acc + s.scope3, 0);
    const totalTurnoverCr = list.reduce((acc, s) => acc + s.turnoverCr, 0);
    const totalWorkforce = list.reduce((acc, s) => acc + s.workforceCount, 0);
    const totalScope12 = totalScope1 + totalScope2;
    const intensityTco2ePerCr = totalTurnoverCr > 0 ? Number((totalScope12 / totalTurnoverCr).toFixed(2)) : 0;
    const avgWaterRecycledPct = Number(
      (list.reduce((acc, s) => acc + s.waterRecycledPct, 0) / (list.length || 1)).toFixed(1)
    );
    const avgLtifr = Number(
      (list.reduce((acc, s) => acc + s.ltifr, 0) / (list.length || 1)).toFixed(2)
    );
    const approvedCount = list.filter((s) => s.status === 'Approved').length;
    const pendingCount = list.filter((s) => s.status === 'Submitted' || s.status === 'In Review').length;

    return {
      totalScope1,
      totalScope2,
      totalScope3,
      totalScope123: totalScope1 + totalScope2 + totalScope3,
      totalTurnoverCr,
      intensityTco2ePerCr,
      avgWaterRecycledPct,
      totalWorkforce,
      avgLtifr,
      siteCount: list.length,
      approvedCount,
      pendingCount,
    };
  }, [activeSite, scopedSites]);

  const addAuditLog = (entry: {
    user: string;
    role: UserRole;
    action: AuditTrailEntry['action'];
    entity: string;
    field: string;
    oldValue: string;
    newValue: string;
  }) => {
    const hash = '0x' + Math.random().toString(16).substring(2, 6) + '...' + Math.random().toString(16).substring(2, 6);
    const newEntry: AuditTrailEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      ...entry,
      ipAddress: '14.139.22.41',
      verifiedHash: hash,
    };
    setAuditTrail((prev) => [newEntry, ...prev]);
  };

  const updateApprovalStatus = (id: string, status: ApprovalItem['status'], comment?: string) => {
    // RBAC validation: Project Data Entry User & Board Viewer cannot touch approvals
    if (!canPerformAction('approve') && status === 'Approved') {
      alert(`Access Denied: ${currentRole} is not authorized to approve submissions.`);
      return;
    }
    if (!canPerformAction('reject') && status === 'Rejected') {
      alert(`Access Denied: ${currentRole} is not authorized to reject submissions.`);
      return;
    }

    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id === id) {
          const updatedComments = comment
            ? [
                ...appr.comments,
                {
                  author: currentUser?.name || 'Enterprise Reviewer',
                  role: currentRole,
                  text: comment,
                  timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                },
              ]
            : appr.comments;

          return {
            ...appr,
            status,
            comments: updatedComments,
          };
        }
        return appr;
      })
    );

    // Also update corresponding site if approved
    const appr = approvals.find((a) => a.id === id);
    if (appr && (status === 'Approved' || status === 'Rejected')) {
      const newSiteStatus = status === 'Approved' ? 'Approved' : 'In Review';
      setSites((prevSites) =>
        prevSites.map((s) => (s.code === appr.siteCode ? { ...s, status: newSiteStatus } : s))
      );
      addAuditLog({
        user: currentUser?.name || 'Enterprise Reviewer',
        role: currentRole,
        action: status === 'Approved' ? 'APPROVE' : 'REJECT',
        entity: `${appr.siteCode} • ${appr.siteName}`,
        field: 'Statutory BRSR Core Approval Status',
        oldValue: appr.status,
        newValue: status,
      });
      logRbacAction({
        actorId: currentUser?.email || 'approver@meilinfra.com',
        userName: currentUser?.name || 'Approver',
        role: currentRole,
        action: status === 'Approved' ? 'approve' : 'reject',
        module: 'assurance',
        recordId: id,
        result: 'SUCCESS',
        scopeContext: userScope.description,
      });
    }
  };

  const updateAnomalyStatus = (id: string, status: AnomalyItem['status'], aiAnalysis?: string) => {
    setAnomalies((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status,
            aiAnalysis: aiAnalysis || a.aiAnalysis,
          };
        }
        return a;
      })
    );

    const targetAnomaly = anomalies.find((a) => a.id === id);
    if (targetAnomaly) {
      addAuditLog({
        user: currentUser?.name || 'Reviewer',
        role: currentRole,
        action: 'UPDATE',
        entity: `${targetAnomaly.siteName}`,
        field: `Anomaly Status (${targetAnomaly.metric})`,
        oldValue: targetAnomaly.status,
        newValue: status,
      });
    }
  };

  // Role detection and login
  const login = (email?: string, _password?: string, role?: UserRole): boolean => {
    // 1. Detect role automatically from email account if matching predefined account
    let detectedAccount: UserAccount | undefined;
    if (email && PREDEFINED_USER_ACCOUNTS[email]) {
      detectedAccount = PREDEFINED_USER_ACCOUNTS[email];
    }

    const userRole: UserRole = detectedAccount?.role || role || 'Group ESG Admin';
    const roleConfig = ROLE_CONFIGS[userRole];

    const userObj: UserAccount = detectedAccount || {
      id: `usr-${Date.now()}`,
      name: roleConfig.sampleUser.name,
      email: email || roleConfig.sampleUser.email,
      role: userRole,
      title: roleConfig.sampleUser.title,
      scope: roleConfig.defaultScope,
    };

    setIsAuthenticated(true);
    setCurrentUser(userObj);
    setCurrentRole(userRole);
    sessionStorage.setItem('meil_esg_authenticated', 'true');
    sessionStorage.setItem('meil_esg_user', JSON.stringify(userObj));
    setIsLoginModalOpen(false);
    setIsGatewayOpen(false);

    // 2. Redirect immediately to the role-specific dashboard
    setActiveModule(roleConfig.defaultModule);
    setActiveSubtab(roleConfig.defaultSubtab);

    // If role is Project Data Entry, set selectedSiteId to assigned project
    if (userRole === 'Project Data Entry User') {
      setSelectedSiteId(userObj.scope.projectId || 'site-042');
    } else {
      setSelectedSiteId('all');
    }

    addAuditLog({
      user: userObj.name,
      role: userRole,
      action: 'APPROVE',
      entity: 'Enterprise Single Sign-On',
      field: 'User Session Authentication',
      oldValue: 'Unauthenticated / Public Landing',
      newValue: `Authenticated as ${userObj.name} (${userRole}) • Scope: ${userObj.scope.description}`,
    });

    logRbacAction({
      actorId: userObj.email,
      userName: userObj.name,
      role: userRole,
      action: 'SESSION_START',
      module: roleConfig.defaultModule,
      result: 'SUCCESS',
      scopeContext: userObj.scope.description,
    });

    return true;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog({
        user: currentUser.name,
        role: currentUser.role,
        action: 'UPDATE',
        entity: 'Enterprise Single Sign-On',
        field: 'Session Termination',
        oldValue: `Active session: ${currentUser.email}`,
        newValue: 'Logged out / Returned to Public Landing',
      });
      logRbacAction({
        actorId: currentUser.email,
        userName: currentUser.name,
        role: currentUser.role,
        action: 'SESSION_END',
        module: activeModule,
        result: 'SUCCESS',
        scopeContext: userScope.description,
      });
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('meil_esg_authenticated');
    sessionStorage.removeItem('meil_esg_user');
    setActiveModule('overview');
    setActiveSubtab('hero-landing');
  };

  // Demo Role Switching (Only available for testing / Live Demo simulations)
  const switchDemoRole = (targetRole: UserRole) => {
    const roleConfig = ROLE_CONFIGS[targetRole];
    if (!roleConfig) return;

    const demoUser: UserAccount = {
      id: roleConfig.sampleUser.id,
      name: roleConfig.sampleUser.name,
      email: roleConfig.sampleUser.email,
      role: targetRole,
      title: roleConfig.sampleUser.title,
      scope: roleConfig.defaultScope,
    };

    setCurrentRole(targetRole);
    setCurrentUser(demoUser);
    sessionStorage.setItem('meil_esg_user', JSON.stringify(demoUser));

    // If active module is not permitted for the new role, redirect to role's default module
    if (!roleConfig.allowedModules.includes(activeModule)) {
      setActiveModule(roleConfig.defaultModule);
      setActiveSubtab(roleConfig.defaultSubtab);
    } else {
      const allowedSubs = roleConfig.allowedSubtabs[activeModule];
      if (allowedSubs && !allowedSubs.includes(activeSubtab)) {
        setActiveSubtab(allowedSubs[0]);
      }
    }

    // Set site scope
    if (targetRole === 'Project Data Entry User') {
      setSelectedSiteId(demoUser.scope.projectId || 'site-042');
    }

    addAuditLog({
      user: demoUser.name,
      role: targetRole,
      action: 'UPDATE',
      entity: 'RBAC Live Demo Simulator',
      field: 'Context Persona Switch',
      oldValue: currentRole,
      newValue: `${targetRole} (${demoUser.scope.description})`,
    });

    logRbacAction({
      actorId: demoUser.email,
      userName: demoUser.name,
      role: targetRole,
      action: 'ACCESS_MODULE',
      module: roleConfig.defaultModule,
      result: 'ALLOWED',
      scopeContext: demoUser.scope.description,
    });
  };

  return (
    <EsgContext.Provider
      value={{
        selectedSiteId,
        setSelectedSiteId,
        selectedCycle,
        setSelectedCycle,
        currentRole,
        setCurrentRole,
        activeModule,
        setActiveModule,
        activeSubtab,
        setActiveSubtab,
        sites,
        scopedSites,
        setSites,
        emissionFactors,
        setEmissionFactors,
        brsrIndicators,
        setBrsrIndicators,
        auditTrail,
        addAuditLog,
        approvals,
        scopedApprovals,
        updateApprovalStatus,
        anomalies,
        updateAnomalyStatus,
        isTourOpen,
        setIsTourOpen,
        searchFilter,
        setSearchFilter,
        isGatewayOpen,
        setIsGatewayOpen,
        isAuthenticated,
        setIsAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        currentUser,
        userScope,
        login,
        logout,
        isDemoMode,
        setIsDemoMode,
        switchDemoRole,
        canPerformAction,
        canModifyRecord,
        isModuleAuthorized,
        isSubtabAuthorized,
        rbacAuditLogs,
        logRbacAction,
        activeSite,
        aggregatedMetrics,
        emissionsLogs,
        scopedEmissionsLogs,
        setEmissionsLogs,
        addEmissionsLog,
        updateEmissionsLogStatus,
        evidenceAttachments,
        setEvidenceAttachments,
        addEvidenceAttachment,
        auditTrailRecords,
        addAuditTrailRecord,
        organizationHierarchy,
        theme,
        toggleTheme,
        setTheme,
        // SEBI BRSR Interactive Engine
        brsrFormData,
        setBrsrFormData,
        updateBrsrField,
        resolveContradiction,
        convertElectricityKwhToGj,
        saveScope1Justification,
        kpiAuditLogs,
        addKpiAuditLog,
        departmentWorkflows,
        updateWorkflowStatus,
        isEvidenceDrawerOpen,
        setIsEvidenceDrawerOpen,
        activeKpiForEvidence,
        openEvidenceDrawerForKpi,
        toggleAuditorVerification,
        brsrCoreFilterOnly,
        setBrsrCoreFilterOnly,
        isContradictionModalOpen,
        setIsContradictionModalOpen,
      }}
    >
      {children}
    </EsgContext.Provider>
  );
};

export const useEsg = () => {
  const context = useContext(EsgContext);
  if (!context) {
    throw new Error('useEsg must be used within an EsgProvider');
  }
  return context;
};
