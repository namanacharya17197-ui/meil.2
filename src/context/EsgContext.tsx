import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  UserRole,
  ReportingCycle,
  InfrastructureSite,
  EmissionFactor,
  BRSRIndicator,
  AuditTrailEntry,
  ApprovalItem,
  AnomalyItem,
} from '../types/esg';
import {
  INFRASTRUCTURE_SITES,
  EMISSION_FACTORS,
  BRSR_CORE_INDICATORS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_APPROVALS,
  INITIAL_ANOMALIES,
} from '../data/mockData';

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
