import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JournalService } from './journal.service';
import { CreateEditorialMemberDto } from './dto/create-editorial-member.dto';
import { UpdateEditorialMemberDto } from './dto/update-editorial-member.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('journal/editorial-board')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  findAllPublic() {
    return this.journalService.findAllPublic();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllAdmin() {
    return this.journalService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.journalService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createDto: CreateEditorialMemberDto) {
    return this.journalService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEditorialMemberDto,
  ) {
    return this.journalService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.journalService.remove(id);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  seed() {
    return this.journalService.seedOfficialData();
  }
}
