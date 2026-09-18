CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`locality` text NOT NULL,
	`interest` text NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`consent` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_enquiries_phone_created` ON `enquiries` (`phone`,`created_at`);