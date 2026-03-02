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
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  // --- Academic Positions ---

  @Get('academic-positions')
  findAllAcademicPositions() {
    return this.staffService.findAllAcademicPositions();
  }

  @Post('academic-positions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  createAcademicPosition(@Body() dto: CreatePositionDto) {
    return this.staffService.createAcademicPosition(dto);
  }

  @Patch('academic-positions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  updateAcademicPosition(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.staffService.updateAcademicPosition(+id, dto);
  }

  @Delete('academic-positions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  removeAcademicPosition(@Param('id') id: string) {
    return this.staffService.removeAcademicPosition(+id);
  }

  // --- Admin Positions ---

  @Get('admin-positions')
  findAllAdminPositions() {
    return this.staffService.findAllAdminPositions();
  }

  @Post('admin-positions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  createAdminPosition(@Body() dto: CreatePositionDto) {
    return this.staffService.createAdminPosition(dto);
  }

  @Patch('admin-positions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  updateAdminPosition(@Param('id') id: string, @Body() dto: UpdatePositionDto) {
    return this.staffService.updateAdminPosition(+id, dto);
  }

  @Delete('admin-positions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  removeAdminPosition(@Param('id') id: string) {
    return this.staffService.removeAdminPosition(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
