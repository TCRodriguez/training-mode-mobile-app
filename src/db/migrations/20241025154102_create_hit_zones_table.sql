CREATE TABLE `hit_zones` (
	`id` integer PRIMARY KEY NOT NULL,
	`zone` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_hit_zone` ON `hit_zones` (`zone`);