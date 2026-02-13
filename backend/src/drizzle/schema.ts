import { pgTable, uuid, varchar, text, integer, boolean, decimal, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// ------------------------------------------
// Enums
// ------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'EDITOR', 'STAFF', 'GUEST']);
export const degreeLevelEnum = pgEnum('degree_level', ['BACHELOR', 'MASTER', 'PHD']);
export const researchCategoryEnum = pgEnum('research_category', ['ACADEMIC', 'INNOVATION', 'COMMUNITY']);
export const newsCategoryEnum = pgEnum('news_category', ['NEWS', 'EVENT', 'ANNOUNCE']);

// Staff-related Enums (ตาม Excel Schema)
export const staffTypeEnum = pgEnum('staff_type', ['ACADEMIC', 'SUPPORT']);
export const academicPositionEnum = pgEnum('academic_position', [
    'LECTURER',           // อาจารย์
    'ASSISTANT_PROF',     // ผู้ช่วยศาสตราจารย์ (ผศ.)
    'ASSOCIATE_PROF',     // รองศาสตราจารย์ (รศ.)
    'PROFESSOR'           // ศาสตราจารย์ (ศ.)
]);

// ------------------------------------------
// 1. Users & IAM (Google OAuth for @crru.ac.th)
// ------------------------------------------

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    googleId: varchar('google_id', { length: 255 }).unique(), // Google OAuth ID
    name: varchar('name', { length: 255 }), // ชื่อจาก Google
    avatar: varchar('avatar', { length: 500 }), // รูปโปรไฟล์จาก Google
    passwordHash: varchar('password_hash', { length: 255 }), // Optional: สำหรับ local auth
    // role: userRoleEnum('role').default('STAFF').notNull(), // OLD
    roles: text('roles').array().default(['STAFF']).notNull(), // NEW: Multiple Roles
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ------------------------------------------
// 2. Organization & Personnel (ตาม Excel Schema)
// ------------------------------------------

export const departments = pgTable('departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    nameTh: varchar('name_th', { length: 255 }).notNull(),
    nameEn: varchar('name_en', { length: 255 }),
    isAcademicUnit: boolean('is_academic_unit').default(true).notNull(), // สาขาวิชา vs หน่วยงานสนับสนุน
});

export const staffProfiles = pgTable('staff_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id), // Optional: ไม่บังคับเชื่อมโยง user account
    departmentId: integer('department_id').notNull().references(() => departments.id),

    // ข้อมูลพื้นฐาน (Common) - ภาษาไทย
    prefixTh: varchar('prefix_th', { length: 50 }),
    firstNameTh: varchar('first_name_th', { length: 100 }).notNull(),
    lastNameTh: varchar('last_name_th', { length: 100 }).notNull(),

    // ข้อมูลพื้นฐาน (Common) - ภาษาอังกฤษ
    prefixEn: varchar('prefix_en', { length: 50 }),
    firstNameEn: varchar('first_name_en', { length: 100 }),
    lastNameEn: varchar('last_name_en', { length: 100 }),

    // ประเภทบุคลากร
    staffType: staffTypeEnum('staff_type').default('ACADEMIC').notNull(),

    // ตำแหน่งวิชาการ (สำหรับสายวิชาการเท่านั้น)
    academicPosition: academicPositionEnum('academic_position'),

    // ตำแหน่งบริหาร (ทั้งสายวิชาการและสนับสนุน ถ้ามี)
    adminPosition: varchar('admin_position', { length: 255 }), // e.g. คณบดี, หัวหน้าสาขา

    // วุฒิการศึกษา (รองรับหลายวุฒิ)
    education: jsonb('education').$type<{
        level: 'BACHELOR' | 'MASTER' | 'DOCTORAL';
        detail: string; // e.g. "ศศ.บ. (สังคมวิทยา) มหาวิทยาลัยเชียงใหม่"
    }[]>(),

    // ข้อมูลติดต่อ
    contactEmail: varchar('contact_email', { length: 255 }),

    // ข้อมูลเพิ่มเติม
    expertise: text('expertise').array(),
    imageUrl: varchar('image_url', { length: 500 }),
    bio: text('bio'),
    sortOrder: integer('sort_order').default(0).notNull(), // สำหรับเรียงลำดับการแสดงผล
    isExecutive: boolean('is_executive').default(false).notNull(), // สถานะผู้บริหาร (แยกจากประเภทบุคลากร)
});

// ------------------------------------------
// 3. Academics (Degrees & Short Courses)
// ------------------------------------------

export const programs = pgTable('programs', {
    id: uuid('id').primaryKey().defaultRandom(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    nameTh: varchar('name_th', { length: 255 }).notNull(),
    degreeTitleTh: varchar('degree_title_th', { length: 255 }), // e.g. "ศิลปศาสตรบัณฑิต (สังคมศาสตร์)"
    degreeTitleEn: varchar('degree_title_en', { length: 255 }),
    degreeLevel: degreeLevelEnum('degree_level').notNull(),
    bannerUrl: varchar('banner_url', { length: 500 }),
    curriculumUrl: varchar('curriculum_url', { length: 500 }),
    description: text('description'),

    // JSONB Structures
    structure: jsonb('structure').$type<{
        totalCredits: number;
        general: number;
        major: number;
        freeElective: number;
    }>(),

    careers: text('careers').array(),

    highlights: jsonb('highlights').$type<{
        title: string;
        description: string;
        icon?: string;
    }[]>(),

    concentrations: jsonb('concentrations').$type<{
        title: string;
        description: string;
    }[]>(),
});

export const shortCourses = pgTable('short_courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    durationHours: integer('duration_hours').notNull(),
    creditBankValue: integer('credit_bank_value').default(0).notNull(),
    isOnline: boolean('is_online').default(false).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});

