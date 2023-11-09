import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import knexfile from '../config/knexfile';
import knex from 'knex';

let db: any; // Declare db at the top level

let userService: UsersService;

beforeEach(async () => {
  db = knex(knexfile.test);
  await db.migrate.latest();
});

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [UsersService],
  }).compile();

  userService = module.get<UsersService>(UsersService);
});

describe('UsersService', () => {
  beforeEach(async () => {
    // Delete data from dependent tables first
    await db('transactions').delete();
    await db('wallets').delete();

    // Then delete data from the main table
    await db('users').delete();
  });

  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      // Add test data to the users table
      await db.table('users').insert({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        password: 'dummy_password',
      });

      const userEmail = 'john.doe@example.com';
      const user = await userService.findOneByEmail(userEmail);

      expect(user[0].email).toBe(userEmail);
    });
  });

  describe('findUserProfileById', () => {
    it('should find a user profile by ID', async () => {
      // Add test data to the users and wallets tables
      const userId = 'qw0aa0f6-bee1-4ba6-b6b9-802336624ff1';
      await db.table('users').insert({
        id: userId,
        firstName: 'Victor',
        lastName: 'Larson',
        email: 'victor@example.com',
        phoneNumber: '+12314516789',
        password: 'dummy_password',
      });

      await db.table('wallets').insert({
        userId: userId,
        balance: 1000,
      });

      const userProfile = await userService.findUserProfileById(userId);

      expect(userProfile.id).toBe(userId);
      expect(userProfile.wallet).toBeDefined();
    });

    it('should throw BadRequestException if user ID is not provided', async () => {
      await expect(userService.findUserProfileById(null)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user with provided ID does not exist', async () => {
      const nonExistentUserId = 999;
      await expect(userService.findUserProfileById(nonExistentUserId)).rejects.toThrow(NotFoundException);
    });
  });
});
