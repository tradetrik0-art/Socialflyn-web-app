import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private openaiApiKey: string;
  private openaiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    private configService: ConfigService,
    private http: HttpService,
    private prisma: PrismaService,
  ) {
    this.openaiApiKey = this.configService.get('OPENAI_API_KEY');
  }

  /**
   * Generate 22 social media posts for a client (1 month batch)
   */
  async generateMonthlyPosts(clientId: string, industry: string, platforms: string[]) {
    const prompt = `You are a creative social media manager for a ${industry} business. 
    Generate 22 unique, engaging social media post captions for ${platforms.join(', ')}.
    For each post, provide: caption (max 300 chars), hashtags (5-10), and content type (carousel/video/image/reels).
    Format as JSON array of objects: [{caption, hashtags, type}]`;

    const response = await this.callOpenAI(prompt);
    const posts = JSON.parse(response);

    // Save posts to database
    const savedPosts = await Promise.all(
      posts.map((post: any) =>
        this.prisma.post.create({
          data: {
            clientId,
            caption: post.caption,
            hashtags: post.hashtags.join(','),
            status: 'DRAFT',
          },
        }),
      ),
    );

    return savedPosts;
  }

  /**
   * Generate AI growth plan (30/60/90 day)
   */
  async generateGrowthPlan(clientId: string, industry: string, monthlyBudget: number) {
    const prompt = `Create a detailed 30/60/90 day growth marketing plan for a ${industry} business with $${monthlyBudget} monthly budget.
    Include:
    - Day 30 tactics and expected metrics
    - Day 60 optimization strategies
    - Day 90 scaling opportunities
    Respond in JSON format: {
      day30: { tactics: [], expected_metrics: {} },
      day60: { tactics: [], expected_metrics: {} },
      day90: { tactics: [], expected_metrics: {} }
    }`;

    const response = await this.callOpenAI(prompt);
    const plan = JSON.parse(response);

    // Save plan
    const savedPlan = await this.prisma.aIPlan.create({
      data: {
        clientId,
        planType: 'THIRTY_SIXTY_NINETY',
        content: plan,
      },
    });

    return savedPlan;
  }

  /**
   * Generate personalized cold outreach template
   */
  async generateOutreachTemplate(clientName: string, industry: string, servicePackage: string) {
    const prompt = `Generate a personalized cold outreach email for a ${industry} business interested in our ${servicePackage} package.
    Client: ${clientName}
    The email should be short (100-150 words), compelling, and include a clear CTA.
    Also generate a WhatsApp variant (max 160 chars).
    Respond in JSON: { email: "...", whatsapp: "..." }`;

    const response = await this.callOpenAI(prompt);
    return JSON.parse(response);
  }

  /**
   * Generate creative prompt for image generation (Stable Diffusion, DALL-E, etc.)
   */
  async generateCreativePrompt(postCaption: string, industry: string) {
    const prompt = `Generate a detailed image generation prompt for Stable Diffusion/DALL-E based on this social media caption:
    "${postCaption}"
    Industry: ${industry}
    The prompt should be descriptive, specific about style/quality, and include relevant keywords.
    Keep it under 200 characters. Respond with just the prompt.`;

    return await this.callOpenAI(prompt);
  }

  /**
   * Analyze performance and suggest optimizations
   */
  async analyzePerformance(metrics: any, clientIndustry: string) {
    const metricsJson = JSON.stringify(metrics);
    const prompt = `As a performance marketing expert, analyze these metrics for a ${clientIndustry} business:
    ${metricsJson}
    
    Provide actionable suggestions in JSON:
    {
      recommendations: ["..."],
      priorityActions: ["..."],
      budgetAllocation: { organic: 0.4, paid: 0.6 }
    }`;

    const response = await this.callOpenAI(prompt);
    return JSON.parse(response);
  }

  /**
   * Core OpenAI API call
   */
  private async callOpenAI(prompt: string, model = 'gpt-4o', temperature = 0.7) {
    try {
      const response = await firstValueFrom(
        this.http.post(
          this.openaiUrl,
          {
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature,
          },
          {
            headers: {
              Authorization: `Bearer ${this.openaiApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('AI service unavailable');
    }
  }
}
