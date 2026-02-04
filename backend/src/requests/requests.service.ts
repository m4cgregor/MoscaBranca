
import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RequestStatus } from '@prisma/client';

import { DistributionService } from '../distribution/distribution.service';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private distributionService: DistributionService
  ) { }

  async create(userId: string, dto: CreateRequestDto) {
    // Generate a readable ID (e.g. MB-1001)
    // For MVP, we'll just use a random number or count
    const count = await this.prisma.partRequest.count();
    const readableId = `MB-${(1000 + count).toString()}`;

    const request = await this.prisma.partRequest.create({
      data: {
        userId,
        readableId,
        status: RequestStatus.OPEN,
        // DTO fields
        make: dto.make,
        model: dto.model,
        year: dto.year,
        color: dto.color,
        partName: dto.partName,
        description: dto.description,
        photoUrl: dto.photoUrl,
        // Default expiration 7 days from now
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Verify and distribute
    // We don't await this to keep the API fast, OR we await to ensure it starts. 
    // Usually async, but for MVP await is safer to catch errors immediately or debug. 
    // Let's not await to keep response fast, but catch errors.
    this.distributionService.distributeRequest(request.id).catch(err => {
      console.error('Error distributing request', err);
    });

    return request;
  }

  findAll(userId: string) {
    return this.prisma.partRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.partRequest.findUnique({
      where: { id },
      include: {
        deliveries: true,
        user: { select: { phone: true, name: true, address: true } }
      },
    });
  }

  // Close request
  updateStatus(id: string, userId: string, status: RequestStatus) {
    return this.prisma.partRequest.updateMany({
      where: { id, userId }, // Ensure ownership
      data: { status },
    });
  }

  async findOpportunities(userId: string) {
    // 1. Get user preferences
    const prefs = await this.prisma.recipientPreference.findUnique({
      where: { userId },
    });

    if (!prefs || !prefs.makes || prefs.makes.length === 0) {
      return [];
    }

    // 2. Find OPEN requests matching makes, EXCLUDING own requests (optional, but logical)
    return this.prisma.partRequest.findMany({
      where: {
        status: RequestStatus.OPEN,
        make: { in: prefs.makes },
        userId: { not: userId }, // Don't show own requests
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, role: true } } // Show who asked (basic info)
      }
    });
  }
}
