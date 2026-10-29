CREATE TYPE "public"."cargo_type" AS ENUM('thermal', 'no-thermal', 'fragile', 'liquid', 'refrigerator', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."loading_method" AS ENUM('rear', 'side', 'top', 'other');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('inspection', 'washing', 'transportation');--> statement-breakpoint
CREATE TYPE "public"."vehicle_type" AS ENUM('car', 'truck', 'truck-trailer', 'bus', 'special-machinery');--> statement-breakpoint
CREATE TYPE "public"."wash_type" AS ENUM('water', 'active-foam', 'dirt-blaster');--> statement-breakpoint
CREATE TABLE "inspection_details" (
	"request_id" integer PRIMARY KEY NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "request_status" DEFAULT 'active' NOT NULL,
	"car_brand" varchar(100) NOT NULL,
	"plate_number" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "request_type" NOT NULL,
	"status" "request_status" DEFAULT 'active' NOT NULL,
	"name_or_company" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transportation_details" (
	"request_id" integer PRIMARY KEY NOT NULL,
	"from_city" varchar(255) NOT NULL,
	"to_city" varchar(255) NOT NULL,
	"departure_date" date NOT NULL,
	"delivery_term" varchar(100),
	"length_cm" integer,
	"width_cm" integer,
	"height_cm" integer,
	"weight_kg" integer,
	"cargo_types" "cargo_type"[] DEFAULT '{}' NOT NULL,
	"loading_methods" "loading_method"[] DEFAULT '{}' NOT NULL,
	"unloading_methods" "loading_method"[] DEFAULT '{}' NOT NULL,
	"budget_min" integer,
	"budget_max" integer,
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "washing_details" (
	"request_id" integer PRIMARY KEY NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "request_status" DEFAULT 'active' NOT NULL,
	"vehicle_type" "vehicle_type" NOT NULL,
	"wash_type" "wash_type" NOT NULL
);
--> statement-breakpoint
DROP TABLE "admins" CASCADE;--> statement-breakpoint
ALTER TABLE "inspection_details" ADD CONSTRAINT "inspection_details_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transportation_details" ADD CONSTRAINT "transportation_details_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "washing_details" ADD CONSTRAINT "washing_details_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "inspection_active_slot_unique" ON "inspection_details" USING btree ("scheduled_at") WHERE "inspection_details"."status" = 'active';--> statement-breakpoint
CREATE UNIQUE INDEX "washing_active_slot_unique" ON "washing_details" USING btree ("scheduled_at") WHERE "washing_details"."status" = 'active';