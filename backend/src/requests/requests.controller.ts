
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }

  @Post()
  create(@Request() req, @Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(req.user.userId, createRequestDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.requestsService.findAll(req.user.userId);
  }

  @Get('opportunities')
  findOpportunities(@Request() req) {
    return this.requestsService.findOpportunities(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: 'OPEN' | 'CLOSED') {
    return this.requestsService.updateStatus(id, req.user.userId, status);
  }
}
