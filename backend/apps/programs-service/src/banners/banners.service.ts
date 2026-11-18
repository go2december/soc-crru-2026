import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, banners } from 'db/database';
import { UploadService } from 'upload/upload';
import { and, asc, eq, gte, isNull, lte, or } from 'drizzle-orm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    private readonly drizzle: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  async findAllPublic() {
    const now = new Date();
    return this.drizzle.db
      .select()
      .from(banners)
      .where(
        and(
          eq(banners.isActive, true),
          or(isNull(banners.startDate), lte(banners.startDate, now)),
          or(isNull(banners.endDate), gte(banners.endDate, now)),
        ),
      )
      .orderBy(asc(banners.order), asc(banners.id));
  }

  async findAllAdmin() {
    return this.drizzle.db
      .select()
      .from(banners)
      .orderBy(asc(banners.order), asc(banners.id));
  }

  async create(dto: CreateBannerDto) {
    const [created] = await this.drizzle.db
      .insert(banners)
      .values({
        title: dto.title || null,
        subtitle: dto.subtitle || null,
        badgeText: dto.badgeText || null,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl || null,
        order: dto.order ?? 0,
        isActive: dto.isActive ?? true,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      })
      .returning();
    return created;
  }

  async update(id: number, dto: UpdateBannerDto) {
    const [existing] = await this.drizzle.db
      .select()
      .from(banners)
      .where(eq(banners.id, id));

    if (!existing) {
      throw new NotFoundException(`Banner #${id} not found`);
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (dto.title !== undefined) updatePayload.title = dto.title || null;
    if (dto.subtitle !== undefined) updatePayload.subtitle = dto.subtitle || null;
    if (dto.badgeText !== undefined) updatePayload.badgeText = dto.badgeText || null;
    if (dto.imageUrl !== undefined) updatePayload.imageUrl = dto.imageUrl;
    if (dto.linkUrl !== undefined) updatePayload.linkUrl = dto.linkUrl || null;
    if (dto.order !== undefined) updatePayload.order = dto.order;
    if (dto.isActive !== undefined) updatePayload.isActive = dto.isActive;
    if (dto.startDate !== undefined) {
      updatePayload.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.endDate !== undefined) {
      updatePayload.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    const [updated] = await this.drizzle.db
      .update(banners)
      .set(updatePayload)
      .where(eq(banners.id, id))
      .returning();

    // Clean up old image if replaced
    if (
      dto.imageUrl &&
      existing.imageUrl &&
      dto.imageUrl !== existing.imageUrl
    ) {
      await this.uploadService.deleteBannerImage(existing.imageUrl);
    }

    return updated;
  }

  async reorder(items: { id: number; order: number }[]) {
    if (!Array.isArray(items) || items.length === 0) return [];

    await Promise.all(
      items.map((item) =>
        this.drizzle.db
          .update(banners)
          .set({ order: item.order, updatedAt: new Date() })
          .where(eq(banners.id, item.id)),
      ),
    );

    return this.findAllAdmin();
  }

  async remove(id: number) {
    const [existing] = await this.drizzle.db
      .select()
      .from(banners)
      .where(eq(banners.id, id));

    if (!existing) {
      throw new NotFoundException(`Banner #${id} not found`);
    }

    await this.drizzle.db.delete(banners).where(eq(banners.id, id));

    if (existing.imageUrl) {
      await this.uploadService.deleteBannerImage(existing.imageUrl);
    }

    return { deleted: true, id };
  }
}
