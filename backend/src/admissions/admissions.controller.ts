import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  // ==========================
  // CONFIG
  // ==========================
  @Get('config')
  getConfig() {
    return this.admissionsService.getConfig();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('config')
  updateConfig(@Body() body: any) {
    return this.admissionsService.updateConfig(body);
  }

  // ==========================
  // SCHEDULES
  // ==========================
  @Get('schedules')
  getSchedules() {
    return this.admissionsService.getSchedules();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('schedules')
  createSchedule(@Body() body: any) {
    return this.admissionsService.createSchedule(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('schedules/order')
  updateSchedulesOrder(@Body() body: any[]) {
    return this.admissionsService.updateSchedulesOrder(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('schedules/:id')
  updateSchedule(@Param('id') id: string, @Body() body: any) {
    return this.admissionsService.updateSchedule(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('schedules/:id')
  deleteSchedule(@Param('id') id: string) {
    return this.admissionsService.deleteSchedule(id);
  }

  // ==========================
  // DOCUMENTS
  // ==========================
  @Get('documents')
  getDocuments() {
    return this.admissionsService.getDocuments();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('documents')
  createDocument(@Body() body: any) {
    return this.admissionsService.createDocument(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('documents/order')
  updateDocumentsOrder(@Body() body: any[]) {
    return this.admissionsService.updateDocumentsOrder(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('documents/:id')
  updateDocument(@Param('id') id: string, @Body() body: any) {
    return this.admissionsService.updateDocument(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('documents/:id')
  deleteDocument(@Param('id') id: string) {
    return this.admissionsService.deleteDocument(id);
  }
}
