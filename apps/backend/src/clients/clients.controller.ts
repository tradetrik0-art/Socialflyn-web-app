import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto';

@Controller('clients')
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  async create(@Body() dto: CreateClientDto, @Request() req: any) {
    return this.clientsService.create(req.user.tenantId, dto);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.clientsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.clientsService.findOne(id, req.user.tenantId);
  }
}
