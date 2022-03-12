-- --------------------------------------------------------
-- Hôte :                        localhost
-- Version du serveur:           5.7.24 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour wolf-town
DROP DATABASE IF EXISTS `wolf-town`;
CREATE DATABASE IF NOT EXISTS `wolf-town` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `wolf-town`;

-- Listage de la structure de la table wolf-town. buildinggame
DROP TABLE IF EXISTS `buildinggame`;
CREATE TABLE IF NOT EXISTS `buildinggame` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game` varchar(50) NOT NULL,
  `user` varchar(50) NOT NULL,
  `animalID` int(11) NOT NULL,
  `action` enum('BUILD','STEAL') NOT NULL,
  `hash` varchar(50) NOT NULL,
  `nonce` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_nonce` (`user`,`nonce`),
  UNIQUE KEY `animalID` (`animalID`,`game`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Les données exportées n'étaient pas sélectionnées.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
