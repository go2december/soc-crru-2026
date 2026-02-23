import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import {
  chiangRaiIdentities,
  chiangRaiArtifacts,
  chiangRaiArticles,
  chiangRaiActivities,
  chiangRaiStaff,
  staffProfiles,
  departments,
  chiangRaiConfig,
} from '../drizzle/schema';
import { eq, desc, asc, ilike, or, and, count, SQL } from 'drizzle-orm';

@Injectable()
export class ChiangRaiService {
  constructor(private readonly drizzle: DrizzleService) {}

  // --- Identities ---
  async getAllIdentities() {
    const identities = await this.drizzle.db.select().from(chiangRaiIdentities);

    // Lazy Seeding: If no identities exist, populate them
    if (identities.length === 0) {
      const defaultIdentities: (typeof chiangRaiIdentities.$inferInsert)[] = [
        {
          code: 'HISTORY',
          nameTh: 'ประวัติศาสตร์',
          nameEn: 'History',
          description:
            'ประวัติศาสตร์ความเป็นมาของเมืองเชียงรายและอาณาจักรล้านนา',
          imageUrl: '/images/chiang-rai/history.jpg',
        },
        {
          code: 'ARCHAEOLOGY',
          nameTh: 'โบราณคดี',
          nameEn: 'Archaeology',
          description:
            'การศึกษาหลักฐานทางโบราณคดีและแหล่งประวัติศาสตร์ในพื้นที่',
          imageUrl: '/images/chiang-rai/archaeology.jpg',
        },
        {
          code: 'CULTURE',
          nameTh: 'วัฒนธรรม ความเชื่อ',
          nameEn: 'Culture & Beliefs',
          description: 'วิถีชีวิต ประเพณี และความเชื่อท้องถิ่นที่สืบทอดกันมา',
          imageUrl: '/images/chiang-rai/culture.jpg',
        },
        {
          code: 'ARTS',
          nameTh: 'ศิลปะการแสดง',
          nameEn: 'Performing Arts',
          description: 'ดนตรีพื้นเมือง การฟ้อนรำ และศิลปะการแสดงล้านนา',
          imageUrl: '/images/chiang-rai/arts.jpg',
        },
        {
          code: 'WISDOM',
          nameTh: 'ภูมิปัญญาท้องถิ่น',
          nameEn: 'Local Wisdom',
          description: 'องค์ความรู้ภูมิปัญญาท้องถิ่นในด้านต่างๆ',
          imageUrl: '/images/chiang-rai/wisdom.jpg',
        },
      ];

      return this.drizzle.db
        .insert(chiangRaiIdentities)
        .values(defaultIdentities)
        .returning();
    }

    return identities;
  }

