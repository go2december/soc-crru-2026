

import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { chiangRaiIdentities, chiangRaiArtifacts, chiangRaiArticles, chiangRaiActivities, chiangRaiStaff, staffProfiles, departments } from '../drizzle/schema';
import { eq, desc, asc, ilike, or, and, count, SQL } from 'drizzle-orm';

@Injectable()
export class ChiangRaiService {
    constructor(private readonly drizzle: DrizzleService) { }

    // --- Identities ---
    async getAllIdentities() {
        const identities = await this.drizzle.db.select().from(chiangRaiIdentities);

        // Lazy Seeding: If no identities exist, populate them
        if (identities.length === 0) {
            const defaultIdentities: typeof chiangRaiIdentities.$inferInsert[] = [
                {
                    code: 'HISTORY',
                    nameTh: 'ประวัติศาสตร์',
                    nameEn: 'History',
                    description: 'ประวัติศาสตร์ความเป็นมาของเมืองเชียงรายและอาณาจักรล้านนา',
                    imageUrl: '/images/chiang-rai/history.jpg'
                },
                {
                    code: 'ARCHAEOLOGY',
                    nameTh: 'โบราณคดี',
                    nameEn: 'Archaeology',
                    description: 'การศึกษาหลักฐานทางโบราณคดีและแหล่งประวัติศาสตร์ในพื้นที่',
                    imageUrl: '/images/chiang-rai/archaeology.jpg'
                },
                {
                    code: 'CULTURE',
                    nameTh: 'วัฒนธรรม ความเชื่อ',
                    nameEn: 'Culture & Beliefs',
                    description: 'วิถีชีวิต ประเพณี และความเชื่อท้องถิ่นที่สืบทอดกันมา',
                    imageUrl: '/images/chiang-rai/culture.jpg'
                },
                {
                    code: 'ARTS',
                    nameTh: 'ศิลปะการแสดง',
                    nameEn: 'Performing Arts',
                    description: 'ดนตรีพื้นเมือง การฟ้อนรำ และศิลปะการแสดงล้านนา',
                    imageUrl: '/images/chiang-rai/arts.jpg'
                },
                {
                    code: 'WISDOM',
                    nameTh: 'ภูมิปัญญาท้องถิ่น',
                    nameEn: 'Local Wisdom',
                    description: 'องค์ความรู้ภูมิปัญญาท้องถิ่นในด้านต่างๆ',
                    imageUrl: '/images/chiang-rai/wisdom.jpg'
                }
            ];

            return this.drizzle.db.insert(chiangRaiIdentities).values(defaultIdentities).returning();
        }

        return identities;
    }

