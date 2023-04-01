import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Report} from "./report.entity";
import {CreateReportDto} from "./dtos/create-report.dto";
import {User} from "../users/user.entity";

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {
    }

    async create(reportDto: CreateReportDto, user: User): Promise<Report> {
        const report = await this.repo.create();
        report.user = user;
        Object.assign(report, reportDto);
        return await this.repo.save(report);
    }

    async changeApproval(id: number, approved: boolean) {
        const report = await this.repo.findOneBy({id});
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        report.approved = approved;
        return await this.repo.save(report);
    }
}
