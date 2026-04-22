import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.profile.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: string, dto: CreateProfileDto) {
    // Vérifier le nombre actuel de profils
    const count = await this.prisma.profile.count({
      where: { userId },
    });

    if (count >= 5) {
      throw new BadRequestException('Vous avez atteint la limite de 5 profils.');
    }

    // Créer le profil
    return this.prisma.profile.create({
      data: {
        ...dto,
        userId,
        avatar: dto.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.name)}`,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateProfileDto) {
    // Vérifier que le profil appartient bien à l'utilisateur
    const profile = await this.prisma.profile.findFirst({
      where: { id, userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    return this.prisma.profile.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id, userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    // Optionnel : On peut s'assurer qu'il reste au moins 1 profil
    const count = await this.prisma.profile.count({
      where: { userId },
    });

    if (count <= 1) {
      throw new BadRequestException('Vous devez conserver au moins un profil.');
    }

    return this.prisma.profile.delete({
      where: { id },
    });
  }
}
