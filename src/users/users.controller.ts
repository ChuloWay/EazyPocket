import { Controller, Get, Body, Patch, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-guard';

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

  @Patch(':id/profile')
  async updateProfile(@Param('id') id: number, @Body() updateData: { firstName?: string; lastName?: string; phoneNumber?: string }) {
    const updatedProfile = await this.usersService.updateProfile(id, updateData);

    if (updatedProfile === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: 'Profile updated successfully' };
  }
}
