import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<({
        preferences: {
            id: string;
            states: string[];
            makes: string[];
            userId: string;
        } | null;
    } & {
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
    }) | null>;
    updateProfile(req: any, body: {
        role?: UserRole;
        makes?: string[];
        name?: string;
        email?: string;
        address?: string;
        state?: string;
        city?: string;
    }): Promise<({
        preferences: {
            id: string;
            states: string[];
            makes: string[];
            userId: string;
        } | null;
    } & {
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
    }) | null>;
}
