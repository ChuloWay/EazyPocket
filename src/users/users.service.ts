import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import db from '../config/index';
const logger = new Logger('UsersService');

@Injectable()
export class UsersService {
  async findOneByEmail(email: string) {
    return await db.table('users').where('email', email);
  }

  async findUserProfileById(userId: any) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const userProfile = await db.table('users').select('id', 'firstName', 'lastName', 'email', 'phoneNumber').where('id', userId).first();

    if (!userProfile) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const walletData = await db.table('wallets').select('id', 'balance').where('userId', userId).first();

    userProfile.wallet = walletData;
    return userProfile;
  }
}
