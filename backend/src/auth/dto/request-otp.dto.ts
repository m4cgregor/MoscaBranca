
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RequestOtpDto {
    @IsNotEmpty()
    @IsString()
    // @IsPhoneNumber('BR') // Optional: enforce region
    phone: string;
}
