import { PartialType } from '@nestjs/mapped-types';
import { CreateEditorialMemberDto } from './create-editorial-member.dto';

export class UpdateEditorialMemberDto extends PartialType(CreateEditorialMemberDto) {}
