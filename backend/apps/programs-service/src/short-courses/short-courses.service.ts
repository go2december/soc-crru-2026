import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, shortCourses } from 'db/database';
import { CreateShortCourseDto } from './dto/create-short-course.dto';
import { UpdateShortCourseDto } from './dto/update-short-course.dto';
import { eq, desc, asc, and } from 'drizzle-orm';

@Injectable()
export class ShortCoursesService {
  constructor(private readonly drizzle: DatabaseService) {}

  async create(createShortCourseDto: CreateShortCourseDto) {
    const payload: any = {
      ...createShortCourseDto,
      price: createShortCourseDto.price !== undefined ? String(createShortCourseDto.price) : '0',
    };

    const result = await this.drizzle.db
      .insert(shortCourses)
      .values(payload)
      .returning();
    return result[0];
  }

  async findAll(options?: {
    isCreditBank?: boolean;
    status?: string;
    onlyActive?: boolean;
  }) {
    const conditions: any[] = [];

    if (options?.onlyActive !== false) {
      conditions.push(eq(shortCourses.isActive, true));
    }

    if (options?.isCreditBank !== undefined) {
      conditions.push(eq(shortCourses.isCreditBank, options.isCreditBank));
    }

    if (options?.status) {
      conditions.push(eq(shortCourses.status, options.status));
    }

    const query = this.drizzle.db.select().from(shortCourses);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query.orderBy(asc(shortCourses.sortOrder), desc(shortCourses.createdAt));
  }

  async findAllAdmin() {
    return await this.drizzle.db
      .select()
      .from(shortCourses)
      .orderBy(asc(shortCourses.sortOrder), desc(shortCourses.createdAt));
  }

  async findOne(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(shortCourses)
      .where(eq(shortCourses.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`Short course with ID ${id} not found`);
    }
    return result[0];
  }

  async update(id: string, updateShortCourseDto: UpdateShortCourseDto) {
    const payload: any = {
      ...updateShortCourseDto,
      updatedAt: new Date(),
    };

    if (updateShortCourseDto.price !== undefined) {
      payload.price = String(updateShortCourseDto.price);
    }

    const result = await this.drizzle.db
      .update(shortCourses)
      .set(payload)
      .where(eq(shortCourses.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Short course with ID ${id} not found`);
    }
    return result[0];
  }

  async remove(id: string) {
    const result = await this.drizzle.db
      .delete(shortCourses)
      .where(eq(shortCourses.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Short course with ID ${id} not found`);
    }
    return result[0];
  }
}
