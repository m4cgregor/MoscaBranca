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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const distribution_service_1 = require("../distribution/distribution.service");
let RequestsService = class RequestsService {
    prisma;
    distributionService;
    constructor(prisma, distributionService) {
        this.prisma = prisma;
        this.distributionService = distributionService;
    }
    async create(userId, dto) {
        const count = await this.prisma.partRequest.count();
        const readableId = `MB-${(1000 + count).toString()}`;
        const request = await this.prisma.partRequest.create({
            data: {
                userId,
                readableId,
                status: client_1.RequestStatus.OPEN,
                make: dto.make,
                model: dto.model,
                year: dto.year,
                color: dto.color,
                partName: dto.partName,
                description: dto.description,
                photoUrl: dto.photoUrl,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        this.distributionService.distributeRequest(request.id).catch(err => {
            console.error('Error distributing request', err);
        });
        return request;
    }
    findAll(userId) {
        return this.prisma.partRequest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    findOne(id) {
        return this.prisma.partRequest.findUnique({
            where: { id },
            include: {
                deliveries: true,
                user: { select: { phone: true, name: true, address: true } }
            },
        });
    }
    updateStatus(id, userId, status) {
        return this.prisma.partRequest.updateMany({
            where: { id, userId },
            data: { status },
        });
    }
    async findOpportunities(userId) {
        const prefs = await this.prisma.recipientPreference.findUnique({
            where: { userId },
        });
        if (!prefs || !prefs.makes || prefs.makes.length === 0) {
            return [];
        }
        return this.prisma.partRequest.findMany({
            where: {
                status: client_1.RequestStatus.OPEN,
                make: { in: prefs.makes },
                userId: { not: userId },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, role: true } }
            }
        });
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        distribution_service_1.DistributionService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map