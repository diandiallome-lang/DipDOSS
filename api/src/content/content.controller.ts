import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentType } from '@prisma/client';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('featured')
  getFeatured() {
    return this.contentService.getFeatured();
  }

  @Get('trending')
  getTrending() {
    return this.contentService.getTrending();
  }

  @Get('type/:type')
  getByType(@Param('type') type: ContentType) {
    return this.contentService.getByType(type);
  }

  @Get('category/:type/:category')
  getByCategory(
    @Param('type') type: ContentType,
    @Param('category') category: string,
  ) {
    return this.contentService.getByCategory(type, category);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.contentService.getById(id);
  }
}
