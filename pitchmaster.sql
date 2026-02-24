/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.0.105_3307
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : pitchmaster

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 12/02/2026 19:14:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of match_registrations
-- ----------------------------
INSERT INTO `match_registrations` VALUES (1, 2, 1, NULL, 0);
INSERT INTO `match_registrations` VALUES (2, 2, 2, NULL, 0);
INSERT INTO `match_registrations` VALUES (3, 2, 3, NULL, 0);
INSERT INTO `match_registrations` VALUES (4, 2, 4, NULL, 0);
INSERT INTO `match_registrations` VALUES (5, 2, 5, NULL, 0);
INSERT INTO `match_registrations` VALUES (6, 2, 6, NULL, 0);
INSERT INTO `match_registrations` VALUES (7, 2, 7, NULL, 0);
INSERT INTO `match_registrations` VALUES (8, 2, 8, NULL, 0);
INSERT INTO `match_registrations` VALUES (9, 2, 9, NULL, 0);
INSERT INTO `match_registrations` VALUES (10, 2, 10, NULL, 0);
INSERT INTO `match_registrations` VALUES (11, 3, 1, NULL, 0);
INSERT INTO `match_registrations` VALUES (12, 3, 2, NULL, 0);
INSERT INTO `match_registrations` VALUES (13, 3, 3, NULL, 0);
INSERT INTO `match_registrations` VALUES (14, 3, 4, NULL, 0);
INSERT INTO `match_registrations` VALUES (15, 3, 5, NULL, 0);
INSERT INTO `match_registrations` VALUES (16, 3, 6, NULL, 0);
INSERT INTO `match_registrations` VALUES (17, 3, 7, NULL, 0);
INSERT INTO `match_registrations` VALUES (18, 3, 8, NULL, 0);
INSERT INTO `match_registrations` VALUES (19, 3, 9, NULL, 0);
INSERT INTO `match_registrations` VALUES (20, 3, 10, NULL, 0);
INSERT INTO `match_registrations` VALUES (21, 4, 1, NULL, 0);
INSERT INTO `match_registrations` VALUES (22, 4, 2, NULL, 0);
INSERT INTO `match_registrations` VALUES (23, 4, 3, NULL, 0);
INSERT INTO `match_registrations` VALUES (24, 4, 4, NULL, 0);
INSERT INTO `match_registrations` VALUES (25, 4, 5, NULL, 0);
INSERT INTO `match_registrations` VALUES (26, 4, 6, NULL, 0);
INSERT INTO `match_registrations` VALUES (27, 4, 9, NULL, 0);
INSERT INTO `match_registrations` VALUES (28, 4, 8, NULL, 0);
INSERT INTO `match_registrations` VALUES (29, 4, 7, NULL, 0);
INSERT INTO `match_registrations` VALUES (30, 4, 10, NULL, 0);
INSERT INTO `match_registrations` VALUES (31, 5, 1, NULL, 0);
INSERT INTO `match_registrations` VALUES (32, 5, 2, NULL, 0);
INSERT INTO `match_registrations` VALUES (33, 5, 3, NULL, 0);
INSERT INTO `match_registrations` VALUES (34, 5, 4, NULL, 0);
INSERT INTO `match_registrations` VALUES (35, 5, 7, NULL, 0);
INSERT INTO `match_registrations` VALUES (36, 5, 6, NULL, 0);
INSERT INTO `match_registrations` VALUES (37, 5, 5, NULL, 0);
INSERT INTO `match_registrations` VALUES (38, 5, 8, NULL, 0);
INSERT INTO `match_registrations` VALUES (39, 5, 9, NULL, 0);
INSERT INTO `match_registrations` VALUES (40, 5, 10, NULL, 0);
INSERT INTO `match_registrations` VALUES (41, 6, 1, NULL, 0);
INSERT INTO `match_registrations` VALUES (42, 6, 2, NULL, 0);
INSERT INTO `match_registrations` VALUES (43, 6, 3, NULL, 0);
INSERT INTO `match_registrations` VALUES (44, 6, 4, NULL, 0);
INSERT INTO `match_registrations` VALUES (45, 6, 7, NULL, 0);
INSERT INTO `match_registrations` VALUES (46, 6, 6, NULL, 0);
INSERT INTO `match_registrations` VALUES (47, 6, 5, NULL, 0);
INSERT INTO `match_registrations` VALUES (48, 6, 8, NULL, 0);
INSERT INTO `match_registrations` VALUES (49, 6, 9, NULL, 0);
INSERT INTO `match_registrations` VALUES (50, 6, 10, NULL, 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of match_stats
-- ----------------------------
INSERT INTO `match_stats` VALUES (1, 2, 1, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (2, 2, 2, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (3, 2, 3, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (4, 2, 4, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (5, 2, 5, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (6, 2, 6, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (7, 2, 7, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (8, 3, 1, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (9, 3, 2, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (10, 3, 3, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (11, 3, 4, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (12, 3, 5, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (13, 3, 6, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (14, 3, 7, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (15, 4, 1, 0, 0, 0, 0, 1);
INSERT INTO `match_stats` VALUES (16, 4, 2, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (17, 4, 3, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (18, 4, 4, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (19, 4, 5, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (20, 4, 6, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (21, 4, 9, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (22, 4, 8, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (23, 4, 7, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (24, 4, 10, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (25, 6, 1, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (26, 6, 2, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (27, 6, 3, 10, 10, 0, 0, 1);
INSERT INTO `match_stats` VALUES (28, 6, 4, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (29, 6, 7, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (30, 6, 6, 0, 0, 0, 0, 0);
INSERT INTO `match_stats` VALUES (31, 6, 5, 0, 0, 0, 0, 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of matches
-- ----------------------------
INSERT INTO `matches` VALUES (1, '2026-02-05', '19:00:00', '浅山公园5人制场地', '7v7', NULL, 'completed', 0, 0, '2026-02-11 22:04:10');
INSERT INTO `matches` VALUES (2, '2026-02-05', '19:00:00', '浅山公园5人制场地', '7v7', '2-3-1', 'completed', 1, 0, '2026-02-11 22:09:57');
INSERT INTO `matches` VALUES (3, '2026-02-05', '19:00:00', '浅山公园5人制场地', '7v7', '2-3-1', 'completed', 1, 0, '2026-02-11 22:19:13');
INSERT INTO `matches` VALUES (4, '2026-02-05', '19:00:00', '浅山公园5人制场地', '11v11', '4-2-3-1', 'completed', 0, 0, '2026-02-11 22:32:58');
INSERT INTO `matches` VALUES (5, '2026-02-05', '19:00:00', '浅山公园5人制场地', '7v7', NULL, 'upcoming', 0, 0, '2026-02-11 22:38:36');
INSERT INTO `matches` VALUES (6, '2026-02-05', '19:00:00', '浅山公园5人制场地', '7v7', '2-3-1', 'completed', 0, 0, '2026-02-11 22:46:32');

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of players
-- ----------------------------
INSERT INTO `players` VALUES (1, '廖金龙', 'GK', 79, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (2, '薛正新', 'DF', 75, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (3, '高亮', 'DF', 87, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (4, '胡启凡', 'MF', 79, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (5, '韩晓天', 'FW', 82, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (6, '李飞', 'MF', 80, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (7, '戎亚杰', 'MF', 86, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (8, '周辉', 'DF', 75, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (9, '熊智信', 'MF', 83, NULL, '2026-02-11 22:09:57');
INSERT INTO `players` VALUES (10, '小泫冰', 'FW', 88, NULL, '2026-02-11 22:09:57');

SET FOREIGN_KEY_CHECKS = 1;

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
-- Default user accounts
-- ----------------------------
INSERT INTO `users` VALUES (1, 'captain', '123456', '队长', 'captain', NOW());
INSERT INTO `users` VALUES (2, 'manager', '123456', '领队', 'manager', NOW());
INSERT INTO `users` VALUES (3, 'player1', '123456', '球员1', 'player', NOW());
INSERT INTO `users` VALUES (4, 'player2', '123456', '球员2', 'player', NOW());
