import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect upload route
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('staff')
    @Roles('ADMIN', 'EDITOR', 'STAFF') // Allow staff to upload
    @UseInterceptors(FileInterceptor('file'))
    async uploadStaffImage(@UploadedFile() file: Express.Multer.File) {
        const imageUrl = await this.uploadService.saveStaffImage(file);
        return { url: imageUrl };
    }
}
