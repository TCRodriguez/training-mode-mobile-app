CREATE TABLE `characters` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`archetype` text NOT NULL,
	`game_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_character_pair` ON `characters` (`name`,`game_id`);