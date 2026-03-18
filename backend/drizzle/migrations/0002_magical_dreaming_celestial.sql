CREATE TYPE "public"."cr_media_type" AS ENUM('IMAGE', 'VIDEO', 'PDF', 'AUDIO', 'DOCUMENT');--> statement-breakpoint
CREATE TABLE "academic_positions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "academic_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_positions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_config" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"hero_bg_url" varchar(500),
	"hero_title" varchar(255) DEFAULT 'ศูนย์เชียงรายศึกษา',
	"hero_subtitle" varchar(500) DEFAULT 'แหล่งรวบรวม อนุรักษ์ และต่อยอดองค์ความรู้อัตลักษณ์เชียงราย เพื่อการพัฒนาท้องถิ่นอย่างยั่งยืน ผ่าน 5 มิติทางวัฒนธรรม',
	"digital_archive_bg_url" varchar(500),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_learning_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"content" text,
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"published_at" timestamp DEFAULT now(),
	"author_id" uuid,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chiang_rai_learning_sites_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_learning_sites_tags" (
	"learning_site_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"learning_site_id" uuid NOT NULL,
	"file_url" varchar(500) NOT NULL,
	"media_type" "cr_media_type" DEFAULT 'IMAGE' NOT NULL,
	"caption" varchar(500),
	"is_thumbnail" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chiang_rai_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "chiang_rai_tags_name_unique" UNIQUE("name"),
	CONSTRAINT "chiang_rai_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "academic_position_id" integer;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "admin_position_id" integer;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "short_bios" text[];--> statement-breakpoint
ALTER TABLE "chiang_rai_learning_sites" ADD CONSTRAINT "chiang_rai_learning_sites_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiang_rai_learning_sites_tags" ADD CONSTRAINT "chiang_rai_learning_sites_tags_learning_site_id_chiang_rai_learning_sites_id_fk" FOREIGN KEY ("learning_site_id") REFERENCES "public"."chiang_rai_learning_sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiang_rai_learning_sites_tags" ADD CONSTRAINT "chiang_rai_learning_sites_tags_tag_id_chiang_rai_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."chiang_rai_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chiang_rai_media" ADD CONSTRAINT "chiang_rai_media_learning_site_id_chiang_rai_learning_sites_id_fk" FOREIGN KEY ("learning_site_id") REFERENCES "public"."chiang_rai_learning_sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cr_learning_sites_title_idx" ON "chiang_rai_learning_sites" USING btree ("title");--> statement-breakpoint
CREATE INDEX "cr_learning_sites_slug_idx" ON "chiang_rai_learning_sites" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cr_learning_sites_published_at_idx" ON "chiang_rai_learning_sites" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "cr_learning_sites_featured_idx" ON "chiang_rai_learning_sites" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "cr_learning_sites_author_id_idx" ON "chiang_rai_learning_sites" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "cr_learning_sites_tags_pk" ON "chiang_rai_learning_sites_tags" USING btree ("learning_site_id","tag_id");--> statement-breakpoint
CREATE INDEX "cr_learning_sites_tags_tag_id_idx" ON "chiang_rai_learning_sites_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "cr_media_learning_site_id_idx" ON "chiang_rai_media" USING btree ("learning_site_id");--> statement-breakpoint
CREATE INDEX "cr_media_type_idx" ON "chiang_rai_media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "cr_media_is_thumbnail_idx" ON "chiang_rai_media" USING btree ("is_thumbnail");--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_academic_position_id_academic_positions_id_fk" FOREIGN KEY ("academic_position_id") REFERENCES "public"."academic_positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_admin_position_id_admin_positions_id_fk" FOREIGN KEY ("admin_position_id") REFERENCES "public"."admin_positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP COLUMN "academic_position";--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP COLUMN "admin_position";--> statement-breakpoint
DROP TYPE "public"."academic_position";