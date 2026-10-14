import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateResumeRequestDto {
  @IsUUID()
  @IsNotEmpty()
  staffId: string;

  @IsString()
  @IsNotEmpty()
  requesterName: string;

  @IsString()
  @IsNotEmpty()
  organization: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // Anti-Bot & Human Verification
  @IsString()
  @IsOptional()
  honeypot?: string;

  @IsString()
  @IsOptional()
  captchaToken?: string;

  @IsString()
  @IsOptional()
  captchaAnswer?: string;

  @IsNumber()
  @IsOptional()
  renderedTime?: number;
}

export class ApproveResumeRequestDto {
  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
