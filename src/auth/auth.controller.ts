import { Controller, Get, Post, Body, Next, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user..dto';
import { LoginUserDTO } from './dto/login-user.dto.';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: RegisterUserDto): Promise<{ message: string }> {
    try {
      await this.authService.registerUser(userDto);
      return { message: 'User Created' };
    } catch (error) {
      throw new HttpException('Reason: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO) {
    try {
      const user = await this.authService.login(body);
      return user;
    } catch (error) {
      throw new HttpException('Reason: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
