
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // Request OTP
  async requestOtp(phone: string) {
    // 1. Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Hash code
    const hashedCode = await bcrypt.hash(code, 10);

    // 3. Expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 4. Save to DB
    await this.prisma.otpCode.create({
      data: {
        phone,
        code: hashedCode,
        expiresAt,
      },
    });

    // 5. Mock send (log to console)
    console.log(`[DEV MODE] OTP for ${phone}: ${code}`);

    return { message: 'OTP sent (check console)' };
  }

  // Verify OTP & Login/Register
  async verifyOtp(phone: string, code: string) {
    // 1. Find latest valid OTP
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // 2. Verify hash
    const isMatch = await bcrypt.compare(code, otpRecord.code);
    if (!isMatch) {
      throw new BadRequestException('Invalid OTP');
    }

    // 3. Mark as used
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // 4. Find or Create User
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Create new user (default role OFFICE)
      user = await this.prisma.user.create({
        data: {
          phone,
          role: UserRole.OFFICE, // Default
        },
      });
    }

    // 5. Generate JWT
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
