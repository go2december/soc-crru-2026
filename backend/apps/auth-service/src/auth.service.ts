import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { DatabaseService, schema } from 'db/database';
import { eq, desc, lt, sql, and } from 'drizzle-orm';

interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  // Retention Policy: Default 365 Days (1 Year)
  private readonly RETENTION_DAYS = 365;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    // Run automated cleanup check on server start and every 24 hours
    this.scheduleAutomatedCleanup();
  }

  private scheduleAutomatedCleanup() {
    // Run initial cleanup check asynchronously 10 seconds after boot
    setTimeout(() => {
      this.pruneOldAuditLogs(this.RETENTION_DAYS).catch((err) =>
        console.error('Failed to run initial audit prune:', err),
      );
    }, 10000);

    // Schedule periodic interval: every 24 hours (86,400,000 ms)
    setInterval(
      () => {
        this.pruneOldAuditLogs(this.RETENTION_DAYS).catch((err) =>
          console.error('Failed to run periodic audit prune:', err),
        );
      },
      24 * 60 * 60 * 1000,
    );
  }

  /**
   * Delete audit logs older than retention days (Default: 365 days / 1 Year)
   */
  async pruneOldAuditLogs(days: number = this.RETENTION_DAYS) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const deleted = await this.databaseService.db
      .delete(schema.auditLogs)
      .where(lt(schema.auditLogs.createdAt, cutoffDate))
      .returning({ id: schema.auditLogs.id });

    if (deleted.length > 0) {
      console.log(
        `[Audit Retention] Pruned ${deleted.length} logs older than ${days} days (before ${cutoffDate.toISOString()})`,
      );
    }

    return {
      success: true,
      deletedCount: deleted.length,
      retentionDays: days,
      cutoffDate: cutoffDate.toISOString(),
    };
  }

  /**
   * Get Audit Retention Policy statistics for Admin dashboard
   */
  async getAuditRetentionStats() {
    // Total count
    const totalCountRes = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.auditLogs);
    const total = Number(totalCountRes[0]?.count || 0);

    // Oldest log date
    const oldestLog = await this.databaseService.db
      .select({ createdAt: schema.auditLogs.createdAt })
      .from(schema.auditLogs)
      .orderBy(schema.auditLogs.createdAt)
      .limit(1);

    return {
      retentionPolicyDays: this.RETENTION_DAYS,
      policyDescription: 'เก็บบันทึกประวัติไว้ 365 วัน (1 ปี) ตามมาตรฐาน Cyber & IAM Audit',
      totalLogs: total,
      oldestLogDate: oldestLog[0]?.createdAt || null,
    };
  }

  // Helper method to record security and IAM actions into audit_logs
  async logAction(params: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    action: string;
    targetResource: string;
    targetId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.databaseService.db.insert(schema.auditLogs).values({
        userId: params.userId,
        userEmail: params.userEmail,
        userName: params.userName,
        action: params.action,
        targetResource: params.targetResource,
        targetId: params.targetId,
        details: params.details,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  // Get recent audit logs (Admin only)
  async getAuditLogs(limit: number = 100) {
    return this.databaseService.db
      .select()
      .from(schema.auditLogs)
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(limit);
  }

  // ----------------------------------------------------
  // Dynamic Modules & Permission Matrix Management
  // ----------------------------------------------------

  /**
   * Get all registered system modules alongside their assigned role permissions
   */
  async getModulesWithPermissions() {
    const modules = await this.databaseService.db
      .select()
      .from(schema.systemModules)
      .orderBy(schema.systemModules.id);

    const permissions = await this.databaseService.db
      .select()
      .from(schema.rolePermissions);

    // Group permissions by module_key
    const result = modules.map((mod) => {
      const modPerms = permissions.filter((p) => p.moduleKey === mod.key);
      return {
        ...mod,
        permissions: {
          ADMIN: modPerms.find((p) => p.role === 'ADMIN') || null,
          EDITOR: modPerms.find((p) => p.role === 'EDITOR') || null,
          STAFF: modPerms.find((p) => p.role === 'STAFF') || null,
          GUEST: modPerms.find((p) => p.role === 'GUEST') || null,
        },
      };
    });

    return result;
  }

  /**
   * Register a new System Module dynamically
   */
  async createSystemModule(
    data: {
      key: string;
      nameTh: string;
      description?: string;
      category?: string;
      routePath?: string;
      isWorkflowRequired?: boolean;
    },
    adminUser?: any,
  ) {
    // Sanitize key (lowercase, alphanumeric + underscore)
    const sanitizedKey = data.key.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');

    // Check existing
    const existing = await this.databaseService.db
      .select()
      .from(schema.systemModules)
      .where(eq(schema.systemModules.key, sanitizedKey));

    if (existing.length > 0) {
      throw new BadRequestException(`โมดูลรหัส '${sanitizedKey}' มีอยู่ในระบบแล้ว`);
    }

    const inserted = await this.databaseService.db
      .insert(schema.systemModules)
      .values({
        key: sanitizedKey,
        nameTh: data.nameTh,
        description: data.description,
        category: data.category || 'Custom',
        routePath: data.routePath || `/admin/${sanitizedKey.replace(/_/g, '-')}`,
        isWorkflowRequired: !!data.isWorkflowRequired,
        isCore: false,
      })
      .returning();

    const newModule = inserted[0];

    // Seed default permissions for this new module
    // 1. ADMIN: Full permissions
    await this.databaseService.db.insert(schema.rolePermissions).values([
      {
        role: 'ADMIN',
        moduleKey: sanitizedKey,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        canApprove: true,
        scopeType: 'GLOBAL',
      },
      {
        role: 'EDITOR',
        moduleKey: sanitizedKey,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: false,
        canApprove: false,
        scopeType: 'DEPARTMENT',
      },
      {
        role: 'STAFF',
        moduleKey: sanitizedKey,
        canCreate: false,
        canRead: true,
        canUpdate: false,
        canDelete: false,
        canApprove: false,
        scopeType: 'GLOBAL',
      },
      {
        role: 'GUEST',
        moduleKey: sanitizedKey,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canApprove: false,
        scopeType: 'GLOBAL',
      },
    ]);

    await this.logAction({
      userId: adminUser?.id,
      userEmail: adminUser?.email,
      userName: adminUser?.name,
      action: 'SYSTEM_MODULE_CREATED',
      targetResource: 'system_modules',
      targetId: sanitizedKey,
      details: { key: sanitizedKey, nameTh: data.nameTh },
    });

    return newModule;
  }

  /**
   * Update or batch-update role permissions for a module
   */
  async updateRolePermission(
    data: {
      role: 'ADMIN' | 'EDITOR' | 'STAFF' | 'GUEST';
      moduleKey: string;
      canCreate: boolean;
      canRead: boolean;
      canUpdate: boolean;
      canDelete: boolean;
      canApprove: boolean;
      scopeType: string;
    },
    adminUser?: any,
  ) {
    const existing = await this.databaseService.db
      .select()
      .from(schema.rolePermissions)
      .where(
        and(
          eq(schema.rolePermissions.role, data.role),
          eq(schema.rolePermissions.moduleKey, data.moduleKey),
        ),
      );

    let updated;
    if (existing.length > 0) {
      updated = await this.databaseService.db
        .update(schema.rolePermissions)
        .set({
          canCreate: data.canCreate,
          canRead: data.canRead,
          canUpdate: data.canUpdate,
          canDelete: data.canDelete,
          canApprove: data.canApprove,
          scopeType: data.scopeType,
          updatedAt: new Date(),
        })
        .where(eq(schema.rolePermissions.id, existing[0].id))
        .returning();
    } else {
      updated = await this.databaseService.db
        .insert(schema.rolePermissions)
        .values({
          role: data.role,
          moduleKey: data.moduleKey,
          canCreate: data.canCreate,
          canRead: data.canRead,
          canUpdate: data.canUpdate,
          canDelete: data.canDelete,
          canApprove: data.canApprove,
          scopeType: data.scopeType,
        })
        .returning();
    }

    await this.logAction({
      userId: adminUser?.id,
      userEmail: adminUser?.email,
      userName: adminUser?.name,
      action: 'ROLE_PERMISSION_UPDATED',
      targetResource: 'role_permissions',
      targetId: `${data.role}:${data.moduleKey}`,
      details: data,
    });

    return updated[0];
  }

  /**
   * Delete a custom system module
   */
  async deleteSystemModule(key: string, adminUser?: any) {
    const existing = await this.databaseService.db
      .select()
      .from(schema.systemModules)
      .where(eq(schema.systemModules.key, key));

    if (existing.length === 0) {
      throw new BadRequestException('ไม่พบโมดูลที่ต้องการลบ');
    }

    if (existing[0].isCore) {
      throw new BadRequestException('ไม่สามารถลบโมดูลหลักของระบบ (Core Module) ได้');
    }

    const deleted = await this.databaseService.db
      .delete(schema.systemModules)
      .where(eq(schema.systemModules.key, key))
      .returning();

    await this.logAction({
      userId: adminUser?.id,
      userEmail: adminUser?.email,
      userName: adminUser?.name,
      action: 'SYSTEM_MODULE_DELETED',
      targetResource: 'system_modules',
      targetId: key,
      details: { deletedKey: key, nameTh: existing[0].nameTh },
    });

    return deleted[0];
  }
  // Issue a new refresh token (UUID) and store it (30 day expiry)
  async issueRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.databaseService.db.insert(schema.refreshTokens).values({
      userId,
      token,
      expiresAt,
    });
    return token;
  }

  // Validate refresh token and return a new access token (static refresh token)
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const stored = await this.databaseService.db
      .select()
      .from(schema.refreshTokens)
      .where(eq(schema.refreshTokens.token, refreshToken))
      .then((r) => r[0]);
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    // Load user
    const user = await this.databaseService.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, stored.userId))
      .then((r) => r[0]);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = (await this.generateToken(user)).accessToken;
    // Return same refresh token (static)
    return { accessToken, refreshToken };
  }

  // Logout: blacklist current access token and optionally delete refresh token
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    const token = accessToken.replace(/^Bearer\s+/i, '').trim();

    let expiresAt: Date | undefined;
    try {
      const decoded = this.jwtService.decode(token);
      if (decoded && decoded.exp) {
        expiresAt = new Date(decoded.exp * 1000);
      }
    } catch (e) {
      console.error('Failed to decode JWT expiration:', e);
    }
    if (!expiresAt) {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    await this.databaseService.db
      .insert(schema.tokenBlacklist)
      .values({
        token,
        expiresAt,
      })
      .onConflictDoNothing();

    if (refreshToken) {
      await this.databaseService.db
        .delete(schema.refreshTokens)
        .where(eq(schema.refreshTokens.token, refreshToken));
    }
  }

  // Helper used by JwtStrategy to verify blacklist
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklisted = await this.databaseService.db
      .select()
      .from(schema.tokenBlacklist)
      .where(eq(schema.tokenBlacklist.token, token))
      .then((r) => r[0]);
    return !!blacklisted;
  }
  async validateOrCreateUser(googleUser: GoogleUser) {
    // Ensure only @crru.ac.th emails are allowed
    if (!googleUser.email.endsWith('@crru.ac.th')) {
      throw new UnauthorizedException('กรุณาใช้อีเมล @crru.ac.th เท่านั้น');
    }
    // Upsert user based on Google info
    const user = await this.upsertUserFromGoogle(googleUser);
    return user;
  }

  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      name: user.name,
      departmentId: user.departmentId ?? null,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
        departmentId: user.departmentId ?? null,
      },
    };
  }

  async getProfile(userId: string) {
    const result = await this.databaseService.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        avatar: schema.users.avatar,
        roles: schema.users.roles,
        departmentId: schema.users.departmentId,
        isActive: schema.users.isActive,
        lastLoginAt: schema.users.lastLoginAt,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, userId));

    return result[0];
  }

  async getAllUsers() {
    return this.databaseService.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        avatar: schema.users.avatar,
        roles: schema.users.roles,
        departmentId: schema.users.departmentId,
        isActive: schema.users.isActive,
        lastLoginAt: schema.users.lastLoginAt,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users);
  }

  async updateUserDepartment(
    userId: string,
    departmentId: number | null,
    adminUser?: any,
  ) {
    const updated = await this.databaseService.db
      .update(schema.users)
      .set({ departmentId, updatedAt: new Date() })
      .where(eq(schema.users.id, userId))
      .returning();

    if (updated[0]) {
      await this.logAction({
        userId: adminUser?.id,
        userEmail: adminUser?.email,
        userName: adminUser?.name,
        action: 'USER_DEPARTMENT_UPDATE',
        targetResource: 'users',
        targetId: userId,
        details: { departmentId, targetUserEmail: updated[0].email },
      });
    }

    return updated[0];
  }

  async updateUserRoles(userId: string, roles: string[], adminUser?: any) {
    // Self-lockout protection: Admin cannot demote themselves from ADMIN
    if (adminUser && adminUser.id === userId && !roles.includes('ADMIN')) {
      throw new BadRequestException('ไม่สามารถปลดสิทธิ์ ADMIN ของตนเองได้');
    }

    const updated = await this.databaseService.db
      .update(schema.users)
      .set({ roles, updatedAt: new Date() })
      .where(eq(schema.users.id, userId))
      .returning();

    if (updated[0]) {
      await this.logAction({
        userId: adminUser?.id,
        userEmail: adminUser?.email,
        userName: adminUser?.name,
        action: 'USER_ROLES_UPDATE',
        targetResource: 'users',
        targetId: userId,
        details: { roles, targetUserEmail: updated[0].email },
      });
    }

    return updated[0];
  }

  async toggleUserActive(userId: string, isActive: boolean, adminUser?: any) {
    // Self-lockout protection: Admin cannot deactivate their own account
    if (adminUser && adminUser.id === userId && !isActive) {
      throw new BadRequestException('ไม่สามารถระงับการใช้งานบัญชีของตนเองได้');
    }

    const updated = await this.databaseService.db
      .update(schema.users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(schema.users.id, userId))
      .returning();

    if (updated[0]) {
      await this.logAction({
        userId: adminUser?.id,
        userEmail: adminUser?.email,
        userName: adminUser?.name,
        action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
        targetResource: 'users',
        targetId: userId,
        details: { isActive, targetUserEmail: updated[0].email },
      });
    }

    return updated[0];
  }

  async deleteUser(userId: string, adminUser?: any) {
    // Self-lockout protection: Admin cannot delete themselves
    if (adminUser && adminUser.id === userId) {
      throw new BadRequestException('ไม่สามารถลบบัญชีของตนเองได้');
    }

    // 1. Unlink Staff Profiles (Set userId = NULL)
    await this.databaseService.db
      .update(schema.staffProfiles)
      .set({ userId: null })
      .where(eq(schema.staffProfiles.userId, userId));

    // 2. Unlink News (Set authorId = NULL)
    await this.databaseService.db
      .update(schema.news)
      .set({ authorId: null })
      .where(eq(schema.news.authorId, userId));

    // 3. Finally Delete User
    const deleted = await this.databaseService.db
      .delete(schema.users)
      .where(eq(schema.users.id, userId))
      .returning();

    if (deleted[0]) {
      await this.logAction({
        userId: adminUser?.id,
        userEmail: adminUser?.email,
        userName: adminUser?.name,
        action: 'USER_DELETED',
        targetResource: 'users',
        targetId: userId,
        details: { deletedEmail: deleted[0].email },
      });
    }

    return deleted[0];
  }

  // สำหรับ Dev Mode เท่านั้น
  async loginAsDevAdmin() {
    const devEmail = 'admin@soc.crru.ac.th';

    // เช็คว่ามี user นี้หรือยัง
    const existing = await this.databaseService.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, devEmail));

    let user = existing[0];

    if (!user) {
      // สร้าง Admin ใหม่
      const newUser = await this.databaseService.db
        .insert(schema.users)
        .values({
          email: devEmail,
          googleId: 'dev-admin-id',
          name: 'Dev Admin',
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
          roles: ['ADMIN'],
          isActive: true,
        })
        .returning();
      user = newUser[0];
    } else if (!user.roles || !user.roles.includes('ADMIN')) {
      // บังคับเพิ่มสิทธิ์ ADMIN ถ้ายังไม่มี
      const newRoles = [...(user.roles || []), 'ADMIN'];
      const uniqueRoles = [...new Set(newRoles)];

      const updated = await this.databaseService.db
        .update(schema.users)
        .set({ roles: uniqueRoles })
        .where(eq(schema.users.id, user.id))
        .returning();
      user = updated[0];
    }

    const tokenResult = await this.generateToken(user);
    const refreshToken = await this.issueRefreshToken(user.id);

    return {
      accessToken: tokenResult.accessToken,
      refreshToken,
      user: tokenResult.user,
    };
  }

  // Helper method to upsert user based on Google info
  async upsertUserFromGoogle(googleUser: GoogleUser) {
    // Find existing user by email
    const existing = await this.databaseService.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, googleUser.email));

    let user;
    if (existing.length === 0) {
      // Create new user with default STAFF role
      const inserted = await this.databaseService.db
        .insert(schema.users)
        .values({
          email: googleUser.email,
          googleId: googleUser.googleId,
          name: googleUser.name,
          avatar: googleUser.avatar,
          roles: ['STAFF'],
          isActive: true,
          lastLoginAt: new Date(),
        })
        .returning();
      user = inserted[0];
    } else {
      const existingUser = existing[0];
      const updated = await this.databaseService.db
        .update(schema.users)
        .set({
          googleId: googleUser.googleId,
          name: googleUser.name,
          avatar: googleUser.avatar,
          lastLoginAt: new Date(),
        })
        .where(eq(schema.users.id, existingUser.id))
        .returning();
      user = updated[0];
    }

    return user;
  }
}
