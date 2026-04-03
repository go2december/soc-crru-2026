import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  timestamp,
  pgEnum,
  jsonb,
  index,
  primaryKey,
  real,
} from 'drizzle-orm/pg-core';

// ------------------------------------------
// Enums
// ------------------------------------------

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'EDITOR',
  'STAFF',
  'GUEST',
]);
export const degreeLevelEnum = pgEnum('degree_level', [
  'BACHELOR',
  'MASTER',
  'PHD',
]);
export const projectStatusEnum = pgEnum('project_status', [
  'ONGOING',
  'COMPLETED',
  'PUBLISHED',
  'CANCELLED',
]);
export const memberRoleEnum = pgEnum('member_role', [
  'HEAD',
  'CO_RESEARCHER',
  'ADVISOR',
  'ASSISTANT',
  'EXTERNAL_EXPERT',
]);
export const newsCategoryEnum = pgEnum('news_category', [
  'NEWS',
  'EVENT',
  'ANNOUNCE',
  'JOB',
]);

// Staff-related Constants
export const staffTypeEnum = pgEnum('staff_type', ['ACADEMIC', 'SUPPORT']);

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

export const academicPositions = pgTable('academic_positions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nameTh: varchar('name_th', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const adminPositions = pgTable('admin_positions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nameTh: varchar('name_th', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const staffProfiles = pgTable('staff_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id), // Optional: ไม่บังคับเชื่อมโยง user account
  departmentId: integer('department_id')
    .notNull()
    .references(() => departments.id),

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
  academicPositionId: integer('academic_position_id').references(() => academicPositions.id),

  // ตำแหน่งบริหาร (ทั้งสายวิชาการและสนับสนุน ถ้ามี)
  adminPositionId: integer('admin_position_id').references(() => adminPositions.id),

  // วุฒิการศึกษา (รองรับหลายวุฒิ)
  education: jsonb('education').$type<
    {
      level: 'BACHELOR' | 'MASTER' | 'DOCTORAL';
      detail: string; // e.g. "ศศ.บ. (สังคมวิทยา) มหาวิทยาลัยเชียงใหม่"
    }[]
  >(),

  // ข้อมูลติดต่อ
  contactEmail: varchar('contact_email', { length: 255 }),

  // ข้อมูลเพิ่มเติม
  expertise: text('expertise').array(),
  imageUrl: varchar('image_url', { length: 500 }),
  bio: text('bio'),
  shortBios: text('short_bios').array(),
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

  highlights: jsonb('highlights').$type<
    {
      title: string;
      description: string;
      icon?: string;
    }[]
  >(),

  concentrations: jsonb('concentrations').$type<
    {
      title: string;
      description: string;
    }[]
  >(),

  isActive: boolean('is_active').default(true).notNull(),

  // PR Media enhancements
  galleryImages: text('gallery_images').array(),
  attachments: jsonb('attachments').$type<{
    originalName: string;
    fileUrl: string;
    mimeType?: string;
    size?: number;
  }[]>(),
  youtubeVideoUrl: varchar('youtube_video_url', { length: 500 }),
  facebookVideoUrl: varchar('facebook_video_url', { length: 500 }),
});

export const programInstructorRoleEnum = pgEnum('program_instructor_role', [
  'CHAIR', // ประธาน
  'MEMBER', // อาจารย์ประจำหลักสูตร
]);

export const programInstructors = pgTable('program_instructors', {
  id: uuid('id').primaryKey().defaultRandom(),
  programId: uuid('program_id')
    .notNull()
    .references(() => programs.id, { onDelete: 'cascade' }),
  staffId: uuid('staff_id')
    .notNull()
    .references(() => staffProfiles.id, { onDelete: 'cascade' }),
  role: programInstructorRoleEnum('role').default('MEMBER').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
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

export const researchProjects = pgTable(
  'research_projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    titleTh: varchar('title_th', { length: 500 }).notNull(),
    titleEn: varchar('title_en', { length: 500 }),
    abstractTh: text('abstract_th'),
    abstractEn: text('abstract_en'),
    year: integer('year').notNull(),
    budget: decimal('budget', { precision: 12, scale: 2 }),
    fundingSource: varchar('funding_source', { length: 255 }),
    status: projectStatusEnum('status').default('ONGOING').notNull(),
    isSocialService: boolean('is_social_service').default(false).notNull(),
    isCommercial: boolean('is_commercial').default(false).notNull(),
    coverImageUrl: varchar('cover_image_url', { length: 500 }),
    keywords: text('keywords').array(),
    isPublished: boolean('is_published').default(true).notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      slugIdx: index('research_projects_slug_idx').on(table.slug),
      titleThIdx: index('research_projects_title_th_idx').on(table.titleTh),
      yearIdx: index('research_projects_year_idx').on(table.year),
      statusIdx: index('research_projects_status_idx').on(table.status),
      isPublishedIdx: index('research_projects_is_published_idx').on(table.isPublished),
      fundingSourceIdx: index('research_projects_funding_source_idx').on(table.fundingSource),
      publishedAtIdx: index('research_projects_published_at_idx').on(table.publishedAt),
    };
  },
);

export const projectMembers = pgTable(
  'project_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => researchProjects.id, { onDelete: 'cascade' }),
    staffProfileId: uuid('staff_profile_id').references(() => staffProfiles.id, {
      onDelete: 'set null',
    }),
    externalName: varchar('external_name', { length: 255 }),
    role: memberRoleEnum('role').default('CO_RESEARCHER').notNull(),
    organization: varchar('organization', { length: 255 }),
    positionTitle: varchar('position_title', { length: 255 }),
    sortOrder: integer('sort_order').default(0).notNull(),
  },
  (table) => {
    return {
      projectIdx: index('project_members_project_id_idx').on(table.projectId),
      staffProfileIdx: index('project_members_staff_profile_id_idx').on(table.staffProfileId),
      roleIdx: index('project_members_role_idx').on(table.role),
      sortOrderIdx: index('project_members_sort_order_idx').on(table.sortOrder),
    };
  },
);

