import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        tenantId,
        name: dto.name,
        industry: dto.industry,
        platforms: dto.platforms,
        monthlyBudget: dto.monthlyBudget,
        packageType: dto.packageType || 'SOCIAL_MEDIA_MANAGEMENT',
      },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.client.findMany({
      where: { tenantId },
      include: {
        posts: true,
        adAccounts: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.client.findFirst({
      where: { id, tenantId },
      include: {
        posts: true,
        adAccounts: true,
        aiPlans: true,
      },
    });
  }

  async update(id: string, tenantId: string, data: any) {
    return this.prisma.client.updateMany({
      where: { id, tenantId },
      data,
    });
  }
}
