import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { CreateResumeRequestDto, ApproveResumeRequestDto } from './dto/create-resume-request.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 100;
    return this.staffService.findAll(pageNumber, limitNumber);
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
  updateAcademicPosition(
    @Param('id') id: string,
    @Body() dto: UpdatePositionDto,
  ) {
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

  // --- Resume & Speaker Bio Requests (PDPA Compliance) ---

  @Get('captcha-challenge')
  getCaptchaChallenge() {
    return this.staffService.generateCaptchaChallenge();
  }

  @Post('resume-requests')
  createResumeRequest(@Body() dto: CreateResumeRequestDto) {
    return this.staffService.createResumeRequest(dto);
  }

  @Get('resume-requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAllResumeRequests(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.staffService.findAllResumeRequests(pageNum, limitNum, status);
  }

  @Post('resume-requests/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  approveResumeRequest(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.staffService.approveResumeRequest(id, userId);
  }

  @Post('resume-requests/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  rejectResumeRequest(
    @Param('id') id: string,
    @Body() dto: ApproveResumeRequestDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.staffService.rejectResumeRequest(id, dto.rejectionReason || '', userId);
  }

  @Get(':id/resume-preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async previewResumePdf(@Param('id') id: string, @Res() res: any) {
    try {
      const { buffer, fileName } = await this.staffService.getResumePdfPreview(id);
      const encodedFileName = encodeURIComponent(fileName);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="official-speaker-bio.pdf"; filename*=UTF-8''${encodedFileName}`,
        'Content-Length': buffer.length.toString(),
      });
      return res.end(buffer);
    } catch (err: any) {
      console.error(`[previewResumePdf] Error generating preview for staffId ${id}:`, err);
      return res.status(err.status || 500).json({
        statusCode: err.status || 500,
        message: err.message || 'Error generating PDF preview',
      });
    }
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
