import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, schema } from 'db/database';
import {
  CreateProcurementDto,
  ProcurementDocumentInputDto,
} from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';
import { QueryProcurementDto } from './dto/query-procurement.dto';
import { eq, desc, and, sql, ilike, or } from 'drizzle-orm';
import { UploadService } from 'upload/upload';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uploadService: UploadService,
  ) {}

  private async getDocuments(procurementId: string) {
    return this.databaseService.db
      .select()
      .from(schema.procurementDocuments)
      .where(eq(schema.procurementDocuments.procurementId, procurementId))
      .orderBy(
        schema.procurementDocuments.sortOrder,
        schema.procurementDocuments.createdAt,
      );
  }

  async create(createDto: CreateProcurementDto, userId?: string) {
    const { documents, ...recordData } = createDto;

    const [record] = await this.databaseService.db
      .insert(schema.procurementRecords)
      .values({
        fiscalYear: recordData.fiscalYear,
        title: recordData.title,
        procurementType: recordData.procurementType as any,
        category: recordData.category as any,
        budget: recordData.budget.toString(),
        contractAmount: recordData.contractAmount
          ? recordData.contractAmount.toString()
          : null,
        vendorName: recordData.vendorName || null,
        approvedAt: recordData.approvedAt
          ? new Date(recordData.approvedAt)
          : null,
        completedAt: recordData.completedAt
          ? new Date(recordData.completedAt)
          : null,
        status: (recordData.status || 'PLANNING') as any,
        isPublished: recordData.isPublished ?? true,
        createdBy: userId || recordData.createdBy || null,
      })
      .returning();

    let createdDocs: any[] = [];
    if (documents && documents.length > 0) {
      createdDocs = await this.databaseService.db
        .insert(schema.procurementDocuments)
        .values(
          documents.map((doc, index) => ({
            procurementId: record.id,
            documentType: doc.documentType as any,
            title: doc.title,
            fileUrl: doc.fileUrl || null,
            externalUrl: doc.externalUrl || null,
            originalName: doc.originalName || null,
            mimeType: doc.mimeType || 'application/pdf',
            fileSize: doc.fileSize || null,
            sortOrder: doc.sortOrder ?? index,
          })),
        )
        .returning();
    }

    return {
      ...record,
      documents: createdDocs,
    };
  }

  async findAll(query: QueryProcurementDto, isPublic: boolean = false) {
    const {
      fiscalYear,
      procurementType,
      category,
      status,
      search,
      page = 1,
      limit = 10,
    } = query;

    const conditions: any[] = [];

    if (isPublic) {
      conditions.push(eq(schema.procurementRecords.isPublished, true));
    }

    if (fiscalYear) {
      conditions.push(eq(schema.procurementRecords.fiscalYear, fiscalYear));
    }

    if (procurementType) {
      conditions.push(
        eq(schema.procurementRecords.procurementType, procurementType as any),
      );
    }

    if (category) {
      conditions.push(eq(schema.procurementRecords.category, category as any));
    }

    if (status) {
      conditions.push(eq(schema.procurementRecords.status, status as any));
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(schema.procurementRecords.title, term),
          ilike(schema.procurementRecords.vendorName, term),
        ),
      );
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Total Count
    const countResult = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.procurementRecords)
      .where(whereCondition);
    const total = Number(countResult[0]?.count || 0);

    // Items
    const items = await this.databaseService.db
      .select()
      .from(schema.procurementRecords)
      .where(whereCondition)
      .orderBy(
        desc(schema.procurementRecords.fiscalYear),
        desc(schema.procurementRecords.createdAt),
      )
      .limit(limit)
      .offset((page - 1) * limit);

    // Attach documents to items
    const recordsWithDocs = await Promise.all(
      items.map(async (item) => {
        const docs = await this.getDocuments(item.id);
        return {
          ...item,
          documents: docs,
        };
      }),
    );

    return {
      data: recordsWithDocs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const [record] = await this.databaseService.db
      .select()
      .from(schema.procurementRecords)
      .where(eq(schema.procurementRecords.id, id));

    if (!record) {
      throw new NotFoundException(`Procurement record with ID ${id} not found`);
    }

    const documents = await this.getDocuments(id);
    return {
      ...record,
      documents,
    };
  }

  async update(id: string, updateDto: UpdateProcurementDto) {
    const existing = await this.findOne(id);
    const { documents, ...recordData } = updateDto;

    const updatePayload: any = {
      updatedAt: new Date(),
    };

    if (recordData.fiscalYear !== undefined)
      updatePayload.fiscalYear = recordData.fiscalYear;
    if (recordData.title !== undefined) updatePayload.title = recordData.title;
    if (recordData.procurementType !== undefined)
      updatePayload.procurementType = recordData.procurementType as any;
    if (recordData.category !== undefined)
      updatePayload.category = recordData.category as any;
    if (recordData.budget !== undefined)
      updatePayload.budget = recordData.budget.toString();
    if (recordData.contractAmount !== undefined) {
      updatePayload.contractAmount = recordData.contractAmount
        ? recordData.contractAmount.toString()
        : null;
    }
    if (recordData.vendorName !== undefined)
      updatePayload.vendorName = recordData.vendorName || null;
    if (recordData.approvedAt !== undefined) {
      updatePayload.approvedAt = recordData.approvedAt
        ? new Date(recordData.approvedAt)
        : null;
    }
    if (recordData.completedAt !== undefined) {
      updatePayload.completedAt = recordData.completedAt
        ? new Date(recordData.completedAt)
        : null;
    }
    if (recordData.status !== undefined)
      updatePayload.status = recordData.status as any;
    if (recordData.isPublished !== undefined)
      updatePayload.isPublished = recordData.isPublished;

    const [updatedRecord] = await this.databaseService.db
      .update(schema.procurementRecords)
      .set(updatePayload)
      .where(eq(schema.procurementRecords.id, id))
      .returning();

    // If documents array is supplied in update, sync documents
    if (documents !== undefined) {
      // Find old documents to check which files need deletion
      const oldDocs = existing.documents || [];
      const newDocIds = new Set(documents.filter((d) => d.id).map((d) => d.id));

      const removedDocs = oldDocs.filter((d) => !newDocIds.has(d.id));
      for (const removed of removedDocs) {
        if (removed.fileUrl) {
          await this.uploadService.deleteProcurementFile(removed.fileUrl);
        }
      }

      // Delete all existing and re-insert or replace
      await this.databaseService.db
        .delete(schema.procurementDocuments)
        .where(eq(schema.procurementDocuments.procurementId, id));

      if (documents.length > 0) {
        await this.databaseService.db
          .insert(schema.procurementDocuments)
          .values(
            documents.map((doc, index) => ({
              procurementId: id,
              documentType: doc.documentType as any,
              title: doc.title,
              fileUrl: doc.fileUrl || null,
              externalUrl: doc.externalUrl || null,
              originalName: doc.originalName || null,
              mimeType: doc.mimeType || 'application/pdf',
              fileSize: doc.fileSize || null,
              sortOrder: doc.sortOrder ?? index,
            })),
          );
      }
    }

    const finalDocs = await this.getDocuments(id);
    return {
      ...updatedRecord,
      documents: finalDocs,
    };
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    for (const doc of existing.documents || []) {
      if (doc.fileUrl) {
        await this.uploadService.deleteProcurementFile(doc.fileUrl);
      }
    }

    await this.databaseService.db
      .delete(schema.procurementRecords)
      .where(eq(schema.procurementRecords.id, id));

    return { message: 'Procurement record deleted successfully' };
  }

  async addDocument(
    procurementId: string,
    docDto: ProcurementDocumentInputDto,
  ) {
    await this.findOne(procurementId); // ensure exists

    const [created] = await this.databaseService.db
      .insert(schema.procurementDocuments)
      .values({
        procurementId,
        documentType: docDto.documentType as any,
        title: docDto.title,
        fileUrl: docDto.fileUrl || null,
        externalUrl: docDto.externalUrl || null,
        originalName: docDto.originalName || null,
        mimeType: docDto.mimeType || 'application/pdf',
        fileSize: docDto.fileSize || null,
        sortOrder: docDto.sortOrder ?? 0,
      })
      .returning();

    return created;
  }

  async removeDocument(procurementId: string, documentId: string) {
    const [doc] = await this.databaseService.db
      .select()
      .from(schema.procurementDocuments)
      .where(
        and(
          eq(schema.procurementDocuments.id, documentId),
          eq(schema.procurementDocuments.procurementId, procurementId),
        ),
      );

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    if (doc.fileUrl) {
      await this.uploadService.deleteProcurementFile(doc.fileUrl);
    }

    await this.databaseService.db
      .delete(schema.procurementDocuments)
      .where(eq(schema.procurementDocuments.id, documentId));

    return { message: 'Document deleted successfully' };
  }
}
