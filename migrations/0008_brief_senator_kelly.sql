ALTER TABLE "user" DROP CONSTRAINT "user_phone_number_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "phone_number";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "phone_number_verified";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "last_name";