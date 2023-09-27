-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for testing
DROP DATABASE IF EXISTS `testing`;
CREATE DATABASE IF NOT EXISTS `testing` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `testing`;

-- Dumping structure for table testing.mgsin
DROP TABLE IF EXISTS `mgsin`;
CREATE TABLE IF NOT EXISTS `mgsin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `chatid` varchar(50) DEFAULT NULL,
  `number` varchar(50) NOT NULL DEFAULT '',
  `name` varchar(50) NOT NULL DEFAULT '',
  `type` varchar(50) NOT NULL DEFAULT '',
  `massage` varchar(50) NOT NULL DEFAULT '',
  `time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table testing.mgsin: ~10 rows (approximately)
DELETE FROM `mgsin`;
INSERT INTO `mgsin` (`id`, `id_user`, `chatid`, `number`, `name`, `type`, `massage`, `time`) VALUES
	(1, NULL, NULL, '6289671533195', 'Restu Adimas Kh', 'c.us', 'Eheheh', '2023-09-26 06:09:17'),
	(2, NULL, NULL, 'status', 'Cahyo Adnin', 'broadcast', '', '2023-09-26 06:23:17'),
	(3, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'Siap2 meh kerja yang', '2023-09-26 06:38:24'),
	(4, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'aku mgkt kerja riyen', '2023-09-26 06:53:04'),
	(5, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'Pun ketuk niki', '2023-09-26 07:01:14'),
	(6, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'Mas balik jam pinten?', '2023-09-26 07:01:22'),
	(7, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'Sore', '2023-09-26 07:35:58'),
	(8, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'Yang, senin sek nyetir sampean?', '2023-09-26 07:36:08'),
	(9, NULL, NULL, '6289675912867', 'Reni Hidayah', 'c.us', 'Bapak mboten nderek?', '2023-09-26 07:36:14'),
	(10, NULL, '3EB07168D8252A8A66113C', '6289671533195', 'Restu Adimas Kh', 'c.us', 'saddwawdasdwa', '2023-09-26 08:08:37');

-- Dumping structure for table testing.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT '',
  `password` varchar(50) DEFAULT '',
  `token` varchar(50) DEFAULT '',
  `time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table testing.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `username`, `password`, `token`, `time`) VALUES
	(1, 'restu', 'hokya4', '', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
