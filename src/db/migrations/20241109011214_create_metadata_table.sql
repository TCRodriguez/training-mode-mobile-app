CREATE TABLE `metadata` (
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `metadata_key_unique` ON `metadata` (`key`);