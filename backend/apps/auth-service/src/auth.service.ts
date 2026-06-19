import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService, schema } from 'db/database';
import { eq } from 'drizzle-orm';

interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}
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
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
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
        isActive: schema.users.isActive,
        lastLoginAt: schema.users.lastLoginAt,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users);
  }

  async updateUserRoles(userId: string, roles: string[]) {
    const updated = await this.databaseService.db
      .update(schema.users)
      .set({ roles, updatedAt: new Date() })
      .where(eq(schema.users.id, userId))
      .returning();

    return updated[0];
  }

  async toggleUserActive(userId: string, isActive: boolean) {
    const updated = await this.databaseService.db
      .update(schema.users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(schema.users.id, userId))
      .returning();

    return updated[0];
  }

  async deleteUser(userId: string) {
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
