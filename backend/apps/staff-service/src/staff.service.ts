import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  DatabaseService,
  staffProfiles,
  departments,
  academicPositions,
  adminPositions,
  researchProjects,
  projectMembers,
  staffResumeRequests,
} from 'db/database';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CreatePositionDto, UpdatePositionDto } from './dto/position.dto';
import { CreateResumeRequestDto, ApproveResumeRequestDto } from './dto/create-resume-request.dto';
import { UploadService } from 'upload/upload';
import { StaffMailService } from './mail.service';
import { PdfResumeService } from './pdf-resume.service';
import { eq, sql, and, desc } from 'drizzle-orm';
import * as crypto from 'crypto';

@Injectable()
export class StaffService {
  constructor(
    private readonly drizzle: DatabaseService,
    private readonly uploadService: UploadService,
    private readonly mailService: StaffMailService,
    private readonly pdfResumeService: PdfResumeService,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    // Check if staff profile already exists for this user (only if userId is provided)
    if (createStaffDto.userId) {
      const existing = await this.drizzle.db
        .select()
        .from(staffProfiles)
        .where(eq(staffProfiles.userId, createStaffDto.userId));

      if (existing.length > 0) {
        throw new BadRequestException(
          'Staff profile already exists for this user',
        );
      }
    }

    // Verify department exists
    const dept = await this.drizzle.db
      .select()
      .from(departments)
      .where(eq(departments.id, createStaffDto.departmentId));

    if (dept.length === 0) {
      throw new BadRequestException('Department not found');
    }

    const result = await this.drizzle.db
      .insert(staffProfiles)
      .values(createStaffDto)
      .returning();
    return result[0];
  }

