import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SharedService } from './shared.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { DatabaseModule } from 'db/database';

@Global()
@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [SharedService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [
    SharedService,
    PassportModule,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class SharedModule {}
