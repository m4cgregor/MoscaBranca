import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(req: any, createRequestDto: CreateRequestDto): Promise<{
        id: string;
        readableId: string | null;
        make: string;
        model: string;
        year: number;
        color: string | null;
        partName: string;
        description: string | null;
        photoUrl: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    }>;
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        readableId: string | null;
        make: string;
        model: string;
        year: number;
        color: string | null;
        partName: string;
        description: string | null;
        photoUrl: string | null;
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    }[]>;
    findOpportunities(req: any): Promise<({
        user: {
            name: string | null;
            role: import(".prisma/client").$Enums.UserRole;
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
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__PartRequestClient<({
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
        status: import(".prisma/client").$Enums.RequestStatus;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date | null;
        userId: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateStatus(req: any, id: string, status: 'OPEN' | 'CLOSED'): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