  async findAll(page: number = 1, limit: number = 100) {
    const offset = (page - 1) * limit;

    const data = await this.drizzle.db
      .select({
        id: staffProfiles.id,
        prefixTh: staffProfiles.prefixTh,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
        prefixEn: staffProfiles.prefixEn,
        firstNameEn: staffProfiles.firstNameEn,
        lastNameEn: staffProfiles.lastNameEn,
        staffType: staffProfiles.staffType,
        academicPositionId: staffProfiles.academicPositionId,
        academicPosition: academicPositions.nameTh,
        adminPositionId: staffProfiles.adminPositionId,
        adminPosition: adminPositions.nameTh,
        education: staffProfiles.education,
        expertise: staffProfiles.expertise,
        shortBios: staffProfiles.shortBios,
        imageUrl: staffProfiles.imageUrl,
        contactEmail: staffProfiles.contactEmail,
        googleScholarUrl: staffProfiles.googleScholarUrl,
        orcidId: staffProfiles.orcidId,
        scopusAuthorId: staffProfiles.scopusAuthorId,
        sortOrder: staffProfiles.sortOrder,
        isExecutive: staffProfiles.isExecutive,
        departmentId: staffProfiles.departmentId,
        userId: staffProfiles.userId,
        department: departments.nameTh,
        departmentEn: departments.nameEn,
      })
      .from(staffProfiles)
      .leftJoin(departments, eq(staffProfiles.departmentId, departments.id))
      .leftJoin(
        academicPositions,
        eq(staffProfiles.academicPositionId, academicPositions.id),
      )
      .leftJoin(
        adminPositions,
        eq(staffProfiles.adminPositionId, adminPositions.id),
      )
      .orderBy(staffProfiles.sortOrder)
      .limit(limit)
      .offset(offset);

    const countResult = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(staffProfiles);
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

  async findOne(id: string) {
    const result = await this.drizzle.db
      .select({
        id: staffProfiles.id,
        prefixTh: staffProfiles.prefixTh,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
        prefixEn: staffProfiles.prefixEn,
        firstNameEn: staffProfiles.firstNameEn,
        lastNameEn: staffProfiles.lastNameEn,
        staffType: staffProfiles.staffType,
        academicPositionId: staffProfiles.academicPositionId,
        academicPosition: academicPositions.nameTh,
        adminPositionId: staffProfiles.adminPositionId,
        adminPosition: adminPositions.nameTh,
        education: staffProfiles.education,
        expertise: staffProfiles.expertise,
        shortBios: staffProfiles.shortBios,
        imageUrl: staffProfiles.imageUrl,
        bio: staffProfiles.bio,
        contactEmail: staffProfiles.contactEmail,
        googleScholarUrl: staffProfiles.googleScholarUrl,
        orcidId: staffProfiles.orcidId,
        scopusAuthorId: staffProfiles.scopusAuthorId,
        sortOrder: staffProfiles.sortOrder,
        departmentId: staffProfiles.departmentId,
        userId: staffProfiles.userId,
        isExecutive: staffProfiles.isExecutive,
        department: departments.nameTh,
        departmentEn: departments.nameEn,
      })
      .from(staffProfiles)
      .leftJoin(departments, eq(staffProfiles.departmentId, departments.id))
      .leftJoin(
        academicPositions,
        eq(staffProfiles.academicPositionId, academicPositions.id),
      )
      .leftJoin(
        adminPositions,
        eq(staffProfiles.adminPositionId, adminPositions.id),
      )
      .where(eq(staffProfiles.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`Staff profile with ID ${id} not found`);
    }

    const projects = await this.drizzle.db
      .select({
        id: researchProjects.id,
        slug: researchProjects.slug,
        titleTh: researchProjects.titleTh,
        titleEn: researchProjects.titleEn,
        year: researchProjects.year,
        status: researchProjects.status,
        fundingSource: researchProjects.fundingSource,
        isSocialService: researchProjects.isSocialService,
        isCommercial: researchProjects.isCommercial,
        coverImageUrl: researchProjects.coverImageUrl,
        role: projectMembers.role,
        positionTitle: projectMembers.positionTitle,
      })
      .from(projectMembers)
      .innerJoin(
        researchProjects,
        eq(projectMembers.projectId, researchProjects.id),
      )
      .where(
        and(
          eq(projectMembers.staffProfileId, id),
          eq(researchProjects.isPublished, true),
        ),
      )
      .orderBy(desc(researchProjects.year));

    return {
      ...result[0],
      researchProjects: projects,
    };
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const oldStaff = await this.findOne(id);

    const result = await this.drizzle.db
      .update(staffProfiles)
      .set(updateStaffDto)
      .where(eq(staffProfiles.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Staff profile with ID ${id} not found`);
    }

    // Delete old image if a new image URL is provided (or if image was cleared)
    if (
      updateStaffDto.imageUrl !== undefined &&
      oldStaff.imageUrl &&
      oldStaff.imageUrl !== updateStaffDto.imageUrl
    ) {
      await this.uploadService.deleteStaffImage(oldStaff.imageUrl);
    }

    return result[0];
  }

  async remove(id: string) {
    const result = await this.drizzle.db
      .delete(staffProfiles)
      .where(eq(staffProfiles.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Staff profile with ID ${id} not found`);
    }

    // Delete the associated image if it exists
    if (result[0].imageUrl) {
      await this.uploadService.deleteStaffImage(result[0].imageUrl);
    }

    return result[0];
  }

  // --- Academic Positions CRUD ---

  async findAllAcademicPositions() {
    return await this.drizzle.db
      .select()
      .from(academicPositions)
      .orderBy(academicPositions.sortOrder);
  }

  async createAcademicPosition(dto: CreatePositionDto) {
    const result = await this.drizzle.db
      .insert(academicPositions)
      .values(dto)
      .returning();
    return result[0];
  }

  async updateAcademicPosition(id: number, dto: UpdatePositionDto) {
    const result = await this.drizzle.db
      .update(academicPositions)
      .set(dto)
      .where(eq(academicPositions.id, id))
      .returning();
    if (!result.length)
      throw new NotFoundException(`Academic Position with ID ${id} not found`);
    return result[0];
  }

  async removeAcademicPosition(id: number) {
    // Check if in use
    const inUse = await this.drizzle.db
      .select()
      .from(staffProfiles)
      .where(eq(staffProfiles.academicPositionId, id));
    if (inUse.length > 0)
      throw new BadRequestException(
        'Cannot delete position as it is in use by staff profile(s)',
      );

    const result = await this.drizzle.db
      .delete(academicPositions)
      .where(eq(academicPositions.id, id))
      .returning();
    if (!result.length)
      throw new NotFoundException(`Academic Position with ID ${id} not found`);
    return result[0];
  }

  // --- Admin Positions CRUD ---

  async findAllAdminPositions() {
    return await this.drizzle.db
      .select()
      .from(adminPositions)
      .orderBy(adminPositions.sortOrder);
  }

  async createAdminPosition(dto: CreatePositionDto) {
    const result = await this.drizzle.db
      .insert(adminPositions)
      .values(dto)
      .returning();
    return result[0];
  }

  async updateAdminPosition(id: number, dto: UpdatePositionDto) {
    const result = await this.drizzle.db
      .update(adminPositions)
      .set(dto)
      .where(eq(adminPositions.id, id))
      .returning();
    if (!result.length)
      throw new NotFoundException(`Admin Position with ID ${id} not found`);
    return result[0];
  }

  async removeAdminPosition(id: number) {
    // Check if in use
    const inUse = await this.drizzle.db
      .select()
      .from(staffProfiles)
      .where(eq(staffProfiles.adminPositionId, id));
    if (inUse.length > 0)
      throw new BadRequestException(
        'Cannot delete position as it is in use by staff profile(s)',
      );

    const result = await this.drizzle.db
      .delete(adminPositions)
      .where(eq(adminPositions.id, id))
      .returning();
    if (!result.length)
      throw new NotFoundException(`Admin Position with ID ${id} not found`);
    return result[0];
  }

  // --- Anti-Bot Human Verification ---

  generateCaptchaChallenge() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const answer = (num1 + num2).toString();
    const timestamp = Date.now().toString();
    const secret = process.env.JWT_SECRET || 'soc-captcha-secret';

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(`${answer}:${timestamp}`)
      .digest('hex');

    const token = `${timestamp}.${hmac}`;
    return {
      question: `${num1} + ${num2}`,
      token,
    };
  }

