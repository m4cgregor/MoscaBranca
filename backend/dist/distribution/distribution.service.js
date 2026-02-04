"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DistributionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistributionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DistributionService = DistributionService_1 = class DistributionService {
    prisma;
    logger = new common_1.Logger(DistributionService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async distributeRequest(requestId) {
        this.logger.log(`Starting distribution for request: ${requestId}`);
        const request = await this.prisma.partRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            this.logger.error(`Request ${requestId} not found during distribution.`);
            return;
        }
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
        for (const vendor of vendors) {
            await this.sendToVendor(vendor, request);
        }
    }
    async sendToVendor(vendor, request) {
        try {
            this.logger.log(`[MOCK] Sending WhatsApp to ${vendor.phone} (${vendor.name || 'Vendor'}): "New Request: ${request.make} ${request.model} - ${request.partName}"`);
            await this.prisma.deliveryLog.create({
                data: {
                    requestId: request.id,
                    recipientId: vendor.id,
                    channel: 'whatsapp',
                    status: 'SENT',
                }
            });
        }
        catch (error) {
            this.logger.error(`Failed to send to vendor ${vendor.id}`, error);
        }
    }
};
exports.DistributionService = DistributionService;
exports.DistributionService = DistributionService = DistributionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DistributionService);
//# sourceMappingURL=distribution.service.js.map