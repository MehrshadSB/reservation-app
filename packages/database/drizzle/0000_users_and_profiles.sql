CREATE TYPE "public"."kyc_status" AS ENUM('unverified', 'pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"given_name" varchar(100),
	"family_name" varchar(100),
	"national_id" varchar(32),
	"date_of_birth" date,
	"nationality" varchar(2),
	"country" varchar(2),
	"city" varchar(100),
	"address_line" varchar(255),
	"kyc_status" "kyc_status" DEFAULT 'unverified' NOT NULL,
	"kyc_submitted_at" timestamp with time zone,
	"kyc_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"phone" varchar(16) NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"is_platform_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_profiles_national_id_uidx" ON "user_profiles" USING btree ("national_id");
