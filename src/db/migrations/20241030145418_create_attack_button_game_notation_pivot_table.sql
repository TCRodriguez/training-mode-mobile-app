CREATE TABLE `attack_button_game_notation` (
	`attack_button_id` integer NOT NULL,
	`game_notation_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`attack_button_id`) REFERENCES `attack_buttons`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`game_notation_id`) REFERENCES `game_notations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_attack_button_game_notation_set` ON `attack_button_game_notation` (`attack_button_id`,`game_notation_id`);