import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('กรุณาเข้าสู่ระบบ');
        }

        // Check if user has ANY of the required roles
        // user.roles is now an string[] (e.g. ['STAFF', 'EDITOR'])
        const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

        if (!hasRole) {
            throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้');
        }

        return true;
    }
}
