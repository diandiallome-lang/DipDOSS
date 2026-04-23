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

  async getById(id: string, profileId?: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
    });

    if (content && profileId) {
      const [progress, favorite] = await Promise.all([
        this.prisma.progress.findFirst({ where: { profileId, contentId: id } }),
        this.prisma.favorite.findUnique({ where: { profileId_contentId: { profileId, contentId: id } } }),
      ]);
      return { ...content, progress: progress?.position, isFavorite: !!favorite };
    }

    return content;
  }

  async toggleFavorite(profileId: string, contentId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { profileId_contentId: { profileId, contentId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { isFavorite: false };
    }

    await this.prisma.favorite.create({
      data: { profileId, contentId },
    });
    return { isFavorite: true };
  }

  async getFavorites(profileId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { profileId },
      include: { content: true },
      orderBy: { createdAt: 'desc' },
    });
    return favorites.map(f => ({ ...f.content, isFavorite: true }));
  }

  async searchContent(query: string) {
    return this.prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }

  async updateProgress(profileId: string, contentId: string, position: string, completed: boolean) {
    const existing = await this.prisma.progress.findFirst({
      where: { profileId, contentId },
    });

    if (existing) {
      return this.prisma.progress.update({
        where: { id: existing.id },
        data: { position, completed, updatedAt: new Date() },
      });
    }

    return this.prisma.progress.create({
      data: { profileId, contentId, position, completed },
    });
  }

  async getContinueWatching(profileId: string) {
    const progressItems = await this.prisma.progress.findMany({
      where: { profileId, completed: false },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: { content: true },
    });
    
    // Return the content with progress info attached
    return progressItems.map(p => ({
      ...p.content,
      progress: p.position,
    }));
  }
}
