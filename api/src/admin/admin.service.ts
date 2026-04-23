import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [userCount, contentCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.content.count(),
    ]);
    return {
      totalUsers: userCount,
      totalContent: contentCount,
      revenue: 0, // Simplified for now
    };
  }

  async getAllContent() {
    return this.prisma.content.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createContent(data: any) {
    return this.prisma.content.create({
      data,
    });
  }

  async updateContent(id: string, data: any) {
    return this.prisma.content.update({
      where: { id },
      data,
    });
  }

  async deleteContent(id: string) {
    return this.prisma.content.delete({
      where: { id },
    });
  }
}
