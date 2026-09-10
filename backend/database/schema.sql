-- Analytics System Database Schema
-- Use utf8mb4 for full Unicode support (including emojis)

-- CREATE DATABASE IF NOT EXISTS `analytics_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `analytics_db`;

CREATE TABLE IF NOT EXISTS `visitors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `visitor_id` VARCHAR(64) NOT NULL,
  `first_seen` DATETIME NOT NULL,
  `last_seen` DATETIME NOT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `device_type` VARCHAR(50) DEFAULT NULL,
  `browser` VARCHAR(100) DEFAULT NULL,
  `os` VARCHAR(100) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_visitor_id` (`visitor_id`),
  KEY `idx_last_seen` (`last_seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(64) NOT NULL,
  `visitor_id` VARCHAR(64) NOT NULL,
  `started_at` DATETIME NOT NULL,
  `last_activity` DATETIME NOT NULL,
  `ended_at` DATETIME DEFAULT NULL,
  `duration_seconds` INT UNSIGNED DEFAULT 0,
  `landing_page` VARCHAR(500) DEFAULT NULL,
  `exit_page` VARCHAR(500) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_session_id` (`session_id`),
  KEY `idx_visitor_id` (`visitor_id`),
  KEY `idx_started_at` (`started_at`),
  KEY `idx_last_activity` (`last_activity`),
  CONSTRAINT `fk_session_visitor` FOREIGN KEY (`visitor_id`) REFERENCES `visitors` (`visitor_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `page_views` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(64) NOT NULL,
  `visitor_id` VARCHAR(64) NOT NULL,
  `page_url` VARCHAR(500) NOT NULL,
  `page_title` VARCHAR(255) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `viewed_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_visitor_id` (`visitor_id`),
  KEY `idx_viewed_at` (`viewed_at`),
  KEY `idx_page_url` (`page_url`(191)),
  CONSTRAINT `fk_pv_session` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(64) NOT NULL,
  `visitor_id` VARCHAR(64) NOT NULL,
  `event_name` VARCHAR(100) NOT NULL,
  `element_id` VARCHAR(100) DEFAULT NULL,
  `element_text` VARCHAR(255) DEFAULT NULL,
  `page_url` VARCHAR(500) DEFAULT NULL,
  `event_data` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_visitor_id` (`visitor_id`),
  KEY `idx_event_name` (`event_name`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_event_session` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
