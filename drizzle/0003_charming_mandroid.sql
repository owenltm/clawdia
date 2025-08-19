CREATE TABLE `finance_journal` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('expense','revenue') NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`category` varchar(50) NOT NULL,
	`reference_id` int,
	`description` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `finance_journal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `history_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity_type` enum('crab','box') NOT NULL,
	`entity_id` int NOT NULL,
	`action` enum('checkin','checkout','death','move') NOT NULL,
	`data` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `history_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_finance_journal_created_at` ON `finance_journal` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_finance_journal_type_category` ON `finance_journal` (`type`,`category`);--> statement-breakpoint
CREATE INDEX `idx_finance_journal_reference_id` ON `finance_journal` (`reference_id`);--> statement-breakpoint
CREATE INDEX `idx_history_log_entity` ON `history_log` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_history_log_action` ON `history_log` (`action`);--> statement-breakpoint
CREATE INDEX `idx_history_log_created_at` ON `history_log` (`created_at`);