import { PrismaService } from '../prisma/prisma.service';
export declare class DistributionService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    distributeRequest(requestId: string): Promise<void>;
    private sendToVendor;
}
