import { Controller, Get, Post, Req, Res, UseGuards, Param, Patch, Body, Delete as NestDelete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // เริ่มต้น Google OAuth Login
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Guard จะ redirect ไป Google
    }

    // Dev Login (Bypass Google)
    // callbackPath: เส้นทาง callback ของ frontend เช่น /admin/callback หรือ /chiang-rai-studies/admin/callback
    @Get('dev/login')
    async devLogin(@Res() res: Response, @Query('callbackPath') callbackPath?: string) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
        const cbPath = callbackPath || '/admin/callback';
        try {
            const token = await this.authService.loginAsDevAdmin();
            res.redirect(`${frontendUrl}${cbPath}?token=${token.accessToken}`);
        } catch (error) {
            console.error('Dev Login Error:', error);
            // Derive login path from callback path (e.g. /chiang-rai-studies/admin/callback -> /chiang-rai-studies/admin/login)
            const loginPath = cbPath.replace('/callback', '/login');
            res.redirect(`${frontendUrl}${loginPath}?error=${encodeURIComponent(error.message || 'Unknown error')}`);
        }
    }

    // Dev Login (JSON response - no redirect)
    @Post('dev/token')
    async devLoginToken() {
        const token = await this.authService.loginAsDevAdmin();
        return { accessToken: token.accessToken };
    }

    // Callback หลังจาก Google OAuth สำเร็จ
    // ใช้ localStorage redirect_after_login ที่ frontend ตั้งไว้ก่อนเรียก Google OAuth
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Req() req: any, @Res() res: Response) {
        try {
            const user = await this.authService.validateOrCreateUser(req.user);
            const token = await this.authService.generateToken(user);

            // Redirect ไป Frontend พร้อม token
            // Google OAuth ไม่สามารถส่ง custom state ได้ง่าย จึงใช้ /admin/callback เป็น default
            // Frontend callback page จะอ่าน localStorage.redirect_after_login เพื่อ redirect ต่อ
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
            res.redirect(`${frontendUrl}/admin/callback?token=${token.accessToken}`);
        } catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
            res.redirect(`${frontendUrl}/admin/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    // ดึงข้อมูล Profile ของ User ที่ Login
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
        return this.authService.getProfile(req.user.id);
    }

    // ดึงรายการ Users ทั้งหมด (Admin เท่านั้น)
    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async getAllUsers() {
        return this.authService.getAllUsers();
    }

    // อัปเดต Roles ของ User (Admin เท่านั้น)
    @Patch('users/:id/role')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async updateUserRole(
        @Param('id') id: string,
        @Body('roles') roles: string[],
    ) {
        return this.authService.updateUserRoles(id, roles);
    }

    // เปิด/ปิดการใช้งาน User (Admin เท่านั้น)
    @Patch('users/:id/active')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async toggleUserActive(
        @Param('id') id: string,
        @Body('isActive') isActive: boolean,
    ) {
        return this.authService.toggleUserActive(id, isActive);
    }

    // ลบผู้ใช้ (Admin เท่านั้น)
    @NestDelete('users/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async deleteUser(@Param('id') id: string) {
        return this.authService.deleteUser(id);
    }
}