// ------------------------------------------
// 4. Research & Innovation
// ------------------------------------------

export const researchProjects = pgTable('research_projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    abstract: text('abstract'),
    publicationYear: integer('publication_year').notNull(),
    category: researchCategoryEnum('category').notNull(),
    externalLink: varchar('external_link', { length: 500 }),
});

export const researchAuthors = pgTable('research_authors', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    researchId: uuid('research_id').notNull().references(() => researchProjects.id),
    staffId: uuid('staff_id').notNull().references(() => staffProfiles.id),
});

// ------------------------------------------
// 5. Content Management (CMS)
// ------------------------------------------

export const news = pgTable('news', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    content: text('content').notNull(),
    category: newsCategoryEnum('category').notNull(),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
    isPublished: boolean('is_published').default(true).notNull(),
    publishedAt: timestamp('published_at').defaultNow(),
    authorId: uuid('author_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const banners = pgTable('banners', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    linkUrl: varchar('link_url', { length: 500 }),
    order: integer('order').default(0).notNull(),
});

// ------------------------------------------
// 6. Chiang Rai Studies Center (Microservice)
// ------------------------------------------

export const chiangRaiIdentityCategoryEnum = pgEnum('cr_identity_category', [
    'HISTORY',      // ประวัติศาสตร์
    'ARCHAEOLOGY',  // โบราณคดี
    'CULTURE',      // วัฒนธรรม ความเชื่อ
    'ARTS',         // ศิลปะการแสดง
    'WISDOM'        // ภูมิปัญญาท้องถิ่น
]);

export const chiangRaiIdentities = pgTable('chiang_rai_identities', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code: chiangRaiIdentityCategoryEnum('code').notNull().unique(),
    nameTh: varchar('name_th', { length: 255 }).notNull(),
    nameEn: varchar('name_en', { length: 255 }),
    description: text('description'),
    imageUrl: varchar('image_url', { length: 500 }),
});

export const chiangRaiArtifacts = pgTable('chiang_rai_artifacts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    description: text('description'), // Short intro
    content: text('content'), // Full detail or Markdown
    identityId: integer('identity_id').references(() => chiangRaiIdentities.id),
    category: chiangRaiIdentityCategoryEnum('category'), // Denormalized for easier query

    // Media support
    mediaType: varchar('media_type', { length: 50 }).default('IMAGE'), // IMAGE, VIDEO, AUDIO, 3D
    mediaUrls: text('media_urls').array(), // List of related media
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

    author: varchar('author', { length: 255 }),
    isPublished: boolean('is_published').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const chiangRaiArticles = pgTable('chiang_rai_articles', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    abstract: text('abstract'),
    content: text('content').notNull(),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

    tags: text('tags').array(),
    author: varchar('author', { length: 255 }),

    isPublished: boolean('is_published').default(true),
    publishedAt: timestamp('published_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const chiangRaiStaffRoleEnum = pgEnum('cr_staff_role', [
    'DIRECTOR',      // ผู้อำนวยการ
    'ACADEMIC',      // ฝ่ายวิชาการ
    'NETWORK',       // ฝ่ายประสานเครือข่าย
    'DISSEMINATION', // ฝ่ายเผยแพร่ข้อมูล
    'SUPPORT'        // เจ้าหน้าที่ช่วยงานทั่วไป
]);

export const chiangRaiStaff = pgTable('chiang_rai_staff', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 50 }), // e.g. นาย, นาง, ดร.
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }), // ตำแหน่งที่แสดงผล e.g. "หัวหน้าโครงการ"
    role: chiangRaiStaffRoleEnum('role').notNull(), // หมวดหมู่สำหรับจัดกลุ่ม
    email: varchar('email', { length: 255 }),
    imageUrl: varchar('image_url', { length: 500 }),
    bio: text('bio'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const chiangRaiActivityTypeEnum = pgEnum('cr_activity_type', [
    'NEWS',          // ข่าวสาร
    'EVENT',         // กิจกรรม
    'ANNOUNCEMENT'   // ประกาศ
]);

export const chiangRaiActivities = pgTable('chiang_rai_activities', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    type: chiangRaiActivityTypeEnum('type').notNull().default('NEWS'),
    description: text('description'),
    content: text('content'),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
    mediaUrls: text('media_urls').array(),

    location: varchar('location', { length: 500 }),
    eventDate: timestamp('event_date'),
    eventEndDate: timestamp('event_end_date'),

    author: varchar('author', { length: 255 }),
    tags: text('tags').array(),
    isPublished: boolean('is_published').default(true),
    isFeatured: boolean('is_featured').default(false),
    publishedAt: timestamp('published_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
