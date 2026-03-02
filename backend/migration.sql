CREATE TABLE IF NOT EXISTS "academic_positions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "academic_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "admin_positions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admin_positions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_th" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL
);

ALTER TABLE "staff_profiles" ADD COLUMN IF NOT EXISTS "academic_position_id" integer;
ALTER TABLE "staff_profiles" ADD COLUMN IF NOT EXISTS "admin_position_id" integer;

DO $$ BEGIN
 ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_academic_position_id_academic_positions_id_fk" FOREIGN KEY ("academic_position_id") REFERENCES "public"."academic_positions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DO $$ BEGIN
 ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_admin_position_id_admin_positions_id_fk" FOREIGN KEY ("admin_position_id") REFERENCES "public"."admin_positions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

INSERT INTO "academic_positions" ("name_th", "sort_order") VALUES 
('อาจารย์', 1),
('ผู้ช่วยศาสตราจารย์ (ผศ.)', 2),
('รองศาสตราจารย์ (รศ.)', 3),
('ศาสตราจารย์ (ศ.)', 4)
ON CONFLICT DO NOTHING;
