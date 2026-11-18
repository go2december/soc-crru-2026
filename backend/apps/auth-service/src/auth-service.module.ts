import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { DatabaseModule } from 'db/database';
import { JwtStrategy } from 'shared/shared';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        (process.env.NODE_ENV === 'production'
          ? (() => {
              throw new Error(
                'JWT_SECRET environment variable must be set in production',
              );
            })()
          : 'dev-only-jwt-secret-do-not-use-in-prod'),
      signOptions: { expiresIn: '7d' }, // Token หมดอายุใน 7 วัน
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthServiceModule {}