  // --- Stats ---
  async getStats() {
    const [artifactsCount] = await this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiArtifacts);
    const [articlesCount] = await this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiArticles);
    const [identitiesCount] = await this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiIdentities);

    return {
      artifacts: artifactsCount.count,
      articles: articlesCount.count,
      identities: identitiesCount.count,
    };
  }

  async getIdentityByCode(
    code: 'HISTORY' | 'ARCHAEOLOGY' | 'CULTURE' | 'ARTS' | 'WISDOM',
  ) {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiIdentities)
      .where(eq(chiangRaiIdentities.code, code))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Identity category ${code} not found`);
    }
    return result[0];
  }

  // --- Search ---
  async search(query: string) {
    if (!query || query.trim().length === 0) {
      return { artifacts: [], articles: [], activities: [] };
    }

    const searchTerm = `%${query.trim()}%`;

    // Parallel search across multiple entities
    const [artifacts, articles, activities] = await Promise.all([
      // 1. Search Artifacts
      this.drizzle.db
        .select()
        .from(chiangRaiArtifacts)
        .where(
          or(
            ilike(chiangRaiArtifacts.title, searchTerm),
            ilike(chiangRaiArtifacts.description, searchTerm),
            ilike(chiangRaiArtifacts.content, searchTerm),
          ),
        )
        .orderBy(desc(chiangRaiArtifacts.createdAt))
        .limit(10), // Limit results for performance

      // 2. Search Articles
      this.drizzle.db
        .select()
        .from(chiangRaiArticles)
        .where(
          or(
            ilike(chiangRaiArticles.title, searchTerm),
            ilike(chiangRaiArticles.abstract, searchTerm),
            ilike(chiangRaiArticles.content, searchTerm),
          ),
        )
        .orderBy(desc(chiangRaiArticles.publishedAt))
        .limit(10),

      // 3. Search Activities
      this.drizzle.db
        .select()
        .from(chiangRaiActivities)
        .where(
          or(
            ilike(chiangRaiActivities.title, searchTerm),
            ilike(chiangRaiActivities.description, searchTerm),
            ilike(chiangRaiActivities.content, searchTerm),
          ),
        )
        .orderBy(desc(chiangRaiActivities.publishedAt))
        .limit(10),
    ]);

    return {
      artifacts,
      articles,
      activities,
    };
  }

  // --- Artifacts ---
  async getArtifacts(
    category?: string,
    searchQuery?: string,
    page: number = 1,
    limit: number = 12,
  ) {
    // Lazy Seeding: If no artifacts exist, populate with real Chiang Rai data (5 per identity × 5 categories = 25)
    const countResult = await this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiArtifacts);
    if (countResult[0].count === 0) {
      const sampleArtifacts: (typeof chiangRaiArtifacts.$inferInsert)[] = [
        // ===== HISTORY (ประวัติศาสตร์) =====
        {
          title: 'พระเจ้าเม็งรายมหาราช ผู้สร้างเมืองเชียงราย',
          description:
            'พระเจ้าเม็งราย (พ.ศ. 1781–1860) ปฐมกษัตริย์แห่งอาณาจักรล้านนา ทรงสร้างเมืองเชียงรายในปี พ.ศ. 1805 บนที่ราบลุ่มแม่น้ำกก ก่อนเสด็จไปสร้างเชียงใหม่เป็นราชธานี',
          content:
            'พระเจ้าเม็งรายทรงเป็นพระราชโอรสของพญาลาวเม็ง กษัตริย์แห่งหิรัญนครเงินยาง (เชียงแสน) ทรงรวบรวมหัวเมืองต่าง ๆ สร้างอาณาจักรล้านนาอันยิ่งใหญ่ เมืองเชียงรายมีอายุกว่า 760 ปี เป็นศูนย์กลางทางประวัติศาสตร์ระหว่างดินแดน 3 ประเทศ คือ ไทย ลาว และเมียนมา',
          category: 'HISTORY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/6/6a/Mangrai_Monument.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/6/6a/Mangrai_Monument.jpg',
          ],
        },
        {
          title: 'เมืองเก่าเชียงแสน อาณาจักรโบราณริมโขง',
          description:
            'เชียงแสนเป็นเมืองโบราณที่มีประวัติย้อนกลับไปกว่าพันปี เป็นศูนย์กลางอารยธรรมลุ่มน้ำโขงตอนบน มีกำแพงเมืองและคูน้ำล้อมรอบ พร้อมโบราณสถานกว่า 75 แห่ง',
          content:
            'เมืองเชียงแสนตั้งอยู่ริมฝั่งแม่น้ำโขง อ.เชียงแสน จ.เชียงราย มีหลักฐานการตั้งถิ่นฐานตั้งแต่สมัยก่อนประวัติศาสตร์ เป็นเมืองต้นกำเนิดของราชวงศ์เม็งราย มีโบราณสถานสำคัญ เช่น วัดพระธาตุเจดีย์หลวง วัดป่าสัก วัดเจดีย์เจ็ดยอด',
          category: 'HISTORY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Watpasak1.jpg/960px-Watpasak1.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Watpasak1.jpg/960px-Watpasak1.jpg',
          ],
        },
        {
          title: 'วัดพระแก้ว เชียงราย สถานที่ค้นพบพระแก้วมรกต',
          description:
            'วัดพระแก้ว เป็นวัดสำคัญทางประวัติศาสตร์ที่มีการค้นพบพระแก้วมรกต (พระพุทธมหามณีรัตนปฏิมากร) ในปี พ.ศ. 1977 ปัจจุบันเป็นที่ประดิษฐานพระหยกเชียงราย',
          content:
            'วัดพระแก้ว ตั้งอยู่บนถนนไตรรัตน์ อ.เมือง จ.เชียงราย เดิมชื่อวัดป่าเยี้ย ตามตำนานกล่าวว่า ฟ้าผ่าเจดีย์แตก ทำให้พบพระแก้วมรกตซ่อนอยู่ภายใน ภายหลังถูกอัญเชิญไปประดิษฐานที่ลำปาง เชียงใหม่ ลาว และกรุงเทพฯ ตามลำดับ',
          category: 'HISTORY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/6/65/Chiang_Rai-Wat_Phra_Kaeo-001.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/6/65/Chiang_Rai-Wat_Phra_Kaeo-001.jpg',
          ],
        },
        {
          title: 'สามเหลี่ยมทองคำ จุดบรรจบ 3 แผ่นดิน',
          description:
            'ดินแดนสามเหลี่ยมทองคำ (Golden Triangle) อ.เชียงแสน จ.เชียงราย คือจุดบรรจบพรมแดน 3 ประเทศ ไทย ลาว เมียนมา บริเวณแม่น้ำโขงกับแม่น้ำรวก มีความสำคัญทางภูมิรัฐศาสตร์และประวัติศาสตร์',
          content:
            'สามเหลี่ยมทองคำเคยเป็นพื้นที่ค้าฝิ่นที่ใหญ่ที่สุดในโลก ปัจจุบันเปลี่ยนเป็นแหล่งท่องเที่ยวทางประวัติศาสตร์และวัฒนธรรม มีหอฝิ่น Hall of Opium ที่บอกเล่าประวัติศาสตร์ยาเสพติดในภูมิภาค',
          category: 'HISTORY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Golden_Triangle_1.jpg/1280px-Golden_Triangle_1.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Golden_Triangle_1.jpg/1280px-Golden_Triangle_1.jpg',
          ],
        },
        {
          title: 'คัมภีร์ใบลานล้านนา มรดกภูมิปัญญาอักษรธรรม',
          description:
            'คัมภีร์ใบลาน (ปั๊บสา) จารึกด้วยอักษรธรรมล้านนา บันทึกเรื่องราวทางพระพุทธศาสนา ตำรายา ประวัติศาสตร์ และนิทานพื้นบ้าน สืบทอดกันมาหลายร้อยปี',
          content:
            'ใบลานเป็นวัสดุจารึกหลักของล้านนา ทำจากใบของต้นลาน จารึกด้วยเหล็กแหลมแล้วทาด้วยน้ำหมึก คัมภีร์ใบลานเชียงรายมีทั้งเรื่องธรรมะ ตำราโหราศาสตร์ ตำรายาพื้นบ้าน และพงศาวดาร ปัจจุบันมีการสำรวจและอนุรักษ์โดยสถาบันวิจัยสังคม มหาวิทยาลัยเชียงใหม่',
          category: 'HISTORY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2014_Wat_Pa_Sak_chedi.jpg/1280px-2014_Wat_Pa_Sak_chedi.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2014_Wat_Pa_Sak_chedi.jpg/1280px-2014_Wat_Pa_Sak_chedi.jpg',
          ],
        },

        // ===== ARCHAEOLOGY (โบราณคดี) =====
        {
          title: 'เวียงกาหลง แหล่งเตาเครื่องเคลือบดินเผาโบราณ',
          description:
            'แหล่งเตาเผาเวียงกาหลง อ.เวียงป่าเป้า จ.เชียงราย เป็นแหล่งผลิตเครื่องเคลือบดินเผาที่สำคัญที่สุดของอาณาจักรล้านนา มีอายุราวพุทธศตวรรษที่ 19-21',
          content:
            'เครื่องเคลือบเวียงกาหลงมีลักษณะเด่นคือลวดลายขูดขีดใต้เคลือบสีเขียวไข่กา (Celadon) รูปสัตว์ ดอกไม้ และลายเรขาคณิต พบเตาเผากว่า 200 เตา แสดงถึงอุตสาหกรรมเครื่องเคลือบขนาดใหญ่ ปัจจุบันมีพิพิธภัณฑ์เมืองโบราณเวียงกาหลงจัดแสดงโบราณวัตถุ',
          category: 'ARCHAEOLOGY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://thailandfoundation.or.th/wp-content/uploads/2021/06/7dade1084c5c864ea6a4c100c3555eb3.jpeg',
          mediaUrls: [
            'https://thailandfoundation.or.th/wp-content/uploads/2021/06/7dade1084c5c864ea6a4c100c3555eb3.jpeg',
          ],
        },
        {
          title: 'พระพุทธรูปศิลปะเชียงแสน สกุลช่างสิงห์หนึ่ง',
          description:
            'พระพุทธรูปศิลปะเชียงแสน "สิงห์หนึ่ง" เป็นพระพุทธรูปสกุลช่างเชียงแสนยุคแรก อายุราวพุทธศตวรรษที่ 17-19 พุทธลักษณะงดงาม พระเกศาขมวดเป็นก้นหอย มีรัศมีดอกบัวตูม',
          content:
            'พระพุทธรูปเชียงแสน สิงห์หนึ่ง มีลักษณะเฉพาะคือ พระวรกายอวบอ้วน พระอุระนูน ประทับนั่งขัดสมาธิเพชร ชายสังฆาฏิสั้นเหนือพระถัน ฐานเป็นบัวคว่ำบัวหงาย สะท้อนอิทธิพลศิลปะอินเดียแบบปาละผสมพม่า จัดแสดงที่พิพิธภัณฑสถานแห่งชาติ เชียงแสน',
          category: 'ARCHAEOLOGY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/WatPhraKaew-CR-PhraKaewMarakot.jpg/250px-WatPhraKaew-CR-PhraKaewMarakot.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/WatPhraKaew-CR-PhraKaewMarakot.jpg/250px-WatPhraKaew-CR-PhraKaewMarakot.jpg',
          ],
        },
        {
          title: 'วัดป่าสัก เมืองเชียงแสน โบราณสถานสำคัญ',
          description:
            'วัดป่าสัก อ.เชียงแสน จ.เชียงราย โบราณสถานที่สำคัญที่สุดในเมืองเชียงแสน สร้างโดยพญาแสนภู เมื่อ พ.ศ. 1838 เจดีย์ทรงปราสาทยอดห้าชั้น ตกแต่งด้วยปูนปั้นรูปเทวดา',
          content:
            'วัดป่าสักตั้งอยู่นอกกำแพงเมืองเชียงแสนทางทิศตะวันตก เจดีย์ประธานเป็นทรงปราสาทยอดระฆัง สูงประมาณ 12.5 เมตร ตกแต่งปูนปั้นรูปเทวดา นาค กินรี และลวดลายพรรณพฤกษา ได้รับอิทธิพลศิลปะพุกามผสมศิลปะหริภุญไชย ได้รับการขุดแต่งและบูรณะโดยกรมศิลปากร',
          category: 'ARCHAEOLOGY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2014_Wat_Pa_Sak_chedi.jpg/640px-2014_Wat_Pa_Sak_chedi.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2014_Wat_Pa_Sak_chedi.jpg/640px-2014_Wat_Pa_Sak_chedi.jpg',
          ],
        },
        {
          title: 'เวียงหนองล่ม แหล่งโบราณคดีใต้น้ำ',
          description:
            'เวียงหนองล่ม หรือ "เมืองจมใต้น้ำ" ตั้งอยู่ที่ อ.เทิง จ.เชียงราย เชื่อกันว่าเป็นเมืองโบราณที่จมลงใต้กว๊านพะเยา (หนองหลวง) มีตำนานเล่าขานมาหลายร้อยปี',
          content:
            'ตำนานพื้นบ้านกล่าวว่าเวียงหนองล่มเป็นเมืองที่ถูกสาปให้จมลงใต้น้ำเพราะความชั่วร้ายของผู้คน นักโบราณคดีพบซากโบราณสถานและเครื่องปั้นดินเผาใต้น้ำ สะท้อนถึงการตั้งถิ่นฐานโบราณในพื้นที่ลุ่มน้ำอิง',
          category: 'ARCHAEOLOGY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/e/ef/Golden_Triangle_Mekong_at_Doi_Pu_Khao_06.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/e/ef/Golden_Triangle_Mekong_at_Doi_Pu_Khao_06.jpg',
          ],
        },
        {
          title: 'ศิลาจารึกเมืองเชียงแสน หลักฐานอักษรล้านนาโบราณ',
          description:
            'ศิลาจารึกที่ค้นพบในเมืองเชียงแสนและบริเวณใกล้เคียง จารึกด้วยอักษรฝักขาม (อักษรล้านนา) บันทึกเรื่องราวการสร้างวัด การถวายที่ดิน และพระราชกรณียกิจของกษัตริย์',
          content:
            'ศิลาจารึกเชียงแสนเป็นหลักฐานชั้นต้นทางประวัติศาสตร์ที่ช่วยยืนยันเหตุการณ์ในพงศาวดาร อักษรฝักขามเป็นอักษรล้านนาที่พัฒนาจากอักษรมอญโบราณ ศิลาจารึกจำนวนหนึ่งจัดแสดงอยู่ที่พิพิธภัณฑสถานแห่งชาติ เชียงแสน',
          category: 'ARCHAEOLOGY',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28002%29.jpg/640px-Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28002%29.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28002%29.jpg/640px-Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28002%29.jpg',
          ],
        },

        // ===== CULTURE (ประเพณี/ชาติพันธุ์) =====
        {
          title: 'ผ้าทอไทลื้อ ลายน้ำไหล เอกลักษณ์เชียงของ',
          description:
            'ผ้าทอมือลายน้ำไหลของชาวไทลื้อ อ.เชียงของ จ.เชียงราย มีลวดลายเป็นเอกลักษณ์เฉพาะ สะท้อนวิถีชีวิตและความเชื่อของชาวไทลื้อที่อพยพจากสิบสองปันนา',
          content:
            'ชาวไทลื้อเชียงของมีภูมิปัญญาการทอผ้าสืบทอดจากบรรพบุรุษ ลายน้ำไหลเป็นลวดลายที่จำลองสายน้ำและธรรมชาติ ใช้เทคนิคจก (ขิด) ผสมมัดหมี่ สีที่ใช้ส่วนมากเป็นสีธรรมชาติจากพืช เช่น ครั่ง ขมิ้น ใบคราม',
          category: 'CULTURE',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Akha_Dress.JPG/250px-Akha_Dress.JPG',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Akha_Dress.JPG/250px-Akha_Dress.JPG',
          ],
        },
        {
          title: 'ประเพณียี่เป็ง ล้านนา เทศกาลลอยโคม',
          description:
            'ประเพณียี่เป็ง (Loy Krathong Lanna) เทศกาลสำคัญของชาวล้านนาเชียงราย จัดขึ้นในวันเพ็ญเดือน 12 มีการปล่อยโคมลอยขึ้นฟ้า ลอยกระทง และสวดมนต์ปฏิบัติธรรม',
          content:
            'ยี่เป็งเป็นประเพณีล้านนาที่มีเอกลักษณ์เฉพาะ ชาวล้านนาเรียกเดือน 12 ว่า "เดือนยี่" (เดือน 2 ในปฏิทินล้านนา) จึงเรียกว่า "ยี่เป็ง" หมายถึงวันเพ็ญเดือนยี่ มีการจุดผางประทีป (ตะเกียงดินเผา) บูชาพระรัตนตรัย และปล่อยโคมลอยเพื่อปล่อยทุกข์',
          category: 'CULTURE',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/2/22/Yi_peng_sky_lantern_festival_San_Sai_Thailand.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/2/22/Yi_peng_sky_lantern_festival_San_Sai_Thailand.jpg',
          ],
        },
        {
          title: 'ชาวอาข่า (อีก้อ) วิถีชีวิตบนดอยสูงเชียงราย',
          description:
            'ชาวอาข่าเป็นกลุ่มชาติพันธุ์บนพื้นที่สูงที่มีวัฒนธรรมอันเป็นเอกลักษณ์ มีถิ่นฐานอยู่ในหลายอำเภอของเชียงราย เช่น แม่จัน แม่ฟ้าหลวง แม่สาย มีเครื่องแต่งกายประดับเงินและลูกปัดสีสันสดใส',
          content:
            'ชาวอาข่ามีวัฒนธรรมการเฉลิมฉลองที่สำคัญ เช่น พิธีโล้ชิงช้า (อาข่า ซอ จ่า แย) ซึ่งจัดขึ้นเพื่อขอบคุณพระเจ้าและเฉลิมฉลองผลผลิต มีความเชื่อเรื่องจิตวิญญาณและบรรพบุรุษ ปัจจุบันหลายชุมชนเปิดเป็นหมู่บ้านท่องเที่ยวเชิงวัฒนธรรม',
          category: 'CULTURE',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/4/45/Chiang_Rai%2C_Akha_woman.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/4/45/Chiang_Rai%2C_Akha_woman.jpg',
          ],
        },
        {
          title: 'พิธีสืบชะตาเมืองเชียงราย',
          description:
            'พิธีสืบชะตาเมืองเป็นพิธีกรรมความเชื่อของชาวล้านนา จัดขึ้นเพื่อเสริมสร้างความเป็นสิริมงคลให้แก่บ้านเมือง ต่ออายุเมือง และสร้างขวัญกำลังใจให้ประชาชน',
          content:
            'พิธีสืบชะตาเมืองเชียงรายจัดขึ้นเป็นประจำทุกปี มีพิธีทำบุญตักบาตร สวดมนต์ ผูกเสาอินทขิล (เสาหลักเมือง) ด้วยด้ายสายสิญจน์ ประพรมน้ำมนต์ เป็นการรวมพลังศรัทธาของชาวเชียงรายที่มีต่อบ้านเมือง',
          category: 'CULTURE',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/3/32/Yi_Peng_lanterns_in_Chiang_Mai_%2811067469754%29.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/3/32/Yi_Peng_lanterns_in_Chiang_Mai_%2811067469754%29.jpg',
          ],
        },
        {
          title: 'ชาวม้ง (แม้ว) เชียงราย ความงามแห่งภูเขาสูง',
          description:
            'ชาวม้งเป็นกลุ่มชาติพันธุ์ที่อาศัยบนพื้นที่สูงของเชียงราย มีวัฒนธรรมที่โดดเด่นในด้านการปักผ้า การตีเครื่องเงิน และเทศกาลปีใหม่ม้ง',
          content:
            'ชาวม้งเชียงรายแบ่งเป็น 2 กลุ่มหลัก คือ ม้งน้ำเงิน (ม้งดำ) และม้งขาว มีประเพณีปีใหม่ม้งที่จัดขึ้นในช่วงเดือนธันวาคม-มกราคม มีกิจกรรมโยนลูกช่วง การร้องเพลงเกี้ยว และการเป่าแคน (เกง) ชุมชนม้งหลายแห่งในเชียงรายเปิดเป็นแหล่งท่องเที่ยว เช่น ดอยตุง ดอยผาตั้ง',
          category: 'CULTURE',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/6/62/Thailand_hmong-1462236_960_720.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/6/62/Thailand_hmong-1462236_960_720.jpg',
          ],
        },

        // ===== ARTS (ศิลปะการแสดง) =====
        {
          title: 'ฟ้อนสาวไหม ศิลปะการฟ้อนต้นตำรับเชียงราย',
          description:
            'ฟ้อนสาวไหม เป็นศิลปะการฟ้อนพื้นเมืองที่กำเนิดในจังหวัดเชียงราย สร้างสรรค์โดยพ่อครูกุย สุภาวสิทธิ์ ท่าฟ้อนจำลองจากกระบวนการปลูกหม่อน เลี้ยงไหม สาวไหม และทอผ้า',
          content:
            'ฟ้อนสาวไหมมีต้นกำเนิดจากการผสมผสานท่าฟ้อนเจิง (ฟ้อนอาวุธ) กับท่าทางการทอผ้าไหมในชีวิตประจำวัน ลีลาการฟ้อนอ่อนช้อย สะท้อนความเป็นหญิงงามล้านนา ปัจจุบันมีทั้งแบบดั้งเดิมและแบบประยุกต์ มีการสืบสานผ่านสายสกุลช่างฟ้อนแม่ครูบัวเรียว รัตมณีภรณ์',
          category: 'ARTS',
          mediaType: 'VIDEO',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/9/93/%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%B3%E0%B8%9D%E0%B8%A3%E0%B8%B1%E0%B9%88%E0%B8%87%E0%B8%84%E0%B8%B9%E0%B9%88.png',
          mediaUrls: ['https://www.youtube.com/watch?v=9DbSwa-HEzc'],
        },
        {
          title: 'กลองสะบัดชัย เสียงกึกก้องแห่งล้านนา',
          description:
            'กลองสะบัดชัยเป็นกลองพื้นเมืองล้านนาที่ใช้ตีในโอกาสพิเศษ เช่น งานบุญ สงกรานต์ และขบวนแห่ต่าง ๆ มีจังหวะที่ทรงพลัง สะท้อนความกล้าหาญของชาวล้านนา',
          content:
            'กลองสะบัดชัยเดิมเป็นกลองศึก ใช้ตีเพื่อเป็นสัญญาณสู้รบและเรียกขวัญกำลังใจ ปัจจุบันเปลี่ยนมาใช้ในงานเทศกาลและพิธีกรรม ท่าตีมีทั้งเข่าตี ยืนตี และตีหมุน ชาวเชียงรายถือว่ากลองสะบัดชัยเป็นสัญลักษณ์ของความเข้มแข็งและสามัคคี',
          category: 'ARTS',
          mediaType: 'VIDEO',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28003%29.jpg/640px-Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28003%29.jpg',
          mediaUrls: ['https://www.youtube.com/watch?v=9DbSwa-HEzc'],
        },
        {
          title: 'ซอพื้นเมืองล้านนา ขับขานเรื่องราวถิ่นเหนือ',
          description:
            'ซอ (การขับซอ) เป็นศิลปะการขับร้องพื้นเมืองล้านนาที่มีท่วงทำนองไพเราะ มีหลากหลายทำนอง เช่น ซอล่องน่าน ซอเมือง ซอจ๊อย ใช้ในงานบุญ งานเฮือน (สร้างบ้าน) และงานรื่นเริง',
          content:
            'การขับซอเป็นเสน่ห์เฉพาะของดนตรีล้านนา ช่างซอ (นักร้อง) จะขับร้องโต้ตอบกันระหว่างชายหญิง มักมีปี่ (สะล้อ) และซึง (พิณ 4 สาย) ประกอบ เนื้อร้องทั้งสด (ปฏิภาณ) และจากวรรณกรรม ปัจจุบันมีศิลปินซอที่มีชื่อเสียงหลายท่านเป็นชาวเชียงราย',
          category: 'ARTS',
          mediaType: 'VIDEO',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28003%29.jpg/960px-Mangrai_Monument%2C_Chiang_Rai_-_2017-06-27_%28003%29.jpg',
          mediaUrls: ['https://www.youtube.com/watch?v=9DbSwa-HEzc'],
        },
        {
          title: 'ฟ้อนเล็บ (ฟ้อนเทียน) อัตลักษณ์นาฏศิลป์ล้านนา',
          description:
            'ฟ้อนเล็บเป็นการร่ายรำพื้นเมืองล้านนาที่สง่างาม ผู้ฟ้อนสวมเล็บยาวทำจากทองเหลือง ลีลาการเคลื่อนไหวช้า สะท้อนความอ่อนโยนและเอกลักษณ์สตรีล้านนา',
          content:
            'ฟ้อนเล็บเป็นหนึ่งในการแสดงเอกลักษณ์ของภาคเหนือ เดิมเรียกว่า "ฟ้อนเทียน" เพราะถือเทียนขณะร่ายรำ ผู้ฟ้อนแต่งชุดพื้นเมืองล้านนาประดับเครื่องเงิน ท่ารำมี 17 ท่าหลัก ดนตรีประกอบด้วยวงปี่พาทย์พื้นเมือง มักแสดงต้อนรับแขกบ้านแขกเมืองและในงานเทศกาล',
          category: 'ARTS',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/LK_03_loy_krathong_yi_peng_san_sai.jpg/250px-LK_03_loy_krathong_yi_peng_san_sai.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/LK_03_loy_krathong_yi_peng_san_sai.jpg/250px-LK_03_loy_krathong_yi_peng_san_sai.jpg',
          ],
        },
        {
          title: 'วัดร่องขุ่น ศิลปะร่วมสมัยอาจารย์เฉลิมชัย',
          description:
            'วัดร่องขุ่น (White Temple) ผลงานสร้างสรรค์ของอาจารย์เฉลิมชัย โฆษิตพิพัฒน์ ศิลปินแห่งชาติ สถาปัตยกรรมสีขาวบริสุทธิ์ผสมผสานศิลปะล้านนากับจินตนาการร่วมสมัย',
          content:
            'อาจารย์เฉลิมชัยเริ่มสร้างวัดร่องขุ่นเมื่อ พ.ศ. 2540 ด้วยทุนส่วนตัว ตั้งใจให้เป็นงานศิลปะถวายแด่พระพุทธศาสนา สะพานวงจรชีวิตข้ามสระนรก อุโบสถสีขาวล้วนประดับกระจก สะท้อนพุทธธรรมผ่างานศิลปะ ปัจจุบันเป็นสถานที่ท่องเที่ยวระดับโลก',
          category: 'ARTS',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Chiang_Rai_Thailand_Wat-Rong-Khun-01.jpg/1280px-Chiang_Rai_Thailand_Wat-Rong-Khun-01.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Chiang_Rai_Thailand_Wat-Rong-Khun-01.jpg/1280px-Chiang_Rai_Thailand_Wat-Rong-Khun-01.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Wat_Rong_Khun_-_Chiang_Rai.jpg/1280px-Wat_Rong_Khun_-_Chiang_Rai.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/The_White_Temple%2C_Wat_Rong_Khun%2C_Chiang_Rai%2C_Thailand.jpg/1280px-The_White_Temple%2C_Wat_Rong_Khun%2C_Chiang_Rai%2C_Thailand.jpg',
          ],
        },

        // ===== WISDOM (ภูมิปัญญาท้องถิ่น) =====
        {
          title: 'เครื่องเงินวัวลาย ศิลปหัตถกรรมเชียงราย',
          description:
            'ช่างเงินเชียงรายสืบทอดฝีมือการตีเครื่องเงินด้วยเทคนิคโบราณ ลวดลายประณีตละเอียด ทั้งลายดอกไม้ ลายล้านนา และลายสัตว์มงคล เป็นของฝากและเครื่องประดับชื่อดัง',
          content:
            'เครื่องเงินเชียงรายมีเอกลักษณ์ตรงลวดลายที่มีรายละเอียดสูง ฝีมือช่างละเอียดประณีต ทำจากเงินบริสุทธิ์ 92.5% ขึ้นไป มีทั้งสร้อยคอ กำไล แหวน และเครื่องใช้ แหล่งช่างเงินสำคัญอยู่ที่ อ.เมือง และ อ.เวียงป่าเป้า',
          category: 'WISDOM',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Akha_village.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Akha_village.jpg',
          ],
        },
        {
          title: 'ชาสันติคีรี (ดอยแม่สลอง) ชาอู่หลงบนยอดดอย',
          description:
            'ดอยแม่สลอง อ.แม่ฟ้าหลวง จ.เชียงราย เป็นแหล่งปลูกชาที่สำคัญที่สุดของไทย โดยเฉพาะชาอู่หลง (Oolong Tea) ที่มีรสชาติเป็นเอกลักษณ์ สืบทอดจากชาวจีนยูนนาน',
          content:
            'ชาวจีนยูนนาน (กองพล 93 KMT) อพยพมาตั้งถิ่นฐานบนดอยแม่สลองหลังสงครามกลางเมืองจีน นำพันธุ์ชาและเทคนิคการปลูกมาด้วย อากาศเย็นตลอดปีและระดับความสูง 1,200 เมตร ทำให้ชาสันติคีรีมีคุณภาพดีเยี่ยม ปลูกทั้ง อู่หลง ชาเขียว และชาจิ้นซวน',
          category: 'WISDOM',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/5/5e/2019_01_View_over_the_eastern_end_of_Mae_Salong.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/5/5e/2019_01_View_over_the_eastern_end_of_Mae_Salong.jpg',
          ],
        },
        {
          title: 'กาแฟดอยช้าง ดินแดนกาแฟอาราบิก้าไทย',
          description:
            'ดอยช้าง อ.แม่สรวย จ.เชียงราย เป็นแหล่งปลูกกาแฟอาราบิก้าคุณภาพระดับพรีเมียมแห่งแรกของไทย ชาวชาวอาข่าเปลี่ยนจากปลูกฝิ่นมาปลูกกาแฟจนมีชื่อเสียงระดับโลก',
          content:
            'กาแฟดอยช้างเริ่มปลูกตั้งแต่ พ.ศ. 2526 ตามโครงการหลวง ปลูกบนระดับความสูง 1,200-1,600 เมตร ให้รสชาติกลมกล่อม มีกลิ่นหอมผลไม้ ได้รับการรับรองมาตรฐาน Fair Trade และ Organic จนกลายเป็นแบรนด์ "Doi Chaang Coffee" ส่งออกไปทั่วโลก',
          category: 'WISDOM',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/e/e1/Golden_Triangle_P1110585.JPG',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/e/e1/Golden_Triangle_P1110585.JPG',
          ],
        },
        {
          title: 'สมุนไพรพื้นบ้านล้านนา ตำรับยาหมอเมือง',
          description:
            'ภูมิปัญญาสมุนไพรล้านนาเชียงรายสืบทอดจากบรรพบุรุษ "หมอเมือง" คือ แพทย์พื้นบ้านที่ใช้สมุนไพรท้องถิ่นรักษาโรค มีตำรับยาจารึกในใบลานและสมุดข่อย',
          content:
            'สมุนไพรพื้นบ้านล้านนามีหลากหลายชนิด เช่น ว่านชักมดลูก ขิง ข่า ไพล ตะไคร้ มะแขว่น หมอเมืองใช้ทั้งการอบสมุนไพร นวดแบบล้านนา และปรุงยาสมุนไพร ปัจจุบันมีการวิจัยและพัฒนาสมุนไพรล้านนาเป็นผลิตภัณฑ์สุขภาพ เช่น ลูกประคบสมุนไพร น้ำมันนวด',
          category: 'WISDOM',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Wat_Phra_Kaeo%2C_Chiang_Rai_-_2017-06-27_%28055%29.jpg/640px-Wat_Phra_Kaeo%2C_Chiang_Rai_-_2017-06-27_%28055%29.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Wat_Phra_Kaeo%2C_Chiang_Rai_-_2017-06-27_%28055%29.jpg/640px-Wat_Phra_Kaeo%2C_Chiang_Rai_-_2017-06-27_%28055%29.jpg',
          ],
        },
        {
          title: 'สับปะรดภูแล นางแลเชียงราย ผลไม้ GI',
          description:
            'สับปะรดนางแลและสับปะรดภูแลเป็นผลไม้ขึ้นชื่อของเชียงราย ได้รับการขึ้นทะเบียน GI (Geographical Indication) เนื้อหวาน กรอบ แกนนิ่มรับประทานได้ ปลูกในพื้นที่ ต.นางแล อ.เมือง',
          content:
            'สับปะรดภูแลมีลักษณะเด่นคือผลเล็ก ทรงกระบอก สีเหลืองทอง เนื้อละเอียดหวานฉ่ำ แกนกลางอ่อนนุ่มสามารถรับประทานได้ทั้งผล เป็นภูมิปัญญาเกษตรท้องถิ่นที่ชาวเชียงรายสร้างมูลค่าเพิ่มจนเป็นสินค้า OTOP 5 ดาว และส่งออกไปต่างประเทศ',
          category: 'WISDOM',
          mediaType: 'IMAGE',
          author: 'ศูนย์เชียงรายศึกษา',
          thumbnailUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Two_hmong_kids_in_Thailand.jpg/640px-Two_hmong_kids_in_Thailand.jpg',
          mediaUrls: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Two_hmong_kids_in_Thailand.jpg/640px-Two_hmong_kids_in_Thailand.jpg',
          ],
        },
      ];
      await this.drizzle.db.insert(chiangRaiArtifacts).values(sampleArtifacts);
    }

    const conditions: SQL[] = [];

    if (category && category !== 'ALL') {
      conditions.push(eq(chiangRaiArtifacts.category, category as any));
    }

    // Full-text search: ILIKE across title + description + content + author (Thai substring matching)
    if (searchQuery && searchQuery.trim().length > 0) {
      const term = `%${searchQuery.trim()}%`;
      conditions.push(
        or(
          ilike(chiangRaiArtifacts.title, term),
          ilike(chiangRaiArtifacts.description, term),
          ilike(chiangRaiArtifacts.content, term),
          ilike(chiangRaiArtifacts.author, term),
        )!,
      );
    }

    const offset = (page - 1) * limit;

    const query = this.drizzle.db.select().from(chiangRaiArtifacts);
    const countQuery = this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiArtifacts);

    if (conditions.length > 0) {
      query.where(and(...conditions));
      countQuery.where(and(...conditions));
    }

    const data = await query
      .orderBy(desc(chiangRaiArtifacts.createdAt))
      .limit(limit)
      .offset(offset);
    const total = await countQuery;
    const totalItems = total[0].count;

    return {
      data,
      meta: {
        page,
        limit,
        total: totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async getArtifactById(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiArtifacts)
      .where(eq(chiangRaiArtifacts.id, id))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Artifact ${id} not found`);
    }
    return result[0];
  }

  async createArtifact(data: typeof chiangRaiArtifacts.$inferInsert) {
    return this.drizzle.db.insert(chiangRaiArtifacts).values(data).returning();
  }

  async updateArtifact(
    id: string,
    data: Partial<typeof chiangRaiArtifacts.$inferInsert>,
  ) {
    return this.drizzle.db
      .update(chiangRaiArtifacts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(chiangRaiArtifacts.id, id))
      .returning();
  }

  async deleteArtifact(id: string) {
    return this.drizzle.db
      .delete(chiangRaiArtifacts)
      .where(eq(chiangRaiArtifacts.id, id))
      .returning();
  }

  // --- Articles ---
  async getArticles() {
    // Lazy Seeding
    const countResult = await this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiArticles);
    if (countResult[0].count === 0) {
      const sampleArticles: (typeof chiangRaiArticles.$inferInsert)[] = [
        {
          title: 'การเปลี่ยนแปลงทางสังคมวัฒนธรรมในลุ่มน้ำโขง',
          slug: 'socio-cultural-change-mekong-basin',
          category: 'ACADEMIC',
          abstract:
            'บทความวิชาการสำรวจผลกระทบจากการพัฒนาเศรษฐกิจข้ามพรมแดนต่อวิถีชีวิตดั้งเดิม',
          content: '<p>เนื้อหาฉบับเต็มของบทความ...</p>',
          author: 'ดร.สมชาย ใจดี',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1518176258769-f227c798150e',
          mediaType: 'IMAGE',
          mediaUrls: [
            'https://images.unsplash.com/photo-1518176258769-f227c798150e',
          ],
          publishedAt: new Date(),
        },
        {
          title: 'ภูมิปัญญาท้องถิ่นและการจัดการทรัพยากรชุมชน',
          slug: 'local-wisdom-resource-management',
          category: 'RESEARCH',
          abstract:
            'งานวิจัยเชิงปฏิบัติการแบบมีส่วนร่วมในการจัดการป่าชุมชนเชียงราย',
          content: '<p>เนื้อหาฉบับเต็มของงานวิจัย...</p>',
          author: 'ผศ.ดร.วิชัย รักเรียน',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b1e',
          mediaType: 'PDF',
          mediaUrls: ['https://example.com/research.pdf'],
          publishedAt: new Date(),
        },
      ];
      await this.drizzle.db.insert(chiangRaiArticles).values(sampleArticles);
    }

    return this.drizzle.db
      .select()
      .from(chiangRaiArticles)
      .orderBy(desc(chiangRaiArticles.publishedAt));
  }

  async getArticleBySlug(slug: string) {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiArticles)
      .where(eq(chiangRaiArticles.slug, slug))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }
    return result[0];
  }

  async getArticleById(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiArticles)
      .where(eq(chiangRaiArticles.id, id))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Article ${id} not found`);
    }
    return result[0];
  }

  async createArticle(data: typeof chiangRaiArticles.$inferInsert) {
    return this.drizzle.db.insert(chiangRaiArticles).values(data).returning();
  }

  async updateArticle(
    id: string,
    data: Partial<typeof chiangRaiArticles.$inferInsert>,
  ) {
    return this.drizzle.db
      .update(chiangRaiArticles)
      .set(data)
      .where(eq(chiangRaiArticles.id, id))
      .returning();
  }

  async deleteArticle(id: string) {
    return this.drizzle.db
      .delete(chiangRaiArticles)
      .where(eq(chiangRaiArticles.id, id))
      .returning();
  }

  // --- Activities ---
  async getActivities(
    type?: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT',
    page: number = 1,
    limit: number = 10,
  ) {
    const countResult = await this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiActivities);
    if (countResult[0].count === 0) {
      const sampleActivities: (typeof chiangRaiActivities.$inferInsert)[] = [
        // NEWS 1-5
        {
          title: 'เปิดศูนย์เชียงรายศึกษาอย่างเป็นทางการ',
          slug: 'grand-opening-chiang-rai-center',
          type: 'NEWS',
          description:
            'พิธีเปิดศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
          content: '<p>รายละเอียดพิธีเปิด...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1541534741631-27b54065f909',
          publishedAt: new Date('2025-01-15'),
        },
        {
          title: 'ต้อนรับคณะดูงานจากมหาวิทยาลัยเชียงใหม่',
          slug: 'welcome-cmu-visit',
          type: 'NEWS',
          description: 'แลกเปลี่ยนเรียนรู้ด้านการจัดการทรัพยากรวัฒนธรรม',
          content: '<p>รายละเอียดการดูงาน...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
          publishedAt: new Date('2025-02-01'),
        },
        {
          title: 'ลงนามความร่วมมือทางวิชาการกับเครือข่ายล้านนา',
          slug: 'mou-lanna-network',
          type: 'NEWS',
          description: 'พิธีลงนาม MOU เพื่อพัฒนาการศึกษาวิจัยท้องถิ่น',
          content: '<p>รายละเอียด MOU...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1560523160-754a9e25c68f',
          publishedAt: new Date('2025-02-10'),
        },
        {
          title: 'กิจกรรมจิตอาสาพัฒนาชุมชนรอบรั้วมหาลัย',
          slug: 'volunteer-community-dev',
          type: 'NEWS',
          description: 'นักศึกษาและบุคลากรร่วมทำกิจกรรมจิตอาสา',
          content: '<p>รายละเอียดกิจกรรม...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1559027615-cd4628902d4a',
          publishedAt: new Date('2025-02-14'),
        },
        {
          title: 'สรุปผลการดำเนินงานประจำปี 2568',
          slug: 'annual-report-2025',
          type: 'NEWS',
          description: 'รายงานความคืบหน้าและผลสัมฤทธิ์ของศูนย์ฯ',
          content: '<p>อ่านรายงานฉบับเต็ม...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
          publishedAt: new Date('2025-02-20'),
        },
        // EVENTS 1-5
        {
          title: 'นิทรรศการ "วิถีไท ไทลื้อ"',
          slug: 'thai-lue-exhibition',
          type: 'EVENT',
          description:
            'เชิญชมนิทรรศการวิถีชีวิตชาวไทลื้อ ณ หอประชุมใหญ่ (เริ่ม 10-12 มี.ค. 68)',
          content: '<p>รายละเอียดนิทรรศการ...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1533035339937-567086053309',
          publishedAt: new Date('2025-03-01'),
        },
        {
          title: 'อบรมเชิงปฏิบัติการ "นักวิจัยท้องถิ่นรุ่นใหม่"',
          slug: 'young-local-researcher-workshop',
          type: 'EVENT',
          description:
            'รับสมัครผู้สนใจเข้าร่วมอบรมกระบวนการวิจัยเพื่อท้องถิ่น (เริ่ม 20 มี.ค. 68)',
          content: '<p>รายละเอียดการอบรม...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1544531696-60c78a05f32a',
          publishedAt: new Date('2025-03-05'),
        },
        {
          title: 'เสวนาวิชาการ "เชียงรายในทศวรรษหน้า"',
          slug: 'chiang-rai-next-decade-talk',
          type: 'EVENT',
          description:
            'เวทีระดมความคิดเห็นทิศทางการพัฒนาจังหวัดเชียงราย (1 เม.ย. 68)',
          content: '<p>รายละเอียดเสวนา...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1475721027767-f4242310f17e',
          publishedAt: new Date('2025-03-15'),
        },
        {
          title: 'มหกรรมดนตรีชาติพันธุ์ล้านนา',
          slug: 'lanna-ethnic-music-festival',
          type: 'EVENT',
          description:
            'การแสดงดนตรีและศิลปะวัฒนธรรมจากกลุ่มชาติพันธุ์ต่างๆ (13-15 เม.ย. 68)',
          content: '<p>ตารางการแสดง...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1514525253440-b393452e8d26',
          publishedAt: new Date('2025-03-20'),
        },
        {
          title: 'ค่ายอาสาพัฒนาชนบท ครั้งที่ 10',
          slug: 'rural-development-camp-10',
          type: 'EVENT',
          description:
            'รับสมัครนักศึกษาจิตอาสาออกค่ายสร้างฝายชะลอน้ำ (1-5 พ.ค. 68)',
          content: '<p>รายละเอียดการรับสมัคร...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1502086223501-6cb28574d755',
          publishedAt: new Date('2025-03-25'),
        },
        // ANNOUNCEMENTS 1-5
        {
          title: 'ประกาศรับสมัครทุนวิจัยประจำปี 2568',
          slug: 'research-grant-2025',
          type: 'ANNOUNCEMENT',
          description: 'เปิดรับข้อเสนอโครงการวิจัยด้านเชียงรายศึกษา',
          content: '<p>ดาวน์โหลดแบบฟอร์ม...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
          publishedAt: new Date('2025-01-10'),
        },
        {
          title: 'งดให้บริการห้องสมุดชั่วคราว',
          slug: 'library-close-renovation',
          type: 'ANNOUNCEMENT',
          description: 'ปิดปรับปรุงระบบไฟฟ้า ระหว่างวันที่ 1-2 เมษายน',
          content: '<p>ขออภัยในความไม่สะดวก...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
          publishedAt: new Date('2025-03-30'),
        },
        {
          title: 'รับสมัครเจ้าหน้าที่ประสานงานโครงการ 1 อัตรา',
          slug: 'job-vacancy-coordinator',
          type: 'ANNOUNCEMENT',
          description: 'วุฒิปริญญาตรี เงินเดือนตามโครงสร้าง',
          content: '<p>คุณสมบัติ...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1521791136064-7986c2920216',
          publishedAt: new Date('2025-02-15'),
        },
        {
          title: 'ประกาศผลการคัดเลือกบทความตีพิมพ์',
          slug: 'article-selection-result',
          type: 'ANNOUNCEMENT',
          description:
            'รายชื่อบทความที่ผ่านการคัดเลือกตีพิมพ์ในวารสารฉบับล่าสุด',
          content: '<p>ตรวจสอบรายชื่อ...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23',
          publishedAt: new Date('2025-03-01'),
        },
        {
          title: 'แจ้งกำหนดการส่งรายงานความก้าวหน้า',
          slug: 'progress-report-deadline',
          type: 'ANNOUNCEMENT',
          description:
            'ขอให้นักวิจัยส่งรายงานความก้าวหน้าภายในวันที่ 30 เมษายน',
          content: '<p>รายละเอียดการส่ง...</p>',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
          publishedAt: new Date('2025-04-10'),
        },
      ];

      await this.drizzle.db
        .insert(chiangRaiActivities)
        .values(sampleActivities);
    }

    const offset = (page - 1) * limit;

    const query = this.drizzle.db.select().from(chiangRaiActivities);
    const countQuery = this.drizzle.db
      .select({ count: count() })
      .from(chiangRaiActivities);

    if (type) {
      query.where(eq(chiangRaiActivities.type, type));
      countQuery.where(eq(chiangRaiActivities.type, type));
    }

    const data = await query
      .orderBy(desc(chiangRaiActivities.publishedAt))
      .limit(limit)
      .offset(offset);
    const total = await countQuery;
    const totalItems = total[0].count;

    return {
      data,
      meta: {
        page,
        limit,
        total: totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async getActivityById(id: string) {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiActivities)
      .where(eq(chiangRaiActivities.id, id))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Activity ${id} not found`);
    }
    return result[0];
  }

  async getActivityBySlug(slug: string) {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiActivities)
      .where(eq(chiangRaiActivities.slug, slug))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Activity with slug ${slug} not found`);
    }
    return result[0];
  }

  async createActivity(data: typeof chiangRaiActivities.$inferInsert) {
    return this.drizzle.db.insert(chiangRaiActivities).values(data).returning();
  }

  async updateActivity(
    id: string,
    data: Partial<typeof chiangRaiActivities.$inferInsert>,
  ) {
    return this.drizzle.db
      .update(chiangRaiActivities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(chiangRaiActivities.id, id))
      .returning();
  }

  async deleteActivity(id: string) {
    return this.drizzle.db
      .delete(chiangRaiActivities)
      .where(eq(chiangRaiActivities.id, id))
      .returning();
  }

  // --- Staff Management ---

  // =============================================
  // STAFF MANAGEMENT (3 Groups)
  // =============================================

  // Get all staff grouped by staffGroup
  async getStaff() {
    const allStaff = await this.drizzle.db
      .select()
      .from(chiangRaiStaff)
      .where(eq(chiangRaiStaff.isActive, true))
      .orderBy(asc(chiangRaiStaff.sortOrder));

    return {
      advisors: allStaff.filter((s) => s.staffGroup === 'ADVISOR'),
      executives: allStaff.filter((s) => s.staffGroup === 'EXECUTIVE'),
      committee: allStaff.filter((s) => s.staffGroup === 'COMMITTEE'),
    };
  }

  // Get staff by specific group
  async getStaffByGroup(group: 'ADVISOR' | 'EXECUTIVE' | 'COMMITTEE') {
    return this.drizzle.db
      .select()
      .from(chiangRaiStaff)
      .where(
        and(
          eq(chiangRaiStaff.isActive, true),
          eq(chiangRaiStaff.staffGroup, group),
        ),
      )
      .orderBy(asc(chiangRaiStaff.sortOrder));
  }

  // Create staff manually (especially for Advisors)
  async createStaff(data: typeof chiangRaiStaff.$inferInsert) {
    return this.drizzle.db.insert(chiangRaiStaff).values(data).returning();
  }

  // Update staff
  async updateStaff(
    id: string,
    data: Partial<typeof chiangRaiStaff.$inferInsert>,
  ) {
    return this.drizzle.db
      .update(chiangRaiStaff)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(chiangRaiStaff.id, id))
      .returning();
  }

  // Delete staff
  async deleteStaff(id: string) {
    return this.drizzle.db
      .delete(chiangRaiStaff)
      .where(eq(chiangRaiStaff.id, id))
      .returning();
  }

  // List all Faculty Staff (for Admin import selector)
  async getFacultyStaffList() {
    return this.drizzle.db
      .select({
        id: staffProfiles.id,
        prefixTh: staffProfiles.prefixTh,
        firstNameTh: staffProfiles.firstNameTh,
        lastNameTh: staffProfiles.lastNameTh,
        academicPosition: staffProfiles.academicPosition,
        department: departments.nameTh,
        imageUrl: staffProfiles.imageUrl,
        email: staffProfiles.contactEmail,
      })
      .from(staffProfiles)
      .leftJoin(departments, eq(staffProfiles.departmentId, departments.id));
  }

  // Import a Faculty Staff member into Chiang Rai Staff
  async importStaffFromFaculty(
    facultyStaffId: string,
    staffGroup: 'EXECUTIVE' | 'COMMITTEE',
    position: string,
  ) {
    const facultyStaff = await this.drizzle.db
      .select()
      .from(staffProfiles)
      .where(eq(staffProfiles.id, facultyStaffId))
      .limit(1);

    if (!facultyStaff.length) {
      throw new NotFoundException('Faculty staff not found');
    }

    const staff = facultyStaff[0];

    // Map academic position enum to Thai label
    const academicTitleMap: Record<string, string> = {
      LECTURER: 'อ.',
      ASSISTANT_PROF: 'ผศ.',
      ASSOCIATE_PROF: 'รศ.',
      PROFESSOR: 'ศ.',
    };

    const newStaffData: typeof chiangRaiStaff.$inferInsert = {
      staffGroup,
      title: staff.prefixTh || '',
      firstName: staff.firstNameTh,
      lastName: staff.lastNameTh,
      position,
      academicTitle: staff.academicPosition
        ? academicTitleMap[staff.academicPosition] || ''
        : '',
      email: staff.contactEmail,
      imageUrl: staff.imageUrl,
      bio: staff.bio,
      facultyStaffId,
      isActive: true,
    };

    return this.drizzle.db
      .insert(chiangRaiStaff)
      .values(newStaffData)
      .returning();
  }

  // --- Config ---
  async getConfig() {
    const result = await this.drizzle.db
      .select()
      .from(chiangRaiConfig)
      .limit(1);
    if (!result.length) {
      // Should be created by migration/seed, but just in case fallback
      return {
        heroBgUrl: null,
        heroTitle: 'ศูนย์เชียงรายศึกษา',
        heroSubtitle:
          'แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน ผ่าน 5 มิติทางวัฒนธรรม',
      };
    }
    return result[0];
  }

  async updateConfig(data: Partial<typeof chiangRaiConfig.$inferInsert>) {
    // Always update ID 1
    return this.drizzle.db
      .update(chiangRaiConfig)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(chiangRaiConfig.id, 1))
      .returning();
  }
}
