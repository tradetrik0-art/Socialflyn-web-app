import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getTenant(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: {
        clients: true,
      },
    });
  }

  async updateSettings(id: string, settings: any) {
    return this.prisma.tenant.update({
      where: { id },
      data: { settings },
    });
  }
}
