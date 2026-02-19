
import { Controller, Get, Post, Delete, Body, Param, Query, Put } from '@nestjs/common';
import { ChiangRaiService } from './chiang-rai.service';

@Controller('chiang-rai')
export class ChiangRaiController {
    constructor(private readonly service: ChiangRaiService) { }


    @Get('identities')
    async getIdentities() {
        return this.service.getAllIdentities();
    }

    @Get('stats')
    async getStats() {
        return this.service.getStats();
    }

    @Get('search')
    async search(@Query('q') q: string) {
        return this.service.search(q);
    }

    @Get('artifacts')
    async getArtifacts(
        @Query('category') category?: any,
        @Query('q') q?: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '12'
    ) {
        return this.service.getArtifacts(category, q, Number(page), Number(limit));
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

    @Put('artifacts/:id')
    async updateArtifact(@Param('id') id: string, @Body() body: any) {
        return this.service.updateArtifact(id, body);
    }

    @Delete('artifacts/:id')
    async deleteArtifact(@Param('id') id: string) {
        return this.service.deleteArtifact(id);
    }

    @Get('articles')
    async getArticles() {
        return this.service.getArticles();
    }

    @Get('articles/by-id/:id')
    async getArticleById(@Param('id') id: string) {
        return this.service.getArticleById(id);
    }

    @Get('articles/:slug')
    async getArticleBySlug(@Param('slug') slug: string) {
        return this.service.getArticleBySlug(slug);
    }

    @Post('articles')
    async createArticle(@Body() body: any) {
        return this.service.createArticle(body);
    }

    @Put('articles/:id')
    async updateArticle(@Param('id') id: string, @Body() body: any) {
        return this.service.updateArticle(id, body);
    }

    @Delete('articles/:id')
    async deleteArticle(@Param('id') id: string) {
        return this.service.deleteArticle(id);
    }


    @Get('activities')
    async getActivities(
        @Query('type') type?: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT',
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ) {
        return this.service.getActivities(type, Number(page), Number(limit));
    }

    @Get('activities/by-id/:id')
    async getActivityById(@Param('id') id: string) {
        return this.service.getActivityById(id);
    }

    @Get('activities/:slug')
    async getActivityBySlug(@Param('slug') slug: string) {
        return this.service.getActivityBySlug(slug);
    }

    @Post('activities')
    async createActivity(@Body() body: any) {
        return this.service.createActivity(body);
    }

    @Put('activities/:id')
    async updateActivity(@Param('id') id: string, @Body() body: any) {
        return this.service.updateActivity(id, body);
    }

    @Delete('activities/:id')
    async deleteActivity(@Param('id') id: string) {
        return this.service.deleteActivity(id);
    }

    @Get('staff')
    async getStaff() {
        return this.service.getStaff();
    }

    @Get('staff/:group')
    async getStaffByGroup(@Param('group') group: 'ADVISOR' | 'EXECUTIVE' | 'COMMITTEE') {
        return this.service.getStaffByGroup(group);
    }

    @Post('staff')
    async createStaff(@Body() body: any) {
        return this.service.createStaff(body);
    }

    @Put('staff/:id')
    async updateStaff(@Param('id') id: string, @Body() body: any) {
        return this.service.updateStaff(id, body);
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
    async importStaff(@Body() body: {
        facultyStaffId: string,
        staffGroup: 'EXECUTIVE' | 'COMMITTEE',
        position: string
    }) {
        return this.service.importStaffFromFaculty(body.facultyStaffId, body.staffGroup, body.position);
    }

    @Get('config')
    async getConfig() {
        return this.service.getConfig();
    }

    @Put('config')
    async updateConfig(@Body() body: any) {
        return this.service.updateConfig(body);
    }
}
