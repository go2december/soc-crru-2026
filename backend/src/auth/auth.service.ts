import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users } from '../drizzle/schema';
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
            // สร้าง user ใหม่ (default role = STAFF)
            const newUser = await this.drizzle.db
                .insert(users)
                .values({
                    email: googleUser.email,
                    googleId: googleUser.googleId,
                    name: googleUser.name,
                    avatar: googleUser.avatar,
                    role: 'STAFF',
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
            role: user.role,
            name: user.name,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                role: user.role,
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
                role: users.role,
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
                role: users.role,
                isActive: users.isActive,
                lastLoginAt: users.lastLoginAt,
                createdAt: users.createdAt,
            })
            .from(users);
    }

    async updateUserRole(userId: string, role: 'ADMIN' | 'EDITOR' | 'STAFF' | 'GUEST') {
        const updated = await this.drizzle.db
            .update(users)
            .set({ role, updatedAt: new Date() })
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
                role: 'ADMIN',
                isActive: true,
            }).returning();
            user = newUser[0];
        } else if (user.role !== 'ADMIN') {
            // บังคับเปลี่ยนเป็น ADMIN
            const updated = await this.drizzle.db.update(users).set({ role: 'ADMIN' }).where(eq(users.id, user.id)).returning();
            user = updated[0];
        }

        return this.generateToken(user);
    }
}
