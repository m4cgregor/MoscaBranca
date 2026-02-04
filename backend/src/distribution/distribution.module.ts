import { Module } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [DistributionService],
    exports: [DistributionService],
})
export class DistributionModule { }
