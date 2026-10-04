import { UserRole } from '../types/esg';
import { PermissionAction, RoleConfig, UserAccount, UserScope } from '../types/rbac';

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  'Group ESG Admin': {
    role: 'Group ESG Admin',
    displayName: 'Group ESG Admin',
    title: 'Chief Sustainability Officer',
    defaultModule: 'overview',
    defaultSubtab: 'dashboard',
    allowedModules: [
      'overview',
      'governance',
      'collection',
      'calculator',
      'analytics',
      'assurance',
      'copilot',
      'admin',
    ],
    allowedSubtabs: {
      overview: ['dashboard', 'gis-map', 'sdg-heatmap', 'hero-landing', 'gateway'],
      governance: ['org-tree', 'submission-matrix'],
      collection: ['quick-entry', 'scope-calculator', 'section-a', 'section-b', 'section-c'],
      calculator: ['scope-emissions', 'decarbonization-simulator', 'water-calculator', 'material-embodied', 'intensity-benchmarking'],
      analytics: ['emission-engine', 'brsr-attributes', 'drilldown', 'anomaly-radar'],
      assurance: ['auditor-portal', 'principle-6-report', 'approvals', 'audit-trail', 'report-generator'],
      copilot: ['narratives', 'anomaly-explainer', 'gap-analysis', 'ask-chat'],
      admin: ['emission-library', 'indicator-master', 'system-settings'],
    },
    permissions: [
      'view',
      'create',
      'edit',
      'delete',
      'upload',
      'download',
      'approve',
      'reject',
      'export',
      'lock',
      'unlock',
      'audit_comment',
      'recalculate',
    ],
    defaultScope: {
      organization: 'MEIL Group (Global)',
      description: 'Full conglomerate governance across 300+ infrastructure projects & subsidiaries',
    },
    sampleUser: {
      id: 'usr-admin-01',
      name: 'K. V. Rao',
      email: 'cso@meilgroup.com',
      title: 'Chief Sustainability Officer',
    },
  },

  'Subsidiary Approver': {
    role: 'Subsidiary Approver',
    displayName: 'Subsidiary Approver',
    title: 'VP - Infrastructure Projects',
    defaultModule: 'assurance',
    defaultSubtab: 'approvals',
    allowedModules: [
      'overview',
      'governance',
      'calculator',
      'analytics',
      'assurance',
    ],
    allowedSubtabs: {
      overview: ['dashboard', 'gis-map', 'sdg-heatmap'],
      governance: ['org-tree', 'submission-matrix'],
      calculator: ['scope-emissions', 'water-calculator', 'intensity-benchmarking'],
      analytics: ['brsr-attributes', 'drilldown'],
      assurance: ['approvals', 'principle-6-report', 'report-generator'],
    },
    permissions: ['view', 'download', 'approve', 'reject', 'audit_comment', 'export'],
    defaultScope: {
      organization: 'MEIL Group',
      subsidiary: 'Megha Hydro Infrastructure Ltd',
      description: 'Assigned Subsidiary: Megha Hydro Infrastructure Ltd',
    },
    sampleUser: {
      id: 'usr-sub-02',
      name: 'P. Sharma',
      email: 'approver@meilinfra.com',
      title: 'VP - Infrastructure Projects (Hydro Subsidiary)',
    },
  },

  'Business Unit Reviewer': {
    role: 'Business Unit Reviewer',
    displayName: 'Business Unit Reviewer',
    title: 'General Manager - ESG Quality',
    defaultModule: 'analytics',
    defaultSubtab: 'brsr-attributes',
    allowedModules: [
      'overview',
      'governance',
      'collection',
      'calculator',
      'analytics',
      'assurance',
    ],
    allowedSubtabs: {
      overview: ['dashboard', 'gis-map'],
      governance: ['org-tree'],
      collection: ['quick-entry', 'scope-calculator'],
      calculator: ['scope-emissions', 'water-calculator', 'intensity-benchmarking'],
      analytics: ['brsr-attributes', 'anomaly-radar'],
      assurance: ['principle-6-report'],
    },
    permissions: ['view', 'download', 'audit_comment', 'recalculate'],
    defaultScope: {
      organization: 'MEIL Group',
      subsidiary: 'Megha Hydro Infrastructure Ltd',
      businessUnit: 'Hydro & Irrigation',
      description: 'Assigned BU: Hydro & Irrigation Division',
    },
    sampleUser: {
      id: 'usr-bu-03',
      name: 'A. Mukherjee',
      email: 'reviewer@meilgroup.com',
      title: 'General Manager - ESG Quality (Hydro BU)',
    },
  },

  'Project Data Entry User': {
    role: 'Project Data Entry User',
    displayName: 'Project Data Entry User',
    title: 'Senior Site Engineer',
    defaultModule: 'collection',
    defaultSubtab: 'quick-entry',
    allowedModules: ['collection', 'calculator'],
    allowedSubtabs: {
      collection: ['quick-entry', 'scope-calculator'],
      calculator: ['scope-emissions', 'water-calculator'],
    },
    permissions: ['view', 'create', 'edit', 'upload', 'download'],
    defaultScope: {
      organization: 'MEIL Group',
      subsidiary: 'Megha Hydro Infrastructure Ltd',
      businessUnit: 'Hydro & Irrigation',
      projectId: 'site-042',
      projectName: 'Polavaram Multi-Purpose Project',
      description: 'Assigned Project: Site #042 • Polavaram Multi-Purpose Project',
    },
    sampleUser: {
      id: 'usr-site-04',
      name: 'R. Verma',
      email: 'site.engineer@meil.in',
      title: 'Senior Site Resident Engineer',
    },
  },

  'Independent Auditor (ISAE 3000)': {
    role: 'Independent Auditor (ISAE 3000)',
    displayName: 'Independent Auditor (ISAE 3000)',
    title: 'Lead ESG Assurance Partner',
    defaultModule: 'assurance',
    defaultSubtab: 'auditor-portal',
    allowedModules: [
      'overview',
      'calculator',
      'analytics',
      'assurance',
    ],
    allowedSubtabs: {
      overview: ['dashboard', 'gis-map'],
      calculator: ['scope-emissions', 'water-calculator', 'intensity-benchmarking'],
      analytics: ['emission-engine', 'brsr-attributes', 'anomaly-radar'],
      assurance: ['auditor-portal', 'principle-6-report', 'audit-trail', 'report-generator'],
    },
    permissions: ['view', 'download', 'audit_comment', 'recalculate', 'export'],
    defaultScope: {
      organization: 'MEIL Group',
      description: 'Statutory ISAE 3000 Audit Scope • Approved & Audited Records',
    },
    sampleUser: {
      id: 'usr-aud-05',
      name: 'S. Narayanan',
      email: 'auditor@kpmg-assurance.com',
      title: 'Lead ESG Assurance Partner (ISAE 3000)',
    },
  },

  'Board Viewer': {
    role: 'Board Viewer',
    displayName: 'Board Viewer',
    title: 'Independent Board Director',
    defaultModule: 'overview',
    defaultSubtab: 'sdg-heatmap',
    allowedModules: ['overview', 'assurance'],
    allowedSubtabs: {
      overview: ['dashboard', 'gis-map', 'sdg-heatmap'],
      assurance: ['principle-6-report', 'report-generator'],
    },
    permissions: ['view', 'download', 'export'],
    defaultScope: {
      organization: 'MEIL Group',
      description: 'Board of Directors Governance • High-level Aggregated Strategic Data Only',
    },
    sampleUser: {
      id: 'usr-brd-06',
      name: 'Dr. B. Reddy',
      email: 'board@meil.in',
      title: 'Independent Board Director & ESG Committee Chair',
    },
  },
};