    async getIdentityByCode(code: 'HISTORY' | 'ARCHAEOLOGY' | 'CULTURE' | 'ARTS' | 'WISDOM') {
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
            this.drizzle.db.select()
                .from(chiangRaiArtifacts)
                .where(or(
                    ilike(chiangRaiArtifacts.title, searchTerm),
                    ilike(chiangRaiArtifacts.description, searchTerm),
                    ilike(chiangRaiArtifacts.content, searchTerm)
                ))
                .orderBy(desc(chiangRaiArtifacts.createdAt))
                .limit(10), // Limit results for performance

            // 2. Search Articles
            this.drizzle.db.select()
                .from(chiangRaiArticles)
                .where(or(
                    ilike(chiangRaiArticles.title, searchTerm),
                    ilike(chiangRaiArticles.abstract, searchTerm),
                    ilike(chiangRaiArticles.content, searchTerm)
                ))
                .orderBy(desc(chiangRaiArticles.publishedAt))
                .limit(10),

            // 3. Search Activities
            this.drizzle.db.select()
                .from(chiangRaiActivities)
                .where(or(
                    ilike(chiangRaiActivities.title, searchTerm),
                    ilike(chiangRaiActivities.description, searchTerm),
                    ilike(chiangRaiActivities.content, searchTerm)
                ))
                .orderBy(desc(chiangRaiActivities.publishedAt))
                .limit(10)
        ]);

        return {
            artifacts,
            articles,
            activities
        };
    }


    // --- Artifacts ---
    async getArtifacts(category?: string, searchQuery?: string) {
        // Lazy Seeding: If no artifacts exist, populate them
        const countResult = await this.drizzle.db.select({ count: count() }).from(chiangRaiArtifacts);
        if (countResult[0].count === 0) {
            const sampleArtifacts: typeof chiangRaiArtifacts.$inferInsert[] = [
                {
                    title: 'คัมภีร์ใบลานล้านนา',
                    description: 'คัมภีร์โบราณจารึกอักษรธรรมล้านนา บันทึกเรื่องราวทางศาสนาและประวัติศาสตร์',
                    content: 'รายละเอียดเกี่ยวกับคัมภีร์ใบลาน...',
                    category: 'HISTORY',
                    mediaType: 'IMAGE',
                    mediaUrls: ['https://images.unsplash.com/photo-1544256718-3bcf237f3974'],
                    thumbnailUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974'
                },
                {
                    title: 'เครื่องเงินเชียงราย',
                    description: 'งานหัตถกรรมเครื่องเงินที่มีลวดลายเอกลักษณ์เฉพาะตัวของช่างฝีมือเชียงราย',
                    category: 'WISDOM',
                    mediaType: 'IMAGE',
                    mediaUrls: ['https://images.unsplash.com/photo-1610450917711-209214732120'],
                    thumbnailUrl: 'https://images.unsplash.com/photo-1610450917711-209214732120'
                },
                {
                    title: 'กลองสะบัดชัย',
                    description: 'ศิลปะการดนตรีและการแสดงอันทรงพลังของล้านนา',
                    category: 'ARTS',
                    mediaType: 'VIDEO',
                    mediaUrls: ['https://www.youtube.com/watch?v=example'],
                    thumbnailUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212'
                },
                {
                    title: 'ผ้าทอไทลื้อ',
                    description: 'ผ้าทอมือลายน้ำไหล เอกลักษณ์ของชาวไทลื้อเชียงของ',
                    category: 'CULTURE',
                    mediaType: 'IMAGE',
                    mediaUrls: ['https://images.unsplash.com/photo-1523363402092-74b89c02d94b'],
                    thumbnailUrl: 'https://images.unsplash.com/photo-1523363402092-74b89c02d94b'
                },
                {
                    title: 'พระพุทธรูปเชียงแสน',
                    description: 'พระพุทธรูปศิลปะเชียงแสน สกุลช่างสิงห์หนึ่ง',
                    category: 'ARCHAEOLOGY',
                    mediaType: 'IMAGE',
                    mediaUrls: ['https://images.unsplash.com/photo-1626270634689-54d6537706d9'],
                    thumbnailUrl: 'https://images.unsplash.com/photo-1626270634689-54d6537706d9'
                }
            ];
            await this.drizzle.db.insert(chiangRaiArtifacts).values(sampleArtifacts);
        }

        const conditions: SQL[] = [];

        if (category && category !== 'ALL') {
            conditions.push(eq(chiangRaiArtifacts.category, category as any));
        }

        if (searchQuery && searchQuery.trim().length > 0) {
            const term = `%${searchQuery.trim()}%`;
            conditions.push(or(
                ilike(chiangRaiArtifacts.title, term),
                ilike(chiangRaiArtifacts.description, term),
                ilike(chiangRaiArtifacts.content, term)
            )!);
        }

        return this.drizzle.db.select()
            .from(chiangRaiArtifacts)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(chiangRaiArtifacts.createdAt));
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

    async updateArtifact(id: string, data: Partial<typeof chiangRaiArtifacts.$inferInsert>) {
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
        const countResult = await this.drizzle.db.select({ count: count() }).from(chiangRaiArticles);
        if (countResult[0].count === 0) {
            const sampleArticles: typeof chiangRaiArticles.$inferInsert[] = [
                {
                    title: 'การเปลี่ยนแปลงทางสังคมวัฒนธรรมในลุ่มน้ำโขง',
                    slug: 'socio-cultural-change-mekong-basin',
                    category: 'ACADEMIC',
                    abstract: 'บทความวิชาการสำรวจผลกระทบจากการพัฒนาเศรษฐกิจข้ามพรมแดนต่อวิถีชีวิตดั้งเดิม',
                    content: '<p>เนื้อหาฉบับเต็มของบทความ...</p>',
                    author: 'ดร.สมชาย ใจดี',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e',
                    mediaType: 'IMAGE',
                    mediaUrls: ['https://images.unsplash.com/photo-1518176258769-f227c798150e'],
                    publishedAt: new Date(),
                },
                {
                    title: 'ภูมิปัญญาท้องถิ่นและการจัดการทรัพยากรชุมชน',
                    slug: 'local-wisdom-resource-management',
                    category: 'RESEARCH',
                    abstract: 'งานวิจัยเชิงปฏิบัติการแบบมีส่วนร่วมในการจัดการป่าชุมชนเชียงราย',
                    content: '<p>เนื้อหาฉบับเต็มของงานวิจัย...</p>',
                    author: 'ผศ.ดร.วิชัย รักเรียน',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b1e',
                    mediaType: 'PDF',
                    mediaUrls: ['https://example.com/research.pdf'],
                    publishedAt: new Date(),
                }
            ];
            await this.drizzle.db.insert(chiangRaiArticles).values(sampleArticles);
        }

        return this.drizzle.db.select().from(chiangRaiArticles).orderBy(desc(chiangRaiArticles.publishedAt));
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

    async updateArticle(id: string, data: Partial<typeof chiangRaiArticles.$inferInsert>) {
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
    async getActivities(type?: 'NEWS' | 'EVENT' | 'ANNOUNCEMENT', page: number = 1, limit: number = 10) {
        const countResult = await this.drizzle.db.select({ count: count() }).from(chiangRaiActivities);
        if (countResult[0].count === 0) {
            const sampleActivities: typeof chiangRaiActivities.$inferInsert[] = [
                // NEWS 1-5
                {
                    title: 'เปิดศูนย์เชียงรายศึกษาอย่างเป็นทางการ',
                    slug: 'grand-opening-chiang-rai-center',
                    type: 'NEWS',
                    description: 'พิธีเปิดศูนย์เชียงรายศึกษา คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย',
                    content: '<p>รายละเอียดพิธีเปิด...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1541534741631-27b54065f909',
                    publishedAt: new Date('2025-01-15')
                },
                {
                    title: 'ต้อนรับคณะดูงานจากมหาวิทยาลัยเชียงใหม่',
                    slug: 'welcome-cmu-visit',
                    type: 'NEWS',
                    description: 'แลกเปลี่ยนเรียนรู้ด้านการจัดการทรัพยากรวัฒนธรรม',
                    content: '<p>รายละเอียดการดูงาน...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
                    publishedAt: new Date('2025-02-01')
                },
                {
                    title: 'ลงนามความร่วมมือทางวิชาการกับเครือข่ายล้านนา',
                    slug: 'mou-lanna-network',
                    type: 'NEWS',
                    description: 'พิธีลงนาม MOU เพื่อพัฒนาการศึกษาวิจัยท้องถิ่น',
                    content: '<p>รายละเอียด MOU...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1560523160-754a9e25c68f',
                    publishedAt: new Date('2025-02-10')
                },
                {
                    title: 'กิจกรรมจิตอาสาพัฒนาชุมชนรอบรั้วมหาลัย',
                    slug: 'volunteer-community-dev',
                    type: 'NEWS',
                    description: 'นักศึกษาและบุคลากรร่วมทำกิจกรรมจิตอาสา',
                    content: '<p>รายละเอียดกิจกรรม...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a',
                    publishedAt: new Date('2025-02-14')
                },
                {
                    title: 'สรุปผลการดำเนินงานประจำปี 2568',
                    slug: 'annual-report-2025',
                    type: 'NEWS',
                    description: 'รายงานความคืบหน้าและผลสัมฤทธิ์ของศูนย์ฯ',
                    content: '<p>อ่านรายงานฉบับเต็ม...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
                    publishedAt: new Date('2025-02-20')
                },
                // EVENTS 1-5
                {
                    title: 'นิทรรศการ "วิถีไท ไทลื้อ"',
                    slug: 'thai-lue-exhibition',
                    type: 'EVENT',
                    description: 'เชิญชมนิทรรศการวิถีชีวิตชาวไทลื้อ ณ หอประชุมใหญ่ (เริ่ม 10-12 มี.ค. 68)',
                    content: '<p>รายละเอียดนิทรรศการ...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1533035339937-567086053309',
                    publishedAt: new Date('2025-03-01')
                },
                {
                    title: 'อบรมเชิงปฏิบัติการ "นักวิจัยท้องถิ่นรุ่นใหม่"',
                    slug: 'young-local-researcher-workshop',
                    type: 'EVENT',
                    description: 'รับสมัครผู้สนใจเข้าร่วมอบรมกระบวนการวิจัยเพื่อท้องถิ่น (เริ่ม 20 มี.ค. 68)',
                    content: '<p>รายละเอียดการอบรม...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1544531696-60c78a05f32a',
                    publishedAt: new Date('2025-03-05')
                },
                {
                    title: 'เสวนาวิชาการ "เชียงรายในทศวรรษหน้า"',
                    slug: 'chiang-rai-next-decade-talk',
                    type: 'EVENT',
                    description: 'เวทีระดมความคิดเห็นทิศทางการพัฒนาจังหวัดเชียงราย (1 เม.ย. 68)',
                    content: '<p>รายละเอียดเสวนา...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027767-f4242310f17e',
                    publishedAt: new Date('2025-03-15')
                },
                {
                    title: 'มหกรรมดนตรีชาติพันธุ์ล้านนา',
                    slug: 'lanna-ethnic-music-festival',
                    type: 'EVENT',
                    description: 'การแสดงดนตรีและศิลปะวัฒนธรรมจากกลุ่มชาติพันธุ์ต่างๆ (13-15 เม.ย. 68)',
                    content: '<p>ตารางการแสดง...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26',
                    publishedAt: new Date('2025-03-20')
                },
                {
                    title: 'ค่ายอาสาพัฒนาชนบท ครั้งที่ 10',
                    slug: 'rural-development-camp-10',
                    type: 'EVENT',
                    description: 'รับสมัครนักศึกษาจิตอาสาออกค่ายสร้างฝายชะลอน้ำ (1-5 พ.ค. 68)',
                    content: '<p>รายละเอียดการรับสมัคร...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1502086223501-6cb28574d755',
                    publishedAt: new Date('2025-03-25')
                },
                // ANNOUNCEMENTS 1-5
                {
                    title: 'ประกาศรับสมัครทุนวิจัยประจำปี 2568',
                    slug: 'research-grant-2025',
                    type: 'ANNOUNCEMENT',
                    description: 'เปิดรับข้อเสนอโครงการวิจัยด้านเชียงรายศึกษา',
                    content: '<p>ดาวน์โหลดแบบฟอร์ม...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
                    publishedAt: new Date('2025-01-10')
                },
                {
                    title: 'งดให้บริการห้องสมุดชั่วคราว',
                    slug: 'library-close-renovation',
                    type: 'ANNOUNCEMENT',
                    description: 'ปิดปรับปรุงระบบไฟฟ้า ระหว่างวันที่ 1-2 เมษายน',
                    content: '<p>ขออภัยในความไม่สะดวก...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
                    publishedAt: new Date('2025-03-30')
                },
                {
                    title: 'รับสมัครเจ้าหน้าที่ประสานงานโครงการ 1 อัตรา',
                    slug: 'job-vacancy-coordinator',
                    type: 'ANNOUNCEMENT',
                    description: 'วุฒิปริญญาตรี เงินเดือนตามโครงสร้าง',
                    content: '<p>คุณสมบัติ...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
                    publishedAt: new Date('2025-02-15')
                },
                {
                    title: 'ประกาศผลการคัดเลือกบทความตีพิมพ์',
                    slug: 'article-selection-result',
                    type: 'ANNOUNCEMENT',
                    description: 'รายชื่อบทความที่ผ่านการคัดเลือกตีพิมพ์ในวารสารฉบับล่าสุด',
                    content: '<p>ตรวจสอบรายชื่อ...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23',
                    publishedAt: new Date('2025-03-01')
                },
                {
                    title: 'แจ้งกำหนดการส่งรายงานความก้าวหน้า',
                    slug: 'progress-report-deadline',
                    type: 'ANNOUNCEMENT',
                    description: 'ขอให้นักวิจัยส่งรายงานความก้าวหน้าภายในวันที่ 30 เมษายน',
                    content: '<p>รายละเอียดการส่ง...</p>',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
                    publishedAt: new Date('2025-04-10')
                }
            ];

            await this.drizzle.db.insert(chiangRaiActivities).values(sampleActivities);
        }

        const offset = (page - 1) * limit;

        const query = this.drizzle.db.select().from(chiangRaiActivities);
        const countQuery = this.drizzle.db.select({ count: count() }).from(chiangRaiActivities);

        if (type) {
            query.where(eq(chiangRaiActivities.type, type));
            countQuery.where(eq(chiangRaiActivities.type, type));
        }

        const data = await query.orderBy(desc(chiangRaiActivities.publishedAt)).limit(limit).offset(offset);
        const total = await countQuery;
        const totalItems = total[0].count;

        return {
            data,
            meta: {
                page,
                limit,
                total: totalItems,
                totalPages: Math.ceil(totalItems / limit),
            }
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

    async updateActivity(id: string, data: Partial<typeof chiangRaiActivities.$inferInsert>) {
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

    // 1. Get Chiang Rai Staff (Public & Admin)
    async getStaff() {
        return this.drizzle.db
            .select()
            .from(chiangRaiStaff)
            .where(eq(chiangRaiStaff.isActive, true))
            .orderBy(asc(chiangRaiStaff.sortOrder));
    }

    // 2. Add New Staff (Manual)
    async createStaff(data: typeof chiangRaiStaff.$inferInsert) {
        return this.drizzle.db.insert(chiangRaiStaff).values(data).returning();
    }

    // 3. Delete Staff
    async deleteStaff(id: string) {
        return this.drizzle.db.delete(chiangRaiStaff).where(eq(chiangRaiStaff.id, id)).returning();
    }

    // --- Faculty Staff Integration (Import Feature) ---

    // 1. List all Faculty Staff (for Admin selector)
    async getFacultyStaffList() {
        // Join with departments to show useful info
        return this.drizzle.db
            .select({
                id: staffProfiles.id,
                firstNameTh: staffProfiles.firstNameTh,
                lastNameTh: staffProfiles.lastNameTh,
                department: departments.nameTh,
                imageUrl: staffProfiles.imageUrl,
                email: staffProfiles.contactEmail
            })
            .from(staffProfiles)
            .leftJoin(departments, eq(staffProfiles.departmentId, departments.id));
    }

    // 2. Import a Faculty Staff member into Chiang Rai Staff
    async importStaffFromFaculty(facultyStaffId: string, role: 'DIRECTOR' | 'ACADEMIC' | 'NETWORK' | 'DISSEMINATION' | 'SUPPORT') {
        // 2.1 Fetch Faculty Staff Data
        const facultyStaff = await this.drizzle.db
            .select()
            .from(staffProfiles)
            .where(eq(staffProfiles.id, facultyStaffId))
            .limit(1);

        if (!facultyStaff.length) {
            throw new NotFoundException('Faculty Staff not found');
        }

        const staff = facultyStaff[0];

        // 2.2 Map data to Chiang Rai Schema
        // Note: We COPY data, so it becomes independent. Updates in Faculty won't affect Chiang Rai unless re-imported.
        const newStaffData: typeof chiangRaiStaff.$inferInsert = {
            firstName: staff.firstNameTh,
            lastName: staff.lastNameTh,
            title: staff.prefixTh || '',
            email: staff.contactEmail,
            imageUrl: staff.imageUrl,
            // Default position to their academic position or empty
            position: staff.academicPosition || 'อาจารย์',
            role: role,
            bio: staff.bio, // Optional: Copy bio if needed
            isActive: true
        };

        // 2.3 Insert into Chiang Rai Table
        return this.drizzle.db.insert(chiangRaiStaff).values(newStaffData).returning();
    }
}

