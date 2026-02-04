import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    requestOtp(phone: string): Promise<{
        message: string;
    }>;
    verifyOtp(phone: string, code: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            phone: string;
            name: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            email: string | null;
            state: string | null;
            city: string | null;
            address: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            companyId: string | null;
        };
    }>;
}
