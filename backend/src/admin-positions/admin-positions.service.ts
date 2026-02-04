import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { adminPositions } from '../drizzle/schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class AdminPositionsService {
    constructor(private readonly drizzle: DrizzleService) { }

    async findAll() {
        return this.drizzle.db.select().from(adminPositions).orderBy(asc(adminPositions.level), asc(adminPositions.nameTh));
    }

    async create(data: { nameTh: string; nameEn?: string; level?: number }) {
        return this.drizzle.db.insert(adminPositions).values(data).returning();
    }

    async update(id: number, data: { nameTh?: string; nameEn?: string; level?: number }) {
        return this.drizzle.db.update(adminPositions).set(data).where(eq(adminPositions.id, id)).returning();
    }

    async remove(id: number) {
        return this.drizzle.db.delete(adminPositions).where(eq(adminPositions.id, id)).returning();
    }
}
