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
  private readonly researchUploadDir = './uploads/research';
  private readonly procurementUploadDir = './uploads/procurement';
  private readonly coursesUploadDir = './uploads/courses';

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
    if (!fs.existsSync(this.researchUploadDir)) {
      fs.mkdirSync(this.researchUploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.procurementUploadDir)) {
      fs.mkdirSync(this.procurementUploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.coursesUploadDir)) {
      fs.mkdirSync(this.coursesUploadDir, { recursive: true });
    }
  }

  /**
   * Validates file buffer against known safe signatures (Magic Bytes)
   * Prevents executable or malicious payloads disguised as safe file extensions.
   */
  private validateMagicBytes(
    buffer: Buffer,
    allowedTypes: ('pdf' | 'image' | 'archive' | 'office')[],
  ): boolean {
    if (!buffer || buffer.length < 4) return false;

    // Disallow executable headers immediately: MZ (Windows PE/EXE/DLL) or ELF (Linux) or scripts
    const isWindowsExe = buffer[0] === 0x4d && buffer[1] === 0x5a; // "MZ"
    const isElfExe =
      buffer[0] === 0x7f &&
      buffer[1] === 0x45 &&
      buffer[2] === 0x4c &&
      buffer[3] === 0x46; // "\x7FELF"
    if (isWindowsExe || isElfExe) {
      throw new BadRequestException(
        'Security rejection: Executable binary files are strictly prohibited.',
      );
    }

    for (const type of allowedTypes) {
      if (type === 'pdf') {
        // PDF magic bytes: "%PDF-" -> 0x25 0x50 0x44 0x46
        if (
          buffer[0] === 0x25 &&
          buffer[1] === 0x50 &&
          buffer[2] === 0x44 &&
          buffer[3] === 0x46
        ) {
          return true;
        }
      }
      if (type === 'image') {
        // JPEG: FF D8 FF
        const isJpeg =
          buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        // PNG: 89 50 4E 47
        const isPng =
          buffer[0] === 0x89 &&
          buffer[1] === 0x50 &&
          buffer[2] === 0x4e &&
          buffer[3] === 0x47;
        // GIF: 47 49 46 38 ("GIF8")
        const isGif =
          buffer[0] === 0x47 &&
          buffer[1] === 0x49 &&
          buffer[2] === 0x46 &&
          buffer[3] === 0x38;
        // WebP: RIFF....WEBP (0x52 0x49 0x46 0x46 at 0, 0x57 0x45 0x42 0x50 at 8)
        const isWebp =
          buffer.length >= 12 &&
          buffer[0] === 0x52 &&
          buffer[1] === 0x49 &&
          buffer[2] === 0x46 &&
          buffer[3] === 0x46 &&
          buffer[8] === 0x57 &&
          buffer[9] === 0x45 &&
          buffer[10] === 0x42 &&
          buffer[11] === 0x50;

        if (isJpeg || isPng || isGif || isWebp) return true;
      }
      if (type === 'office' || type === 'archive') {
        // Zip / Office Open XML (DOCX, XLSX, PPTX): 50 4B 03 04 ("PK\x03\x04")
        if (
          buffer[0] === 0x50 &&
          buffer[1] === 0x4b &&
          buffer[2] === 0x03 &&
          buffer[3] === 0x04
        ) {
          return true;
        }
        // Legacy MS Office (DOC, XLS, PPT OLE2): D0 CF 11 E0
        if (
          buffer[0] === 0xd0 &&
          buffer[1] === 0xcf &&
          buffer[2] === 0x11 &&
          buffer[3] === 0xe0
        ) {
          return true;
        }
      }
    }

    return false;
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

    // Validate Magic Bytes (Allow PDF, Office documents, and safe images)
    const isSafeAttachment = this.validateMagicBytes(file.buffer, [
      'pdf',
      'office',
      'archive',
      'image',
    ]);
    if (!isSafeAttachment) {
      throw new BadRequestException(
        'Invalid or disallowed file content format. Allowed: PDF, Office Docs (DOCX, XLSX, PPTX), Safe Images.',
      );
    }

    // Fix Multer latin1 encoding issue for Thai characters
    const utf8OriginalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const sanitizedOriginalName = utf8OriginalName.replace(
      /[^a-zA-Z0-9ก-๙._-]/g,
      '_',
    );
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

  async saveResearchImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Unsupported file type');
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(this.researchUploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(1600, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(filepath);

      return `/uploads/research/${filename}`;
    } catch (error) {
      console.error('Research image processing error:', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  async deleteResearchImage(fileUrl: string): Promise<boolean> {
    if (!fileUrl || !fileUrl.startsWith('/uploads/research/')) {
      return false;
    }

    const filename = path.basename(fileUrl);
    const filepath = path.join(this.researchUploadDir, filename);

    try {
      await fs.promises.access(filepath);
      await fs.promises.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Delete research image error:', error);
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
    const utf8OriginalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const sanitizedOriginalName = utf8OriginalName.replace(
      /[^a-zA-Z0-9ก-๙._-]/g,
      '_',
    );
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
    } catch {
      return false;
    }
  }

  async saveProcurementFile(file: Express.Multer.File): Promise<{
    originalName: string;
    fileUrl: string;
    mimeType: string;
    size: number;
  }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.includes('pdf')) {
      throw new BadRequestException(
        'Only PDF files are allowed for procurement documents',
      );
    }

    // Validate Magic Bytes strictly for PDF (%PDF-)
    if (!this.validateMagicBytes(file.buffer, ['pdf'])) {
      throw new BadRequestException(
        'Security rejection: Uploaded file is not a valid PDF document.',
      );
    }

    const utf8OriginalName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8',
    );
    const sanitizedOriginalName = utf8OriginalName.replace(
      /[^a-zA-Z0-9ก-๙._-]/g,
      '_',
    );
    const filename = `${uuidv4()}-${sanitizedOriginalName}`;
    const filepath = path.join(this.procurementUploadDir, filename);

    try {
      await fs.promises.writeFile(filepath, file.buffer);
      return {
        originalName: utf8OriginalName,
        fileUrl: `/uploads/procurement/${filename}`,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error('Procurement file save error:', error);
      throw new BadRequestException('Failed to save procurement document');
    }
  }

  async deleteProcurementFile(fileUrl: string): Promise<boolean> {
    if (!fileUrl || !fileUrl.startsWith('/uploads/procurement/')) {
      return false;
    }

    const relativePath = fileUrl.replace(/^\/uploads\//, '');
    const filepath = path.join(process.cwd(), 'uploads', relativePath);

    try {
      await fs.promises.access(filepath);
      await fs.promises.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Delete procurement file error:', error);
      return false;
    }
  }

  async saveCourseImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      throw new BadRequestException('Unsupported file type');
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(this.coursesUploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(1200, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      return `/uploads/courses/${filename}`;
    } catch (error) {
      console.error('Course image processing error:', error);
      throw new BadRequestException('Failed to process course image');
    }
  }
}
