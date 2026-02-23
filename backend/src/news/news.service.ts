import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { news } from '../drizzle/schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { eq, desc } from 'drizzle-orm';
import slugify from 'slugify';

@Injectable()
export class NewsService {
  constructor(private readonly drizzle: DrizzleService) {}

  private generateSlug(title: string): string {
    return (
      slugify(title, { lower: true, strict: true }) +
      '-' +
      Date.now().toString().slice(-4)
    );
  }

  async create(createNewsDto: CreateNewsDto) {
    const slug = this.generateSlug(createNewsDto.title);
    const result = await this.drizzle.db
      .insert(news)
      .values({
        ...createNewsDto,
        slug,
        isPublished: true, // Default publish
        publishedAt: new Date(),
      })
      .returning();
    return result[0];
  }

  async findAll() {
    return this.drizzle.db.select().from(news).orderBy(desc(news.publishedAt));
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
      .where(eq(news.slug, slug));
    if (result.length === 0)
      throw new NotFoundException(`News with slug ${slug} not found`);
    return result[0];
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) {
    const existing = await this.findOne(id); // Check existence
    const result = await this.drizzle.db
      .update(news)
      .set({ ...updateNewsDto, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return result[0];
  }

  async remove(id: string) {
    const existing = await this.findOne(id); // Check existence
    await this.drizzle.db.delete(news).where(eq(news.id, id));
    return { message: 'Deleted successfully' };
  }
}
