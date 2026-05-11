import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AcademicServicesService } from './academic-services.service';
import { CreateAcademicServiceDto } from './dto/create-academic-service.dto';
import { UpdateAcademicServiceDto } from './dto/update-academic-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('academic-services')
export class AcademicServicesController {
  constructor(private readonly academicServicesService: AcademicServicesService) {}

  @Get()
  findAllPublic() {
    return this.academicServicesService.findAllPublic();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAllAdmin() {
    return this.academicServicesService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicServicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createAcademicServiceDto: CreateAcademicServiceDto) {
    return this.academicServicesService.create(createAcademicServiceDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() updateAcademicServiceDto: UpdateAcademicServiceDto) {
    return this.academicServicesService.update(id, updateAcademicServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string) {
    return this.academicServicesService.remove(id);
  }
}
