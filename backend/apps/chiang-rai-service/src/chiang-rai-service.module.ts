import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { JwtStrategy } from 'shared/shared';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ChiangRaiController } from './chiang-rai.controller';
import { ChiangRaiService } from './chiang-rai.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  controllers: [ChiangRaiController],
  providers: [
    ChiangRaiService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ChiangRaiServiceModule {}
