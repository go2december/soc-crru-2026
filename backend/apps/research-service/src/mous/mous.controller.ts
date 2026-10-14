import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MousService } from './mous.service';
import { CreateMouDto } from './dto/create-mou.dto';
import { UpdateMouDto } from './dto/update-mou.dto';
import { JwtAuthGuard, RolesGuard, Roles } from 'shared/shared';

@Controller('mous')
export class MousController {
  constructor(private readonly mousService: MousService) {}

  @Get()
  findAllPublic(
    @Query('partnerType') partnerType?: string,
    @Query('search') search?: string,
  ) {
    return this.mousService.findAllPublic(partnerType, search);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'STAFF')
  findAllAdmin(
    @Query('partnerType') partnerType?: string,
    @Query('search') search?: string,
  ) {
    return this.mousService.findAllAdmin(partnerType, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mousService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createMouDto: CreateMouDto, @Req() req: any) {
    return this.mousService.create(createMouDto, req?.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @Param('id') id: string,
    @Body() updateMouDto: UpdateMouDto,
    @Req() req: any,
  ) {
    return this.mousService.update(id, updateMouDto, req?.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.mousService.remove(id, req?.user);
  }
}
