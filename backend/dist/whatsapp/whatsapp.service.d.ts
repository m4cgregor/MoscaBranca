import { HttpService } from '@nestjs/axios';
export declare class WhatsappService {
    private httpService;
    private readonly logger;
    private readonly instanceName;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(httpService: HttpService);
    createInstance(): Promise<any>;
    connectInstance(): Promise<any>;
    sendText(phone: string, text: string): Promise<any>;
}
