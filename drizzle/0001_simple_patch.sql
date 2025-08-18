ALTER TABLE `crabs` MODIFY COLUMN `check_in_date` date NOT NULL DEFAULT (CURRENT_DATE);;--> statement-breakpoint
CREATE INDEX `idx_boxes_status` ON `boxes` (`status`);--> statement-breakpoint
CREATE INDEX `idx_crabs_check_in_date` ON `crabs` (`check_in_date`);