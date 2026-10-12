import { SetMetadata } from '@nestjs/common';

export type PermissionAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE';

export interface RequiredPermission {
  moduleKey: string;
  action: PermissionAction;
}

export const PERMISSION_CHECK_KEY = 'require_permission';

/**
 * Decorator to enforce dynamic module action permission
 * Example: @RequirePermission('news', 'APPROVE')
 * Example: @RequirePermission('admissions', 'CREATE')
 */
export const RequirePermission = (
  moduleKey: string,
  action: PermissionAction,
) => SetMetadata(PERMISSION_CHECK_KEY, { moduleKey, action });
