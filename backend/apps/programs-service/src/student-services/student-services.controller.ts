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
import { StudentServicesService } from './student-services.service';
import { CreateStudentServiceDto } from './dto/create-student-service.dto';
import { UpdateStudentServiceDto } from './dto/update-student-service.dto';
import { CreateStudentDocumentDto } from './dto/create-student-document.dto';
import { UpdateStudentDocumentDto } from './dto/update-student-document.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('student-services')
export class StudentServicesController {
  constructor(private readonly studentServicesService: StudentServicesService) {}

  // ==========================================
  // Public Endpoints
  // ==========================================

  @Get()
  findAll(@Query('category') category?: string) {
    return this.studentServicesService.findAll({
      category,
      onlyPublished: true,
    });
  }

  @Get('documents')
  findAllDocs(@Query('category') category?: string) {
    return this.studentServicesService.findAllDocs({
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
    return this.studentServicesService.findAllAdmin();
  }

  @Get('admin/documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllDocsAdmin() {
    return this.studentServicesService.findAllDocsAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createDto: CreateStudentServiceDto) {
    return this.studentServicesService.create(createDto);
  }

  @Post('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  createDoc(@Body() createDto: CreateStudentDocumentDto) {
    return this.studentServicesService.createDoc(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentServicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateStudentServiceDto,
  ) {
    return this.studentServicesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.studentServicesService.remove(id);
  }

  @Patch('documents/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  updateDoc(
    @Param('id') id: string,
    @Body() updateDto: UpdateStudentDocumentDto,
  ) {
    return this.studentServicesService.updateDoc(id, updateDto);
  }

  @Delete('documents/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  removeDoc(@Param('id') id: string) {
    return this.studentServicesService.removeDoc(id);
  }
}
