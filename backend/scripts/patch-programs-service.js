const fs = require('fs');
const path = require('path');

const serviceFile = path.resolve(__dirname, '../apps/programs-service/src/programs.service.ts');
let code = fs.readFileSync(serviceFile, 'utf8');

// 1. Add asc to imports
code = code.replace("import { eq, sql, and } from 'drizzle-orm';", "import { eq, sql, and, asc } from 'drizzle-orm';");

// 2. Add getAllTracks and getTrackById
const target = '  async getTracks(programId: string) {';
const replacement = `  async getAllTracks(departmentId?: number, programId?: string) {
    const conditions = [];
    if (programId) {
      conditions.push(eq(programTracks.programId, programId));
    }
    if (departmentId) {
      conditions.push(eq(programs.departmentId, departmentId));
    }

    const rows = await this.drizzle.db
      .select({
        id: programTracks.id,
        programId: programTracks.programId,
        code: programTracks.code,
        nameTh: programTracks.nameTh,
        nameEn: programTracks.nameEn,
        trackType: programTracks.trackType,
        studyPlanType: programTracks.studyPlanType,
        degreeTitleTh: programTracks.degreeTitleTh,
        degreeTitleEn: programTracks.degreeTitleEn,
        description: programTracks.description,
        structure: programTracks.structure,
        careers: programTracks.careers,
        highlights: programTracks.highlights,
        bannerUrl: programTracks.bannerUrl,
        curriculumUrl: programTracks.curriculumUrl,
        youtubeVideoUrl: programTracks.youtubeVideoUrl,
        facebookVideoUrl: programTracks.facebookVideoUrl,
        socialLinks: programTracks.socialLinks,
        galleryImages: programTracks.galleryImages,
        attachments: programTracks.attachments,
        sortOrder: programTracks.sortOrder,
        isActive: programTracks.isActive,
        admissionStatus: programTracks.admissionStatus,
        createdAt: programTracks.createdAt,
        updatedAt: programTracks.updatedAt,
        program: {
          id: programs.id,
          code: programs.code,
          nameTh: programs.nameTh,
          departmentId: programs.departmentId,
          degreeLevel: programs.degreeLevel,
          admissionStatus: programs.admissionStatus,
        },
      })
      .from(programTracks)
      .innerJoin(programs, eq(programTracks.programId, programs.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(programs.code), asc(programTracks.sortOrder), asc(programTracks.nameTh));

    return rows;
  }

  async getTrackById(trackId: string) {
    const rows = await this.drizzle.db
      .select({
        id: programTracks.id,
        programId: programTracks.programId,
        code: programTracks.code,
        nameTh: programTracks.nameTh,
        nameEn: programTracks.nameEn,
        trackType: programTracks.trackType,
        studyPlanType: programTracks.studyPlanType,
        degreeTitleTh: programTracks.degreeTitleTh,
        degreeTitleEn: programTracks.degreeTitleEn,
        description: programTracks.description,
        structure: programTracks.structure,
        careers: programTracks.careers,
        highlights: programTracks.highlights,
        bannerUrl: programTracks.bannerUrl,
        curriculumUrl: programTracks.curriculumUrl,
        youtubeVideoUrl: programTracks.youtubeVideoUrl,
        facebookVideoUrl: programTracks.facebookVideoUrl,
        socialLinks: programTracks.socialLinks,
        galleryImages: programTracks.galleryImages,
        attachments: programTracks.attachments,
        sortOrder: programTracks.sortOrder,
        isActive: programTracks.isActive,
        admissionStatus: programTracks.admissionStatus,
        createdAt: programTracks.createdAt,
        updatedAt: programTracks.updatedAt,
        program: {
          id: programs.id,
          code: programs.code,
          nameTh: programs.nameTh,
          departmentId: programs.departmentId,
          degreeLevel: programs.degreeLevel,
          admissionStatus: programs.admissionStatus,
        },
      })
      .from(programTracks)
      .innerJoin(programs, eq(programTracks.programId, programs.id))
      .where(eq(programTracks.id, trackId));

    if (rows.length === 0) {
      throw new NotFoundException(\`Track with ID "\${trackId}" not found\`);
    }

    return rows[0];
  }

  async getTracks(programId: string) {`;

code = code.replace(target, replacement);

// 3. Add admissionStatus in createTrack
code = code.replace(
  'isActive: trackDto.is_active ?? trackDto.isActive ?? true,',
  'isActive: trackDto.is_active ?? trackDto.isActive ?? true,\r\n        admissionStatus: trackDto.admission_status || trackDto.admissionStatus || null,'
);

// 4. Add admissionStatus in updateTrack
code = code.replace(
  'if (trackDto.isActive !== undefined)\r\n      updateData.isActive = trackDto.isActive;',
  'if (trackDto.isActive !== undefined)\r\n      updateData.isActive = trackDto.isActive;\r\n    if (trackDto.admission_status !== undefined)\r\n      updateData.admissionStatus = trackDto.admission_status;\r\n    if (trackDto.admissionStatus !== undefined)\r\n      updateData.admissionStatus = trackDto.admissionStatus;'
);

fs.writeFileSync(serviceFile, code);
console.log('Successfully updated programs.service.ts');
