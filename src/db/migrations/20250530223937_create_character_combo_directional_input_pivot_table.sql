CREATE TABLE `character_combo_directional_input` (
	`character_combo_id` integer NOT NULL,
	`directional_input_id` integer NOT NULL,
	`order_in_combo` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_combo_id`) REFERENCES `character_combos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`directional_input_id`) REFERENCES `directional_inputs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_combo_directional_input_order_set` ON `character_combo_directional_input` (`character_combo_id`,`directional_input_id`,`order_in_combo`);