export const projectLocations = pgTable(
  'project_locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => researchProjects.id, { onDelete: 'cascade' }),
    subDistrict: varchar('sub_district', { length: 100 }),
    district: varchar('district', { length: 100 }),
    province: varchar('province', { length: 100 }).default('เชียงราย'),
    lat: real('lat'),
    lng: real('lng'),
  },
  (table) => {
    return {
      projectIdx: index('project_locations_project_id_idx').on(table.projectId),
      provinceIdx: index('project_locations_province_idx').on(table.province),
      districtIdx: index('project_locations_district_idx').on(table.district),
    };
  },
);

export const projectSdgs = pgTable(
  'project_sdgs',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => researchProjects.id, { onDelete: 'cascade' }),
    sdgId: integer('sdg_id').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.projectId, table.sdgId] }),
      sdgIdx: index('project_sdgs_sdg_id_idx').on(table.sdgId),
    };
  },
);

export const researchOutputs = pgTable(
  'research_outputs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => researchProjects.id, { onDelete: 'cascade' }),
    outputType: varchar('output_type', { length: 100 }),
    title: text('title').notNull(),
    journalName: varchar('journal_name', { length: 500 }),
    publicationDate: timestamp('publication_date'),
    volume: varchar('volume', { length: 50 }),
    issue: varchar('issue', { length: 50 }),
    pages: varchar('pages', { length: 50 }),
    citation: text('citation'),
    doiUrl: varchar('doi_url', { length: 500 }),
    tciUrl: varchar('tci_url', { length: 500 }),
    externalUrl: varchar('external_url', { length: 500 }),
    tier: varchar('tier', { length: 50 }),
  },
  (table) => {
    return {
      projectIdx: index('research_outputs_project_id_idx').on(table.projectId),
      publicationDateIdx: index('research_outputs_publication_date_idx').on(table.publicationDate),
      outputTypeIdx: index('research_outputs_output_type_idx').on(table.outputType),
    };
  },
);

