import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { staffProfiles, departments } from '../drizzle/schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class StaffService {
    constructor(private readonly drizzle: DrizzleService) { }

    async create(createStaffDto: CreateStaffDto) {
        // Check if staff profile already exists for this user (only if userId is provided)
        if (createStaffDto.userId) {
            const existing = await this.drizzle.db
                .select()
                .from(staffProfiles)
                .where(eq(staffProfiles.userId, createStaffDto.userId));

            if (existing.length > 0) {
                throw new BadRequestException('Staff profile already exists for this user');
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

    async findAll() {
        return await this.drizzle.db
            .select({
                id: staffProfiles.id,
                prefixTh: staffProfiles.prefixTh,
                firstNameTh: staffProfiles.firstNameTh,
                lastNameTh: staffProfiles.lastNameTh,
                prefixEn: staffProfiles.prefixEn,
                firstNameEn: staffProfiles.firstNameEn,
                lastNameEn: staffProfiles.lastNameEn,
                staffType: staffProfiles.staffType,
                academicPosition: staffProfiles.academicPosition,
                adminPosition: staffProfiles.adminPosition,
                education: staffProfiles.education,
                expertise: staffProfiles.expertise,
                imageUrl: staffProfiles.imageUrl,
                contactEmail: staffProfiles.contactEmail,
                sortOrder: staffProfiles.sortOrder,
                department: departments.nameTh,
                departmentEn: departments.nameEn,
            })
            .from(staffProfiles)
            .leftJoin(departments, eq(staffProfiles.departmentId, departments.id))
            .orderBy(staffProfiles.sortOrder);
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
                academicPosition: staffProfiles.academicPosition,
                adminPosition: staffProfiles.adminPosition,
                education: staffProfiles.education,
                expertise: staffProfiles.expertise,
                imageUrl: staffProfiles.imageUrl,
                bio: staffProfiles.bio,
                contactEmail: staffProfiles.contactEmail,
                sortOrder: staffProfiles.sortOrder,
                departmentId: staffProfiles.departmentId,
                userId: staffProfiles.userId,
                department: departments.nameTh,
                departmentEn: departments.nameEn,
            })
            .from(staffProfiles)
            .leftJoin(departments, eq(staffProfiles.departmentId, departments.id))
            .where(eq(staffProfiles.id, id));

        if (result.length === 0) {
            throw new NotFoundException(`Staff profile with ID ${id} not found`);
        }
        return result[0];
    }

    async update(id: string, updateStaffDto: UpdateStaffDto) {
        const result = await this.drizzle.db
            .update(staffProfiles)
            .set(updateStaffDto)
            .where(eq(staffProfiles.id, id))
            .returning();

        if (result.length === 0) {
            throw new NotFoundException(`Staff profile with ID ${id} not found`);
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
        return result[0];
    }
}
