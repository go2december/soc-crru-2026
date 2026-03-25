import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { programs, programInstructors, staffProfiles, academicPositions } from '../drizzle/schema';
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

    // Handle initial instructors if any
    if (createProgramDto.instructors && createProgramDto.instructors.length > 0) {
      const inserts = createProgramDto.instructors.map((inst, index) => ({
        programId: program.id,
        staffId: inst.staffId,
        role: inst.role as any,
        sortOrder: inst.sortOrder ?? index,
      }));
      await this.drizzle.db.insert(programInstructors).values(inserts);
    }

    return this.findOne(program.id);
  }

  /**
   * Get all programs
   */
  async findAll() {
    const allPrograms = await this.drizzle.db.select().from(programs).orderBy(programs.code);
    return allPrograms;
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

    // Fetch instructors with staff details (JOIN)
    const instructorRows = await this.drizzle.db
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
      .leftJoin(academicPositions, eq(staffProfiles.academicPositionId, academicPositions.id))
      .where(eq(programInstructors.programId, program.id))
      .orderBy(programInstructors.sortOrder);

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

    // Fetch instructors with staff details (JOIN)
    const instructorRows = await this.drizzle.db
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
      .leftJoin(academicPositions, eq(staffProfiles.academicPositionId, academicPositions.id))
      .where(eq(programInstructors.programId, program.id))
      .orderBy(programInstructors.sortOrder);

    return { ...program, instructors: instructorRows };
  }

  /**
   * Update a program
   */
  async update(id: string, updateProgramDto: UpdateProgramDto) {
    // Check if exists first
    await this.findOne(id);

    const updateData: Partial<typeof programs.$inferInsert> = {};
    if (updateProgramDto.code !== undefined) updateData.code = updateProgramDto.code;
    if (updateProgramDto.name_th !== undefined) updateData.nameTh = updateProgramDto.name_th;
    if (updateProgramDto.degree_title_th !== undefined) updateData.degreeTitleTh = updateProgramDto.degree_title_th;
    if (updateProgramDto.degree_title_en !== undefined) updateData.degreeTitleEn = updateProgramDto.degree_title_en;
    if (updateProgramDto.degree_level !== undefined) updateData.degreeLevel = updateProgramDto.degree_level;
    if (updateProgramDto.banner_url !== undefined) updateData.bannerUrl = updateProgramDto.banner_url;
    if (updateProgramDto.curriculum_url !== undefined) updateData.curriculumUrl = updateProgramDto.curriculum_url;
    if (updateProgramDto.description !== undefined) updateData.description = updateProgramDto.description;
    if (updateProgramDto.structure !== undefined) updateData.structure = updateProgramDto.structure;
    if (updateProgramDto.careers !== undefined) updateData.careers = updateProgramDto.careers;
    if (updateProgramDto.highlights !== undefined) updateData.highlights = updateProgramDto.highlights;
    if (updateProgramDto.concentrations !== undefined) updateData.concentrations = updateProgramDto.concentrations;
    if (updateProgramDto.is_active !== undefined) updateData.isActive = updateProgramDto.is_active;
    if (updateProgramDto.gallery_images !== undefined) updateData.galleryImages = updateProgramDto.gallery_images;
    if (updateProgramDto.attachments !== undefined) updateData.attachments = updateProgramDto.attachments;
    if (updateProgramDto.youtube_video_url !== undefined) updateData.youtubeVideoUrl = updateProgramDto.youtube_video_url;
    if (updateProgramDto.facebook_video_url !== undefined) updateData.facebookVideoUrl = updateProgramDto.facebook_video_url;

    if (Object.keys(updateData).length > 0) {
      await this.drizzle.db
        .update(programs)
        .set(updateData)
        .where(eq(programs.id, id));
    }

    // Handle instructors mapping
    if (updateProgramDto.instructors !== undefined) {
      await this.drizzle.db.delete(programInstructors).where(eq(programInstructors.programId, id));

      if (updateProgramDto.instructors && updateProgramDto.instructors.length > 0) {
        const inserts = updateProgramDto.instructors.map((inst, index) => ({
          programId: id,
          staffId: inst.staffId,
          role: inst.role as any,
          sortOrder: inst.sortOrder ?? index,
        }));
        await this.drizzle.db.insert(programInstructors).values(inserts);
      }
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
}
