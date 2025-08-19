ALTER TABLE `crabs` MODIFY COLUMN `check_in_date` date NOT NULL DEFAULT (CURRENT_DATE);--> statement-breakpoint
ALTER TABLE `crabs` ADD `check_out_date` date;--> statement-breakpoint
CREATE INDEX `idx_crabs_check_out_date` ON `crabs` (`check_out_date`);