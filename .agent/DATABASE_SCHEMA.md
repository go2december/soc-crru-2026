# 🗄️ Database Schema Design (PostgreSQL)
**Target Stack:** NestJS + Drizzle ORM
**Version:** 1.0 (Active)

This schema is implemented using **Drizzle ORM** to support the **Learner-Centric** platform.

## 1. Users & Authentication (IAM)
Centralized user management for Staff, Students, and Admins.

| Table Name | Column | Type | Relation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `id` | UUID | PK | Unique ID |
| | `email` | Varchar(255) | Unique | Official email |
| | `password_hash` | Varchar(255) | | Bcrypt hash |
| | `role` | Enum | | `ADMIN`, `STAFF`, `STUDENT`, `GUEST` |
| | `created_at` | Timestamp | | |
| | `updated_at` | Timestamp | | |

## 2. Organization & Personnel
Managing faculty members and their hierarchy.

| Table Name | Column | Type | Relation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `departments` | `id` | Serial | PK | Auto-increment ID |
| | `name_th` | Varchar(255) | | |
| | `name_en` | Varchar(255) | | |
| `staff_profiles` | `id` | UUID | PK | |
| | `user_id` | UUID | FK -> `users` | Link to login |
| | `department_id` | Int | FK -> `departments` | |
| | `prefix_th` | Varchar(50) | | e.g. "ผศ.ดร." |
| | `first_name_th` | Varchar(100) | | |
| | `last_name_th` | Varchar(100) | | |
| | `position` | Varchar(255) | | |
| | `expertise` | Text[] | | Searchable tags |
| | `image_url` | Varchar(500) | | |
| | `bio` | Text | | |

## 3. Academics (Programs & Courses)
Supports both formal degrees and lifelong learning (Short courses).

| Table Name | Column | Type | Relation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `programs` | `id` | UUID | PK | Degree Programs |
| | `code` | Varchar(50) | Unique | e.g. "SOC-01" |
| | `name_th` | Varchar(255) | | |
| | `degree_level` | Enum | | `BACHELOR`, `MASTER`, `PHD` |
| | `description` | Text | | |
| `short_courses` | `id` | UUID | PK | Lifelong Learning |
| | `title` | Varchar(255) | | |
| | `duration_hours` | Int | | |
| | `credit_bank_value` | Int | | Credits for banking |
| | `is_online` | Boolean | | |
| | `price` | Decimal | | |

## 4. Research & Innovation
Database for publications and community projects.

| Table Name | Column | Type | Relation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `research_projects` | `id` | UUID | PK | |
| | `title` | Varchar(500) | | |
| | `abstract` | Text | | |
| | `publication_year` | Int | | |
| | `category` | Enum | | `ACADEMIC`, `INNOVATION`, `COMMUNITY` |
| | `external_link` | Varchar(500) | | DOI or URL |
| `research_authors` | `id` | Serial | PK | Junction Table |
| | `research_id` | UUID | FK -> `research_projects` | |
| | `staff_id` | UUID | FK -> `staff_profiles` | |

## 5. Content Management (CMS)
For dynamic website content.

| Table Name | Column | Type | Relation | Description |
| :--- | :--- | :--- | :--- | :--- |
| `news` | `id` | UUID | PK | |
| | `title` | Varchar(500) | | |
| | `slug` | Varchar(255) | Unique | SEO friendly URL |
| | `content` | Text | | Markdown/HTML |
| | `category` | Enum | | `NEWS`, `EVENT`, `ANNOUNCE` |
| `banners` | `id` | Serial | PK | Homepage Sliders |
| | `image_url` | Varchar(500) | | |
| | `link_url` | Varchar(500) | | |

---

## 🛠️ Implementation Steps (Drizzle ORM)

1. **Install Dependencies**:
   ```bash
   npm install drizzle-orm pg
   npm install -D drizzle-kit @types/pg
   ```

2. **Define Schema (`src/drizzle/schema.ts`)**:
   Implement tables using `pgTable` and types from `drizzle-orm/pg-core`.

3. **Configure & Migrate**:
   ```bash
   # Generate migration files
   npx drizzle-kit generate

   # Push changes to DB directly (for dev)
   npx drizzle-kit push
   ```

4. **Create API Resources**:
   Use `DrizzleService` to execute queries via `this.drizzle.db.select()...`.
