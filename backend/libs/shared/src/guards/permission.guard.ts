import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService, schema } from 'db/database';
import { eq, and } from 'drizzle-orm';
import {
  PERMISSION_CHECK_KEY,
  RequiredPermission,
} from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission =
      this.reflector.getAllAndOverride<RequiredPermission>(
        PERMISSION_CHECK_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!requiredPermission) {
      return true; // No specific dynamic permission required
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles || user.roles.length === 0) {
      throw new ForbiddenException('ไม่มีสิทธิ์เข้าถึงโมดูลนี้');
    }

    // Super Admin always has full access
    if (user.roles.includes('ADMIN')) {
      return true;
    }

    const { moduleKey, action } = requiredPermission;

    // Check each role assigned to the user
    for (const role of user.roles) {
      const permission = await this.databaseService.db
        .select()
        .from(schema.rolePermissions)
        .where(
          and(
            eq(schema.rolePermissions.role, role as any),
            eq(schema.rolePermissions.moduleKey, moduleKey),
          ),
        )
        .then((r) => r[0]);

      if (permission) {
        let isAllowed = false;
        switch (action) {
          case 'CREATE':
            isAllowed = permission.canCreate;
            break;
          case 'READ':
            isAllowed = permission.canRead;
            break;
          case 'UPDATE':
            isAllowed = permission.canUpdate;
            break;
          case 'DELETE':
            isAllowed = permission.canDelete;
            break;
          case 'APPROVE':
            isAllowed = permission.canApprove;
            break;
        }

        if (isAllowed) {
          return true;
        }
      }
    }

    throw new ForbiddenException(
      `คุณไม่มีสิทธิ์ในการ ${action} สำหรับโมดูล '${moduleKey}'`,
    );
  }
}
