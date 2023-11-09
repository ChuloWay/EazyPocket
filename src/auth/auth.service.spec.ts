import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user..dto';
import { UsersService } from '../users/users.service';
import { JwtPayloadService } from './strategy/jwt-payload';
import { UtilityService } from '../utils/index';
import { JwtService } from '@nestjs/jwt';
import knexfile from '../config/knexfile';
import knex from 'knex';

let db;

let authService: AuthService;

beforeEach(async () => {
  db = knex(knexfile.test);
  await db.migrate.latest();
});

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [AuthService, UsersService, JwtPayloadService, UtilityService, JwtService],
  }).compile();

  authService = module.get<AuthService>(AuthService);
});

describe('AuthService', () => {
  beforeEach(async () => {
    // Delete data from dependent tables first
    await db('transactions').delete();
    await db('wallets').delete();

    // Then delete data from the main table
    await db('users').delete();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phoneNumber: '1234567890',
      };

      await authService.registerUser(userDto);

      const users = await db.table('users');
      const user = users[0];

      expect(users.length).toBe(1);
      expect(user.firstName).toBe(userDto.firstName);
      expect(user.lastName).toBe(userDto.lastName);
      expect(user.email).toBe(userDto.email);
      expect(user.phoneNumber).toBe(userDto.phoneNumber);
    });

    it('should throw an error if the user with the same email already exists', async () => {
      const userDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phoneNumber: '1234567890',
      };

      await authService.registerUser(userDto);

      await expect(authService.registerUser(userDto)).rejects.toThrow('Error creating user');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const userDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phoneNumber: '1234567890',
      };

      await authService.registerUser(userDto);

      await expect(
        authService.login({
          email: userDto.email,
          password: userDto.password,
        }),
      ).rejects.toThrow('Cant create token');
    });

    it('should throw an error if the user does not exist', async () => {
      await expect(
        authService.login({
          email: 'non-existent-email@example.com',
          password: 'password',
        }),
      ).rejects.toThrow('Email does not exist');
    });

    it('should throw an error if the password is invalid', async () => {
      const userDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phoneNumber: '1234567890',
      };

      await authService.registerUser(userDto);

      await expect(
        authService.login({
          email: userDto.email,
          password: 'invalid-password',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
