CREATE TABLE `game_notations` (
	`id` integer PRIMARY KEY NOT NULL,
	`notation` text NOT NULL,
	`description` text NOT NULL,
	`game_id` integer NOT NULL,
	`notations_group` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_game_notations_pair` ON `game_notations` (`notation`,`game_id`);