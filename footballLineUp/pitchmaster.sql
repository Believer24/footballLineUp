/*
  Football LineUp - Database Schema
  Production Initialization Script
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `role` enum('captain','manager','player') NOT NULL DEFAULT 'player',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Default user accounts (PLEASE CHANGE PASSWORDS IN PRODUCTION)
-- ----------------------------
INSERT INTO `users` (`username`, `password`, `display_name`, `role`) VALUES 
('captain', 'YOUR_CAPTAIN_PASSWORD', '队长', 'captain'),
('manager', 'YOUR_MANAGER_PASSWORD', '领队', 'manager');

-- ----------------------------
-- Table structure for players
-- ----------------------------
DROP TABLE IF EXISTS `players`;
CREATE TABLE `players`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_position` enum('GK','DF','MF','FW') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NULL DEFAULT 75,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for matches
-- ----------------------------
DROP TABLE IF EXISTS `matches`;
CREATE TABLE `matches`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_date` date NOT NULL,
  `match_time` time NULL DEFAULT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `format` enum('5v5','7v7','11v11') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '5v5',
  `formation` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` enum('upcoming','ongoing','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'upcoming',
  `home_score` int NULL DEFAULT 0,
  `away_score` int NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for match_registrations
-- ----------------------------
DROP TABLE IF EXISTS `match_registrations`;
CREATE TABLE `match_registrations`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `player_id` int NOT NULL,
  `position_index` int NULL DEFAULT NULL,
  `is_starter` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_registration`(`match_id` ASC, `player_id` ASC) USING BTREE,
  INDEX `player_id`(`player_id` ASC) USING BTREE,
  CONSTRAINT `match_registrations_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `match_registrations_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for match_stats
-- ----------------------------
DROP TABLE IF EXISTS `match_stats`;
CREATE TABLE `match_stats`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `match_id` int NOT NULL,
  `player_id` int NOT NULL,
  `goals` int NULL DEFAULT 0,
  `assists` int NULL DEFAULT 0,
  `interceptions` int NULL DEFAULT 0,
  `yellow_cards` int NULL DEFAULT 0,
  `red_cards` int NULL DEFAULT 0,
  `is_mvp` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_stat`(`match_id` ASC, `player_id` ASC) USING BTREE,
  INDEX `player_id`(`player_id` ASC) USING BTREE,
  CONSTRAINT `match_stats_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `match_stats_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
