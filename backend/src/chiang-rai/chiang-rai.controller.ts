
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ChiangRaiService } from './chiang-rai.service';

@Controller('chiang-rai')
export class ChiangRaiController {
    constructor(private readonly service: ChiangRaiService) { }

    @Get('identities')
    async getIdentities() {
        return this.service.getAllIdentities();
    }

    @Get('artifacts')
    async getArtifacts(@Query('category') category?: any) {
        return this.service.getArtifacts(category);
    }

    @Get('artifacts/:id')
    async getArtifactById(@Param('id') id: string) {
        return this.service.getArtifactById(id);
    }

    @Post('artifacts')
    async createArtifact(@Body() body: any) {
        // In production, add DTO validation here
        return this.service.createArtifact(body);
    }

    @Get('articles')
    async getArticles() {
        return this.service.getArticles();
    }

    @Get('articles/:slug')
    async getArticleBySlug(@Param('slug') slug: string) {
        return this.service.getArticleBySlug(slug);
    }

    @Get('staff')
    async getStaff() {
        return this.service.getStaff();
    }

    @Post('staff')
    async createStaff(@Body() body: any) {
        return this.service.createStaff(body);
    }

    @Delete('staff/:id')
    async deleteStaff(@Param('id') id: string) {
        return this.service.deleteStaff(id);
    }

    @Get('admin/faculty-staff')
    async getFacultyStaffList() {
        return this.service.getFacultyStaffList();
    }

    @Post('staff/import')
    async importStaff(@Body() body: { facultyStaffId: string, role: 'DIRECTOR' | 'ACADEMIC' | 'NETWORK' | 'DISSEMINATION' | 'SUPPORT' }) {
        return this.service.importStaffFromFaculty(body.facultyStaffId, body.role);
    }
}
