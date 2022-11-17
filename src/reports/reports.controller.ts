import { Controller, Get, Query } from '@nestjs/common';
import { Body, Param, Patch, Post, UseGuards } from '@nestjs/common/decorators';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from './../guards/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from './../users/user.entity';
import { Serialize } from 'src/interceptors/serialize.iterceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from './../guards/admin.guard';
import { query } from 'express';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto) // service请求返回结果序列化
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  /**
   * 
   * 执行顺序middlerware -> Guard -> interceptor
    如果在Guard去获取interceptor的requst.currentUser会是undefined 
  */
  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    console.log('body', body);
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
