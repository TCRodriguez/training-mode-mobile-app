CREATE TABLE `directional_inputs` (
	`id` integer PRIMARY KEY NOT NULL,
	`direction` text NOT NULL,
	`game_shorthand` text,
	`numpad_notation` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_directional_inputs` ON `directional_inputs` (`direction`);