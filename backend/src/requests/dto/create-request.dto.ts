
import { IsNotEmpty, IsString, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestDto {
    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1900)
    @Max(new Date().getFullYear() + 1)
    @Type(() => Number)
    year: number;

    @IsOptional()
    @IsString()
    color?: string;

    @IsNotEmpty()
    @IsString()
    partName: string;

    @IsOptional()
    @IsString()
    description?: string;

    // For MVP, photo might be a Base64 string or a URL from a pre-upload step
    // We'll keep it simple for now and accept a string URL or placeholder
    @IsOptional()
    @IsString()
    photoUrl?: string;
}
