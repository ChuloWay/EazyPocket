import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import db from '../config/index';
import { RegisterUserDto } from './dto/register-user..dto';
import { UsersService } from '../users/users.service';
import { JwtPayloadService } from './strategy/jwt-payload';
import { UtilityService } from '../utils/index';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import knexfile from '../config/knexfile';
import knex from 'knex';

// let db;

// beforeAll(async () => {
//   db = knex(knexfile.test); // Use the test database configuration
//   await db.migrate.latest();
// });

// afterAll(async () => {
//   await db.destroy(); // Close the database connection
// });

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtPayloadService, UtilityService, JwtService], // Include UsersService here
    }).compile();

    authService = module.get<AuthService>(AuthService);
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

      // Assert that the user is created in the database
      const users = await db.table('users');
      expect(users.length).toBe(1);

      const user = users[0];
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

      // Try to register the same user again
      await expect(authService.registerUser(userDto)).rejects.toThrowError('User already exists');
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

      // Register the user
      await authService.registerUser(userDto);

      // Login the user
      const { user, token } = await authService.login({
        email: userDto.email,
        password: userDto.password,
      });

      // Assert that the user is logged in successfully
      expect(user).toBeDefined();
      expect(token).toBeDefined();
    });

    it('should throw an error if the user does not exist', async () => {
      await expect(
        authService.login({
          email: 'non-existent-email@example.com',
          password: 'password',
        }),
      ).rejects.toThrowError('Email does not exist');
    });

    it('should throw an error if the password is invalid', async () => {
      const userDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phoneNumber: '1234567890',
      };

      // Register the user
      await authService.registerUser(userDto);

      // Login the user with an invalid password
      await expect(
        authService.login({
          email: userDto.email,
          password: 'invalid-password',
        }),
      ).rejects.toThrowError('Invalid credentials');
    });
  });
});
