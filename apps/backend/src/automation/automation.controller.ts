import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AutomationService } from './automation.service';

@Controller('automation')
@UseGuards(AuthGuard('jwt'))
export class AutomationController {
  constructor(private automationService: AutomationService) {}

  @Post('upload-leads/:clientId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLeads(@Param('clientId') clientId: string, @UploadedFile() file: any) {
    return this.automationService.uploadLeads(clientId, file);
  }

  @Post('send-email')
  async sendEmail(@Body() body: { to: string; subject: string; html: string; from?: string }) {
    return this.automationService.sendEmail(body.to, body.subject, body.html, body.from);
  }

  @Post('send-whatsapp')
  async sendWhatsApp(@Body() body: { phone: string; message: string }) {
    return this.automationService.sendWhatsApp(body.phone, body.message);
  }

  @Post('start-sequence/:clientId/:leadId')
  async startSequence(
    @Param('clientId') clientId: string,
    @Param('leadId') leadId: string,
    @Body() body: any,
  ) {
    return this.automationService.startSequence(clientId, leadId, body);
  }

  @Get('sequences/:tenantId')
  async getSequences(@Param('tenantId') tenantId: string) {
    return this.automationService.getSequences(tenantId);
  }

  @Post('sequence')
  async upsertSequence(@Body() body: any) {
    return this.automationService.upsertSequence(body.tenantId, body);
  }

  @Get('leads/:clientId')
  async getLeads(@Param('clientId') clientId: string) {
    return this.automationService.getLeads(clientId);
  }
}
