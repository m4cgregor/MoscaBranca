import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PartRequest, User } from '@prisma/client';

@Injectable()
export class DistributionService {
    private readonly logger = new Logger(DistributionService.name);

    constructor(private prisma: PrismaService) { }

    async distributeRequest(requestId: string) {
        this.logger.log(`Starting distribution for request: ${requestId}`);

        const request = await this.prisma.partRequest.findUnique({
            where: { id: requestId },
        });

        if (!request) {
            this.logger.error(`Request ${requestId} not found during distribution.`);
            return;
        }

        // 1. Find matching vendors
        // Logic: User is VENDOR AND (preferences.makes includes request.make OR preferences is empty/null?)
        // For now, strict matching on preferences.
        const vendors = await this.prisma.user.findMany({
            where: {
                role: 'VENDOR',
                status: 'ACTIVE',
                preferences: {
                    is: {
                        makes: {
                            has: request.make
                        }
                    }
                }
            },
        });

        this.logger.log(`Found ${vendors.length} vendors matching make "${request.make}"`);

        // 2. Mock Send to each vendor
        for (const vendor of vendors) {
            await this.sendToVendor(vendor, request);
        }
    }

    private async sendToVendor(vendor: User, request: PartRequest) {
        try {
            // MOCK: Integration with WhatsApp API would go here.
            this.logger.log(`[MOCK] Sending WhatsApp to ${vendor.phone} (${vendor.name || 'Vendor'}): "New Request: ${request.make} ${request.model} - ${request.partName}"`);

            // Log delivery
            await this.prisma.deliveryLog.create({
                data: {
                    requestId: request.id,
                    recipientId: vendor.id,
                    channel: 'whatsapp',
                    status: 'SENT', // In real app, might be 'QUEUED'
                }
            });

        } catch (error) {
            this.logger.error(`Failed to send to vendor ${vendor.id}`, error);
        }
    }
}
