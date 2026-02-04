import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.userId);
    }

    @Patch('me')
    @Patch('me')
    updateProfile(@Request() req, @Body() body: { role?: UserRole; makes?: string[]; name?: string; email?: string; address?: string; state?: string; city?: string }) {
        return this.usersService.updateProfile(req.user.userId, body);
    }
}
