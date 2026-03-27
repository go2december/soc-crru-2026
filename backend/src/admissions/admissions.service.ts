import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import * as schema from 'src/drizzle/schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class AdmissionsService {
  constructor(private readonly drizzle: DrizzleService) {}

  // ==========================
  // CONFIG
  // ==========================
  async getConfig() {
    const records = await this.drizzle.db.select().from(schema.admissionConfig).where(eq(schema.admissionConfig.id, 1));
    if (!records.length) {
      // return default structure
      return {
        id: 1,
        youtubeVideoUrl: '',
        brochureUrl: '',
        bachelorLink: '',
        graduateLink: '',
        tableTitle: 'ตารางรอบรับสมัคร ประจำปีการศึกษา 2569',
      };
    }
    return records[0];
  }

  async updateConfig(dto: any) {
    const existing = await this.drizzle.db.select().from(schema.admissionConfig).where(eq(schema.admissionConfig.id, 1));
    if (!existing.length) {
      const [newConfig] = await this.drizzle.db
        .insert(schema.admissionConfig)
        .values({
          id: 1,
          ...dto,
          updatedAt: new Date(),
        })
        .returning();
      return newConfig;
    }

    const [updated] = await this.drizzle.db
      .update(schema.admissionConfig)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(schema.admissionConfig.id, 1))
      .returning();
    return updated;
  }

  // ==========================
  // SCHEDULES
  // ==========================
  async getSchedules() {
    return this.drizzle.db.select().from(schema.admissionSchedules).orderBy(asc(schema.admissionSchedules.sortOrder));
  }

  async createSchedule(dto: any) {
    const [created] = await this.drizzle.db.insert(schema.admissionSchedules).values(dto).returning();
    return created;
  }

  async updateSchedule(id: string, dto: any) {
    const [updated] = await this.drizzle.db
      .update(schema.admissionSchedules)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.admissionSchedules.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Schedule not found');
    return updated;
  }

  async deleteSchedule(id: string) {
    const [deleted] = await this.drizzle.db
      .delete(schema.admissionSchedules)
      .where(eq(schema.admissionSchedules.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Schedule not found');
    return { success: true };
  }

  async updateSchedulesOrder(items: { id: string; sortOrder: number }[]) {
    await this.drizzle.db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(schema.admissionSchedules)
          .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
          .where(eq(schema.admissionSchedules.id, item.id));
      }
    });
    return { success: true };
  }

  // ==========================
  // DOCUMENTS
  // ==========================
  async getDocuments() {
    return this.drizzle.db.select().from(schema.admissionDocuments).orderBy(asc(schema.admissionDocuments.sortOrder));
  }

  async createDocument(dto: any) {
    const [created] = await this.drizzle.db.insert(schema.admissionDocuments).values(dto).returning();
    return created;
  }

  async updateDocument(id: string, dto: any) {
    const [updated] = await this.drizzle.db
      .update(schema.admissionDocuments)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.admissionDocuments.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Document not found');
    return updated;
  }

  async deleteDocument(id: string) {
    const [deleted] = await this.drizzle.db
      .delete(schema.admissionDocuments)
      .where(eq(schema.admissionDocuments.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Document not found');
    return { success: true };
  }

  async updateDocumentsOrder(items: { id: string; sortOrder: number }[]) {
    await this.drizzle.db.transaction(async (tx) => {
      for (const item of items) {
        await tx.update(schema.admissionDocuments)
          .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
          .where(eq(schema.admissionDocuments.id, item.id));
      }
    });
    return { success: true };
  }
}
