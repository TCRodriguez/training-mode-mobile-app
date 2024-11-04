CREATE TABLE `character_move_game_notation` (
	`character_move_id` integer NOT NULL,
	`game_notation_id` integer NOT NULL,
	`order_in_move` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`game_notation_id`) REFERENCES `game_notations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_move_game_notation_order_set` ON `character_move_game_notation` (`character_move_id`,`game_notation_id`,`order_in_move`);