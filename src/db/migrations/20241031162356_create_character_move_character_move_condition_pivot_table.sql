CREATE TABLE `character_move_character_move_condition` (
	`character_move_id` integer NOT NULL,
	`character_move_condition_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_move_condition_id`) REFERENCES `character_move_conditions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_move_character_move_condition_set` ON `character_move_character_move_condition` (`character_move_id`,`character_move_condition_id`);