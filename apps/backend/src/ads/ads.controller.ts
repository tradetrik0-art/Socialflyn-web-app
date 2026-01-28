import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdsService } from './ads.service';

@Controller('ads')
@UseGuards(AuthGuard('jwt'))
export class AdsController {
  constructor(private adsService: AdsService) {}

  @Post('connect-meta/:clientId')
  async connectMeta(@Param('clientId') clientId: string, @Body() body: { accessToken: string }) {
    return this.adsService.connectMetaAccount(clientId, body.accessToken);
  }

  @Post('sync-meta/:adAccountId')
  async syncMeta(@Param('adAccountId') adAccountId: string) {
    return this.adsService.syncMetaCampaigns(adAccountId);
  }

  @Get('campaigns/:clientId')
  async getCampaigns(@Param('clientId') clientId: string) {
    return this.adsService.getCampaigns(clientId);
  }

  @Get('performance/:clientId')
  async getPerformance(@Param('clientId') clientId: string) {
    return this.adsService.getPerformanceSummary(clientId);
  }

  @Delete('disconnect/:adAccountId')
  async disconnect(@Param('adAccountId') adAccountId: string) {
    return this.adsService.disconnectAccount(adAccountId);
  }
}
