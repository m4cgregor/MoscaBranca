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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    httpService;
    logger = new common_1.Logger(WhatsappService_1.name);
    instanceName = 'moscabranca-main';
    apiKey = process.env.EVOLUTION_API_KEY || 'moscabranca-secret-key';
    baseUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8081';
    constructor(httpService) {
        this.httpService = httpService;
    }
    async createInstance() {
        try {
            const url = `${this.baseUrl}/instance/create`;
            const data = {
                instanceName: this.instanceName,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS',
            };
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(url, data, {
                headers: {
                    apikey: this.apiKey
                }
            }));
            this.logger.log('Instance created successfully', response.data);
            return response.data;
        }
        catch (error) {
        }
    }
    async connectInstance() {
        try {
            const url = `${this.baseUrl}/instance/connect/${this.instanceName}`;
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(url, {
                headers: { apikey: this.apiKey }
            }));
            this.logger.log('Connection response', response.data);
            return response.data;
        }
        catch (error) {
            this.logger.error('Error connecting instance', error.response?.data || error.message);
            throw error;
        }
    }
    async sendText(phone, text) {
        try {
            const cleanPhone = phone.replace(/\D/g, '');
            const url = `${this.baseUrl}/message/sendText/${this.instanceName}`;
            const body = {
                number: cleanPhone,
                options: {
                    delay: 1200,
                    presence: 'composing',
                    linkPreview: false
                },
                textMessage: {
                    text: text
                }
            };
            this.logger.log(`Sending WhatsApp to ${cleanPhone}: ${text}`);
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(url, body, {
                headers: { apikey: this.apiKey }
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to send WhatsApp to ${phone}`, error.response?.data || error.message);
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map