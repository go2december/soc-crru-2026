
import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { chiangRaiIdentities, chiangRaiArtifacts, chiangRaiArticles, chiangRaiActivities, chiangRaiStaff, staffProfiles, departments } from '../drizzle/schema';
import { eq, desc, asc } from 'drizzle-orm';

@Injectable()
export class ChiangRaiService {
    constructor(private readonly drizzle: DrizzleService) { }

    // --- Identities ---
    async getAllIdentities() {
        return this.drizzle.db.select().from(chiangRaiIdentities);
    }

    async getIdentityByCode(code: 'HISTORY' | 'ARCHAEOLOGY' | 'CULTURE' | 'ARTS' | 'WISDOM') {
        const result = await this.drizzle.db
            .select()
            .from(chiangRaiIdentities)
            .where(eq(chiangRaiIdentities.code, code))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException(`Identity category ${code} not found`);
        }
        return result[0];
    }

    // --- Artifacts ---
    async getArtifacts(category?: 'HISTORY' | 'ARCHAEOLOGY' | 'CULTURE' | 'ARTS' | 'WISDOM') {
        const query = this.drizzle.db.select().from(chiangRaiArtifacts);

        if (category) {
            query.where(eq(chiangRaiArtifacts.category, category));
        }

        // Default sort by created_at desc
        return query.orderBy(desc(chiangRaiArtifacts.createdAt));
    }

    async getArtifactById(id: string) {
        const result = await this.drizzle.db
            .select()
            .from(chiangRaiArtifacts)
            .where(eq(chiangRaiArtifacts.id, id))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException(`Artifact ${id} not found`);
        }
        return result[0];
    }

    async createArtifact(data: typeof chiangRaiArtifacts.$inferInsert) {
        return this.drizzle.db.insert(chiangRaiArtifacts).values(data).returning();
    }

    async updateArtifact(id: string, data: Partial<typeof chiangRaiArtifacts.$inferInsert>) {
        return this.drizzle.db
            .update(chiangRaiArtifacts)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(chiangRaiArtifacts.id, id))
            .returning();
    }

    async deleteArtifact(id: string) {
        return this.drizzle.db
            .delete(chiangRaiArtifacts)
            .where(eq(chiangRaiArtifacts.id, id))
            .returning();
    }

    // --- Articles ---
    async getArticles() {
        return this.drizzle.db.select().from(chiangRaiArticles).orderBy(desc(chiangRaiArticles.publishedAt));
    }

    async getArticleBySlug(slug: string) {
        const result = await this.drizzle.db
            .select()
            .from(chiangRaiArticles)
            .where(eq(chiangRaiArticles.slug, slug))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException(`Article with slug ${slug} not found`);
        }
        return result[0];
    }

    async getArticleById(id: string) {
        const result = await this.drizzle.db
            .select()
            .from(chiangRaiArticles)
            .where(eq(chiangRaiArticles.id, id))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException(`Article ${id} not found`);
        }
        return result[0];
    }

    async createArticle(data: typeof chiangRaiArticles.$inferInsert) {
        return this.drizzle.db.insert(chiangRaiArticles).values(data).returning();
    }

    async updateArticle(id: string, data: Partial<typeof chiangRaiArticles.$inferInsert>) {
        return this.drizzle.db
            .update(chiangRaiArticles)
            .set(data)
            .where(eq(chiangRaiArticles.id, id))
            .returning();
    }

    async deleteArticle(id: string) {
        return this.drizzle.db
            .delete(chiangRaiArticles)
            .where(eq(chiangRaiArticles.id, id))
            .returning();
    }

    // --- Activities ---
    async getActivities(type?: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT') {
        const query = this.drizzle.db.select().from(chiangRaiActivities);

        if (type) {
            query.where(eq(chiangRaiActivities.type, type));
        }

        return query.orderBy(desc(chiangRaiActivities.publishedAt));
    }

    async getActivityById(id: string) {
        const result = await this.drizzle.db
            .select()
            .from(chiangRaiActivities)
            .where(eq(chiangRaiActivities.id, id))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException(`Activity ${id} not found`);
        }
        return result[0];
    }

    async getActivityBySlug(slug: string) {
        const result = await this.drizzle.db
            .select()
            .from(chiangRaiActivities)
            .where(eq(chiangRaiActivities.slug, slug))
            .limit(1);

        if (!result.length) {
            throw new NotFoundException(`Activity with slug ${slug} not found`);
        }
        return result[0];
    }

    async createActivity(data: typeof chiangRaiActivities.$inferInsert) {
        return this.drizzle.db.insert(chiangRaiActivities).values(data).returning();
    }

    async updateActivity(id: string, data: Partial<typeof chiangRaiActivities.$inferInsert>) {
        return this.drizzle.db
            .update(chiangRaiActivities)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(chiangRaiActivities.id, id))
            .returning();
    }

    async deleteActivity(id: string) {
        return this.drizzle.db
            .delete(chiangRaiActivities)
            .where(eq(chiangRaiActivities.id, id))
            .returning();
    }

    // --- Staff Management ---

    // 1. Get Chiang Rai Staff (Public & Admin)
    async getStaff() {
        return this.drizzle.db
            .select()
            .from(chiangRaiStaff)
            .where(eq(chiangRaiStaff.isActive, true))
            .orderBy(asc(chiangRaiStaff.sortOrder));
    }

    // 2. Add New Staff (Manual)
    async createStaff(data: typeof chiangRaiStaff.$inferInsert) {
        return this.drizzle.db.insert(chiangRaiStaff).values(data).returning();
    }

    // 3. Delete Staff
    async deleteStaff(id: string) {
        return this.drizzle.db.delete(chiangRaiStaff).where(eq(chiangRaiStaff.id, id)).returning();
    }

    // --- Faculty Staff Integration (Import Feature) ---

    // 1. List all Faculty Staff (for Admin selector)
    async getFacultyStaffList() {
        // Join with departments to show useful info
        return this.drizzle.db
            .select({
                id: staffProfiles.id,
                firstNameTh: staffProfiles.firstNameTh,
                lastNameTh: staffProfiles.lastNameTh,
                department: departments.nameTh,
                imageUrl: staffProfiles.imageUrl,
                email: staffProfiles.contactEmail
            })
            .from(staffProfiles)
            .leftJoin(departments, eq(staffProfiles.departmentId, departments.id));
    }

    // 2. Import a Faculty Staff member into Chiang Rai Staff
    async importStaffFromFaculty(facultyStaffId: string, role: 'DIRECTOR' | 'ACADEMIC' | 'NETWORK' | 'DISSEMINATION' | 'SUPPORT') {
        // 2.1 Fetch Faculty Staff Data
        const facultyStaff = await this.drizzle.db
            .select()
            .from(staffProfiles)
            .where(eq(staffProfiles.id, facultyStaffId))
            .limit(1);

        if (!facultyStaff.length) {
            throw new NotFoundException('Faculty Staff not found');
        }

        const staff = facultyStaff[0];

        // 2.2 Map data to Chiang Rai Schema
        // Note: We COPY data, so it becomes independent. Updates in Faculty won't affect Chiang Rai unless re-imported.
        const newStaffData: typeof chiangRaiStaff.$inferInsert = {
            firstName: staff.firstNameTh,
            lastName: staff.lastNameTh,
            title: staff.prefixTh || '',
            email: staff.contactEmail,
            imageUrl: staff.imageUrl,
            // Default position to their academic position or empty
            position: staff.academicPosition || 'อาจารย์',
            role: role,
            bio: staff.bio, // Optional: Copy bio if needed
            isActive: true
        };

        // 2.3 Insert into Chiang Rai Table
        return this.drizzle.db.insert(chiangRaiStaff).values(newStaffData).returning();
    }
}
