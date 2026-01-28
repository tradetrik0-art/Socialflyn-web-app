import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getPosts(clientId: string, status?: string) {
    return this.prisma.post.findMany({
      where: {
        clientId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPost(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async updatePost(id: string, data: any) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async approvePost(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async rejectPost(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: { status: 'DRAFT' },
    });
  }

  async publishPost(id: string, scheduledAt?: Date) {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        scheduledAt,
      },
    });
  }

  async getContentStats(clientId: string) {
    const posts = await this.prisma.post.findMany({
      where: { clientId },
    });

    const totalPosts = posts.length;
    const approvedPosts = posts.filter((p) => p.status === 'APPROVED').length;
    const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED').length;

    const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
    const avgEngagement = totalPosts > 0 ? totalEngagement / totalPosts : 0;

    return {
      totalPosts,
      approvedPosts,
      publishedPosts,
      remainingQuota: 22 - publishedPosts,
      totalEngagement,
      avgEngagement: Math.round(avgEngagement),
    };
  }
}
