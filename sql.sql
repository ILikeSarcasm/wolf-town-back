-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           8.0.23 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour wolf-town
CREATE DATABASE IF NOT EXISTS `wolf-town` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `wolf-town`;

-- Listage de la structure de la table wolf-town. building
DROP TABLE IF EXISTS `building`;
CREATE TABLE IF NOT EXISTS `building` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table wolf-town.building : ~0 rows (environ)
/*!40000 ALTER TABLE `building` DISABLE KEYS */;
INSERT INTO `building` (`id`, `name`) VALUES
	(1, 'ARENA');
/*!40000 ALTER TABLE `building` ENABLE KEYS */;

-- Listage de la structure de la table wolf-town. building-game
DROP TABLE IF EXISTS `building-game`;
CREATE TABLE IF NOT EXISTS `building-game` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buildingId` int NOT NULL,
  `state` enum('PROCESSING','WAITING') NOT NULL DEFAULT 'WAITING',
  `user` varchar(50) NOT NULL,
  `animalId` int NOT NULL,
  `action` tinyint NOT NULL,
  `hashedAction` varchar(100) NOT NULL,
  `nonce` bigint NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `animalID` (`animalId`,`buildingId`),
  KEY `FK_BUILDING_GAME_BUILDING` (`buildingId`),
  CONSTRAINT `FK_BUILDING_GAME_BUILDING` FOREIGN KEY (`buildingId`) REFERENCES `building` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Listage des données de la table wolf-town.building-game : ~2 rows (environ)
/*!40000 ALTER TABLE `building-game` DISABLE KEYS */;
/*!40000 ALTER TABLE `building-game` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
