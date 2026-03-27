import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads/staff';
  private readonly chiangRaiUploadDir = './uploads/chiang-rai';
  private readonly newsUploadDir = './uploads/news';
  private readonly newsAttachmentUploadDir = './uploads/news/attachments';
  private readonly programsUploadDir = './uploads/programs';

  constructor() {
    // Ensure upload directories exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.chiangRaiUploadDir)) {
      fs.mkdirSync(this.chiangRaiUploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.newsUploadDir)) {
      fs.mkdirSync(this.newsUploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.newsAttachmentUploadDir)) {
      fs.mkdirSync(this.newsAttachmentUploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.programsUploadDir)) {
      fs.mkdirSync(this.programsUploadDir, { recursive: true });
    }
  }

  async saveNewsImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Unsupported file type');
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(this.newsUploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(1600, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(filepath);

      return `/uploads/news/${filename}`;
    } catch (error) {
      console.error('News image processing error:', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  async saveNewsAttachment(file: Express.Multer.File): Promise<{
    originalName: string;
    fileUrl: string;
    mimeType: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Fix Multer latin1 encoding issue for Thai characters
    const utf8OriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const sanitizedOriginalName = utf8OriginalName.replace(/[^a-zA-Z0-9ก-๙._-]/g, '_');
    const filename = `${uuidv4()}-${sanitizedOriginalName}`;
    const filepath = path.join(this.newsAttachmentUploadDir, filename);

    try {
      await fs.promises.writeFile(filepath, file.buffer);
      return {
        originalName: utf8OriginalName,
        fileUrl: `/uploads/news/attachments/${filename}`,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error('News attachment save error:', error);
      throw new BadRequestException('Failed to save attachment');
    }
  }

  async deleteNewsFile(fileUrl: string): Promise<boolean> {
    if (
      !fileUrl ||
      (!fileUrl.startsWith('/uploads/news/') &&
        !fileUrl.startsWith('/uploads/news/attachments/'))
    ) {
      return false;
    }

    const relativePath = fileUrl.replace(/^\/uploads\//, '');
    const filepath = path.join(process.cwd(), 'uploads', relativePath);

    try {
      await fs.promises.access(filepath);
      await fs.promises.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Delete news file error:', error);
      return false;
    }
  }

  async saveChiangRaiImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Unsupported file type');
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(this.chiangRaiUploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(1024, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(filepath);

      return `/uploads/chiang-rai/${filename}`;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  async deleteChiangRaiImage(fileUrl: string): Promise<boolean> {
    // Only delete files from our uploads directory
    if (!fileUrl || !fileUrl.startsWith('/uploads/chiang-rai/')) {
      return false;
    }

    const filename = path.basename(fileUrl);
    const filepath = path.join(this.chiangRaiUploadDir, filename);

    try {
      await fs.promises.access(filepath);
      await fs.promises.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      return false;
    }
  }

  async deleteStaffImage(fileUrl: string): Promise<boolean> {
    // Only delete files from our uploads directory
    if (!fileUrl || !fileUrl.startsWith('/uploads/staff/')) {
      return false;
    }

    const filename = path.basename(fileUrl);
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.promises.access(filepath);
      await fs.promises.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      return false;
    }
  }

  async saveStaffImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate image type (basic check)
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new BadRequestException('Unsupported file type');
    }

    const filename = `${uuidv4()}.png`;
    const filepath = path.join(this.uploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(768, 1024, {
          fit: 'inside', // Ensures dimensions do not exceed 768x1024 while maintaining aspect ratio
          withoutEnlargement: true,
        })
        .png({ quality: 80, compressionLevel: 9 }) // Compress as PNG
        .toFile(filepath);

      // Return relative URL path (assuming served from root/uploads)
      return `/uploads/staff/${filename}`;
    } catch (error) {
      console.error('Image processing error:', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  async saveProgramsFile(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('No file uploaded');
    
    // Fix Multer latin1 encoding issue for Thai characters
    const utf8OriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const sanitizedOriginalName = utf8OriginalName.replace(/[^a-zA-Z0-9ก-๙._-]/g, '_');
    const filename = `${uuidv4()}-${sanitizedOriginalName}`;
    const baseFilepath = path.join(this.programsUploadDir, filename);

    try {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        await sharp(file.buffer)
          .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(baseFilepath + '.webp');
        return `/uploads/programs/${filename}.webp`;
      } else {
        await fs.promises.writeFile(baseFilepath, file.buffer);
        return `/uploads/programs/${filename}`;
      }
    } catch (error) {
      console.error('Programs file processing error:', error);
      throw new BadRequestException('Failed to process programs file');
    }
  }

  async deleteProgramsFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl || !fileUrl.startsWith('/uploads/programs/')) return false;
    const filename = path.basename(fileUrl);
    const filepath = path.join(this.programsUploadDir, filename);
    try {
      await fs.promises.access(filepath);
      await fs.promises.unlink(filepath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
