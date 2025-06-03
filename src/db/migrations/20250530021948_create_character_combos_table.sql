CREATE TABLE `character_combos` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`game_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	`damage` integer,
	`hits` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_combo_name` ON `character_combos` (`name`,`character_id`);