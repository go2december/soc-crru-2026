import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, journalEditorialBoard, JournalEditorialBoardMember } from 'db/database';
import { CreateEditorialMemberDto } from './dto/create-editorial-member.dto';
import { UpdateEditorialMemberDto } from './dto/update-editorial-member.dto';
import { eq, asc, desc } from 'drizzle-orm';

export const OFFICIAL_THAIJO_EDITORIAL_MEMBERS = [
  // 1. บรรณาธิการ (Editors)
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.จามรี พระสุนิล',
    roleTitle: 'บรรณาธิการ (Editor-in-Chief)',
    roleGroup: 'EDITOR_IN_CHIEF' as const,
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    email: 'journal.soc@crru.ac.th',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ธนพัทธ์ จันท์พิพัฒน์พงศ์',
    roleTitle: 'บรรณาธิการ',
    roleGroup: 'ASSOCIATE_EDITOR' as const,
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    displayOrder: 2,
    isActive: true,
  },

  // 2. กองบรรณาธิการ (Editorial Board)
  {
    name: 'ศาสตราจารย์เกียรติคุณ ดร.มนัส สุวรรณ',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยราชภัฏเชียงใหม่',
    email: 'manatsuwan@gmail.com',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'ศาสตราจารย์เกียรติคุณ ดร.อนุรักษ์ ปัญญานุวัฒน์',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยเชียงใหม่',
    email: 'anurak.p@cmu.ac.th',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.มนตรี พิริยะกุล',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยรามคำแหง',
    email: 'mpiriyakul@yahoo.com',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.บุญฑวรรณ วิงวอน',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'วิทยาลัยอินเตอร์เทคลําปาง',
    email: 'boonthawan2009@gmail.com',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.รังสรรค์ โฉมยา',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยมหาสารคาม',
    email: 'rungson.c@msu.ac.th',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.อัจศรา ประเสริฐสิน',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยนอร์ทกรุงเทพ',
    email: 'ubib_p@hotmail.com',
    displayOrder: 8,
    isActive: true,
  },
  {
    name: 'รองศาสตราจารย์ ดร.ขวัญหญิง ศรีประเสริฐภาพ',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    email: 'khwanying@g.swu.ac.th',
    displayOrder: 9,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.สุดารัตน์ ตันติวิวัทน์',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    email: 'juntuntivivat@gmail.com',
    displayOrder: 10,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.พิมพาภรณ์ บุญประเสริฐ',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยศรีนครินทรวิโรฒ',
    email: 'pimpaporn@g.swu.ac.th',
    displayOrder: 11,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.วีระวัฒน์ อุ่นเสน่หา',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยราชภัฏวไลยอลงกรณ์',
    email: 'weerawat@vru.ac.th',
    displayOrder: 12,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.พิชิต ลำใย',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยเกษตรศาสตร์',
    email: 'fforpcl@ku.ac.th',
    displayOrder: 13,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.สุวิมล สายสวัสดิ์ พิชญไพบูลย์',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'มหาวิทยาลัยเทคโนโลยีราชมงคล',
    email: 'Noonoi0509@gmail.com',
    displayOrder: 14,
    isActive: true,
  },
  {
    name: 'อาจารย์ ดร.กนกวรรณ เอี่ยมชัย',
    roleTitle: 'กองบรรณาธิการ',
    roleGroup: 'EDITORIAL_BOARD' as const,
    institution: 'วิทยาลัยพยาบาลบรมราชชนนี พะเยา',
    email: 'K_aiemchai@hotmail.com',
    displayOrder: 15,
    isActive: true,
  },
  {
    name: 'นางศรีสมร พิริยะสุรวงศ์',
    roleTitle: 'ผู้จัดการวารสาร / กองบรรณาธิการ',
    roleGroup: 'JOURNAL_MANAGER' as const,
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    email: 'srisamorn8184@gmail.com',
    displayOrder: 16,
    isActive: true,
  },

  // 3. ที่ปรึกษา (Advisors)
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.เลหล้า ตรีเอกานุกูล',
    roleTitle: 'ที่ปรึกษา',
    roleGroup: 'ADVISOR' as const,
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    displayOrder: 17,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ ดร.นาวิน พรมใจสา',
    roleTitle: 'ที่ปรึกษา',
    roleGroup: 'ADVISOR' as const,
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    displayOrder: 18,
    isActive: true,
  },
  {
    name: 'ผู้ช่วยศาสตราจารย์ภัทรีพันธุ์ พันธุ',
    roleTitle: 'ที่ปรึกษา',
    roleGroup: 'ADVISOR' as const,
    institution: 'คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
    displayOrder: 19,
    isActive: true,
  },
];

