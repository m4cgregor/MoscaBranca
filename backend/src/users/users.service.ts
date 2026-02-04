import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { preferences: true },
        });
    }

    async updateProfile(userId: string, data: { role?: UserRole; makes?: string[]; name?: string; email?: string; address?: string; state?: string; city?: string }) {
        // 1. Update basic user data
        if (data.role || data.name || data.email || data.address || data.state || data.city) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    role: data.role,
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    state: data.state,
                    city: data.city,
                },
            });
        }

        // 2. Update preferences if provided
        if (data.makes) {
            await this.prisma.recipientPreference.upsert({
                where: { userId },
                create: {
                    userId,
                    makes: data.makes,
                    states: [], // Default empty or handle similarly
                },
                update: {
                    makes: data.makes,
                },
            });
        }

        return this.getProfile(userId);
    }
}
