import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { programs } from '../drizzle/schema';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private readonly drizzle: DrizzleService) {}

  /**
   * Create a new program
   */
  async create(createProgramDto: CreateProgramDto) {
    const result = await this.drizzle.db
      .insert(programs)
      .values({
        code: createProgramDto.code,
        nameTh: createProgramDto.name_th,
        degreeLevel: createProgramDto.degree_level,
        description: createProgramDto.description,
      })
      .returning();

    return result[0];
  }

  /**
   * Get all programs
   */
  async findAll() {
    return this.drizzle.db.select().from(programs).orderBy(programs.code);
  }

  /**
   * Get a single program by ID
   */
  async findOne(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(programs)
      .where(eq(programs.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`Program with ID "${id}" not found`);
    }

    return result[0];
  }

  /**
   * Get a single program by code (e.g., "social-sci")
   */
  async findByCode(code: string) {
    const result = await this.drizzle.db
      .select()
      .from(programs)
      .where(eq(programs.code, code));

    if (result.length === 0) {
      throw new NotFoundException(`Program with code "${code}" not found`);
    }

    return result[0];
  }

  /**
   * Update a program
   */
  async update(id: string, updateProgramDto: UpdateProgramDto) {
    // Check if exists first
    await this.findOne(id);

    const updateData: Partial<typeof programs.$inferInsert> = {};
    if (updateProgramDto.code) updateData.code = updateProgramDto.code;
    if (updateProgramDto.name_th) updateData.nameTh = updateProgramDto.name_th;
    if (updateProgramDto.degree_level)
      updateData.degreeLevel = updateProgramDto.degree_level;
    if (updateProgramDto.description !== undefined)
      updateData.description = updateProgramDto.description;

    const result = await this.drizzle.db
      .update(programs)
      .set(updateData)
      .where(eq(programs.id, id))
      .returning();

    return result[0];
  }

  /**
   * Delete a program
   */
  async remove(id: string) {
    // Check if exists first
    await this.findOne(id);

    await this.drizzle.db.delete(programs).where(eq(programs.id, id));

    return { deleted: true };
  }
}
