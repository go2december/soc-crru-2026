import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, studentServices, studentDocuments } from 'db/database';
import { UploadService } from 'upload/upload';
import { CreateStudentServiceDto } from './dto/create-student-service.dto';
import { UpdateStudentServiceDto } from './dto/update-student-service.dto';
import { CreateStudentDocumentDto } from './dto/create-student-document.dto';
import { UpdateStudentDocumentDto } from './dto/update-student-document.dto';
import { eq, desc, asc, and } from 'drizzle-orm';

@Injectable()
export class StudentServicesService {
  constructor(
    private readonly drizzle: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  // ==========================================
  // Student Services (E-Services)
  // ==========================================

  async findAll(options?: { category?: string; onlyPublished?: boolean }) {
    const conditions: any[] = [];

    if (options?.onlyPublished !== false) {
      conditions.push(eq(studentServices.isPublished, true));
    }

    if (options?.category && options.category !== 'ALL') {
      conditions.push(eq(studentServices.category, options.category as any));
    }

    const query = this.drizzle.db.select().from(studentServices);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query.orderBy(asc(studentServices.displayOrder), desc(studentServices.createdAt));
  }

  async findAllAdmin() {
    return await this.drizzle.db
      .select()
      .from(studentServices)
      .orderBy(asc(studentServices.displayOrder), desc(studentServices.createdAt));
  }

  async findOne(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(studentServices)
      .where(eq(studentServices.id, id));

    if (!result.length) {
      throw new NotFoundException(`Student service with ID "${id}" not found`);
    }

    return result[0];
  }

  async create(createDto: CreateStudentServiceDto) {
    const result = await this.drizzle.db
      .insert(studentServices)
      .values({
        ...createDto,
        displayOrder: createDto.displayOrder ?? 0,
        isPublished: createDto.isPublished ?? true,
      })
      .returning();
    return result[0];
  }

  async update(id: string, updateDto: UpdateStudentServiceDto) {
    await this.findOne(id);

    const result = await this.drizzle.db
      .update(studentServices)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(studentServices.id, id))
      .returning();

    return result[0];
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.drizzle.db.delete(studentServices).where(eq(studentServices.id, id));
    return { success: true, message: `Student service with ID "${id}" has been removed` };
  }

  // ==========================================
  // Student Documents (Forms & Faculty Docs)
  // ==========================================

  async findAllDocs(options?: { category?: string; onlyPublished?: boolean }) {
    const conditions: any[] = [];

    if (options?.onlyPublished !== false) {
      conditions.push(eq(studentDocuments.isPublished, true));
    }

    if (options?.category && options.category !== 'ALL') {
      conditions.push(eq(studentDocuments.category, options.category));
    }

    const query = this.drizzle.db.select().from(studentDocuments);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query.orderBy(asc(studentDocuments.displayOrder), desc(studentDocuments.createdAt));
  }

  async findAllDocsAdmin() {
    return await this.drizzle.db
      .select()
      .from(studentDocuments)
      .orderBy(asc(studentDocuments.displayOrder), desc(studentDocuments.createdAt));
  }

  async findOneDoc(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(studentDocuments)
      .where(eq(studentDocuments.id, id));

    if (!result.length) {
      throw new NotFoundException(`Student document with ID "${id}" not found`);
    }

    return result[0];
  }

  async createDoc(createDto: CreateStudentDocumentDto) {
    const result = await this.drizzle.db
      .insert(studentDocuments)
      .values({
        ...createDto,
        displayOrder: createDto.displayOrder ?? 0,
        isPublished: createDto.isPublished ?? true,
      })
      .returning();
    return result[0];
  }

  async updateDoc(id: string, updateDto: UpdateStudentDocumentDto) {
    const existing = await this.findOneDoc(id);

    const result = await this.drizzle.db
      .update(studentDocuments)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(studentDocuments.id, id))
      .returning();

    if (existing.fileUrl && existing.fileUrl !== result[0].fileUrl) {
      await this.uploadService.deleteProgramsFile(existing.fileUrl);
    }

    return result[0];
  }

  async removeDoc(id: string) {
    const existing = await this.findOneDoc(id);
    await this.drizzle.db.delete(studentDocuments).where(eq(studentDocuments.id, id));
    if (existing.fileUrl) {
      await this.uploadService.deleteProgramsFile(existing.fileUrl);
    }
    return { success: true, message: `Student document with ID "${id}" has been removed` };
  }
}
