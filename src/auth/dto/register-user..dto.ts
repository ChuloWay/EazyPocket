import { IsString, IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;
}
