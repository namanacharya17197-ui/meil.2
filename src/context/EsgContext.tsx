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
} from '../types/esg';
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
  currentUser: {
    name: string;
    email: string;
    role: UserRole;
    title: string;
  } | null;
  login: (email?: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
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
}

const EsgContext = createContext<EsgContextType | undefined>(undefined);

export const EsgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [selectedCycle, setSelectedCycle] = useState<ReportingCycle>('FY 2024-25 (Active)');
  const [currentRole, setCurrentRole] = useState<UserRole>('Group ESG Admin');
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [activeSubtab, setActiveSubtab] = useState<string>('hero-landing');
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
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: UserRole;
    title: string;
  } | null>(() => {
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

  const [emissionsLogs, setEmissionsLogs] = useState<EmissionsLog[]>(INITIAL_EMISSIONS_LOGS);
  const [evidenceAttachments, setEvidenceAttachments] = useState<EvidenceAttachment[]>(INITIAL_EVIDENCE_ATTACHMENTS);
  const [auditTrailRecords, setAuditTrailRecords] = useState<AuditTrailRecord[]>(INITIAL_AUDIT_TRAIL_RECORDS);
  const organizationHierarchy = ORGANIZATION_HIERARCHY;

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
    return newLog;
  };

  const updateEmissionsLogStatus = async (id: string, status: EmissionLogStatus, comments?: string): Promise<void> => {
    const existing = emissionsLogs.find((l) => l.id === id);
    if (!existing) return;
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
  };

  const addEvidenceAttachment = async (
    att: Omit<EvidenceAttachment, 'id' | 'uploadedAt'> & { uploadedAt?: string }
  ): Promise<EvidenceAttachment> => {
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
    return newAtt;
  };


  const activeSite = useMemo(() => {
    if (selectedSiteId === 'all') return null;
    return sites.find((s) => s.id === selectedSiteId) || null;
  }, [selectedSiteId, sites]);

  const aggregatedMetrics = useMemo(() => {
    const list = activeSite ? [activeSite] : sites;
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
  }, [activeSite, sites]);

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
    setApprovals((prev) =>
      prev.map((appr) => {
        if (appr.id === id) {
          const updatedComments = comment
            ? [
                ...appr.comments,
                {
                  author: 'K. V. Rao',
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
        user: 'K. V. Rao',
        role: currentRole,
        action: status === 'Approved' ? 'APPROVE' : 'REJECT',
        entity: `${appr.siteCode} • ${appr.siteName}`,
        field: 'Statutory BRSR Core Approval Status',
        oldValue: appr.status,
        newValue: status,
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
        user: 'K. V. Rao',
        role: currentRole,
        action: 'UPDATE',
        entity: `${targetAnomaly.siteName}`,
        field: `Anomaly Status (${targetAnomaly.metric})`,
        oldValue: targetAnomaly.status,
        newValue: status,
      });
    }
  };

  const login = (email?: string, _password?: string, role?: UserRole): boolean => {
    const userRole = role || 'Group ESG Admin';
    const userName =
      userRole === 'Group ESG Admin'
        ? 'K. V. Rao'
        : userRole === 'Subsidiary Approver'
        ? 'P. Sharma'
        : userRole === 'Business Unit Reviewer'
        ? 'A. Mukherjee'
        : userRole === 'Project Data Entry User'
        ? 'R. Verma'
        : userRole === 'Independent Auditor (ISAE 3000)'
        ? 'S. Narayanan'
        : 'Dr. B. Reddy';

    const userTitle =
      userRole === 'Group ESG Admin'
        ? 'Chief Sustainability Officer'
        : userRole === 'Subsidiary Approver'
        ? 'VP - Infrastructure Projects'
        : userRole === 'Business Unit Reviewer'
        ? 'General Manager - ESG Quality'
        : userRole === 'Project Data Entry User'
        ? 'Senior Site Engineer'
        : userRole === 'Independent Auditor (ISAE 3000)'
        ? 'Lead ESG Assurance Partner'
        : 'Independent Board Director';

    const userObj = {
      name: userName,
      email:
        email ||
        (userRole === 'Group ESG Admin'
          ? 'cso@meilgroup.com'
          : `${userRole.toLowerCase().replace(/[^a-z0-9]/g, '')}@meilgroup.com`),
      role: userRole,
      title: userTitle,
    };

    setIsAuthenticated(true);
    setCurrentUser(userObj);
    setCurrentRole(userRole);
    sessionStorage.setItem('meil_esg_authenticated', 'true');
    sessionStorage.setItem('meil_esg_user', JSON.stringify(userObj));
    setIsLoginModalOpen(false);
    setIsGatewayOpen(false);
    setActiveModule('overview');
    setActiveSubtab('dashboard');

    addAuditLog({
      user: userName,
      role: userRole,
      action: 'APPROVE',
      entity: 'Enterprise Single Sign-On',
      field: 'User Session Authentication',
      oldValue: 'Unauthenticated / Public Landing',
      newValue: `Authenticated as ${userName} (${userRole})`,
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
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('meil_esg_authenticated');
    sessionStorage.removeItem('meil_esg_user');
    setActiveModule('overview');
    setActiveSubtab('hero-landing');
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
        setSites,
        emissionFactors,
        setEmissionFactors,
        brsrIndicators,
        setBrsrIndicators,
        auditTrail,
        addAuditLog,
        approvals,
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
        login,
        logout,
        activeSite,
        aggregatedMetrics,
        emissionsLogs,
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
