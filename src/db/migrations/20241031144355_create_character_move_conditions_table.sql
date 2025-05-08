CREATE TABLE `character_move_conditions` (
	`id` integer PRIMARY KEY NOT NULL,
	`condition` text NOT NULL,
	`game_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_move_conditions` ON `character_move_conditions` (`condition`,`game_id`);