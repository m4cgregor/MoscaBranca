
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);
    private readonly instanceName = 'moscabranca-main';
    private readonly apiKey = process.env.EVOLUTION_API_KEY || 'moscabranca-secret-key';

    // Default to localhost:8081 for local. In Docker, it should be http://evolution-api:8080
    private readonly baseUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8081';

    constructor(private httpService: HttpService) { }

    /**
     * Tries to create an instance. If it exists, it might fail or return existing info.
     * This should ideally be called once during setup or manually.
     */
    async createInstance() {
        try {
            const url = `${this.baseUrl}/instance/create`;
            const data = {
                instanceName: this.instanceName,
                qrcode: true,
                integration: 'WHATSAPP-BAILEYS',
            };

            const response = await lastValueFrom(
                this.httpService.post(url, data, {
                    headers: {
                        apikey: this.apiKey
                    }
                })
            );

            this.logger.log('Instance created successfully', response.data);
            return response.data;
        } catch (error) {
            // this.logger.error('Error creating instance (might already exist)', error.response?.data || error.message);
            // Don't throw, just log.
        }
    }

    /**
     * Connects to the instance (get QR code).
     */
    async connectInstance() {
        try {
            const url = `${this.baseUrl}/instance/connect/${this.instanceName}`;
            const response = await lastValueFrom(
                this.httpService.get(url, {
                    headers: { apikey: this.apiKey }
                })
            );
            this.logger.log('Connection response', response.data);
            return response.data; // Should contain base64 QR or status
        } catch (error) {
            this.logger.error('Error connecting instance', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Send a text message.
     */
    async sendText(phone: string, text: string) {
        try {
            // Ensure phone format is correct (e.g. 5511999999999)
            // Evolution usually handles raw numbers but '55' prefix is safer for Brazil.
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

            const response = await lastValueFrom(
                this.httpService.post(url, body, {
                    headers: { apikey: this.apiKey }
                })
            );

            return response.data;
        } catch (error) {
            this.logger.error(`Failed to send WhatsApp to ${phone}`, error.response?.data || error.message);
            // In a real scenario, you might want to throw or fallback to email/SMS
        }
    }
}