@Injectable()
export class JournalService {
  constructor(private readonly drizzleService: DatabaseService) {}

  async findAllPublic(): Promise<JournalEditorialBoardMember[]> {
    const members = await this.drizzleService.db
      .select()
      .from(journalEditorialBoard)
      .where(eq(journalEditorialBoard.isActive, true))
      .orderBy(asc(journalEditorialBoard.displayOrder), asc(journalEditorialBoard.id));

    // If empty in DB, auto-seed with official ThaiJO data so it works immediately out-of-the-box
    if (members.length === 0) {
      await this.seedOfficialData();
      return this.drizzleService.db
        .select()
        .from(journalEditorialBoard)
        .where(eq(journalEditorialBoard.isActive, true))
        .orderBy(asc(journalEditorialBoard.displayOrder), asc(journalEditorialBoard.id));
    }

    return members;
  }

  async findAllAdmin(): Promise<JournalEditorialBoardMember[]> {
    const members = await this.drizzleService.db
      .select()
      .from(journalEditorialBoard)
      .orderBy(asc(journalEditorialBoard.displayOrder), asc(journalEditorialBoard.id));

    if (members.length === 0) {
      await this.seedOfficialData();
      return this.drizzleService.db
        .select()
        .from(journalEditorialBoard)
        .orderBy(asc(journalEditorialBoard.displayOrder), asc(journalEditorialBoard.id));
    }

    return members;
  }

  async findOne(id: number): Promise<JournalEditorialBoardMember> {
    const [member] = await this.drizzleService.db
      .select()
      .from(journalEditorialBoard)
      .where(eq(journalEditorialBoard.id, id));

    if (!member) {
      throw new NotFoundException(`Editorial board member with id ${id} not found`);
    }

    return member;
  }

  async create(dto: CreateEditorialMemberDto): Promise<JournalEditorialBoardMember> {
    const [newMember] = await this.drizzleService.db
      .insert(journalEditorialBoard)
      .values({
        name: dto.name,
        roleTitle: dto.roleTitle,
        roleGroup: dto.roleGroup,
        academicTitle: dto.academicTitle,
        position: dto.position,
        institution: dto.institution,
        expertise: dto.expertise,
        email: dto.email,
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      })
      .returning();

    return newMember;
  }

  async update(id: number, dto: UpdateEditorialMemberDto): Promise<JournalEditorialBoardMember> {
    await this.findOne(id);

    const [updated] = await this.drizzleService.db
      .update(journalEditorialBoard)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(journalEditorialBoard.id, id))
      .returning();

    return updated;
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    await this.findOne(id);

    await this.drizzleService.db
      .delete(journalEditorialBoard)
      .where(eq(journalEditorialBoard.id, id));

    return { success: true, message: `Member ${id} deleted successfully` };
  }

  async seedOfficialData(): Promise<{ success: boolean; count: number }> {
    const existing = await this.drizzleService.db
      .select({ id: journalEditorialBoard.id })
      .from(journalEditorialBoard);

    if (existing.length === 0) {
      await this.drizzleService.db
        .insert(journalEditorialBoard)
        .values(OFFICIAL_THAIJO_EDITORIAL_MEMBERS);
      return { success: true, count: OFFICIAL_THAIJO_EDITORIAL_MEMBERS.length };
    }

    return { success: true, count: existing.length };
  }
}
