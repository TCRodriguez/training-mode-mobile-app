CREATE TABLE `games` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`abbreviation` text NOT NULL,
	`buttons` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_title_unique` ON `games` (`title`);