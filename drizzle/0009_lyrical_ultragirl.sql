ALTER TABLE `boxes` MODIFY COLUMN `status` enum('filled','empty','unavailable') NOT NULL DEFAULT 'empty';--> statement-breakpoint
ALTER TABLE `boxes` ADD `notes` varchar(255);