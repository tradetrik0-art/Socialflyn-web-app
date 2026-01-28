import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('client/:clientId')
  async getClientDashboard(@Param('clientId') clientId: string) {
    return this.dashboardService.getClientDashboard(clientId);
  }

  @Get('admin/:tenantId')
  async getAdminDashboard(@Param('tenantId') tenantId: string) {
    return this.dashboardService.getAdminDashboard(tenantId);
  }

  @Get('report/:clientId')
  async getMonthlyReport(@Param('clientId') clientId: string) {
    return this.dashboardService.generateMonthlyReport(clientId);
  }
}
