import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AcademicServicesService } from './academic-services.service';
import { CreateAcademicServiceDto } from './dto/create-academic-service.dto';
import { UpdateAcademicServiceDto } from './dto/update-academic-service.dto';
import { UpdateAcademicServiceConfigDto } from './dto/update-academic-service-config.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('academic-services')
export class AcademicServicesController {
  constructor(
    private readonly academicServicesService: AcademicServicesService,
  ) {}

  @Get()
  findAllPublic() {
    return this.academicServicesService.findAllPublic();
  }

  @Get('config')
  getConfig() {
    return this.academicServicesService.getConfig();
  }

  @Put('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  updateConfig(@Body() updateConfigDto: UpdateAcademicServiceConfigDto) {
    return this.academicServicesService.updateConfig(updateConfigDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAllAdmin(@Query('departmentId') departmentId?: string, @Req() req?: any) {
    let deptId = departmentId ? Number(departmentId) : undefined;
    if (req?.user && !req.user.roles?.includes('ADMIN') && req.user.roles?.includes('EDITOR')) {
      deptId = req.user.departmentId;
    }
    return this.academicServicesService.findAllAdmin(deptId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.academicServicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @Body() createAcademicServiceDto: CreateAcademicServiceDto,
    @Req() req: any,
  ) {
    return this.academicServicesService.create(createAcademicServiceDto, req?.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() updateAcademicServiceDto: UpdateAcademicServiceDto,
    @Req() req: any,
  ) {
    return this.academicServicesService.update(id, updateAcademicServiceDto, req?.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.academicServicesService.remove(id, req?.user);
  }
}
