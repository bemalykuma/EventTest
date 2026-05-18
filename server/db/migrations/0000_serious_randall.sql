CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"location" varchar(255) NOT NULL,
	"maxParticipants" integer,
	"registeredCount" integer DEFAULT 0,
	"image_url" text
);
