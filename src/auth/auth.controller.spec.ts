import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto.';
import { RegisterUserDto } from './dto/register-user..dto';
import { UsersService } from '..//users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UtilityService } from '..//utils';
import { JwtPayloadService } from './strategy/jwt-payload';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtPayloadService, UtilityService, JwtService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const registerDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+12314516789',
        password: 'password123',
      };

      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(Promise.resolve('User Created'));

      const response = await authController.register(registerDto);

      // Check if response is defined before accessing its properties
      expect(response).toBeDefined();
      if (response) {
        expect(response.message).toBe('User Created');
      }
    });

    it('should handle registration failure', async () => {
      const registerDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+12314516789',
        password: 'password123',
      };

      jest.spyOn(authService, 'registerUser').mockRejectedValueOnce(new Error('Registration failed'));

      await expect(authController.register(registerDto)).rejects.toThrow('Reason: Registration failed');
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const loginDto: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce({
        user: 'your user data',
        token: 'your token data',
      });

      const result = await authController.login(loginDto);

      expect(result).toEqual({
        user: 'your user data',
        token: 'your token data',
      });
    });

    it('should handle login failure', async () => {
      const loginDto: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error('Login failed'));

      const nextFunction = jest.fn();

      await expect(authController.login(loginDto)).rejects.toThrow('Reason: Login failed');
    });
  });
});
