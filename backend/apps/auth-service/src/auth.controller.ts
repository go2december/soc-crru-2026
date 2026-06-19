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

  // อัปเดต Roles ของ User (Admin เท่านั้น)
  @Patch('users/:id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body('roles') roles: string[],
  ) {
    return this.authService.updateUserRoles(id, roles);
  }

  // เปิด/ปิดการใช้งาน User (Admin เท่านั้น)
  @Patch('users/:id/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async toggleUserActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.authService.toggleUserActive(id, isActive);
  }

  // ลบผู้ใช้ (Admin เท่านั้น)
  @NestDelete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