export const researchAttachments = pgTable(
  'research_attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => researchProjects.id, { onDelete: 'cascade' }),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileType: varchar('file_type', { length: 50 }),
    fileUrl: varchar('file_url', { length: 500 }).notNull(),
    downloadCount: integer('download_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      projectIdx: index('research_attachments_project_id_idx').on(table.projectId),
      fileTypeIdx: index('research_attachments_file_type_idx').on(table.fileType),
      createdAtIdx: index('research_attachments_created_at_idx').on(table.createdAt),
    };
  },
);

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
  mediaUrls: text('media_urls').array(),
  attachments: jsonb('attachments').$type<
    {
      originalName: string;
      fileUrl: string;
      mimeType?: string;
      size?: number;
    }[]
  >(),
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
// 5.5 Admissions (Admissions Center)
// ------------------------------------------

export const admissionScheduleStatusEnum = pgEnum('admission_schedule_status', [
  'CLOSED',
  'OPEN',
  'UPCOMING',
  'ALWAYS',
]);

export const admissionConfig = pgTable('admission_config', {
  id: integer('id').primaryKey().default(1),
  youtubeVideoUrl: varchar('youtube_video_url', { length: 500 }),
  brochureUrl: varchar('brochure_url', { length: 500 }),
  bachelorLink: varchar('bachelor_link', { length: 500 }),
  graduateLink: varchar('graduate_link', { length: 500 }),
  tableTitle: varchar('table_title', { length: 255 }).default('ตารางรอบรับสมัคร ประจำปีการศึกษา 2569'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const admissionSchedules = pgTable('admission_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  roundName: varchar('round_name', { length: 255 }).notNull(),
  description: varchar('description', { length: 500 }),
  period: varchar('period', { length: 255 }).notNull(),
  channel: varchar('channel', { length: 255 }).notNull(),
  status: admissionScheduleStatusEnum('status').default('UPCOMING').notNull(),
  link: varchar('link', { length: 500 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const admissionDocuments = pgTable('admission_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  fileUrl: varchar('file_url', { length: 500 }).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ------------------------------------------
// 6. Chiang Rai Studies Center (Microservice)
// ------------------------------------------

export const chiangRaiIdentityCategoryEnum = pgEnum('cr_identity_category', [
  'HISTORY', // ประวัติศาสตร์
  'ARCHAEOLOGY', // โบราณคดี
  'CULTURE', // วัฒนธรรม ความเชื่อ
  'ARTS', // ศิลปะการแสดง
  'WISDOM', // ภูมิปัญญาท้องถิ่น
]);

export const chiangRaiIdentities = pgTable('chiang_rai_identities', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: chiangRaiIdentityCategoryEnum('code').notNull().unique(),
  nameTh: varchar('name_th', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
});

export const chiangRaiArtifacts = pgTable(
  'chiang_rai_artifacts',
  {
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
  },
  (table) => {
    return {
      titleIdx: index('cr_artifacts_title_idx').on(table.title),
      categoryIdx: index('cr_artifacts_category_idx').on(table.category),
      createdAtIdx: index('cr_artifacts_created_at_idx').on(table.createdAt),
    };
  },
);

export const chiangRaiArticleCategoryEnum = pgEnum('cr_article_category', [
  'ACADEMIC', // บทความวิชาการ
  'RESEARCH', // งานวิจัย
]);

export const chiangRaiArticles = pgTable(
  'chiang_rai_articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    category: chiangRaiArticleCategoryEnum('category')
      .notNull()
      .default('ACADEMIC'),
    abstract: text('abstract'),
    content: text('content').notNull(),
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

    // Media support
    mediaType: varchar('media_type', { length: 50 }).default('IMAGE'), // IMAGE, PDF
    mediaUrls: text('media_urls').array(), // List of related media

    tags: text('tags').array(),
    author: varchar('author', { length: 255 }),

    isPublished: boolean('is_published').default(true),
    publishedAt: timestamp('published_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      titleIdx: index('cr_articles_title_idx').on(table.title),
      publishedAtIdx: index('cr_articles_published_at_idx').on(
        table.publishedAt,
      ),
      categoryIdx: index('cr_articles_category_idx').on(table.category),
    };
  },
);

// Learning Sites Blog (แหล่งเรียนรู้ทางวัฒนธรรม) - Same structure as Articles (without category)
export const chiangRaiLearningSites = pgTable(
  'chiang_rai_learning_sites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 500 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'), // คำอธิบายสั้น (เหมือน abstract)
    content: text('content').notNull(), // เนื้อหาเต็ม

    // Media support (เหมือน articles)
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
    mediaType: varchar('media_type', { length: 50 }).default('IMAGE'),
    mediaUrls: text('media_urls').array(),

    tags: text('tags').array(),
    author: varchar('author', { length: 255 }),

    isPublished: boolean('is_published').default(true),
    publishedAt: timestamp('published_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      titleIdx: index('cr_learning_sites_title_idx').on(table.title),
      publishedAtIdx: index('cr_learning_sites_published_at_idx').on(table.publishedAt),
    };
  },
);

export const chiangRaiStaffGroupEnum = pgEnum('cr_staff_group', [
  'ADVISOR', // ที่ปรึกษาโครงการ
  'EXECUTIVE', // ฝ่ายบริหารโครงการ
  'COMMITTEE', // คณะกรรมการโครงการ
]);

export const chiangRaiStaff = pgTable('chiang_rai_staff', {
  id: uuid('id').primaryKey().defaultRandom(),
  staffGroup: chiangRaiStaffGroupEnum('staff_group').notNull(),
  title: varchar('title', { length: 50 }), // คำนำหน้า e.g. นาย, นาง
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  position: varchar('position', { length: 255 }), // ตำแหน่งในศูนย์ฯ e.g. ผู้อำนวยการ, ประธานกรรมการ
  academicTitle: varchar('academic_title', { length: 100 }), // ตำแหน่งทางวิชาการ e.g. ผศ., รศ.
  email: varchar('email', { length: 255 }),
  imageUrl: varchar('image_url', { length: 500 }),
  bio: text('bio'),
  facultyStaffId: uuid('faculty_staff_id'), // อ้างอิงบุคลากรคณะ (nullable)
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chiangRaiActivityTypeEnum = pgEnum('cr_activity_type', [
  'NEWS', // ข่าวสาร
  'EVENT', // กิจกรรม
  'ANNOUNCEMENT', // ประกาศ
]);

export const chiangRaiActivities = pgTable(
  'chiang_rai_activities',
  {
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
  },
  (table) => {
    return {
      titleIdx: index('cr_activities_title_idx').on(table.title),
      typeIdx: index('cr_activities_type_idx').on(table.type),
      publishedAtIdx: index('cr_activities_published_at_idx').on(
        table.publishedAt,
      ),
    };
  },
);

export const chiangRaiConfig = pgTable('chiang_rai_config', {
  id: integer('id').primaryKey().default(1),
  heroBgUrl: varchar('hero_bg_url', { length: 500 }),
  heroTitle: varchar('hero_title', { length: 255 }).default(
    'ศูนย์เชียงรายศึกษา',
  ),
  heroSubtitle: varchar('hero_subtitle', { length: 500 }).default(
    'แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน ผ่าน 5 มิติทางวัฒนธรรม',
  ),
  digitalArchiveBgUrl: varchar('digital_archive_bg_url', { length: 500 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ------------------------------------------
// 7. Chiang Rai Learning Sites (แหล่งเรียนรู้ทางวัฒนธรรม)
// ------------------------------------------
// Blog-style academic articles by experts

export const chiangRaiMediaTypeEnum = pgEnum('cr_media_type', [
  'IMAGE',
  'VIDEO',
  'PDF',
  'AUDIO',
  'DOCUMENT',
]);
