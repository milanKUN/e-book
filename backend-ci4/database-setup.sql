-- ============================================================
-- Guru Netra — ChatGPT Ebook Database Setup
-- ============================================================
-- Instructions:
--   1. Hostinger cPanel → MySQL Databases → New Database তৈরি করুন
--   2. cPanel → phpMyAdmin → তোমার database select করুন
--   3. এই পুরো SQL টি Import tab → SQL box-এ paste করে Execute করুন
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================================
-- Table: visitors
-- ============================================================
CREATE TABLE IF NOT EXISTS `visitors` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visitor_id`    VARCHAR(64)     NOT NULL,
  `ip_address`    VARCHAR(45)     DEFAULT NULL,
  `user_agent`    VARCHAR(512)    DEFAULT NULL,
  `first_seen_at` DATETIME        NOT NULL,
  `last_seen_at`  DATETIME        NOT NULL,
  `created_at`    DATETIME        DEFAULT NULL,
  `updated_at`    DATETIME        DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visitor_id` (`visitor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: page_views
-- ============================================================
CREATE TABLE IF NOT EXISTS `page_views` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visitor_id`  VARCHAR(64)     NOT NULL,
  `session_id`  VARCHAR(64)     DEFAULT NULL,
  `page_url`    VARCHAR(1024)   NOT NULL,
  `page_title`  VARCHAR(255)    DEFAULT NULL,
  `referrer`    VARCHAR(1024)   DEFAULT NULL,
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  `created_at`  DATETIME        NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visitor_id` (`visitor_id`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: click_events
-- ============================================================
CREATE TABLE IF NOT EXISTS `click_events` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visitor_id`   VARCHAR(64)     NOT NULL,
  `session_id`   VARCHAR(64)     DEFAULT NULL,
  `event_name`   VARCHAR(64)     NOT NULL,
  `element_id`   VARCHAR(128)    DEFAULT NULL,
  `element_text` VARCHAR(255)    DEFAULT NULL,
  `page_url`     VARCHAR(1024)   NOT NULL,
  `tag`          VARCHAR(16)     DEFAULT NULL,
  `href`         VARCHAR(1024)   DEFAULT NULL,
  `event_data`   JSON            DEFAULT NULL,
  `ip_address`   VARCHAR(45)     DEFAULT NULL,
  `created_at`   DATETIME        NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visitor_id` (`visitor_id`),
  KEY `event_name` (`event_name`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS `orders` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `razorpay_order_id`   VARCHAR(64)     NOT NULL,
  `razorpay_payment_id` VARCHAR(64)     DEFAULT NULL,
  `customer_name`       VARCHAR(191)    NOT NULL,
  `customer_email`      VARCHAR(191)    NOT NULL,
  `customer_phone`      VARCHAR(20)     DEFAULT NULL,
  `amount`              INT UNSIGNED    NOT NULL COMMENT 'in paise',
  `currency`            VARCHAR(8)      NOT NULL DEFAULT 'INR',
  `status`              VARCHAR(20)     NOT NULL DEFAULT 'created' COMMENT 'created|paid|failed|refunded',
  `method`              VARCHAR(32)     DEFAULT NULL,
  `signature`           VARCHAR(255)    DEFAULT NULL,
  `receipt`             VARCHAR(64)     DEFAULT NULL,
  `download_token`      VARCHAR(255)    DEFAULT NULL,
  `visitor_id`          VARCHAR(64)     DEFAULT NULL,
  `notes`               TEXT            DEFAULT NULL,
  `paid_at`             DATETIME        DEFAULT NULL,
  `created_at`          DATETIME        DEFAULT NULL,
  `updated_at`          DATETIME        DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `razorpay_order_id` (`razorpay_order_id`),
  KEY `razorpay_payment_id` (`razorpay_payment_id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS `admins` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(100)  NOT NULL,
  `email`         VARCHAR(191)  DEFAULT NULL,
  `password_hash` VARCHAR(255)  NOT NULL,
  `role`          VARCHAR(20)   NOT NULL DEFAULT 'admin',
  `last_login_at` DATETIME      DEFAULT NULL,
  `created_at`    DATETIME      DEFAULT NULL,
  `updated_at`    DATETIME      DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: razorpay_webhooks
-- ============================================================
CREATE TABLE IF NOT EXISTS `razorpay_webhooks` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id`            VARCHAR(100)    NOT NULL,
  `event_type`          VARCHAR(100)    NOT NULL,
  `razorpay_order_id`   VARCHAR(64)     DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(64)     DEFAULT NULL,
  `status`              VARCHAR(20)     DEFAULT NULL,
  `payload`             TEXT            NOT NULL,
  `signature_valid`     TINYINT(1)      NOT NULL DEFAULT 0,
  `processed`           TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`          DATETIME        DEFAULT NULL,
  `updated_at`          DATETIME        DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_id` (`event_id`),
  KEY `razorpay_order_id` (`razorpay_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: settings
-- ============================================================
CREATE TABLE IF NOT EXISTS `settings` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `setting_key`   VARCHAR(64)   NOT NULL,
  `setting_value` TEXT          DEFAULT NULL,
  `description`   VARCHAR(191)  DEFAULT NULL,
  `created_at`    DATETIME      DEFAULT NULL,
  `updated_at`    DATETIME      DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: ebooks
-- ============================================================
CREATE TABLE IF NOT EXISTS `ebooks` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `original_name` VARCHAR(255)  NOT NULL,
  `stored_name`   VARCHAR(255)  NOT NULL,
  `file_path`     VARCHAR(255)  NOT NULL,
  `file_size`     BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `mime`          VARCHAR(100)  DEFAULT NULL,
  `is_active`     TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `created_at`    DATETIME      DEFAULT NULL,
  `updated_at`    DATETIME      DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CodeIgniter 4 Migrations tracking table
-- ============================================================
CREATE TABLE IF NOT EXISTS `migrations` (
  `id`        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `version`   VARCHAR(255)    NOT NULL,
  `class`     VARCHAR(255)    NOT NULL,
  `group`     VARCHAR(255)    NOT NULL,
  `namespace` VARCHAR(255)    NOT NULL,
  `time`      INT             NOT NULL,
  `batch`     INT UNSIGNED    NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mark all migrations as run so CI4 won't try to re-run them
INSERT IGNORE INTO `migrations` (`version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
('2026-10-23-000001', 'App\\Database\\Migrations\\CreateVisitorsTable',         'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000002', 'App\\Database\\Migrations\\CreatePageViewsTable',        'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000003', 'App\\Database\\Migrations\\CreateClickEventsTable',      'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000004', 'App\\Database\\Migrations\\CreateOrdersTable',           'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000005', 'App\\Database\\Migrations\\CreateAdminsTable',           'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000006', 'App\\Database\\Migrations\\CreateRazorpayWebhooksTable', 'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000007', 'App\\Database\\Migrations\\CreateSettingsTable',         'default', 'App', UNIX_TIMESTAMP(), 1),
('2026-10-23-000008', 'App\\Database\\Migrations\\CreateEbooksTable',           'default', 'App', UNIX_TIMESTAMP(), 1);

-- ============================================================
-- Seed: Default Settings
-- ============================================================
INSERT IGNORE INTO `settings` (`setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
('ebook_price',    '1.00',   'Selling price of the ebook in INR (shown on site + used for Razorpay orders)', NOW(), NOW()),
('original_price', '999.00', 'Original / MRP price shown struck-through on the site',                       NOW(), NOW());

-- ============================================================
-- Seed: Default Admin User
-- ============================================================
-- Default password: Admin@1234
-- ⚠️ CHANGE THIS PASSWORD after first login via /admin/login
-- To generate a custom hash, run on your local machine:
--   php -r "echo password_hash('YourNewPassword', PASSWORD_DEFAULT);"
-- Then replace the hash below before importing.
INSERT IGNORE INTO `admins` (`username`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
('admin', 'gurunetra@gmail.com', '$2y$10$8kFsryOi0yqUJXqVlXLm.OqgMF9kCFblMDMq3ZmAVSVr2rDPqcJVu', 'admin', NOW(), NOW());
-- Hash above = bcrypt of "Admin@1234"

SET FOREIGN_KEY_CHECKS = 1;
