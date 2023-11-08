import { Controller, Get, Post, Body, Next, Req, Res, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user..dto';
import { LoginUserDTO } from './dto/login-user.dto.';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: RegisterUserDto, @Res() res): Promise<void> {
    try {
      await this.authService.registerUser(userDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User Created',
      });
    } catch (error) {
      throw new HttpException('Reason: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() body: LoginUserDTO, @Res() res, @Req() req, @Next() next) {
    try {
      const user = await this.authService.login(body);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: user,
        message: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}
