import { PartialType } from '@nestjs/mapped-types';
import { CreateMouDto } from './create-mou.dto';

export class UpdateMouDto extends PartialType(CreateMouDto) {}
