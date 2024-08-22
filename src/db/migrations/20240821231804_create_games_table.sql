CREATE TABLE `games` (
	`id` integer,
	`title` text NOT NULL,
	`abbreviation` text NOT NULL,
	`buttons` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_title_unique` ON `games` (`title`);