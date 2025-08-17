CREATE TABLE `boxes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(255) NOT NULL,
	`status` enum('filled','empty') NOT NULL,
	`max_fill` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boxes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crabs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`weight` decimal(10,2) NOT NULL,
	`supplier` varchar(255) NOT NULL,
	`status` enum('in','sold','dead') NOT NULL,
	`check_in_date` date NOT NULL,
	`box_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crabs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `crabs` ADD CONSTRAINT `crabs_box_id_boxes_id_fk` FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_crabs_box_id` ON `crabs` (`box_id`);--> statement-breakpoint
CREATE INDEX `idx_crabs_status` ON `crabs` (`status`);