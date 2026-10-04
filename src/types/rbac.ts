import { UserRole } from './esg';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'upload'
  | 'download'
  | 'approve'
  | 'reject'
  | 'export'
  | 'lock'
  | 'unlock'
  | 'audit_comment'
  | 'recalculate';

export interface UserScope {
  organization: string;
  subsidiary?: string;
  businessUnit?: string;
  projectId?: string;
  projectName?: string;
  description: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  scope: UserScope;
  isLocked?: boolean;
}

export interface RoleConfig {
  role: UserRole;
  displayName: string;
  title: string;
  defaultModule: string;
  defaultSubtab: string;
  allowedModules: string[];
  allowedSubtabs: Record<string, string[]>;
  permissions: PermissionAction[];
  defaultScope: UserScope;
  sampleUser: {
    id: string;
    name: string;
    email: string;
    title: string;
  };
}

export interface RbacAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  userName: string;
  role: UserRole;
  action: PermissionAction | 'ACCESS_MODULE' | 'SESSION_START' | 'SESSION_END' | 'UNAUTHORIZED_ATTEMPT';
  module: string;
  recordId?: string;
  result: 'ALLOWED' | 'DENIED' | 'SUCCESS';
  reason?: string;
  scopeContext: string;
  verifiedHash: string;
}
