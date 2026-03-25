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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Create News (ADMIN, EDITOR)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() createNewsDto: CreateNewsDto, @Req() req: any) {
    // Automatically set authorId from logged in user if not provided
    if (!createNewsDto.authorId) {
      createNewsDto.authorId = req.user.id;
    }
    return this.newsService.create(createNewsDto);
  }

  // Public: Get List
  @Get()
  findAll(@Query('category') category?: string) {
    return this.newsService.findAllPublic(category);
  }

  // Admin: Get List (includes drafts)
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAllAdmin() {
    return this.newsService.findAllAdmin();
  }

  // Public: Get by Slug
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.newsService.findBySlug(slug);
  }

  // Admin: Get by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  // Update News (ADMIN, EDITOR)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  // Delete News (ADMIN, EDITOR)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