/**
 * Checks whether a given role is authorized to access a module.
 */
export function isModuleAllowed(role: UserRole, moduleId: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.allowedModules.includes(moduleId);
}

/**
 * Checks whether a given role is authorized to access a subtab within a module.
 */
export function isSubtabAllowed(role: UserRole, moduleId: string, subtabId: string): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  if (!config.allowedModules.includes(moduleId)) return false;

  const allowedSubs = config.allowedSubtabs[moduleId];
  if (!allowedSubs) return true; // If unspecified, module-level permission applies
  return allowedSubs.includes(subtabId);
}

/**
 * Checks whether a role has permission to execute an action.
 */
export function hasActionPermission(role: UserRole, action: PermissionAction): boolean {
  const config = ROLE_CONFIGS[role];
  if (!config) return false;
  return config.permissions.includes(action);
}

/**
 * Validates if a user is permitted to edit or modify a specific record given its status.
 * Data Entry Users and Reviewers CANNOT edit records that are Approved or Audited or Locked!
 */
export function canModifyRecordStatus(role: UserRole, currentStatus: string): { allowed: boolean; reason?: string } {
  if (role === 'Group ESG Admin') {
    return { allowed: true };
  }

  if (currentStatus === 'Approved' || currentStatus === 'Audited') {
    return {
      allowed: false,
      reason: `Record is locked under ${currentStatus} statutory assurance status. Only Group ESG Admin can unlock or modify approved records.`,
    };
  }

  if (role === 'Project Data Entry User') {
    if (currentStatus === 'Draft' || currentStatus === 'Submitted') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Project Data Entry Users can only modify records in Draft or Submitted status.',
    };
  }

  if (role === 'Independent Auditor (ISAE 3000)' || role === 'Board Viewer') {
    return {
      allowed: false,
      reason: `${role} accounts have strictly Read-Only access to original operational ESG logs.`,
    };
  }

  return { allowed: true };
}

