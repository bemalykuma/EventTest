ALTER TABLE "events" ADD COLUMN "date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "dates";