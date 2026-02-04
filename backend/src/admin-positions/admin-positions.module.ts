import { Module } from '@nestjs/common';
import { AdminPositionsService } from './admin-positions.service';
import { AdminPositionsController } from './admin-positions.controller';

@Module({
    controllers: [AdminPositionsController],
    providers: [AdminPositionsService],
})
export class AdminPositionsModule { }
