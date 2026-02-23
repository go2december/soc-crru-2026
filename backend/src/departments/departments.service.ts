import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { departments } from '../drizzle/schema';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class DepartmentsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const result = await this.drizzle.db
      .insert(departments)
      .values(createDepartmentDto)
      .returning();
    return result[0];
  }

  async findAll() {
    return await this.drizzle.db.select().from(departments);
  }

  async findOne(id: number) {
    const result = await this.drizzle.db
      .select()
      .from(departments)
      .where(eq(departments.id, id));

    if (result.length === 0) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return result[0];
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const result = await this.drizzle.db
      .update(departments)
      .set(updateDepartmentDto)
      .where(eq(departments.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return result[0];
  }

  async remove(id: number) {
    const result = await this.drizzle.db
      .delete(departments)
      .where(eq(departments.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return result[0];
  }
}
