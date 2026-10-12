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
import { ShortCoursesService } from './short-courses.service';
import { CreateShortCourseDto } from './dto/create-short-course.dto';
import { UpdateShortCourseDto } from './dto/update-short-course.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('short-courses')
export class ShortCoursesController {
  constructor(private readonly shortCoursesService: ShortCoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createShortCourseDto: CreateShortCourseDto) {
    return this.shortCoursesService.create(createShortCourseDto);
  }

  @Get()
  findAll(
    @Query('isCreditBank') isCreditBank?: string,
    @Query('status') status?: string,
  ) {
    const isCreditBankBool =
      isCreditBank !== undefined ? isCreditBank === 'true' : undefined;

    return this.shortCoursesService.findAll({
      isCreditBank: isCreditBankBool,
      status,
      onlyActive: true,
    });
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllAdmin() {
    return this.shortCoursesService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortCoursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() updateShortCourseDto: UpdateShortCourseDto,
  ) {
    return this.shortCoursesService.update(id, updateShortCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string) {
    return this.shortCoursesService.remove(id);
  }
}
