import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, schema } from 'db/database';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { eq, desc, and, sql } from 'drizzle-orm';
import slugify from 'slugify';
import { UploadService } from 'upload/upload';

@Injectable()
export class NewsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  private generateSlug(title: string): string {
    const base = slugify(title, { lower: true, strict: true }) || 'news';
    return `${base}-${Date.now().toString().slice(-6)}`;
  }

  private collectManagedUrls(item: {
    thumbnailUrl?: string | null;
    mediaUrls?: string[] | null;
    attachments?: { fileUrl: string }[] | null;
  }): string[] {
    return [
      ...(item.thumbnailUrl ? [item.thumbnailUrl] : []),
      ...(item.mediaUrls || []).filter((url) =>
        url.startsWith('/uploads/news/'),
      ),
      ...(item.attachments || [])
        .map((attachment) => attachment.fileUrl)
        .filter((url) => url.startsWith('/uploads/news/')),
    ];
  }

  private async cleanupRemovedFiles(
    previousItem: {
      thumbnailUrl?: string | null;
      mediaUrls?: string[] | null;
      attachments?: { fileUrl: string }[] | null;
    },
    nextItem: {
      thumbnailUrl?: string | null;
      mediaUrls?: string[] | null;
      attachments?: { fileUrl: string }[] | null;
    },
  ) {
    const previousUrls = this.collectManagedUrls(previousItem);
    const nextUrls = new Set(this.collectManagedUrls(nextItem));
    const removedUrls = previousUrls.filter((url) => !nextUrls.has(url));
    await Promise.all(
      removedUrls.map((url) => this.uploadService.deleteNewsFile(url)),
    );
  }

  async create(createNewsDto: CreateNewsDto) {
    const slug = this.generateSlug(createNewsDto.title);
    const result = await this.databaseService.db
      .insert(schema.news)
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

  async findAllPublic(category?: string, page: number = 1, limit: number = 10) {
    let whereCondition = eq(schema.news.isPublished, true);
    if (category) {
      whereCondition = and(
        whereCondition,
        eq(schema.news.category, category as any),
      ) as any;
    }

    // Get total count
    const totalRecordsResult = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.news)
      .where(whereCondition);
    const total = Number(totalRecordsResult[0].count);

    // Get paginated data
    const items = await this.databaseService.db
      .select()
      .from(schema.news)
      .where(whereCondition)
      .orderBy(desc(schema.news.publishedAt), desc(schema.news.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllAdmin(page: number = 1, limit: number = 10) {
    const totalRecordsResult = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.news);
    const total = Number(totalRecordsResult[0].count);

    const items = await this.databaseService.db
      .select()
      .from(schema.news)
      .orderBy(desc(schema.news.publishedAt), desc(schema.news.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const result = await this.databaseService.db
      .select()
      .from(schema.news)
      .where(eq(schema.news.id, id));
    if (result.length === 0)
      throw new NotFoundException(`News with ID ${id} not found`);
    return result[0];
  }

  async findBySlug(slug: string) {
    const result = await this.databaseService.db
      .select()
      .from(schema.news)
      .where(
        and(eq(schema.news.slug, slug), eq(schema.news.isPublished, true)),
      );
    if (result.length === 0)
      throw new NotFoundException(`News with slug ${slug} not found`);
    return result[0];
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, user?: any) {
    const existing = await this.findOne(id);

    // If user is EDITOR (not ADMIN), check department scope if existing has departmentId
    if (user && !user.roles?.includes('ADMIN') && user.departmentId) {
      if (existing.departmentId && existing.departmentId !== user.departmentId) {
        throw new NotFoundException('คุณไม่มีสิทธิ์แก้ไขข่าวของหน่วยงานอื่น');
      }
    }

    const nextItem = {
      thumbnailUrl: updateNewsDto.thumbnailUrl ?? existing.thumbnailUrl,
      mediaUrls: updateNewsDto.mediaUrls ?? existing.mediaUrls,
      attachments: updateNewsDto.attachments ?? existing.attachments,
    };

    await this.cleanupRemovedFiles(existing, nextItem);

    // Editor cannot set directly to PUBLISHED unless admin
    let publicationStatus = updateNewsDto.publicationStatus ?? existing.publicationStatus;
    let isPublished = updateNewsDto.isPublished ?? existing.isPublished;

    if (user && !user.roles?.includes('ADMIN')) {
      if (updateNewsDto.publicationStatus === 'PUBLISHED') {
        publicationStatus = 'PENDING_REVIEW';
        isPublished = false;
      }
    }

    const result = await this.databaseService.db
      .update(schema.news)
      .set({
        ...updateNewsDto,
        publicationStatus,
        isPublished,
        mediaUrls: updateNewsDto.mediaUrls ?? existing.mediaUrls ?? [],
        attachments: updateNewsDto.attachments ?? existing.attachments ?? [],
        publishedAt:
          isPublished === false
            ? null
            : existing.publishedAt || new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();
    return result[0];
  }

  async submitForReview(id: string) {
    const existing = await this.findOne(id);
    const result = await this.databaseService.db
      .update(schema.news)
      .set({
        publicationStatus: 'PENDING_REVIEW',
        isPublished: false,
        rejectReason: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();
    return result[0];
  }

  async approve(id: string, reviewerId: string) {
    const result = await this.databaseService.db
      .update(schema.news)
      .set({
        publicationStatus: 'PUBLISHED',
        isPublished: true,
        reviewerId,
        reviewedAt: new Date(),
        publishedAt: new Date(),
        rejectReason: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();
    return result[0];
  }

  async reject(id: string, reviewerId: string, reason: string) {
    const result = await this.databaseService.db
      .update(schema.news)
      .set({
        publicationStatus: 'REJECTED',
        isPublished: false,
        reviewerId,
        reviewedAt: new Date(),
        rejectReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(schema.news.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string, user?: any) {
    const existing = await this.findOne(id);

    if (user && !user.roles?.includes('ADMIN') && user.departmentId) {
      if (existing.departmentId && existing.departmentId !== user.departmentId) {
        throw new NotFoundException('คุณไม่มีสิทธิ์ลบข่าวของหน่วยงานอื่น');
      }
    }

    await Promise.all(
      this.collectManagedUrls(existing).map((url) =>
        this.uploadService.deleteNewsFile(url),
      ),
    );
    await this.databaseService.db
      .delete(schema.news)
      .where(eq(schema.news.id, id));
    return { message: 'Deleted successfully' };
  }
}
