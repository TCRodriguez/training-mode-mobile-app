DROP INDEX IF EXISTS `unique_game_game_notations_pair`;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_game_notations` ON `game_notations` (`notation`,`description`,`game_id`);