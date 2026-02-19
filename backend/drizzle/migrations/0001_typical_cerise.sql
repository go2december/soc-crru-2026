CREATE TYPE "public"."academic_position" AS ENUM('LECTURER', 'ASSISTANT_PROF', 'ASSOCIATE_PROF', 'PROFESSOR');--> statement-breakpoint
CREATE TYPE "public"."cr_activity_type" AS ENUM('NEWS', 'EVENT', 'ANNOUNCEMENT');--> statement-breakpoint
CREATE TYPE "public"."cr_article_category" AS ENUM('ACADEMIC', 'RESEARCH');--> statement-breakpoint
CREATE TYPE "public"."cr_identity_category" AS ENUM('HISTORY', 'ARCHAEOLOGY', 'CULTURE', 'ARTS', 'WISDOM');--> statement-breakpoint
CREATE TYPE "public"."cr_staff_group" AS ENUM('ADVISOR', 'EXECUTIVE', 'COMMITTEE');--> statement-breakpoint
CREATE TYPE "public"."staff_type" AS ENUM('ACADEMIC', 'SUPPORT');--> statement-breakpoint
CREATE TABLE "chiang_rai_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"type" "cr_activity_type" DEFAULT 'NEWS' NOT NULL,
	"description" text,
	"content" text,
	"thumbnail_url" varchar(500),
	"media_urls" text[],
	"location" varchar(500),
	"event_date" timestamp,
	"event_end_date" timestamp,
	"author" varchar(255),
	"tags" text[],
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"published_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chiang_rai_activities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" "cr_article_category" DEFAULT 'ACADEMIC' NOT NULL,
	"abstract" text,
	"content" text NOT NULL,
	"thumbnail_url" varchar(500),
	"media_type" varchar(50) DEFAULT 'IMAGE',
	"media_urls" text[],
	"tags" text[],
	"author" varchar(255),
	"is_published" boolean DEFAULT true,
	"published_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "chiang_rai_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"content" text,
	"identity_id" integer,
	"category" "cr_identity_category",
	"media_type" varchar(50) DEFAULT 'IMAGE',
	"media_urls" text[],
	"thumbnail_url" varchar(500),
	"author" varchar(255),
	"is_published" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_identities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chiang_rai_identities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" "cr_identity_category" NOT NULL,
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"description" text,
	"image_url" varchar(500),
	CONSTRAINT "chiang_rai_identities_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_group" "cr_staff_group" NOT NULL,
	"title" varchar(50),
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"position" varchar(255),
	"academic_title" varchar(100),
	"email" varchar(255),
	"image_url" varchar(500),
	"bio" text,
	"faculty_staff_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP CONSTRAINT "staff_profiles_user_id_unique";--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'EDITOR', 'STAFF', 'GUEST');--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "staff_profiles" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "is_academic_unit" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "is_published" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "author_id" uuid;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "degree_title_th" varchar(255);--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "degree_title_en" varchar(255);--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "banner_url" varchar(500);--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "curriculum_url" varchar(500);--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "structure" jsonb;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "careers" text[];--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "highlights" jsonb;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "concentrations" jsonb;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "prefix_en" varchar(50);--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "first_name_en" varchar(100);--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "last_name_en" varchar(100);--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "staff_type" "staff_type" DEFAULT 'ACADEMIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "academic_position" "academic_position";--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "admin_position" varchar(255);--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "education" jsonb;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "contact_email" varchar(255);--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "is_executive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "google_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "roles" text[] DEFAULT '{"STAFF"}' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "chiang_rai_artifacts" ADD CONSTRAINT "chiang_rai_artifacts_identity_id_chiang_rai_identities_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."chiang_rai_identities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cr_activities_title_idx" ON "chiang_rai_activities" USING btree ("title");--> statement-breakpoint
CREATE INDEX "cr_activities_type_idx" ON "chiang_rai_activities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "cr_activities_published_at_idx" ON "chiang_rai_activities" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "cr_articles_title_idx" ON "chiang_rai_articles" USING btree ("title");--> statement-breakpoint
CREATE INDEX "cr_articles_published_at_idx" ON "chiang_rai_articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "cr_articles_category_idx" ON "chiang_rai_articles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "cr_artifacts_title_idx" ON "chiang_rai_artifacts" USING btree ("title");--> statement-breakpoint
CREATE INDEX "cr_artifacts_category_idx" ON "chiang_rai_artifacts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "cr_artifacts_created_at_idx" ON "chiang_rai_artifacts" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_google_id_unique" UNIQUE("google_id");