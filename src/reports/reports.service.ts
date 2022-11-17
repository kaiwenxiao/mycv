import { Injectable, NotFoundException } from '@nestjs/common';
import { createQueryBuilder, Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate(estimateDto: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        // 安全考虑，写成变量而不是字符串 sql injection exploit
        .where('make=:make', { make: estimateDto.make })
        .andWhere('model=:model', { model: estimateDto.model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage: estimateDto.mileage })
        .limit(3)
        // 查找多列的时候使用getRawMany
        // .getRawMany()
        .getRawOne()
    );
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
