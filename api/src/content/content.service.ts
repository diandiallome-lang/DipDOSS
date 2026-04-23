import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType } from '@prisma/client';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getFeatured() {
    const count = await this.prisma.content.count({
      where: { type: { in: ['MOVIE', 'SERIES'] } },
    });
    
    if (count === 0) return null;
    
    const skip = Math.floor(Math.random() * count);
    return this.prisma.content.findFirst({
      where: { type: { in: ['MOVIE', 'SERIES'] } },
      skip,
    });
  }

  async getTrending() {
    return this.prisma.content.findMany({
      where: { type: { in: ['MOVIE', 'SERIES'] } },
      take: 10,
      orderBy: { rating: 'desc' },
    });
  }

  async getByType(type: ContentType) {
    return this.prisma.content.findMany({
      where: { type },
      take: 20,
    });
  }

  async getByCategory(type: ContentType, category: string) {
    return this.prisma.content.findMany({
      where: { type, category },
      take: 20,
    });
  }
}
