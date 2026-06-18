import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, academicServices } from 'db/database';
import { CreateAcademicServiceDto } from './dto/create-academic-service.dto';
import { UpdateAcademicServiceDto } from './dto/update-academic-service.dto';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class AcademicServicesService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async create(createDto: CreateAcademicServiceDto) {
    const [newService] = await this.drizzleService.db
      .insert(academicServices)
      .values({
        ...createDto,
        publishedAt: createDto.publishedAt
          ? new Date(createDto.publishedAt)
          : undefined,
      })
      .returning();
    return newService;
  }

  async findAllPublic() {
    return this.drizzleService.db
      .select()
      .from(academicServices)
      .where(eq(academicServices.isPublished, true))
      .orderBy(desc(academicServices.createdAt));
  }

  async findAllAdmin() {
    return this.drizzleService.db
      .select()
      .from(academicServices)
      .orderBy(desc(academicServices.createdAt));
  }

  async findOne(id: string) {
    const [service] = await this.drizzleService.db
      .select()
      .from(academicServices)
      .where(eq(academicServices.id, id));

    if (!service) {
      throw new NotFoundException(`Academic service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, updateDto: UpdateAcademicServiceDto) {
    await this.findOne(id); // Check exists

    const [updatedService] = await this.drizzleService.db
      .update(academicServices)
      .set({
        ...updateDto,
        publishedAt: updateDto.publishedAt
          ? new Date(updateDto.publishedAt)
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(academicServices.id, id))
      .returning();

    return updatedService;
  }

  async remove(id: string) {
    await this.findOne(id); // Check exists
    await this.drizzleService.db
      .delete(academicServices)
      .where(eq(academicServices.id, id));
    return { success: true };
  }
}
