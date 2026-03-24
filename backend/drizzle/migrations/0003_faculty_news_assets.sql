ALTER TYPE "public"."news_category" ADD VALUE IF NOT EXISTS 'JOB';--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "media_urls" text[];--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN IF NOT EXISTS "attachments" jsonb;--> statement-breakpoint
ALTER TABLE "news" ALTER COLUMN "published_at" DROP NOT NULL;--> statement-breakpoint
