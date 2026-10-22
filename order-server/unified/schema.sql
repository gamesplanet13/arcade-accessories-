CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`salt` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_username_unique` ON `accounts` (`username`);--> statement-breakpoint
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`order_ref` text NOT NULL,
	`actor` text NOT NULL,
	`changed_at` text NOT NULL,
	`before_json` text NOT NULL,
	`after_json` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_key` text NOT NULL,
	`claim_hash` text NOT NULL,
	`account_id` text,
	`source` text NOT NULL,
	`order_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`payload` text NOT NULL,
	`search_text` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_verified` integer DEFAULT 0 NOT NULL,
	`invoice_approved` integer DEFAULT 0 NOT NULL,
	`dispatch_by` text DEFAULT '' NOT NULL,
	`dispatch_date` text DEFAULT '' NOT NULL,
	`courier` text DEFAULT '' NOT NULL,
	`tracking_number` text DEFAULT '' NOT NULL,
	`tracking_url` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`printed_revision` integer DEFAULT 0 NOT NULL,
	`printed_at` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_submission_key_unique` ON `orders` (`submission_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_id_unique` ON `orders` (`order_id`);--> statement-breakpoint
CREATE INDEX `orders_created` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `orders_account` ON `orders` (`account_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`role` text NOT NULL,
	`expires_at` integer NOT NULL
);
