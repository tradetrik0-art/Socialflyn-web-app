import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as Papa from 'papaparse';

@Injectable()
export class AutomationService {
  private sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
  private sendgridKey: string;
  private twilioAccountSid: string;
  private twilioAuthToken: string;
  private twilioWhatsappNumber: string;

  constructor(
    private configService: ConfigService,
    private http: HttpService,
    private prisma: PrismaService,
  ) {
    this.sendgridKey = this.configService.get('SENDGRID_API_KEY');
    this.twilioAccountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    this.twilioAuthToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.twilioWhatsappNumber = this.configService.get('TWILIO_WHATSAPP_NUMBER');
  }

  /**
   * Upload CSV leads and create automation records
   */
  async uploadLeads(clientId: string, csvFile: any) {
    try {
      const text = csvFile.buffer.toString('utf-8');
      const results = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
      });

      const leads = results.data.filter((row: any) => row.email || row.phone);

      const savedLeads = await Promise.all(
        leads.map((lead: any) =>
          this.prisma.automationLead.create({
            data: {
              clientId,
              source: 'CSV_UPLOAD',
              data: lead,
              status: 'NEW',
              sequenceState: {
                last_email_day: 0,
                last_whatsapp_day: 0,
                status: 'pending',
              },
            },
          }),
        ),
      );

      return { imported: savedLeads.length, leads: savedLeads };
    } catch (error) {
      throw new BadRequestException('Invalid CSV file');
    }
  }

  /**
   * Send personalized email via SendGrid
   */
  async sendEmail(to: string, subject: string, htmlContent: string, fromEmail: string) {
    try {
      const response = await firstValueFrom(
        this.http.post(
          this.sendgridUrl,
          {
            personalizations: [{ to: [{ email: to }] }],
            from: { email: fromEmail || 'socialflyn02@gmail.com' },
            subject,
            content: [{ type: 'text/html', value: htmlContent }],
          },
          {
            headers: {
              Authorization: `Bearer ${this.sendgridKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return { success: true, messageId: response.data };
    } catch (error) {
      console.error('SendGrid error:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send WhatsApp message via Twilio
   */
  async sendWhatsApp(toPhone: string, message: string) {
    try {
      const credentials = Buffer.from(`${this.twilioAccountSid}:${this.twilioAuthToken}`).toString('base64');

      const response = await firstValueFrom(
        this.http.post(
          `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
          {
            From: `whatsapp:${this.twilioWhatsappNumber}`,
            To: `whatsapp:${toPhone}`,
            Body: message,
          },
          {
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          },
        ),
      );

      return { success: true, sid: response.data.sid };
    } catch (error) {
      console.error('Twilio error:', error);
      throw new Error('Failed to send WhatsApp message');
    }
  }

  /**
   * Start automated outreach sequence (Day 1, 3, 7)
   */
  async startSequence(clientId: string, leadId: string, sequences: any) {
    const lead = await this.prisma.automationLead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    const leadData = lead.data as any;

    // Day 1 - Send email
    if (sequences.email?.day1) {
      const emailTemplate = sequences.email.day1;
      const htmlContent = this.personalize(emailTemplate, leadData);

      await this.sendEmail(
        leadData.email,
        'Grow with Socialflyn',
        htmlContent,
        sequences.fromEmail || 'socialflyn02@gmail.com',
      );

      console.log(`✉️ Day 1 email sent to ${leadData.email}`);
    }

    // Day 1 - Send WhatsApp
    if (sequences.whatsapp?.day1 && leadData.phone) {
      const whatsappTemplate = sequences.whatsapp.day1;
      const message = this.personalize(whatsappTemplate, leadData);

      await this.sendWhatsApp(leadData.phone, message);

      console.log(`💬 Day 1 WhatsApp sent to ${leadData.phone}`);
    }

    // Update lead status
    await this.prisma.automationLead.update({
      where: { id: leadId },
      data: {
        status: 'CONTACTED',
        lastContacted: new Date(),
        sequenceState: {
          last_email_day: 1,
          last_whatsapp_day: 1,
          status: 'in_progress',
        },
      },
    });

    // Schedule Day 3 & Day 7 (in production, use job queue like Bull)
    this.scheduleFollowup(clientId, leadId, sequences, 3);
    this.scheduleFollowup(clientId, leadId, sequences, 7);

    return { success: true, message: 'Sequence started' };
  }

  /**
   * Schedule follow-up (simplified version)
   */
  private async scheduleFollowup(clientId: string, leadId: string, sequences: any, day: number) {
    // In production, use BullMQ or similar
    // For now, log it
    const delayMs = day * 24 * 60 * 60 * 1000;
    console.log(`📅 Scheduled Day ${day} follow-up in ${delayMs}ms`);

    // setTimeout(() => this.sendFollowup(clientId, leadId, sequences, day), delayMs);
  }

  /**
   * Personalize template with lead data
   */
  private personalize(template: string, leadData: any): string {
    let personalized = template;
    Object.keys(leadData).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      personalized = personalized.replace(regex, leadData[key]);
    });
    return personalized;
  }

  /**
   * Get automation sequences for a tenant
   */
  async getSequences(tenantId: string) {
    return this.prisma.outreachSequence.findMany({
      where: { tenantId, isActive: true },
    });
  }

  /**
   * Create or update sequence
   */
  async upsertSequence(tenantId: string, data: any) {
    return this.prisma.outreachSequence.upsert({
      where: { id: data.id || 'new' },
      update: data,
      create: { tenantId, ...data },
    });
  }

  /**
   * Get leads for a client with status
   */
  async getLeads(clientId: string, status?: string) {
    return this.prisma.automationLead.findMany({
      where: {
        clientId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
