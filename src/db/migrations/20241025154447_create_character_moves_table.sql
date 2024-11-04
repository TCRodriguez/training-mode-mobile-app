CREATE TABLE `character_moves` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`character_id` integer NOT NULL,
	`game_id` integer NOT NULL,
	`resource_gain` integer,
	`resource_cost` integer,
	`meter_cost` integer,
	`meter_gain` integer,
	`hit_count` integer,
	`ex_hit_count` integer,
	`damage` integer,
	`category` text,
	`type` text,
	`startup_frames` integer,
	`active_frames` integer,
	`recovery_frames` integer,
	`frames_on_hit` integer,
	`frames_on_block` integer,
	`frames_on_counter_hit` integer,
	`move_list_number` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_move_in_game` ON `character_moves` (`name`,`character_id`,`game_id`);