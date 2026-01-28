import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Client Dashboard Summary
   */
  async getClientDashboard(clientId: string) {
    // Posts stats
    const posts = await this.prisma.post.findMany({
      where: { clientId },
    });

    const postsStats = {
      total: posts.length,
      approved: posts.filter((p) => p.status === 'APPROVED').length,
      published: posts.filter((p) => p.status === 'PUBLISHED').length,
      remaining: 22 - posts.filter((p) => p.status === 'PUBLISHED').length,
    };

    // Engagement stats
    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = posts.reduce((sum, p) => sum + p.comments, 0);
    const totalShares = posts.reduce((sum, p) => sum + p.shares, 0);

    const engagementStats = {
      totalEngagement: totalLikes + totalComments + totalShares,
      avgEngagementPerPost: posts.length > 0 ? Math.round((totalLikes + totalComments + totalShares) / posts.length) : 0,
      likes: totalLikes,
      comments: totalComments,
      shares: totalShares,
    };

    // AI Plan
    const aiPlan = await this.prisma.aIPlan.findFirst({
      where: { clientId },
      orderBy: { generatedAt: 'desc' },
    });

    // Ad accounts
    const adAccounts = await this.prisma.adAccount.findMany({
      where: { clientId },
      include: { campaigns: true },
    });

    const totalAdSpend = adAccounts
      .flatMap((acc) => acc.campaigns)
      .reduce((sum, camp) => sum + (camp.metricsSnapshot?.spend || 0), 0);

    // Leads status
    const leads = await this.prisma.automationLead.findMany({
      where: { clientId },
    });

    const leadsStats = {
      total: leads.length,
      new: leads.filter((l) => l.status === 'NEW').length,
      contacted: leads.filter((l) => l.status === 'CONTACTED').length,
      converted: leads.filter((l) => l.status === 'CONVERTED').length,
    };

    return {
      clientId,
      posts: postsStats,
      engagement: engagementStats,
      ads: {
        connectedAccounts: adAccounts.length,
        totalSpend: Math.round(totalAdSpend * 100) / 100,
        campaignCount: adAccounts.flatMap((a) => a.campaigns).length,
      },
      plan: aiPlan ? { id: aiPlan.id, type: aiPlan.planType, status: aiPlan.status } : null,
      leads: leadsStats,
      lastUpdated: new Date(),
    };
  }

  /**
   * Admin Dashboard (all clients overview)
   */
  async getAdminDashboard(tenantId: string) {
    const clients = await this.prisma.client.findMany({
      where: { tenantId },
      include: {
        posts: true,
        adAccounts: { include: { campaigns: true } },
        leads: true,
      },
    });

    const clientCount = clients.length;
    const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;

    let totalRevenue = 0;
    let totalPostsGenerated = 0;
    let totalAdSpend = 0;

    clients.forEach((client) => {
      // Estimate revenue (simple calculation)
      totalRevenue += client.monthlyBudget;
      totalPostsGenerated += client.posts.filter((p) => p.status === 'PUBLISHED').length;
      totalAdSpend += client.adAccounts
        .flatMap((acc) => acc.campaigns)
        .reduce((sum, camp) => sum + (camp.metricsSnapshot?.spend || 0), 0);
    });

    // Package distribution
    const packages = {
      socialMediaManagement: clients.filter((c) => c.packageType === 'SOCIAL_MEDIA_MANAGEMENT').length,
      smoAds: clients.filter((c) => c.packageType === 'SMO_ADS').length,
      customAllInOne: clients.filter((c) => c.packageType === 'CUSTOM_ALL_IN_ONE').length,
    };

    const automationStats = {
      totalLeads: clients.reduce((sum, c) => sum + c.leads.length, 0),
      contactedLeads: clients.reduce((sum, c) => sum + c.leads.filter((l) => l.status === 'CONTACTED').length, 0),
      convertedLeads: clients.reduce((sum, c) => sum + c.leads.filter((l) => l.status === 'CONVERTED').length, 0),
    };

    return {
      tenantId,
      overview: {
        totalClients: clientCount,
        activeClients,
        totalMonthlyRevenue: Math.round(totalRevenue * 100) / 100,
        totalPostsGenerated,
        totalAdSpend: Math.round(totalAdSpend * 100) / 100,
      },
      packages,
      automation: automationStats,
      topClients: clients
        .sort((a, b) => b.monthlyBudget - a.monthlyBudget)
        .slice(0, 5)
        .map((c) => ({ id: c.id, name: c.name, budget: c.monthlyBudget, status: c.status })),
      lastUpdated: new Date(),
    };
  }

  /**
   * Generate Monthly PDF Report
   */
  async generateMonthlyReport(clientId: string) {
    const dashboard = await this.getClientDashboard(clientId);
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });

    const report = {
      clientName: client?.name,
      period: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      ...dashboard,
      recommendations: [
        'Increase posting frequency for better engagement',
        'Test new content formats (Reels, Stories)',
        'Allocate more budget to top-performing ads',
        'Implement weekly performance reviews',
      ],
    };

    // In production, use pdfkit or puppeteer to generate actual PDF
    return report;
  }
}