  private verifyCaptcha(token?: string, answer?: string): boolean {
    if (!token || !answer) return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [timestampStr, hmac] = parts;
    const timestamp = parseInt(timestampStr, 10);
    // Token valid for 10 minutes (600,000 ms)
    if (isNaN(timestamp) || Date.now() - timestamp > 600000) {
      return false;
    }

    const secret = process.env.JWT_SECRET || 'soc-captcha-secret';
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(`${answer.trim()}:${timestampStr}`)
      .digest('hex');

    return hmac === expectedHmac;
  }

  // --- Resume & Speaker Bio Requests (PDPA Compliance) ---

  async createResumeRequest(dto: CreateResumeRequestDto) {
    // 1. Anti-Bot Defense: Honeypot check
    if (dto.honeypot && dto.honeypot.trim().length > 0) {
      throw new BadRequestException('ระบบตรวจพบการส่งข้อมูลอัตโนมัติ (Automated bot detected)');
    }

    // 2. Anti-Bot Defense: Time-gate check (minimum 1.5 seconds between modal open and submit)
    if (dto.renderedTime && Date.now() - dto.renderedTime < 1500) {
      throw new BadRequestException('กรุณากรอกข้อมูลตามขั้นตอนปกติ (Submission too fast)');
    }

    // 3. Anti-Bot Defense: Math Challenge Verification
    if (dto.captchaToken && dto.captchaAnswer) {
      const isValid = this.verifyCaptcha(dto.captchaToken, dto.captchaAnswer);
      if (!isValid) {
        throw new BadRequestException('ผลลัพธ์การตรวจสอบความปลอดภัย (Anti-Bot) ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      }
    } else {
      throw new BadRequestException('กรุณาตอบคำถามยืนยันความปลอดภัยเพื่อป้องกันสแปม');
    }

    const staff = await this.findOne(dto.staffId);
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${dto.staffId} not found`);
    }

    const result = await this.drizzle.db
      .insert(staffResumeRequests)
      .values({
        staffId: dto.staffId,
        requesterName: dto.requesterName,
        organization: dto.organization,
        email: dto.email,
        phone: dto.phone,
        purpose: dto.purpose,
        notes: dto.notes,
        status: 'PENDING',
      })
      .returning();

    const request = result[0];
    const staffName = `${staff.prefixTh || ''} ${staff.firstNameTh} ${staff.lastNameTh}`.trim();

    // ส่งอีเมลยืนยันการรับคำร้องไปยังผู้ขอ (ระบุเงื่อนไขจัดส่งไม่เกิน 7 วันทำการ)
    await this.mailService.sendAcknowledgmentEmail({
      to: dto.email,
      requesterName: dto.requesterName,
      organization: dto.organization,
      staffName,
      purpose: dto.purpose,
      requestId: request.id,
    });

    // แจ้งเตือนแอดมินหรืออีเมลประจำตัวอาจารย์
    await this.mailService.sendAdminAlert({
      adminEmail: staff.contactEmail || undefined,
      requesterName: dto.requesterName,
      organization: dto.organization,
      staffName,
      purpose: dto.purpose,
      requestId: request.id,
    });

    return {
      success: true,
      requestId: request.id,
      status: request.status,
      message: 'บันทึกคำขอรับเอกสารประวัติเรียบร้อยแล้ว คณะฯ จะดำเนินการตรวจสอบและจัดส่งให้ทางอีเมลไม่เกิน 7 วันหลังจากได้รับการร้องขอ',
    };
  }

  async findAllResumeRequests(page: number = 1, limit: number = 20, status?: string) {
    const offset = (page - 1) * limit;

    const baseQuery = this.drizzle.db
      .select({
        id: staffResumeRequests.id,
        staffId: staffResumeRequests.staffId,
        requesterName: staffResumeRequests.requesterName,
        organization: staffResumeRequests.organization,
        email: staffResumeRequests.email,
        phone: staffResumeRequests.phone,
        purpose: staffResumeRequests.purpose,
        notes: staffResumeRequests.notes,
        status: staffResumeRequests.status,
        sentAt: staffResumeRequests.sentAt,
        createdAt: staffResumeRequests.createdAt,
        rejectionReason: staffResumeRequests.rejectionReason,
        staffFirstNameTh: staffProfiles.firstNameTh,
        staffLastNameTh: staffProfiles.lastNameTh,
        staffPrefixTh: staffProfiles.prefixTh,
        departmentName: departments.nameTh,
      })
      .from(staffResumeRequests)
      .leftJoin(staffProfiles, eq(staffResumeRequests.staffId, staffProfiles.id))
      .leftJoin(departments, eq(staffProfiles.departmentId, departments.id));

    let query = baseQuery;
    if (status) {
      query = query.where(eq(staffResumeRequests.status, status as any)) as any;
    }

    const data = await (query as any)
      .orderBy(desc(staffResumeRequests.createdAt))
      .limit(limit)
      .offset(offset);

    const totalRes = await this.drizzle.db
      .select({ count: sql<number>`count(*)` })
      .from(staffResumeRequests);
    const total = Number(totalRes[0]?.count || 0);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approveResumeRequest(requestId: string, adminUserId?: string) {
    const requests = await this.drizzle.db
      .select()
      .from(staffResumeRequests)
      .where(eq(staffResumeRequests.id, requestId));

    if (requests.length === 0) {
      throw new NotFoundException(`Resume request with ID ${requestId} not found`);
    }

    const request = requests[0];
    const staff = await this.findOne(request.staffId);
    if (!staff) {
      throw new NotFoundException(`Staff profile not found for this request`);
    }

    // Generate PDF Resume
    const pdfBuffer = await this.pdfResumeService.generateStaffResumePdf(staff, request.id);
    const staffName = `${staff.prefixTh || ''} ${staff.firstNameTh} ${staff.lastNameTh}`.trim();
    const fileName = `CV_${staff.firstNameTh}_${staff.lastNameTh}.pdf`;

    // Send email with PDF attached
    const emailResult = await this.mailService.sendOfficialResumeEmail({
      to: request.email,
      requesterName: request.requesterName,
      organization: request.organization,
      staffName,
      pdfBuffer,
      fileName,
      requestId: request.id,
    });

    // Update status to SENT
    const updated = await this.drizzle.db
      .update(staffResumeRequests)
      .set({
        status: 'SENT',
        sentAt: new Date(),
        approvedBy: adminUserId || null,
        updatedAt: new Date(),
      })
      .where(eq(staffResumeRequests.id, requestId))
      .returning();

    return {
      success: true,
      data: updated[0],
      emailDelivered: emailResult.success,
      message: 'อนุมัติคำขอและจัดส่งเอกสาร PDF ให้ผู้ขอเรียบร้อยแล้ว',
    };
  }

  async rejectResumeRequest(requestId: string, reason: string, adminUserId?: string) {
    const updated = await this.drizzle.db
      .update(staffResumeRequests)
      .set({
        status: 'REJECTED',
        rejectionReason: reason,
        approvedBy: adminUserId || null,
        updatedAt: new Date(),
      })
      .where(eq(staffResumeRequests.id, requestId))
      .returning();

    if (updated.length === 0) {
      throw new NotFoundException(`Resume request with ID ${requestId} not found`);
    }

    return {
      success: true,
      data: updated[0],
      message: 'ปฏิเสธคำขอเอกสารเรียบร้อยแล้ว',
    };
  }

  async getResumePdfPreview(staffId: string): Promise<{ buffer: Buffer; fileName: string }> {
    const staff = await this.findOne(staffId);
    if (!staff) {
      throw new NotFoundException(`Staff profile with ID ${staffId} not found`);
    }
    const buffer = await this.pdfResumeService.generateStaffResumePdf(staff, 'PREVIEW');
    const fileName = `CV_${staff.firstNameTh}_${staff.lastNameTh}.pdf`;
    return { buffer, fileName };
  }
}
