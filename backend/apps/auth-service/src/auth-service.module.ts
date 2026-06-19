import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from 'db/database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'soc-crru-secret-key-2026',
      signOptions: { expiresIn: '7d' }, // Token หมดอายุใน 7 วัน
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds in milliseconds
        limit: 15,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthServiceModule {}
