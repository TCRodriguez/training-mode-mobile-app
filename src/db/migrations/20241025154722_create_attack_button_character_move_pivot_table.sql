CREATE TABLE `attack_button_character_move` (
	`attack_button_id` integer NOT NULL,
	`character_move_id` integer NOT NULL,
	`order_in_move` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`attack_button_id`) REFERENCES `attack_buttons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_attack_button_character_move_order_set` ON `attack_button_character_move` (`attack_button_id`,`character_move_id`,`order_in_move`);