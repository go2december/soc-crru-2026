import { pgTable, uuid, varchar, text, integer, boolean, decimal, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// ------------------------------------------
// Enums
// ------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'STAFF', 'STUDENT', 'GUEST']);
export const degreeLevelEnum = pgEnum('degree_level', ['BACHELOR', 'MASTER', 'PHD']);
export const researchCategoryEnum = pgEnum('research_category', ['ACADEMIC', 'INNOVATION', 'COMMUNITY']);
export const newsCategoryEnum = pgEnum('news_category', ['NEWS', 'EVENT', 'ANNOUNCE']);

// ------------------------------------------
// 1. Users & IAM
// ------------------------------------------

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    role: userRoleEnum('role').default('GUEST').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ------------------------------------------
// 2. Organization & Personnel
// ------------------------------------------

export const departments = pgTable('departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    nameTh: varchar('name_th', { length: 255 }).notNull(),
    nameEn: varchar('name_en', { length: 255 }),
});

export const staffProfiles = pgTable('staff_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique().references(() => users.id),
    departmentId: integer('department_id').notNull().references(() => departments.id),
    prefixTh: varchar('prefix_th', { length: 50 }),
    firstNameTh: varchar('first_name_th', { length: 100 }).notNull(),
    lastNameTh: varchar('last_name_th', { length: 100 }).notNull(),
    position: varchar('position', { length: 255 }),
    expertise: text('expertise').array(),
    imageUrl: varchar('image_url', { length: 500 }),
    bio: text('bio'),
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
    publishedAt: timestamp('published_at').defaultNow().notNull(),
});

export const banners = pgTable('banners', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    linkUrl: varchar('link_url', { length: 500 }),
    order: integer('order').default(0).notNull(),
});
