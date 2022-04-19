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

-- Listage de la structure de la table wolf-town. tournament
CREATE TABLE IF NOT EXISTS `tournament` (
  `participants` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Listage des données de la table wolf-town.tournament : ~0 rows (environ)
/*!40000 ALTER TABLE `tournament` DISABLE KEYS */;
INSERT INTO `tournament` (`participants`) VALUES
	(8);
/*!40000 ALTER TABLE `tournament` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
