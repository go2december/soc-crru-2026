import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users, staffProfiles, news, researchAuthors } from '../drizzle/schema';
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
        private readonly drizzle: DrizzleService,
        private readonly jwtService: JwtService,
    ) { }

    async validateOrCreateUser(googleUser: GoogleUser) {
        // ตรวจสอบว่าเป็น @crru.ac.th เท่านั้น
        if (!googleUser.email.endsWith('@crru.ac.th')) {
            throw new UnauthorizedException('กรุณาใช้อีเมล @crru.ac.th เท่านั้น');
        }

        // ค้นหา user จาก email
        const existingUsers = await this.drizzle.db
            .select()
            .from(users)
            .where(eq(users.email, googleUser.email));

        let user = existingUsers[0];

        if (user) {
            // อัปเดตข้อมูล Google และ lastLoginAt
            const updated = await this.drizzle.db
                .update(users)
                .set({
                    googleId: googleUser.googleId,
                    name: googleUser.name,
                    avatar: googleUser.avatar,
                    lastLoginAt: new Date(),
                    updatedAt: new Date(),
                })
                .where(eq(users.email, googleUser.email))
                .returning();
            user = updated[0];
        } else {
            // สร้าง user ใหม่ (default roles = ['STAFF'])
            const newUser = await this.drizzle.db
                .insert(users)
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
            user = newUser[0];
        }

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
        const result = await this.drizzle.db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                avatar: users.avatar,
                roles: users.roles,
                isActive: users.isActive,
                lastLoginAt: users.lastLoginAt,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, userId));

        return result[0];
    }

    async getAllUsers() {
        return this.drizzle.db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                avatar: users.avatar,
                roles: users.roles,
                isActive: users.isActive,
                lastLoginAt: users.lastLoginAt,
                createdAt: users.createdAt,
            })
            .from(users);
    }

    async updateUserRoles(userId: string, roles: string[]) {
        const updated = await this.drizzle.db
            .update(users)
            .set({ roles, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return updated[0];
    }

    async toggleUserActive(userId: string, isActive: boolean) {
        const updated = await this.drizzle.db
            .update(users)
            .set({ isActive, updatedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        return updated[0];
    }

    async deleteUser(userId: string) {
        // 1. Unlink Staff Profiles (Set userId = NULL)
        await this.drizzle.db
            .update(staffProfiles)
            .set({ userId: null })
            .where(eq(staffProfiles.userId, userId));

        // 2. Unlink News (Set authorId = NULL)
        await this.drizzle.db
            .update(news)
            .set({ authorId: null })
            .where(eq(news.authorId, userId));

        // 3. Delete from Research Authors?
        // researchAuthors links staffId (not userId), and staffProfiles links userId.
        // So deleting User unlinks StaffProfile, but StaffProfile remains.
        // So ResearchAuthors is safe (referenced to StaffProfile).

        // 4. Finally Delete User
        const deleted = await this.drizzle.db
            .delete(users)
            .where(eq(users.id, userId))
            .returning();

        return deleted[0];
    }

    // สำหรับ Dev Mode เท่านั้น
    async loginAsDevAdmin() {
        const devEmail = 'admin@soc.crru.ac.th';

        // เช็คว่ามี user นี้หรือยัง
        const existing = await this.drizzle.db.select().from(users).where(eq(users.email, devEmail));

        let user = existing[0];

        if (!user) {
            // สร้าง Admin ใหม่
            const newUser = await this.drizzle.db.insert(users).values({
                email: devEmail,
                googleId: 'dev-admin-id',
                name: 'Dev Admin',
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
                roles: ['ADMIN'],
                isActive: true,
            }).returning();
            user = newUser[0];
        } else if (!user.roles || !user.roles.includes('ADMIN')) {
            // บังคับเพิ่มสิทธิ์ ADMIN ถ้ายังไม่มี
            const newRoles = [...(user.roles || []), 'ADMIN'];
            // remove duplicates just in case
            const uniqueRoles = [...new Set(newRoles)];

            const updated = await this.drizzle.db.update(users).set({ roles: uniqueRoles }).where(eq(users.id, user.id)).returning();
            user = updated[0];
        }

        return this.generateToken(user);
    }
}
