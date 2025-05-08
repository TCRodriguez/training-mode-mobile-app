CREATE TABLE `character_move_directional_input` (
	`character_move_id` integer NOT NULL,
	`directional_input_id` integer NOT NULL,
	`order_in_move` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`directional_input_id`) REFERENCES `directional_inputs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `character_move_directional_input_order_set` ON `character_move_directional_input` (`character_move_id`,`directional_input_id`,`order_in_move`);