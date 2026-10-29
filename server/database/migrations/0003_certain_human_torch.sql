CREATE TABLE "washing_details" (
	"request_id" integer PRIMARY KEY NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer NOT NULL,
	"status" "request_status" DEFAULT 'active' NOT NULL,
    "vehicle_type" "vehicle_type" NOT NULL,
    "wash_type" "wash_type" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "washing_details" ADD CONSTRAINT "washing_details_request_id_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;