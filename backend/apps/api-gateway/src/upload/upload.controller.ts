import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'upload/upload';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

const IMAGE_UPLOAD_LIMITS = { fileSize: 10 * 1024 * 1024 }; // 10 MB
const DOC_UPLOAD_LIMITS = { fileSize: 25 * 1024 * 1024 }; // 25 MB

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard) // Protect upload route
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('staff')
  @Roles('ADMIN', 'EDITOR', 'STAFF') // Allow staff to upload
  @UseInterceptors(FileInterceptor('file', { limits: IMAGE_UPLOAD_LIMITS }))
  async uploadStaffImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.saveStaffImage(file);
    return { url: imageUrl };
  }

  @Post('chiang-rai')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  @UseInterceptors(FileInterceptor('file', { limits: IMAGE_UPLOAD_LIMITS }))
  async uploadChiangRaiImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.saveChiangRaiImage(file);
    return { url: imageUrl };
  }

  @Post('research')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  @UseInterceptors(FileInterceptor('file', { limits: IMAGE_UPLOAD_LIMITS }))
  async uploadResearchImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.saveResearchImage(file);
    return { url: imageUrl };
  }

  @Post('news')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  @UseInterceptors(FileInterceptor('file', { limits: IMAGE_UPLOAD_LIMITS }))
  async uploadNewsImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.saveNewsImage(file);
    return { url: imageUrl };
  }

  @Post('news/attachment')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  @UseInterceptors(FileInterceptor('file', { limits: DOC_UPLOAD_LIMITS }))
  async uploadNewsAttachment(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.saveNewsAttachment(file);
  }

  @Post('course')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  @UseInterceptors(FileInterceptor('file', { limits: IMAGE_UPLOAD_LIMITS }))
  async uploadCourseImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.saveCourseImage(file);
    return { url: imageUrl };
  }

  @Post('banner')
  @Roles('ADMIN', 'EDITOR')
  @UseInterceptors(FileInterceptor('file', { limits: IMAGE_UPLOAD_LIMITS }))
  async uploadBannerImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.uploadService.saveBannerImage(file);
    return { url: imageUrl };
  }

  @Delete('banner')
  @Roles('ADMIN', 'EDITOR')
  async deleteBannerImage(@Body('url') url: string) {
    const deleted = await this.uploadService.deleteBannerImage(url);
    return { deleted };
  }

  @Delete('chiang-rai')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  async deleteChiangRaiImage(@Body('url') url: string) {
    const deleted = await this.uploadService.deleteChiangRaiImage(url);
    return { deleted };
  }

  @Delete('research')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  async deleteResearchImage(@Body('url') url: string) {
    const deleted = await this.uploadService.deleteResearchImage(url);
    return { deleted };
  }

  @Delete('news')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  async deleteNewsFile(@Body('url') url: string) {
    const deleted = await this.uploadService.deleteNewsFile(url);
    return { deleted };
  }

  @Post('programs')
  @Roles('ADMIN', 'EDITOR', 'STAFF') // Allow staff/editors to upload
  @UseInterceptors(FileInterceptor('file', { limits: DOC_UPLOAD_LIMITS }))
  async uploadProgramsFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.uploadService.saveProgramsFile(file);
    return { url: fileUrl };
  }

  @Delete('programs')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  async deleteProgramsFile(@Body('url') url: string) {
    const deleted = await this.uploadService.deleteProgramsFile(url);
    return { deleted };
  }

  @Post('procurement')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  @UseInterceptors(FileInterceptor('file', { limits: DOC_UPLOAD_LIMITS }))
  async uploadProcurementFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.saveProcurementFile(file);
  }

  @Delete('procurement')
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  async deleteProcurementFile(@Body('url') url: string) {
    const deleted = await this.uploadService.deleteProcurementFile(url);
    return { deleted };
  }
}
