export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  organizationId: string;
  resourceType?: string;
  resourceId?: string;
  changes?: Record<string, any>;
}

export type AuditLogAction = 
  | 'user.login'
  | 'user.logout'
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'role.created'
  | 'role.updated'
  | 'role.deleted'
  | 'permission.granted'
  | 'permission.revoked'
  | 'settings.updated'
  | 'integration.connected'
  | 'integration.disconnected'
  | 'data.exported'
  | 'data.imported';