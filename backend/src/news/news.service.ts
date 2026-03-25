import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { news } from '../drizzle/schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { eq, desc, and } from 'drizzle-orm';
import slugify from 'slugify';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class NewsService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly uploadService: UploadService,
  ) {}

  private generateSlug(title: string): string {
    return (
      slugify(title, { lower: true, strict: true }) +
      '-' +
      Date.now().toString().slice(-4)
    );
  }

  private collectManagedUrls(item: {
    thumbnailUrl?: string | null;
    mediaUrls?: string[] | null;
    attachments?: { fileUrl: string }[] | null;
  }): string[] {
    return [
      ...(item.thumbnailUrl ? [item.thumbnailUrl] : []),
      ...((item.mediaUrls || []).filter((url) => url.startsWith('/uploads/news/'))),
      ...((item.attachments || []).map((attachment) => attachment.fileUrl).filter((url) => url.startsWith('/uploads/news/'))),
    ];
  }

  private async cleanupRemovedFiles(previousItem: {
    thumbnailUrl?: string | null;
    mediaUrls?: string[] | null;
    attachments?: { fileUrl: string }[] | null;
  }, nextItem: {
    thumbnailUrl?: string | null;
    mediaUrls?: string[] | null;
    attachments?: { fileUrl: string }[] | null;
  }) {
    const previousUrls = this.collectManagedUrls(previousItem);
    const nextUrls = new Set(this.collectManagedUrls(nextItem));
    const removedUrls = previousUrls.filter((url) => !nextUrls.has(url));
    await Promise.all(removedUrls.map((url) => this.uploadService.deleteNewsFile(url)));
  }

  async create(createNewsDto: CreateNewsDto) {
    const slug = this.generateSlug(createNewsDto.title);
    const result = await this.drizzle.db
      .insert(news)
      .values({
        ...createNewsDto,
        slug,
        mediaUrls: createNewsDto.mediaUrls || [],
        attachments: createNewsDto.attachments || [],
        isPublished: createNewsDto.isPublished ?? true,
        publishedAt: createNewsDto.isPublished === false ? null : new Date(),
      })
      .returning();
    return result[0];
  }

  async findAllPublic(category?: string) {
    let whereCondition = eq(news.isPublished, true);
    if (category) {
      whereCondition = and(whereCondition, eq(news.category, category as any)) as any;
    }
    return this.drizzle.db
      .select()
      .from(news)
      .where(whereCondition)
      .orderBy(desc(news.publishedAt), desc(news.createdAt));
  }

  async findAllAdmin() {
    return this.drizzle.db.select().from(news).orderBy(desc(news.publishedAt), desc(news.createdAt));
  }

  async findOne(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(news)
      .where(eq(news.id, id));
    if (result.length === 0)
      throw new NotFoundException(`News with ID ${id} not found`);
    return result[0];
  }

  async findBySlug(slug: string) {
    const result = await this.drizzle.db
      .select()
      .from(news)
      .where(and(eq(news.slug, slug), eq(news.isPublished, true)));
    if (result.length === 0)
      throw new NotFoundException(`News with slug ${slug} not found`);
    return result[0];
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const existing = await this.findOne(id);
    const nextItem = {
      thumbnailUrl: updateNewsDto.thumbnailUrl ?? existing.thumbnailUrl,
      mediaUrls: updateNewsDto.mediaUrls ?? existing.mediaUrls,
      attachments: updateNewsDto.attachments ?? existing.attachments,
    };

    await this.cleanupRemovedFiles(existing, nextItem);

    const result = await this.drizzle.db
      .update(news)
      .set({
        ...updateNewsDto,
        mediaUrls: updateNewsDto.mediaUrls ?? existing.mediaUrls ?? [],
        attachments: updateNewsDto.attachments ?? existing.attachments ?? [],
        publishedAt:
          updateNewsDto.isPublished === false
            ? null
            : existing.publishedAt || new Date(),
        updatedAt: new Date(),
      })
      .where(eq(news.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    await Promise.all(this.collectManagedUrls(existing).map((url) => this.uploadService.deleteNewsFile(url)));
    await this.drizzle.db.delete(news).where(eq(news.id, id));
    return { message: 'Deleted successfully' };
  }
}
