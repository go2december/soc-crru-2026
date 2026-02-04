import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';

import { UploadModule } from '../upload/upload.module';

@Module({
    imports: [UploadModule],
    controllers: [StaffController],
    providers: [StaffService],
})
export class StaffModule { }
