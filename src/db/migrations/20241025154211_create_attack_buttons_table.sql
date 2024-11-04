CREATE TABLE `attack_buttons` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`game_shorthand` text,
	`button_count` text,
	`game_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_attack_buttons` ON `attack_buttons` (`name`,`game_shorthand`,`game_id`);