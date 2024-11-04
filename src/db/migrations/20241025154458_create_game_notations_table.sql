CREATE TABLE `game_notations` (
	`id` integer PRIMARY KEY NOT NULL,
	`notation` text NOT NULL,
	`description` text NOT NULL,
	`game_id` integer NOT NULL,
	`character_id` integer,
	`character_move_id` integer,
	`notations_group` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_game_notations` ON `game_notations` (`notation`,`description`,`game_id`,`notations_group`);