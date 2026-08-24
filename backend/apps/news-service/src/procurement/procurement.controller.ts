import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { CreateProcurementDto, ProcurementDocumentInputDto } from './dto/create-procurement.dto';
import { UpdateProcurementDto } from './dto/update-procurement.dto';
import { QueryProcurementDto } from './dto/query-procurement.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  // 1. Public: Get List
  @Get()
  findAllPublic(@Query() query: QueryProcurementDto) {
    return this.procurementService.findAll(query, true);
  }

  // 2. Admin: Get List (Includes Drafts/Unpublished)
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllAdmin(@Query() query: QueryProcurementDto) {
    return this.procurementService.findAll(query, false);
  }

  // 3. Public: Get Single by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  // 4. Admin: Create Record
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  create(@Body() createDto: CreateProcurementDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.procurementService.create(createDto, userId);
  }

  // 5. Admin: Update Record
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  update(@Param('id') id: string, @Body() updateDto: UpdateProcurementDto) {
    return this.procurementService.update(id, updateDto);
  }

  // 6. Admin: Delete Record
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  remove(@Param('id') id: string) {
    return this.procurementService.remove(id);
  }

  // 7. Admin: Add document to record
  @Post(':id/documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  addDocument(
    @Param('id') id: string,
    @Body() docDto: ProcurementDocumentInputDto,
  ) {
    return this.procurementService.addDocument(id, docDto);
  }

  // 8. Admin: Delete document from record
  @Delete(':id/documents/:docId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  removeDocument(
    @Param('id') id: string,
    @Param('docId') docId: string,
  ) {
    return this.procurementService.removeDocument(id, docId);
  }
}
