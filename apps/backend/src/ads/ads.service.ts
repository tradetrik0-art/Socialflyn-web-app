import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdsService {
  private metaBaseUrl = 'https://graph.instagram.com';
  private googleAdsUrl = 'https://googleads.googleapis.com/google.ads.googleads.v15';

  constructor(
    private configService: ConfigService,
    private http: HttpService,
    private prisma: PrismaService,
  ) {}

  /**
   * Connect Meta Ad Account (OAuth flow)
   */
  async connectMetaAccount(clientId: string, accessToken: string) {
    try {
      // Verify token and get account info
      const response = await firstValueFrom(
        this.http.get(`${this.metaBaseUrl}/me`, {
          params: {
            access_token: accessToken,
            fields: 'id,name,business',
          },
        }),
      );

      const account = await this.prisma.adAccount.create({
        data: {
          clientId,
          provider: 'META',
          accountId: response.data.id,
          credentialsEncrypted: Buffer.from(accessToken).toString('base64'), // In production, use proper encryption
        },
      });

      return account;
    } catch (error) {
      console.error('Meta connection error:', error);
      throw new Error('Failed to connect Meta account');
    }
  }

  /**
   * Fetch ad campaigns and metrics from Meta
   */
  async syncMetaCampaigns(adAccountId: string) {
    const account = await this.prisma.adAccount.findUnique({
      where: { id: adAccountId },
    });

    if (!account) throw new Error('Account not found');

    try {
      const accessToken = Buffer.from(account.credentialsEncrypted, 'base64').toString('utf-8');

      const response = await firstValueFrom(
        this.http.get(`${this.metaBaseUrl}/${account.accountId}/campaigns`, {
          params: {
            access_token: accessToken,
            fields: 'id,name,status,daily_budget,spend,impressions,clicks',
          },
        }),
      );

      // Save/update campaigns
      const campaigns = response.data.data || [];

      await Promise.all(
        campaigns.map((campaign: any) =>
          this.prisma.adCampaign.upsert({
            where: { id: campaign.id },
            update: {
              metricsSnapshot: {
                impressions: campaign.impressions,
                clicks: campaign.clicks,
                spend: campaign.spend,
                ctr: campaign.clicks / campaign.impressions,
              },
              lastFetched: new Date(),
            },
            create: {
              adAccountId,
              name: campaign.name,
              budget: campaign.daily_budget || 0,
              status: campaign.status,
              metricsSnapshot: {
                impressions: campaign.impressions || 0,
                clicks: campaign.clicks || 0,
                spend: campaign.spend || 0,
              },
            },
          }),
        ),
      );

      return campaigns;
    } catch (error) {
      console.error('Meta sync error:', error);
      throw new Error('Failed to sync Meta campaigns');
    }
  }

  /**
   * Get all campaigns for a client with latest metrics
   */
  async getCampaigns(clientId: string) {
    const adAccounts = await this.prisma.adAccount.findMany({
      where: { clientId },
      include: {
        campaigns: true,
      },
    });

    return adAccounts.flatMap((account) =>
      account.campaigns.map((campaign) => ({
        ...campaign,
        provider: account.provider,
      })),
    );
  }

  /**
   * Get performance summary (ROI, ROAS, etc.)
   */
  async getPerformanceSummary(clientId: string) {
    const campaigns = await this.getCampaigns(clientId);

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;

    campaigns.forEach((campaign: any) => {
      const metrics = campaign.metricsSnapshot || {};
      totalSpend += metrics.spend || 0;
      totalImpressions += metrics.impressions || 0;
      totalClicks += metrics.clicks || 0;
    });

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;

    return {
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalImpressions,
      totalClicks,
      ctr: Math.round(ctr * 100) / 100,
      cpc: Math.round(cpc * 100) / 100,
      campaignCount: campaigns.length,
    };
  }

  /**
   * Disconnect an ad account
   */
  async disconnectAccount(adAccountId: string) {
    return this.prisma.adAccount.delete({
      where: { id: adAccountId },
    });
  }
}
