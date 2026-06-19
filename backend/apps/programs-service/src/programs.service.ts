import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import {
  DatabaseService,
  programs,
  programInstructors,
  staffProfiles,
  academicPositions,
} from 'db/database';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(private readonly drizzle: DatabaseService) {}

  /**
   * Create a new program
   */
  async create(createProgramDto: CreateProgramDto) {
    const result = await this.drizzle.db
      .insert(programs)
      .values({
        code: createProgramDto.code,
        nameTh: createProgramDto.name_th,
        degreeTitleTh: createProgramDto.degree_title_th,
        degreeTitleEn: createProgramDto.degree_title_en,
        degreeLevel: createProgramDto.degree_level,
        bannerUrl: createProgramDto.banner_url,
        curriculumUrl: createProgramDto.curriculum_url,
        description: createProgramDto.description,
        structure: createProgramDto.structure,
        careers: createProgramDto.careers,
        highlights: createProgramDto.highlights,
        concentrations: createProgramDto.concentrations,
        isActive: createProgramDto.is_active ?? true,
        galleryImages: createProgramDto.gallery_images,
        attachments: createProgramDto.attachments,
        youtubeVideoUrl: createProgramDto.youtube_video_url,
        facebookVideoUrl: createProgramDto.facebook_video_url,
      })
      .returning();

    const program = result[0];

    // Sync instructors if provided
    await this.syncInstructors(program.id, createProgramDto.instructors);

    return this.findOne(program.id);
  }

  /**
   * Get all programs
   */
  async findAll(page: number = 1, limit: number = 100) {
    const offset = (page - 1) * limit;

    const data = await this.drizzle.db
      .select()
      .from(programs)
      .orderBy(programs.code)
      .limit(limit)
      .offset(offset);

    const countResult = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(programs);
    const totalCount = Number(countResult[0].count);

    return {
      data,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /**
   * Get a single program by ID with instructors
   */
  async findOne(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(programs)
      .where(eq(programs.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`Program with ID "${id}" not found`);
    }

    const program = result[0];

    const instructorRows = await this.getInstructors(program.id);

    return { ...program, instructors: instructorRows };
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

    const program = result[0];

    const instructorRows = await this.getInstructors(program.id);

    return { ...program, instructors: instructorRows };
  }

  /**
   * Update a program
   */
  async update(id: string, updateProgramDto: UpdateProgramDto) {
    // Check if exists first
    await this.findOne(id);

    const updateData: Partial<typeof programs.$inferInsert> = {};
    if (updateProgramDto.code !== undefined)
      updateData.code = updateProgramDto.code;
    if (updateProgramDto.name_th !== undefined)
      updateData.nameTh = updateProgramDto.name_th;
    if (updateProgramDto.degree_title_th !== undefined)
      updateData.degreeTitleTh = updateProgramDto.degree_title_th;
    if (updateProgramDto.degree_title_en !== undefined)
      updateData.degreeTitleEn = updateProgramDto.degree_title_en;
    if (updateProgramDto.degree_level !== undefined)
      updateData.degreeLevel = updateProgramDto.degree_level;
    if (updateProgramDto.banner_url !== undefined)
      updateData.bannerUrl = updateProgramDto.banner_url;
    if (updateProgramDto.curriculum_url !== undefined)
      updateData.curriculumUrl = updateProgramDto.curriculum_url;
    if (updateProgramDto.description !== undefined)
      updateData.description = updateProgramDto.description;
    if (updateProgramDto.structure !== undefined)
      updateData.structure = updateProgramDto.structure;
    if (updateProgramDto.careers !== undefined)
      updateData.careers = updateProgramDto.careers;
    if (updateProgramDto.highlights !== undefined)
      updateData.highlights = updateProgramDto.highlights;
    if (updateProgramDto.concentrations !== undefined)
      updateData.concentrations = updateProgramDto.concentrations;
    if (updateProgramDto.is_active !== undefined)
      updateData.isActive = updateProgramDto.is_active;
    if (updateProgramDto.gallery_images !== undefined)
      updateData.galleryImages = updateProgramDto.gallery_images;
    if (updateProgramDto.attachments !== undefined)
      updateData.attachments = updateProgramDto.attachments;
    if (updateProgramDto.youtube_video_url !== undefined)
      updateData.youtubeVideoUrl = updateProgramDto.youtube_video_url;
    if (updateProgramDto.facebook_video_url !== undefined)
      updateData.facebookVideoUrl = updateProgramDto.facebook_video_url;

    if (Object.keys(updateData).length > 0) {
      await this.drizzle.db
        .update(programs)
        .set(updateData)
        .where(eq(programs.id, id));
    }

    // Handle instructors mapping
    if (updateProgramDto.instructors !== undefined) {
      await this.drizzle.db
        .delete(programInstructors)
        .where(eq(programInstructors.programId, id));

      await this.syncInstructors(id, updateProgramDto.instructors);
    }

    return this.findOne(id);
  }

  /**
   * Delete a program
   */
  async remove(id: string) {
    // Check if exists first
    await this.findOne(id);

    // program_instructors will cascade delete based on schema
    await this.drizzle.db.delete(programs).where(eq(programs.id, id));

    return { deleted: true };
  }
  private async getInstructors(programId: string) {
    return await this.drizzle.db
      .select({
        id: programInstructors.id,
        programId: programInstructors.programId,
        staffId: programInstructors.staffId,
        role: programInstructors.role,
        sortOrder: programInstructors.sortOrder,
        prefixTh: staffProfiles.prefixTh,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
        prefixEn: staffProfiles.prefixEn,
        firstNameEn: staffProfiles.firstNameEn,
        lastNameEn: staffProfiles.lastNameEn,
        imageUrl: staffProfiles.imageUrl,
        academicPositionNameTh: academicPositions.nameTh,
      })
      .from(programInstructors)
      .leftJoin(staffProfiles, eq(programInstructors.staffId, staffProfiles.id))
      .leftJoin(
        academicPositions,
        eq(staffProfiles.academicPositionId, academicPositions.id),
      )
      .where(eq(programInstructors.programId, programId))
      .orderBy(programInstructors.sortOrder);
  }
  /**
   * Synchronize instructors for a program.
   * If instructors array is provided, existing instructors are cleared and new ones inserted.
   */
  private async syncInstructors(programId: string, instructors?: any[]) {
    // Remove existing instructors
    await this.drizzle.db
      .delete(programInstructors)
      .where(eq(programInstructors.programId, programId));
    // Insert new instructors if any
    if (instructors && instructors.length > 0) {
      const inserts = instructors.map((inst, index) => ({
        programId,
        staffId: inst.staffId,
        role: inst.role,
        sortOrder: inst.sortOrder ?? index,
      }));
      await this.drizzle.db.insert(programInstructors).values(inserts);
    }
  }
}
