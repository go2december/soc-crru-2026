import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';
import { Req } from '@nestjs/common';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  /**
   * POST /programs - Create a new program
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createProgramDto: CreateProgramDto, @Req() req: any) {
    return this.programsService.create(createProgramDto, req?.user);
  }

  /**
   * GET /programs - Get all programs
   */
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('departmentId') departmentId?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 100;
    const deptIdNumber = departmentId ? parseInt(departmentId, 10) : undefined;
    return this.programsService.findAll(pageNumber, limitNumber, deptIdNumber);
  }

  /**
   * GET /programs/:id - Get a program by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  /**
   * GET /programs/code/:code - Get a program by code (e.g., "social-sci")
   */
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.programsService.findByCode(code);
  }

  /**
   * PATCH /programs/:id - Update a program
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
    @Req() req: any,
  ) {
    return this.programsService.update(id, updateProgramDto, req?.user);
  }

  /**
   * DELETE /programs/:id - Delete a program
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.programsService.remove(id, req?.user);
  }
  /**
   * GET /programs/code/:code/tracks/:trackCode - Get a single track by program code and track code
   */
  @Get('code/:code/tracks/:trackCode')
  findTrackByCode(
    @Param('code') code: string,
    @Param('trackCode') trackCode: string,
  ) {
    return this.programsService.findTrackByCode(code, trackCode);
  }

  /**
   * GET /programs/:id/tracks - Get all tracks of a program
   */
  @Get(':id/tracks')
  getTracks(@Param('id') id: string) {
    return this.programsService.getTracks(id);
  }

  /**
   * POST /programs/:id/tracks - Create a track for a program
   */
  @Post(':id/tracks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  createTrack(
    @Param('id') id: string,
    @Body() trackDto: any,
    @Req() req: any,
  ) {
    return this.programsService.createTrack(id, trackDto, req?.user);
  }

  /**
   * PATCH /programs/tracks/:trackId - Update a track
   */
  @Patch('tracks/:trackId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  updateTrack(
    @Param('trackId') trackId: string,
    @Body() trackDto: any,
    @Req() req: any,
  ) {
    return this.programsService.updateTrack(trackId, trackDto, req?.user);
  }

  /**
   * DELETE /programs/tracks/:trackId - Delete a track
   */
  @Delete('tracks/:trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  removeTrack(@Param('trackId') trackId: string, @Req() req: any) {
    return this.programsService.removeTrack(trackId, req?.user);
  }

}
