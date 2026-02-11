
-- 0001_chiang_rai_module.sql

-- 1. Chiang Rai Identity Category Enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cr_identity_category') THEN
        CREATE TYPE "cr_identity_category" AS ENUM ('HISTORY', 'ARCHAEOLOGY', 'CULTURE', 'ARTS', 'WISDOM');
    END IF;
END $$;

-- 2. Chiang Rai Identities Table
CREATE TABLE IF NOT EXISTS "chiang_rai_identities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	"code" "cr_identity_category" NOT NULL UNIQUE,
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"description" text,
	"image_url" varchar(500)
);

-- 3. Chiang Rai Artifacts Table
CREATE TABLE IF NOT EXISTS "chiang_rai_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(500) NOT NULL,
	"description" text,
	"content" text,
	"identity_id" integer REFERENCES "chiang_rai_identities"("id"),
	"category" "cr_identity_category",
	"media_type" varchar(50) DEFAULT 'IMAGE',
	"media_urls" text[],
	"thumbnail_url" varchar(500),
	"author" varchar(255),
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- 4. Chiang Rai Articles Table
CREATE TABLE IF NOT EXISTS "chiang_rai_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"abstract" text,
	"content" text NOT NULL,
	"thumbnail_url" varchar(500),
	"tags" text[],
	"author" varchar(255),
	"is_published" boolean DEFAULT true,
	"published_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);

-- 5. Chiang Rai Staff Role Enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cr_staff_role') THEN
        CREATE TYPE "cr_staff_role" AS ENUM ('DIRECTOR', 'ACADEMIC', 'NETWORK', 'DISSEMINATION', 'SUPPORT');
    END IF;
END $$;

-- 6. Chiang Rai Staff Table (New, Separate from main staff)
CREATE TABLE IF NOT EXISTS "chiang_rai_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(50),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"position" varchar(255),
	"role" "cr_staff_role" NOT NULL,
	"email" varchar(255),
	"image_url" varchar(500),
	"bio" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
