CREATE TYPE "public"."degree_level" AS ENUM('BACHELOR', 'MASTER', 'PHD');--> statement-breakpoint
CREATE TYPE "public"."news_category" AS ENUM('NEWS', 'EVENT', 'ANNOUNCE');--> statement-breakpoint
CREATE TYPE "public"."research_category" AS ENUM('ACADEMIC', 'INNOVATION', 'COMMUNITY');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'STAFF', 'STUDENT', 'GUEST');--> statement-breakpoint
CREATE TABLE "banners" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "banners_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"image_url" varchar(500) NOT NULL,
	"link_url" varchar(500),
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" "news_category" NOT NULL,
	"thumbnail_url" varchar(500),
	"published_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name_th" varchar(255) NOT NULL,
	"degree_level" "degree_level" NOT NULL,
	"description" text,
	CONSTRAINT "programs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "research_authors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "research_authors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"research_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"abstract" text,
	"publication_year" integer NOT NULL,
	"category" "research_category" NOT NULL,
	"external_link" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "short_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"duration_hours" integer NOT NULL,
	"credit_bank_value" integer DEFAULT 0 NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"department_id" integer NOT NULL,
	"prefix_th" varchar(50),
	"first_name_th" varchar(100) NOT NULL,
	"last_name_th" varchar(100) NOT NULL,
	"position" varchar(255),
	"expertise" text[],
	"image_url" varchar(500),
	"bio" text,
	CONSTRAINT "staff_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'GUEST' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "research_authors" ADD CONSTRAINT "research_authors_research_id_research_projects_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_authors" ADD CONSTRAINT "research_authors_staff_id_staff_profiles_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;