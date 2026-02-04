import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly uploadDir = './uploads/staff';

    constructor() {
        // Ensure upload directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
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
                    withoutEnlargement: true
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

    async deleteImage(imageUrl: string): Promise<void> {
        if (!imageUrl) return;

        // Extract filename from URL (e.g., /uploads/staff/abc.png -> abc.png)
        const filename = path.basename(imageUrl);
        const filepath = path.join(this.uploadDir, filename);

        if (fs.existsSync(filepath)) {
            try {
                fs.unlinkSync(filepath);
                console.log(`Deleted file: ${filepath}`);
            } catch (error) {
                console.error(`Failed to delete file: ${filepath}`, error);
            }
        }
    }
}
