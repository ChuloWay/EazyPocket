import { Controller, Get, Body, Patch, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/strategy/jwt-guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  async getUserProfile(@Param('id') id: number) {
    const userProfile = await this.usersService.findUserProfileById(id);

    if (!userProfile) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return userProfile;
  }
}
