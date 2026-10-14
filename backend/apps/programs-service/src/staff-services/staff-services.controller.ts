import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StaffServicesService } from './staff-services.service';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { CreateStaffDocumentDto } from './dto/create-staff-document.dto';
import { UpdateStaffDocumentDto } from './dto/update-staff-document.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('staff-services')
export class StaffServicesController {
  constructor(private readonly staffServicesService: StaffServicesService) {}

  // ==========================================
  // Public Endpoints
  // ==========================================

  @Get()
  findAll(@Query('category') category?: string) {
    return this.staffServicesService.findAll({
      category,
      onlyPublished: true,
    });
  }

  @Get('documents')
  findAllDocs(@Query('category') category?: string) {
    return this.staffServicesService.findAllDocs({
      category,
      onlyPublished: true,
    });
  }

  // ==========================================
  // Admin Endpoints
  // ==========================================

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllAdmin() {
    return this.staffServicesService.findAllAdmin();
  }

  @Get('admin/documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllDocsAdmin() {
    return this.staffServicesService.findAllDocsAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createDto: CreateStaffServiceDto) {
    return this.staffServicesService.create(createDto);
  }

  @Post('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  createDoc(@Body() createDto: CreateStaffDocumentDto) {
    return this.staffServicesService.createDoc(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffServicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStaffServiceDto,
  ) {
    return this.staffServicesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.staffServicesService.remove(id);
  }

  @Patch('documents/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  updateDoc(
    @Param('id') id: string,
    @Body() updateDto: UpdateStaffDocumentDto,
  ) {
    return this.staffServicesService.updateDoc(id, updateDto);
  }

  @Delete('documents/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeDoc(@Param('id') id: string) {
    return this.staffServicesService.removeDoc(id);
  }
}
