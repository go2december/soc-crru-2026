import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, IsIn, IsEmail } from 'class-validator';

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
    @IsIn(['LECTURER', 'ASSISTANT_PROF', 'ASSOCIATE_PROF', 'PROFESSOR'])
    @IsOptional()
    academicPosition?: 'LECTURER' | 'ASSISTANT_PROF' | 'ASSOCIATE_PROF' | 'PROFESSOR';

    // ตำแหน่งบริหาร
    @IsString()
    @IsOptional()
    adminPosition?: string;

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

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsNumber()
    @IsOptional()
    sortOrder?: number;
}
