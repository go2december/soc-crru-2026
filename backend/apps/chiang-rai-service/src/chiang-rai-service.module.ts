import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'db/database';
import { JwtStrategy } from 'shared/shared';
import { ChiangRaiController } from './chiang-rai.controller';
import { ChiangRaiService } from './chiang-rai.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ChiangRaiController],
  providers: [ChiangRaiService, JwtStrategy],
})
export class ChiangRaiServiceModule {}
