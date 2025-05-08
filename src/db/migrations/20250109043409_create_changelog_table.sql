CREATE TABLE `changelog` (
	`id` integer PRIMARY KEY NOT NULL,
	`uuid` text NOT NULL,
	`game` text NOT NULL,
	`description` text NOT NULL,
	`type` text,
	`created_at` integer NOT NULL,
	`processed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `changelog_uuid_unique` ON `changelog` (`uuid`);