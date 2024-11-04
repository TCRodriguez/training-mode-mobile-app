CREATE TABLE `character_move_hit_zone` (
	`character_move_id` integer NOT NULL,
	`hit_zone_id` integer NOT NULL,
	`order_in_move` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`character_move_id`) REFERENCES `character_moves`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`hit_zone_id`) REFERENCES `hit_zones`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_character_move_hit_zone_placement` ON `character_move_hit_zone` (`character_move_id`,`hit_zone_id`,`order_in_move`);