import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, mous } from 'db/database';
import { CreateMouDto } from './dto/create-mou.dto';
import { UpdateMouDto } from './dto/update-mou.dto';
import { eq, desc, asc, and, ilike, or, SQL } from 'drizzle-orm';

@Injectable()
export class MousService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async findAllPublic(partnerType?: string, search?: string) {
    const conditions: SQL[] = [eq(mous.isPublished, true)];

    if (partnerType && partnerType !== 'ALL') {
      conditions.push(eq(mous.partnerType, partnerType as any));
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      const searchCondition = or(
        ilike(mous.title, q),
        ilike(mous.partnerName, q),
        ilike(mous.scope, q),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    return this.drizzleService.db
      .select()
      .from(mous)
      .where(and(...conditions))
      .orderBy(asc(mous.displayOrder), desc(mous.createdAt));
  }

  async findAllAdmin(partnerType?: string, search?: string) {
    const conditions: SQL[] = [];

    if (partnerType && partnerType !== 'ALL') {
      conditions.push(eq(mous.partnerType, partnerType as any));
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      const searchCondition = or(
        ilike(mous.title, q),
        ilike(mous.partnerName, q),
        ilike(mous.scope, q),
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    return this.drizzleService.db
      .select()
      .from(mous)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(mous.displayOrder), desc(mous.createdAt));
  }

  async findOne(id: string) {
    const [mou] = await this.drizzleService.db
      .select()
      .from(mous)
      .where(eq(mous.id, id))
      .limit(1);

    if (!mou) {
      throw new NotFoundException(`ไม่พบบันทึกข้อตกลงความร่วมมือรหัส ${id}`);
    }

    return mou;
  }

  async create(createDto: CreateMouDto, _user?: any) {
    const { startDate, endDate, ...rest } = createDto;

    const [newMou] = await this.drizzleService.db
      .insert(mous)
      .values({
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      })
      .returning();

    return newMou;
  }

  async update(id: string, updateDto: UpdateMouDto, _user?: any) {
    await this.findOne(id);

    const { startDate, endDate, ...rest } = updateDto;

    const [updated] = await this.drizzleService.db
      .update(mous)
      .set({
        ...rest,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(mous.id, id))
      .returning();

    return updated;
  }

  async remove(id: string, _user?: any) {
    await this.findOne(id);
    await this.drizzleService.db.delete(mous).where(eq(mous.id, id));
    return { success: true, message: `ลบบันทึกข้อตกลงความร่วมมือเรียบร้อยแล้ว` };
  }
}
