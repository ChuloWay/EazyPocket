import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtPayloadService } from './strategy/jwt-payload';
import { JwtStrategy } from './strategy/jwt-strategy';
import { UsersModule } from 'src/users/users.module';
import { UtilityService } from 'src/utils';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: false }),
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY,
      publicKey: process.env.PUBLIC_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: 'RS256' },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, JwtPayloadService, UtilityService],
  exports: [AuthService, JwtModule, PassportModule, JwtStrategy, JwtPayloadService],
  controllers: [AuthController],
})
export class AuthModule {}
