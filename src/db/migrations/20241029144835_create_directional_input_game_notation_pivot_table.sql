CREATE TABLE `directional_input_game_notation` (
	`directional_input_id` integer NOT NULL,
	`game_notation_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`directional_input_id`) REFERENCES `directional_inputs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`game_notation_id`) REFERENCES `game_notations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_directional_input_game_notation_set` ON `directional_input_game_notation` (`directional_input_id`,`game_notation_id`);