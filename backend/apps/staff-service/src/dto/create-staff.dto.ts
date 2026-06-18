import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsIn,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateStaffDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  // ข้อมูลพื้นฐาน - ภาษาไทย
  @IsString()
  @IsOptional()
  prefixTh?: string;

  @IsString()
  @IsNotEmpty()
  firstNameTh: string;

  @IsString()
  @IsNotEmpty()
  lastNameTh: string;

  // ข้อมูลพื้นฐาน - ภาษาอังกฤษ
  @IsString()
  @IsOptional()
  prefixEn?: string;

  @IsString()
  @IsOptional()
  firstNameEn?: string;

  @IsString()
  @IsOptional()
  lastNameEn?: string;

  // ประเภทบุคลากร
  @IsIn(['ACADEMIC', 'SUPPORT'])
  @IsOptional()
  staffType?: 'ACADEMIC' | 'SUPPORT';

  // ตำแหน่งวิชาการ (สำหรับสายวิชาการ)
  @IsNumber()
  @IsOptional()
  academicPositionId?: number | null;

  // ตำแหน่งบริหาร
  @IsNumber()
  @IsOptional()
  adminPositionId?: number | null;

  // วุฒิการศึกษา (รองรับหลายวุฒิ)
  @IsArray()
  @IsOptional()
  education?: { level: 'BACHELOR' | 'MASTER' | 'DOCTORAL'; detail: string }[];

  // ข้อมูลติดต่อ
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  // ข้อมูลเพิ่มเติม
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  expertise?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  shortBios?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isExecutive?: boolean;
}
