import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, academicServices, academicServiceMembers, staffProfiles } from 'db/database';
import { CreateAcademicServiceDto } from './dto/create-academic-service.dto';
import { UpdateAcademicServiceDto } from './dto/update-academic-service.dto';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class AcademicServicesService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async create(createDto: CreateAcademicServiceDto) {
    const { members, ...data } = createDto;

    const [newService] = await this.drizzleService.db
      .insert(academicServices)
      .values({
        ...data,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : undefined,
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
          .innerJoin(staffProfiles, eq(academicServiceMembers.staffId, staffProfiles.id))
          .where(eq(academicServiceMembers.academicServiceId, service.id));
        return { ...service, members };
      }),
    );
  }

  async findAllAdmin() {
    const services = await this.drizzleService.db
      .select()
      .from(academicServices)
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
          .innerJoin(staffProfiles, eq(academicServiceMembers.staffId, staffProfiles.id))
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
      .innerJoin(staffProfiles, eq(academicServiceMembers.staffId, staffProfiles.id))
      .where(eq(academicServiceMembers.academicServiceId, id));

    return {
      ...service,
      members,
    };
  }

  async update(id: string, updateDto: UpdateAcademicServiceDto) {
    await this.findOne(id); // Check exists

    const { members, ...data } = updateDto;

    const [updatedService] = await this.drizzleService.db
      .update(academicServices)
      .set({
        ...data,
        publishedAt: data.publishedAt
          ? new Date(data.publishedAt)
          : undefined,
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

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id); // Check exists
    await this.drizzleService.db
      .delete(academicServices)
      .where(eq(academicServices.id, id));
    return { success: true };
  }
}
