import { Controller, Get, Post, Put, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';

@Controller('content')
@UseGuards(AuthGuard('jwt'))
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get('posts/:clientId')
  async getPosts(@Param('clientId') clientId: string, @Query('status') status?: string) {
    return this.contentService.getPosts(clientId, status);
  }

  @Get('post/:id')
  async getPost(@Param('id') id: string) {
    return this.contentService.getPost(id);
  }

  @Put('post/:id')
  async updatePost(@Param('id') id: string, @Body() data: any) {
    return this.contentService.updatePost(id, data);
  }

  @Post('post/:id/approve')
  async approvePost(@Param('id') id: string) {
    return this.contentService.approvePost(id);
  }

  @Post('post/:id/reject')
  async rejectPost(@Param('id') id: string) {
    return this.contentService.rejectPost(id);
  }

  @Post('post/:id/publish')
  async publishPost(@Param('id') id: string, @Body() body?: { scheduledAt?: Date }) {
    return this.contentService.publishPost(id, body?.scheduledAt);
  }

  @Get('stats/:clientId')
  async getContentStats(@Param('clientId') clientId: string) {
    return this.contentService.getContentStats(clientId);
  }
}
