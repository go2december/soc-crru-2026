import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, staffServices, staffDocuments } from 'db/database';
import { UploadService } from 'upload/upload';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';
import { UpdateStaffServiceDto } from './dto/update-staff-service.dto';
import { CreateStaffDocumentDto } from './dto/create-staff-document.dto';
import { UpdateStaffDocumentDto } from './dto/update-staff-document.dto';
import { eq, desc, asc, and } from 'drizzle-orm';

@Injectable()
export class StaffServicesService {
  constructor(
    private readonly drizzle: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  // ==========================================
  // Staff Services (E-Services)
  // ==========================================

  async findAll(options?: { category?: string; onlyPublished?: boolean }) {
    const conditions: any[] = [];

    if (options?.onlyPublished !== false) {
      conditions.push(eq(staffServices.isPublished, true));
    }

    if (options?.category && options.category !== 'ALL') {
      conditions.push(eq(staffServices.category, options.category as any));
    }

    const query = this.drizzle.db.select().from(staffServices);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query.orderBy(asc(staffServices.displayOrder), desc(staffServices.createdAt));
  }

  async findAllAdmin() {
    return await this.drizzle.db
      .select()
      .from(staffServices)
      .orderBy(asc(staffServices.displayOrder), desc(staffServices.createdAt));
  }

  async findOne(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(staffServices)
      .where(eq(staffServices.id, id));

    if (!result.length) {
      throw new NotFoundException(`Staff service with ID "${id}" not found`);
    }

    return result[0];
  }

  async create(createDto: CreateStaffServiceDto) {
    const result = await this.drizzle.db
      .insert(staffServices)
      .values({
        ...createDto,
        displayOrder: createDto.displayOrder ?? 0,
        isPublished: createDto.isPublished ?? true,
      })
      .returning();
    return result[0];
  }

  async update(id: string, updateDto: UpdateStaffServiceDto) {
    await this.findOne(id);

    const result = await this.drizzle.db
      .update(staffServices)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(staffServices.id, id))
      .returning();

    return result[0];
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.drizzle.db.delete(staffServices).where(eq(staffServices.id, id));
    return { success: true, message: `Staff service with ID "${id}" has been removed` };
  }

  // ==========================================
  // Staff Documents (Forms & Official Docs)
  // ==========================================

  async findAllDocs(options?: { category?: string; onlyPublished?: boolean }) {
    const conditions: any[] = [];

    if (options?.onlyPublished !== false) {
      conditions.push(eq(staffDocuments.isPublished, true));
    }

    if (options?.category && options.category !== 'ALL') {
      conditions.push(eq(staffDocuments.category, options.category));
    }

    const query = this.drizzle.db.select().from(staffDocuments);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query.orderBy(asc(staffDocuments.displayOrder), desc(staffDocuments.createdAt));
  }

  async findAllDocsAdmin() {
    return await this.drizzle.db
      .select()
      .from(staffDocuments)
      .orderBy(asc(staffDocuments.displayOrder), desc(staffDocuments.createdAt));
  }

  async findOneDoc(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(staffDocuments)
      .where(eq(staffDocuments.id, id));

    if (!result.length) {
      throw new NotFoundException(`Staff document with ID "${id}" not found`);
    }

    return result[0];
  }

  async createDoc(createDto: CreateStaffDocumentDto) {
    const result = await this.drizzle.db
      .insert(staffDocuments)
      .values({
        ...createDto,
        displayOrder: createDto.displayOrder ?? 0,
        isPublished: createDto.isPublished ?? true,
      })
      .returning();
    return result[0];
  }

  async updateDoc(id: string, updateDto: UpdateStaffDocumentDto) {
    const existing = await this.findOneDoc(id);

    const result = await this.drizzle.db
      .update(staffDocuments)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(staffDocuments.id, id))
      .returning();

    if (existing.fileUrl && existing.fileUrl !== result[0].fileUrl) {
      await this.uploadService.deleteProgramsFile(existing.fileUrl);
    }

    return result[0];
  }

  async removeDoc(id: string) {
    const existing = await this.findOneDoc(id);
    await this.drizzle.db.delete(staffDocuments).where(eq(staffDocuments.id, id));
    if (existing.fileUrl) {
      await this.uploadService.deleteProgramsFile(existing.fileUrl);
    }
    return { success: true, message: `Staff document with ID "${id}" has been removed` };
  }
}
