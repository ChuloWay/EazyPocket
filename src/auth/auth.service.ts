import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user..dto';
import db from '../config/index';
import { LoginUserDTO } from './dto/login-user.dto.';
import { JwtPayloadService } from './strategy/jwt-payload';
import { UtilityService } from '../utils/index';
import { UsersService } from '../users/users.service';
const { v4: uuidv4 } = require('uuid');

const logger = new Logger('AuthService');

@Injectable()
export class AuthService {
  constructor(
    private userservice: UsersService,
    private jwtPayloadService: JwtPayloadService,
    private readonly utilityService: UtilityService,
  ) {}
  /**
   * Register a new user with the provided user data.
   * @param userDto - The user data to register.
   * @throws {BadRequestException} Throws an exception if the user with the same email already exists.
   * @throws {Error} Throws an error if any other error occurs during the registration process.
   */
  async registerUser(userDto: RegisterUserDto): Promise<void> {
    const { firstName, lastName, email, password, phoneNumber } = userDto;

    try {
      // Check if the user exists
      const userExist = await db.table('users').where('email', email);

      if (userExist.length > 0) {
        throw new BadRequestException('User already exists');
      }

      // Hash user password
      const hashedPassword = await this.utilityService.hashPassword(password);

      // Create new user
      const newUser = {
        id: uuidv4(),
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
      };

      // Save the user record and retrieve the user's ID
      await db.table('users').insert(newUser);

      // Create the wallet for the user with the reference constraint
      const newWallet = {
        balance: 0,
        userId: newUser.id,
      };

      await db.table('wallets').insert(newWallet);
    } catch (error) {
      logger.error('Error creating user: ' + error.message);
      throw new Error('Error creating user');
    }
  }

  /**
   * login a user with the provided user data.
   * @param LoginUserDTO - The user data to login.
   * @throws {NotFoundException} Throws an exception if the user does not exist.
   * @throws {UnauthorizedException} Throws an exception if user provided invalid credentials.
   */
  async login(loginInput: LoginUserDTO) {
    // Get user information
    const [user] = await this.userservice.findOneByEmail(loginInput.email);
    // Check if user exists
    if (!user) {
      throw new NotFoundException('Email does not exist');
    }

    // Check if the given password matches the saved password
    const isValid = await this.utilityService.comparePassword(loginInput.password, user.password);
    console.log('data for password here', loginInput.password, user.password, isValid);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, email } = user;
    const data = { id, email };

    // Generate JWT token
    const token = this.jwtPayloadService.createToken(data);
    return { user, token };
  }
}
