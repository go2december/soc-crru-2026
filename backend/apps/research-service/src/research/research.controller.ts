import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ResearchService } from './research.service';
import { CreateResearchProjectDto } from './dto/create-research-project.dto';
import { UpdateResearchProjectDto } from './dto/update-research-project.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get('projects')
  findAllPublic(
    @Query('q') q?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
    @Query('sdg') sdg?: string,
    @Query('fundingSource') fundingSource?: string,
    @Query('isSocialService') isSocialService?: string,
    @Query('isCommercial') isCommercial?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.researchService.findAllPublic({
      q,
      year: year ? Number(year) : undefined,
      status,
      sdg: sdg ? Number(sdg) : undefined,
      fundingSource,
      isSocialService,
      isCommercial,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('projects/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.researchService.findBySlug(slug);
  }

  @Get('attachments/:id/download')
  async downloadAttachment(@Param('id') id: string, @Res() res: any) {
    const result = await this.researchService.downloadAttachment(id);
    return res.redirect(result.fileUrl);
  }

  @Get('stats')
  getStats() {
    return this.researchService.getStats();
  }

  @Get('filters')
  getFilters() {
    return this.researchService.getFilters();
  }

  @Get('admin/projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAllAdmin(
    @Query('q') q?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
    @Query('isPublished') isPublished?: string,
    @Query('isSocialService') isSocialService?: string,
    @Query('isCommercial') isCommercial?: string,
    @Query('departmentId') departmentId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Req() req?: any,
  ) {
    // If editor, force their department
    let deptId = departmentId ? Number(departmentId) : undefined;
    if (req?.user && !req.user.roles?.includes('ADMIN') && req.user.roles?.includes('EDITOR')) {
      deptId = req.user.departmentId;
    }

    return this.researchService.findAllAdmin({
      q,
      year: year ? Number(year) : undefined,
      status,
      isPublished,
      isSocialService,
      isCommercial,
      departmentId: deptId,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('admin/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="research-export.csv"')
  async exportCsv(
    @Query('q') q?: string,
    @Query('year') year?: string,
    @Query('status') status?: string,
    @Query('isPublished') isPublished?: string,
    @Query('isSocialService') isSocialService?: string,
    @Query('isCommercial') isCommercial?: string,
    @Res() res?: any,
  ) {
    const csv = await this.researchService.exportAll({
      q,
      year: year ? Number(year) : undefined,
      status,
      isPublished,
      isSocialService,
      isCommercial,
    });
    return res.send(csv);
  }

  @Get('admin/projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findOneAdmin(@Param('id') id: string) {
    return this.researchService.findOneAdmin(id);
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() dto: CreateResearchProjectDto, @Req() req: any) {
    return this.researchService.create(dto, req?.user);
  }

  @Put('projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResearchProjectDto,
    @Req() req: any,
  ) {
    return this.researchService.update(id, dto, req?.user);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.researchService.remove(id, req?.user);
  }
}
