CREATE TABLE `character_move_follow_ups` (
	`character_move_id` integer NOT NULL,
	`follow_up_character_move_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`follow_up_character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_move_follow_up` ON `character_move_follow_ups` (`character_move_id`,`follow_up_character_move_id`);