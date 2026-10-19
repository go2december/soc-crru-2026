import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  DatabaseService,
  academicServices,
  academicServiceMembers,
  academicServiceConfigs,
  staffProfiles,
} from 'db/database';
import { UploadService } from 'upload/upload';
import { CreateAcademicServiceDto } from './dto/create-academic-service.dto';
import { UpdateAcademicServiceDto } from './dto/update-academic-service.dto';
import { UpdateAcademicServiceConfigDto } from './dto/update-academic-service-config.dto';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class AcademicServicesService {
  constructor(
    private readonly drizzleService: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  private collectAcademicUrls(
    item?: {
      coverImageUrl?: string | null;
      documentUrl?: string | null;
      pdfFormUrl?: string | null;
      docxFormUrl?: string | null;
      galleryImages?: string[] | null;
    } | null,
  ): string[] {
    if (!item) return [];
    const urls = new Set<string>();
    for (const u of [
      item.coverImageUrl,
      item.documentUrl,
      item.pdfFormUrl,
      item.docxFormUrl,
      ...(item.galleryImages ?? []),
    ]) {
      if (u && u.startsWith('/uploads/research/')) {
        urls.add(u);
      }
    }
    return [...urls];
  }

  private async cleanupAcademicFiles(
    prev?: Parameters<AcademicServicesService['collectAcademicUrls']>[0],
    next?: Parameters<AcademicServicesService['collectAcademicUrls']>[0],
  ): Promise<void> {
    const nextUrls = new Set(this.collectAcademicUrls(next));
    for (const url of this.collectAcademicUrls(prev)) {
      if (!nextUrls.has(url)) {
        await this.uploadService.deleteResearchImage(url);
      }
    }
  }

  private checkScope(user: any, targetDepartmentId?: number | null) {
    if (!user) return;
    const roles: string[] = user.roles || [];
    if (roles.includes('ADMIN')) return;

    if (roles.includes('EDITOR')) {
      const userDept = user.departmentId;
      if (!userDept || userDept !== targetDepartmentId) {
        throw new ForbiddenException(
          'คุณไม่มีสิทธิ์จัดการบริการวิชาการนอกสังกัดสาขาวิชาของคุณ',
        );
      }
    }
  }

  async create(createDto: CreateAcademicServiceDto, user?: any) {
    const { members, ...data } = createDto;

    let targetDeptId = data.department_id;
    if (user && !user.roles?.includes('ADMIN') && user.roles?.includes('EDITOR')) {
      targetDeptId = user.departmentId;
    }

    const [newService] = await this.drizzleService.db
      .insert(academicServices)
      .values({
        ...data,
        departmentId: targetDeptId,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      })
      .returning();

    if (members && members.length > 0) {
      await this.drizzleService.db.insert(academicServiceMembers).values(
        members.map((m) => ({
          academicServiceId: newService.id,
          staffId: m.staffId,
          role: m.role || 'MEMBER',
        })),
      );
    }

    return this.findOne(newService.id);
  }

  async findAllPublic() {
    const services = await this.drizzleService.db
      .select()
      .from(academicServices)
      .where(eq(academicServices.isPublished, true))
      .orderBy(desc(academicServices.createdAt));

    return Promise.all(
      services.map(async (service) => {
        const members = await this.drizzleService.db
          .select({
            id: academicServiceMembers.id,
            staffId: academicServiceMembers.staffId,
            role: academicServiceMembers.role,
            prefix: staffProfiles.prefixTh,
            firstNameTh: staffProfiles.firstNameTh,
            lastNameTh: staffProfiles.lastNameTh,
          })
          .from(academicServiceMembers)
          .innerJoin(
            staffProfiles,
            eq(academicServiceMembers.staffId, staffProfiles.id),
          )
          .where(eq(academicServiceMembers.academicServiceId, service.id));
        return { ...service, members };
      }),
    );
  }

  async findAllAdmin(departmentId?: number) {
    const condition = departmentId ? eq(academicServices.departmentId, departmentId) : undefined;
    const services = await this.drizzleService.db
      .select()
      .from(academicServices)
      .where(condition)
      .orderBy(desc(academicServices.createdAt));

    return Promise.all(
      services.map(async (service) => {
        const members = await this.drizzleService.db
          .select({
            id: academicServiceMembers.id,
            staffId: academicServiceMembers.staffId,
            role: academicServiceMembers.role,
            prefix: staffProfiles.prefixTh,
            firstNameTh: staffProfiles.firstNameTh,
            lastNameTh: staffProfiles.lastNameTh,
          })
          .from(academicServiceMembers)
          .innerJoin(
            staffProfiles,
            eq(academicServiceMembers.staffId, staffProfiles.id),
          )
          .where(eq(academicServiceMembers.academicServiceId, service.id));
        return { ...service, members };
      }),
    );
  }

  async findOne(id: string) {
    const [service] = await this.drizzleService.db
      .select()
      .from(academicServices)
      .where(eq(academicServices.id, id));

    if (!service) {
      throw new NotFoundException(`Academic service with ID ${id} not found`);
    }

    const members = await this.drizzleService.db
      .select({
        id: academicServiceMembers.id,
        staffId: academicServiceMembers.staffId,
        role: academicServiceMembers.role,
        prefix: staffProfiles.prefixTh,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
        firstNameEn: staffProfiles.firstNameEn,
        lastNameEn: staffProfiles.lastNameEn,
      })
      .from(academicServiceMembers)
      .innerJoin(
        staffProfiles,
        eq(academicServiceMembers.staffId, staffProfiles.id),
      )
      .where(eq(academicServiceMembers.academicServiceId, id));

    return {
      ...service,
      members,
    };
  }

  async update(id: string, updateDto: UpdateAcademicServiceDto, user?: any) {
    const existing = await this.findOne(id); // Check exists
    this.checkScope(user, existing.departmentId);

    const { members, ...data } = updateDto;

    const [updatedService] = await this.drizzleService.db
      .update(academicServices)
      .set({
        ...data,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(academicServices.id, id))
      .returning();

    if (members !== undefined) {
      // Delete old members
      await this.drizzleService.db
        .delete(academicServiceMembers)
        .where(eq(academicServiceMembers.academicServiceId, id));

      // Insert new members
      if (members.length > 0) {
        await this.drizzleService.db.insert(academicServiceMembers).values(
          members.map((m) => ({
            academicServiceId: id,
            staffId: m.staffId,
            role: m.role || 'MEMBER',
          })),
        );
      }
    }

    await this.cleanupAcademicFiles(existing, updatedService);
    return this.findOne(id);
  }

  async remove(id: string, user?: any) {
    const existing = await this.findOne(id); // Check exists
    this.checkScope(user, existing.departmentId);

    await this.drizzleService.db
      .delete(academicServices)
      .where(eq(academicServices.id, id));
    await this.cleanupAcademicFiles(existing);
    return { success: true };
  }

  async getConfig() {
    const [config] = await this.drizzleService.db
      .select()
      .from(academicServiceConfigs)
      .where(eq(academicServiceConfigs.id, 1));

    if (!config) {
      // Fallback create default if not found
      const [newConfig] = await this.drizzleService.db
        .insert(academicServiceConfigs)
        .values({
          id: 1,
          contactEmail: 'socialsciences@crru.ac.th',
          contactPhone: '0-5377-6000 ต่อ 1600',
          officeHours: 'จันทร์ - ศุกร์ 08:30 - 16:30 น. (เว้นวันหยุดราชการ)',
          officeLocation: 'สำนักงานคณบดี อาคาร 1 ชั้น 2 คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
          responseTime: 'เจ้าหน้าที่จะติดต่อกลับภายใน 1-2 วันทำการ',
          pdfFormUrl: '/forms/academic-service-request.pdf',
          docxFormUrl: '/forms/academic-service-request.docx',
        })
        .onConflictDoNothing()
        .returning();
      if (newConfig) return newConfig;

      const [fallback] = await this.drizzleService.db
        .select()
        .from(academicServiceConfigs)
        .limit(1);
      return fallback;
    }

    return config;
  }

  async updateConfig(dto: UpdateAcademicServiceConfigDto) {
    const existing = await this.getConfig();

    const [updated] = await this.drizzleService.db
      .update(academicServiceConfigs)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(academicServiceConfigs.id, existing.id))
      .returning();

    await this.cleanupAcademicFiles(existing, updated);
    return updated;
  }
}

