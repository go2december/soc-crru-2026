import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { eq, sql, and } from 'drizzle-orm';
import {
  DatabaseService,
  programs,
  programInstructors,
  programTracks,
  staffProfiles,
  academicPositions,
} from 'db/database';
import { UploadService } from 'upload/upload';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    private readonly drizzle: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  private collectProgramUrls(
    item?: {
      bannerUrl?: string | null;
      curriculumUrl?: string | null;
      galleryImages?: string[] | null;
      attachments?: { fileUrl: string }[] | null;
    } | null,
  ): string[] {
    if (!item) return [];
    const urls = new Set<string>();
    for (const u of [
      item.bannerUrl,
      item.curriculumUrl,
      ...(item.galleryImages ?? []),
      ...(item.attachments?.map((a) => a.fileUrl) ?? []),
    ]) {
      if (u && u.startsWith('/uploads/programs/')) {
        urls.add(u);
      }
    }
    return [...urls];
  }

  private async cleanupProgramFiles(
    prev?: Parameters<ProgramsService['collectProgramUrls']>[0],
    next?: Parameters<ProgramsService['collectProgramUrls']>[0],
  ): Promise<void> {
    const nextUrls = new Set(this.collectProgramUrls(next));
    for (const url of this.collectProgramUrls(prev)) {
      if (!nextUrls.has(url)) {
        await this.uploadService.deleteProgramsFile(url);
      }
    }
  }

  /**
   * Helper to check department scope for non-admins
   */
  private checkScope(user: any, targetDepartmentId?: number | null) {
    if (!user) return;
    const roles: string[] = user.roles || [];
    if (roles.includes('ADMIN')) return; // Super admin bypass

    if (roles.includes('EDITOR') || roles.includes('STAFF')) {
      const userDept = user.departmentId;
      if (!userDept || userDept !== targetDepartmentId) {
        throw new ForbiddenException(
          'คุณไม่มีสิทธิ์จัดการหลักสูตรนอกสังกัดสาขาวิชาของคุณ',
        );
      }
    }
  }

  /**
   * Create a new program
   */
  async create(createProgramDto: CreateProgramDto, user?: any) {
    // If editor, enforce user's department
    let targetDeptId = createProgramDto.department_id;
    if (user && !user.roles?.includes('ADMIN') && user.roles?.includes('EDITOR')) {
      targetDeptId = user.departmentId;
    }

    const result = await this.drizzle.db
      .insert(programs)
      .values({
        departmentId: targetDeptId,
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
        socialLinks: createProgramDto.social_links,
      })
      .returning();

    const program = result[0];

    // Sync instructors if provided
    await this.syncInstructors(program.id, createProgramDto.instructors);

    return this.findOne(program.id);
  }

  /**
   * Get all programs (optional department filter)
   */
  async findAll(page: number = 1, limit: number = 100, departmentId?: number) {
    const offset = (page - 1) * limit;

    const condition = departmentId
      ? eq(programs.departmentId, departmentId)
      : undefined;

    const data = await this.drizzle.db
      .select()
      .from(programs)
      .where(condition)
      .orderBy(programs.code)
      .limit(limit)
      .offset(offset);

    const countResult = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(programs)
      .where(condition);
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
    const trackRows = await this.getTracks(program.id);

    return { ...program, instructors: instructorRows, tracks: trackRows };
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
    const trackRows = await this.getTracks(program.id);

    return { ...program, instructors: instructorRows, tracks: trackRows };
  }

  /**
   * Update a program
   */
  async update(id: string, updateProgramDto: UpdateProgramDto, user?: any) {
    // Check if exists first
    const existing = await this.findOne(id);
    this.checkScope(user, existing.departmentId);

    const updateData: Partial<typeof programs.$inferInsert> = {};
    if (updateProgramDto.department_id !== undefined && user?.roles?.includes('ADMIN')) {
      updateData.departmentId = updateProgramDto.department_id;
    }
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
    if (updateProgramDto.social_links !== undefined)
      updateData.socialLinks = updateProgramDto.social_links;

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

    const updated = await this.findOne(id);
    await this.cleanupProgramFiles(existing, updated);
    return updated;
  }

  /**
   * Delete a program
   */
  async remove(id: string, user?: any) {
    // Check if exists first
    const existing = await this.findOne(id);
    this.checkScope(user, existing.departmentId);

    // program_instructors will cascade delete based on schema
    await this.drizzle.db.delete(programs).where(eq(programs.id, id));
    await this.cleanupProgramFiles(existing);

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
  async getTracks(programId: string) {
    return await this.drizzle.db
      .select()
      .from(programTracks)
      .where(and(eq(programTracks.programId, programId), eq(programTracks.isActive, true)))
      .orderBy(programTracks.sortOrder);
  }

  async findTrackByCode(programCode: string, trackCode: string) {
    const progRes = await this.drizzle.db
      .select()
      .from(programs)
      .where(eq(programs.code, programCode));
    if (progRes.length === 0) {
      throw new NotFoundException(`Program with code "${programCode}" not found`);
    }
    const program = progRes[0];

    const trackRes = await this.drizzle.db
      .select()
      .from(programTracks)
      .where(
        and(
          eq(programTracks.programId, program.id),
          eq(programTracks.code, trackCode),
          eq(programTracks.isActive, true),
        ),
      );

    if (trackRes.length === 0) {
      throw new NotFoundException(
        `Track with code "${trackCode}" not found under program "${programCode}"`,
      );
    }

    const instructorRows = await this.getInstructors(program.id);
    return {
      ...trackRes[0],
      program: {
        id: program.id,
        code: program.code,
        nameTh: program.nameTh,
        degreeLevel: program.degreeLevel,
      },
      instructors: instructorRows,
    };
  }

  async createTrack(programId: string, trackDto: any, user?: any) {
    const prog = await this.findOne(programId);
    this.checkScope(user, prog.departmentId);

    const inserted = await this.drizzle.db
      .insert(programTracks)
      .values({
        programId,
        code: trackDto.code,
        nameTh: trackDto.name_th || trackDto.nameTh,
        nameEn: trackDto.name_en || trackDto.nameEn,
        trackType: trackDto.track_type || trackDto.trackType || 'MAJOR',
        studyPlanType: trackDto.study_plan_type || trackDto.studyPlanType || 'REGULAR_4YR',
        degreeTitleTh: trackDto.degree_title_th || trackDto.degreeTitleTh,
        degreeTitleEn: trackDto.degree_title_en || trackDto.degreeTitleEn,
        description: trackDto.description,
        structure: trackDto.structure,
        careers: trackDto.careers,
        highlights: trackDto.highlights,
        bannerUrl: trackDto.banner_url || trackDto.bannerUrl,
        curriculumUrl: trackDto.curriculum_url || trackDto.curriculumUrl,
        youtubeVideoUrl: trackDto.youtube_video_url || trackDto.youtubeVideoUrl,
        facebookVideoUrl: trackDto.facebook_video_url || trackDto.facebookVideoUrl,
        socialLinks: trackDto.social_links || trackDto.socialLinks,
        galleryImages: trackDto.gallery_images || trackDto.galleryImages,
        attachments: trackDto.attachments,
        sortOrder: trackDto.sort_order ?? trackDto.sortOrder ?? 0,
        isActive: trackDto.is_active ?? trackDto.isActive ?? true,
      })
      .returning();

    return inserted[0];
  }

  async updateTrack(trackId: string, trackDto: any, user?: any) {
    const existing = await this.drizzle.db
      .select()
      .from(programTracks)
      .where(eq(programTracks.id, trackId));

    if (existing.length === 0) {
      throw new NotFoundException(`Track with ID "${trackId}" not found`);
    }

    const track = existing[0];
    const prog = await this.findOne(track.programId);
    this.checkScope(user, prog.departmentId);

    const updateData: any = { updatedAt: new Date() };
    if (trackDto.code !== undefined) updateData.code = trackDto.code;
    if (trackDto.name_th !== undefined) updateData.nameTh = trackDto.name_th;
    if (trackDto.nameTh !== undefined) updateData.nameTh = trackDto.nameTh;
    if (trackDto.name_en !== undefined) updateData.nameEn = trackDto.name_en;
    if (trackDto.nameEn !== undefined) updateData.nameEn = trackDto.nameEn;
    if (trackDto.track_type !== undefined) updateData.trackType = trackDto.track_type;
    if (trackDto.trackType !== undefined) updateData.trackType = trackDto.trackType;
    if (trackDto.study_plan_type !== undefined) updateData.studyPlanType = trackDto.study_plan_type;
    if (trackDto.studyPlanType !== undefined) updateData.studyPlanType = trackDto.studyPlanType;
    if (trackDto.degree_title_th !== undefined) updateData.degreeTitleTh = trackDto.degree_title_th;
    if (trackDto.degreeTitleTh !== undefined) updateData.degreeTitleTh = trackDto.degreeTitleTh;
    if (trackDto.degree_title_en !== undefined) updateData.degreeTitleEn = trackDto.degree_title_en;
    if (trackDto.degreeTitleEn !== undefined) updateData.degreeTitleEn = trackDto.degreeTitleEn;
    if (trackDto.description !== undefined) updateData.description = trackDto.description;
    if (trackDto.structure !== undefined) updateData.structure = trackDto.structure;
    if (trackDto.careers !== undefined) updateData.careers = trackDto.careers;
    if (trackDto.highlights !== undefined) updateData.highlights = trackDto.highlights;
    if (trackDto.banner_url !== undefined) updateData.bannerUrl = trackDto.banner_url;
    if (trackDto.bannerUrl !== undefined) updateData.bannerUrl = trackDto.bannerUrl;
    if (trackDto.curriculum_url !== undefined) updateData.curriculumUrl = trackDto.curriculum_url;
    if (trackDto.curriculumUrl !== undefined) updateData.curriculumUrl = trackDto.curriculumUrl;
    if (trackDto.youtube_video_url !== undefined) updateData.youtubeVideoUrl = trackDto.youtube_video_url;
    if (trackDto.youtubeVideoUrl !== undefined) updateData.youtubeVideoUrl = trackDto.youtubeVideoUrl;
    if (trackDto.facebook_video_url !== undefined) updateData.facebookVideoUrl = trackDto.facebook_video_url;
    if (trackDto.facebookVideoUrl !== undefined) updateData.facebookVideoUrl = trackDto.facebookVideoUrl;
    if (trackDto.social_links !== undefined) updateData.socialLinks = trackDto.social_links;
    if (trackDto.socialLinks !== undefined) updateData.socialLinks = trackDto.socialLinks;
    if (trackDto.gallery_images !== undefined) updateData.galleryImages = trackDto.gallery_images;
    if (trackDto.galleryImages !== undefined) updateData.galleryImages = trackDto.galleryImages;
    if (trackDto.attachments !== undefined) updateData.attachments = trackDto.attachments;
    if (trackDto.sort_order !== undefined) updateData.sortOrder = trackDto.sort_order;
    if (trackDto.sortOrder !== undefined) updateData.sortOrder = trackDto.sortOrder;
    if (trackDto.is_active !== undefined) updateData.isActive = trackDto.is_active;
    if (trackDto.isActive !== undefined) updateData.isActive = trackDto.isActive;

    const updated = await this.drizzle.db
      .update(programTracks)
      .set(updateData)
      .where(eq(programTracks.id, trackId))
      .returning();

    return updated[0];
  }

  async removeTrack(trackId: string, user?: any) {
    const existing = await this.drizzle.db
      .select()
      .from(programTracks)
      .where(eq(programTracks.id, trackId));

    if (existing.length === 0) {
      throw new NotFoundException(`Track with ID "${trackId}" not found`);
    }

    const track = existing[0];
    const prog = await this.findOne(track.programId);
    this.checkScope(user, prog.departmentId);

    await this.drizzle.db
      .delete(programTracks)
      .where(eq(programTracks.id, trackId));

    return { deleted: true };
  }

}
