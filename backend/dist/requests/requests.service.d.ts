import { CreateRequestDto } from './dto/create-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from '@prisma/client';
import { DistributionService } from '../distribution/distribution.service';
export declare class RequestsService {
    private prisma;
    private distributionService;
    constructor(prisma: PrismaService, distributionService: DistributionService);
    create(userId: string, dto: CreateRequestDto): Promise<{
        id: string;
        readableId: string | null;
        make: string;
        model: string;
        year: number;
        color: string | null;
        partName: string;
        description: string | null;
        photoUrl: string | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    }>;
    findAll(userId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        readableId: string | null;
        make: string;
        model: string;
        year: number;
        color: string | null;
        partName: string;
        description: string | null;
        photoUrl: string | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__PartRequestClient<({
        user: {
            phone: string;
            name: string | null;
            address: string | null;
        };
        deliveries: {
            id: string;
            recipientId: string;
            channel: string;
            status: string;
            sentAt: Date;
            requestId: string;
        }[];
    } & {
        id: string;
        readableId: string | null;
        make: string;
        model: string;
        year: number;
        color: string | null;
        partName: string;
        description: string | null;
        photoUrl: string | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus(id: string, userId: string, status: RequestStatus): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    findOpportunities(userId: string): Promise<({
        user: {
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        };
    } & {
        id: string;
        readableId: string | null;
        make: string;
        model: string;
        year: number;
        color: string | null;
        partName: string;
        description: string | null;
        photoUrl: string | null;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    })[]>;
}