/**
 * Validates organizational scope filtering for a site.
 */
export function isSiteInScope(
  userRole: UserRole,
  userScope: UserScope,
  site: {
    id: string;
    subsidiary?: string;
    division?: string;
  }
): boolean {
  if (userRole === 'Group ESG Admin' || userRole === 'Board Viewer' || userRole === 'Independent Auditor (ISAE 3000)') {
    return true;
  }

  if (userRole === 'Subsidiary Approver') {
    if (!userScope.subsidiary) return true;
    return site.subsidiary?.toLowerCase() === userScope.subsidiary.toLowerCase();
  }

  if (userRole === 'Business Unit Reviewer') {
    if (!userScope.businessUnit) return true;
    return site.division?.toLowerCase() === userScope.businessUnit.toLowerCase();
  }

  if (userRole === 'Project Data Entry User') {
    if (!userScope.projectId) return true;
    return site.id === userScope.projectId;
  }

  return true;
}

/**
 * Predefined demo accounts map for instant testing and role detection.
 */
export const PREDEFINED_USER_ACCOUNTS: Record<string, UserAccount> = {
  'cso@meilgroup.com': {
    id: 'usr-admin-01',
    name: 'K. V. Rao',
    email: 'cso@meilgroup.com',
    role: 'Group ESG Admin',
    title: 'Chief Sustainability Officer',
    scope: ROLE_CONFIGS['Group ESG Admin'].defaultScope,
  },
  'approver@meilinfra.com': {
    id: 'usr-sub-02',
    name: 'P. Sharma',
    email: 'approver@meilinfra.com',
    role: 'Subsidiary Approver',
    title: 'VP - Infrastructure Projects (Hydro Subsidiary)',
    scope: ROLE_CONFIGS['Subsidiary Approver'].defaultScope,
  },
  'reviewer@meilgroup.com': {
    id: 'usr-bu-03',
    name: 'A. Mukherjee',
    email: 'reviewer@meilgroup.com',
    role: 'Business Unit Reviewer',
    title: 'General Manager - ESG Quality (Hydro BU)',
    scope: ROLE_CONFIGS['Business Unit Reviewer'].defaultScope,
  },
  'site.engineer@meil.in': {
    id: 'usr-site-04',
    name: 'R. Verma',
    email: 'site.engineer@meil.in',
    role: 'Project Data Entry User',
    title: 'Senior Site Resident Engineer',
    scope: ROLE_CONFIGS['Project Data Entry User'].defaultScope,
  },
  'auditor@kpmg-assurance.com': {
    id: 'usr-aud-05',
    name: 'S. Narayanan',
    email: 'auditor@kpmg-assurance.com',
    role: 'Independent Auditor (ISAE 3000)',
    title: 'Lead ESG Assurance Partner (ISAE 3000)',
    scope: ROLE_CONFIGS['Independent Auditor (ISAE 3000)'].defaultScope,
  },
  'board@meil.in': {
    id: 'usr-brd-06',
    name: 'Dr. B. Reddy',
    email: 'board@meil.in',
    role: 'Board Viewer',
    title: 'Independent Board Director & ESG Committee Chair',
    scope: ROLE_CONFIGS['Board Viewer'].defaultScope,
  },
};
