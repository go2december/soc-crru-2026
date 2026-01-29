import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for JwtAuthGuard

@Module({
    imports: [DrizzleModule, AuthModule],
    controllers: [NewsController],
    providers: [NewsService],
})
export class NewsModule { }
