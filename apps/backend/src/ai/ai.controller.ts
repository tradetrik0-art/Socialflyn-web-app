import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-posts/:clientId')
  async generatePosts(
    @Param('clientId') clientId: string,
    @Body() body: { industry: string; platforms: string[] },
    @Request() req: any,
  ) {
    return this.aiService.generateMonthlyPosts(clientId, body.industry, body.platforms);
  }

  @Post('growth-plan/:clientId')
  async generateGrowthPlan(
    @Param('clientId') clientId: string,
    @Body() body: { industry: string; monthlyBudget: number },
  ) {
    return this.aiService.generateGrowthPlan(clientId, body.industry, body.monthlyBudget);
  }

  @Post('outreach-template')
  async generateOutreach(
    @Body() body: { clientName: string; industry: string; package: string },
  ) {
    return this.aiService.generateOutreachTemplate(body.clientName, body.industry, body.package);
  }

  @Post('creative-prompt')
  async generateCreativePrompt(@Body() body: { caption: string; industry: string }) {
    return this.aiService.generateCreativePrompt(body.caption, body.industry);
  }

  @Post('analyze-performance')
  async analyzePerformance(
    @Body() body: { metrics: any; industry: string },
  ) {
    return this.aiService.analyzePerformance(body.metrics, body.industry);
  }
}
