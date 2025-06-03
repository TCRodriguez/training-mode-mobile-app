CREATE TABLE `attack_button_character_combo` (
	`character_combo_id` integer NOT NULL,
	`attack_button_id` integer NOT NULL,
	`order_in_combo` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_combo_id`) REFERENCES `character_combos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`attack_button_id`) REFERENCES `attack_buttons`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_attack_button_character_combo_order_set` ON `attack_button_character_combo` (`attack_button_id`,`character_combo_id`,`order_in_combo`);