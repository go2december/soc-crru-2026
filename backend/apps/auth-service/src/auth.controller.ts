import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Param,
  Patch,
  Body,
  Delete as NestDelete,
  Query,
} from '@nestjs/common';
import { RolesEnum } from './roles.enum';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // เริ่มต้น Google OAuth Login
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard จะ redirect ไป Google
  }

  // Dev Login (Bypass Google)
  @Get('dev/login')
  async devLogin(
    @Res() res: Response,
    @Query('callbackPath') callbackPath?: string,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
    const cbPath = callbackPath || '/admin/callback';
    try {
      const token = await this.authService.loginAsDevAdmin();
      res.redirect(`${frontendUrl}${cbPath}?token=${token.accessToken}`);
    } catch (error) {
      console.error('Dev Login Error:', error);
      const loginPath = cbPath.replace('/callback', '/login');
      res.redirect(
        `${frontendUrl}${loginPath}?error=${encodeURIComponent(error.message || 'Unknown error')}`,
      );
    }
  }

  // Dev Login (JSON response - no redirect)
  @Post('dev/token')
  async devLoginToken() {
    const token = await this.authService.loginAsDevAdmin();
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Body('refreshToken') refreshToken?: string) {
    const accessToken = req.headers.authorization;
    await this.authService.logout(accessToken, refreshToken);
    return { message: 'Logged out' };
  }

  @Post('blacklist/check')
  async checkBlacklist(@Body('token') token: string) {
    const isBlacklisted = await this.authService.isTokenBlacklisted(token);
    return { isBlacklisted };
  }

  // Callback หลังจาก Google OAuth สำเร็จ
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    try {
      const user = await this.authService.validateOrCreateUser(req.user);
      const token = await this.authService.generateToken(user);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
      res.redirect(`${frontendUrl}/admin/callback?token=${token.accessToken}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
      res.redirect(
        `${frontendUrl}/admin/login?error=${encodeURIComponent(error.message)}`,
      );
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
  @Roles(RolesEnum.ADMIN)
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  // ดึงรายการ Audit Logs (Admin เท่านั้น)
  @Get('audit-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async getAuditLogs(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.authService.getAuditLogs(limitNum);
  }

  // ดึงข้อมูลนโยบายการจัดเก็บและสถิติการเก็บ Log (Admin เท่านั้น)
  @Get('audit-logs/retention')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async getAuditRetentionStats() {
    return this.authService.getAuditRetentionStats();
  }

  // ล้าง Log เก่าตามนโยบาย (Admin เท่านั้น)
  @Post('audit-logs/prune')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async pruneAuditLogs(@Body('days') days?: number) {
    return this.authService.pruneOldAuditLogs(days);
  }

  // ----------------------------------------------------
  // Dynamic Modules & Role Permissions Endpoints
  // ----------------------------------------------------

  // ดึงรายการโมดูลทั้งหมดพร้อมเมทริกซ์สิทธิ์ของแต่ละ Role
  @Get('modules-permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async getModulesWithPermissions() {
    return this.authService.getModulesWithPermissions();
  }

  // ลงทะเบียนโมดูลระบบใหม่ (Admin เท่านั้น)
  @Post('modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async createSystemModule(@Body() body: any, @Req() req: any) {
    return this.authService.createSystemModule(body, req.user);
  }

  // อัปเดตสิทธิ์ของ Role ต่อโมดูล (Admin เท่านั้น)
  @Patch('permissions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async updateRolePermission(@Body() body: any, @Req() req: any) {
    return this.authService.updateRolePermission(body, req.user);
  }

  // ลบโมดูลระบบที่เพิ่มขึ้นมาเอง (Custom Module) (Admin เท่านั้น)
  @NestDelete('modules/:key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteSystemModule(@Param('key') key: string, @Req() req: any) {
    return this.authService.deleteSystemModule(key, req.user);
  }

  // อัปเดต Roles ของ User (Admin เท่านั้น)
  @Patch('users/:id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body('roles') roles: string[],
    @Req() req: any,
  ) {
    return this.authService.updateUserRoles(id, roles, req.user);
  }

  // อัปเดต สังกัด/สาขาวิชา ของ User (Admin เท่านั้น)
  @Patch('users/:id/department')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async updateUserDepartment(
    @Param('id') id: string,
    @Body('departmentId') departmentId: number | null,
    @Req() req: any,
  ) {
    return this.authService.updateUserDepartment(id, departmentId, req.user);
  }

  // เปิด/ปิดการใช้งาน User (Admin เท่านั้น)
  @Patch('users/:id/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async toggleUserActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
    @Req() req: any,
  ) {
    return this.authService.toggleUserActive(id, isActive, req.user);
  }

  // ลบผู้ใช้ (Admin เท่านั้น)
  @NestDelete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    return this.authService.deleteUser(id, req.user);
  }
}
