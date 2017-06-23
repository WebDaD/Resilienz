-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: resilienz
-- ------------------------------------------------------
-- Server version	5.7.17-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `actionList`
--

DROP TABLE IF EXISTS `actionList`;
/*!50001 DROP VIEW IF EXISTS `actionList`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `actionList` AS SELECT
 1 AS `email`,
 1 AS `user_id`,
 1 AS `language`,
 1 AS `location`,
 1 AS `start_time`,
 1 AS `end_time`,
 1 AS `finalized`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `finalized` tinyint(4) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_actions_user1_idx` (`user_id`),
  CONSTRAINT `fk_actions_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `actions_has_layouts`
--

DROP TABLE IF EXISTS `actions_has_layouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actions_has_layouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actions_id` int(11) NOT NULL,
  `layouts_id` int(11) NOT NULL,
  `page` varchar(5) NOT NULL COMMENT 'Calculated by using used cat and set page-number.\ncan be two numbers (eg 2-3)',
  PRIMARY KEY (`id`),
  KEY `fk_actions_has_layouts_layouts1_idx` (`layouts_id`),
  KEY `fk_actions_has_layouts_actions1_idx` (`actions_id`),
  CONSTRAINT `fk_actions_has_layouts_actions1` FOREIGN KEY (`actions_id`) REFERENCES `actions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_actions_has_layouts_layouts1` FOREIGN KEY (`layouts_id`) REFERENCES `layouts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `pages` int(11) NOT NULL,
  `ordering` int(11) NOT NULL,
  `lang_string_key` varchar(255) CHARACTER SET latin1 COLLATE latin1_german1_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories_has_layouts`
--

DROP TABLE IF EXISTS `categories_has_layouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories_has_layouts` (
  `categories_id` int(11) NOT NULL,
  `layouts_id` int(11) NOT NULL,
  PRIMARY KEY (`categories_id`,`layouts_id`),
  KEY `fk_categories_has_layouts_layouts1_idx` (`layouts_id`),
  KEY `fk_categories_has_layouts_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_categories_has_layouts_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_categories_has_layouts_layouts1` FOREIGN KEY (`layouts_id`) REFERENCES `layouts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `layout_backgrounds`
--

DROP TABLE IF EXISTS `layout_backgrounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resilienz`.`layout_backgrounds` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `page` INT NOT NULL,
  `background` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images_on_positions`
--

DROP TABLE IF EXISTS `images_on_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images_on_positions` (
  `actions_has_layouts_id` int(11) NOT NULL,
  `positions_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL COMMENT 'Name of image',
  PRIMARY KEY (`actions_has_layouts_id`,`positions_id`),
  KEY `fk_images_has_actions_has_layouts_actions_has_layouts1_idx` (`actions_has_layouts_id`),
  KEY `fk_images_has_actions_has_layouts_positions1_idx` (`positions_id`),
  CONSTRAINT `fk_images_has_actions_has_layouts_actions_has_layouts1` FOREIGN KEY (`actions_has_layouts_id`) REFERENCES `actions_has_layouts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_images_has_actions_has_layouts_positions1` FOREIGN KEY (`positions_id`) REFERENCES `positions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `language_translations`
--

DROP TABLE IF EXISTS `language_translations`;
/*!50001 DROP VIEW IF EXISTS `language_translations`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `language_translations` AS SELECT
 1 AS `language_name`,
 1 AS `language_key`,
 1 AS `string_key`,
 1 AS `translation`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `lang_key` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lang_key_UNIQUE` (`lang_key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `layouts`
--

DROP TABLE IF EXISTS `layouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `layouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `spin` int(11) NOT NULL DEFAULT '0',
  `layouts_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_positions_layouts1_idx` (`layouts_id`),
  CONSTRAINT `fk_positions_layouts1` FOREIGN KEY (`layouts_id`) REFERENCES `layouts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `strings`
--

DROP TABLE IF EXISTS `strings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `string_key` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `string_key_UNIQUE` (`string_key`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `translations`
--

DROP TABLE IF EXISTS `translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `translations` (
  `languages_id` int(11) NOT NULL,
  `strings_id` int(11) NOT NULL,
  `translation` text NOT NULL,
  PRIMARY KEY (`languages_id`,`strings_id`),
  KEY `fk_languages_has_strings_strings1_idx` (`strings_id`),
  KEY `fk_languages_has_strings_languages1_idx` (`languages_id`),
  CONSTRAINT `fk_languages_has_strings_languages1` FOREIGN KEY (`languages_id`) REFERENCES `languages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_languages_has_strings_strings1` FOREIGN KEY (`strings_id`) REFERENCES `strings` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vorname` varchar(255) NOT NULL,
  `nachname` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(64) NOT NULL,
  `languages_id` int(11) NOT NULL,
  `admin` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `fk_user_languages1_idx` (`languages_id`),
  CONSTRAINT `fk_user_languages1` FOREIGN KEY (`languages_id`) REFERENCES `languages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `userList`
--

DROP TABLE IF EXISTS `userList`;
/*!50001 DROP VIEW IF EXISTS `userList`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `userList` AS SELECT
 1 AS `id`,
 1 AS `vorname`,
 1 AS `nachname`,
 1 AS `email`,
 1 AS `language`,
 1 AS `location`,
 1 AS `finalized`,
 1 AS `action_id`*/;
SET character_set_client = @saved_cs_client;


CREATE OR REPLACE VIEW positions_on_actions AS
SELECT p.id AS position_id, p.x, p.y, p.width, p.height, p.spin, ahl.id AS action_has_layouts_id, ahl.layouts_id AS layouts_id, ahl.page, ahl.actions_id
FROM positions p, actions_has_layouts ahl
WHERE p.layouts_id=ahl.layouts_id
;

--
-- Dumping routines for database 'resilienz'
--

--
-- Final view structure for view `actionList`
--

/*!50001 DROP VIEW IF EXISTS `actionList`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `actionList` AS select `u`.`email` AS `email`,`u`.`id` AS `user_id`,`l`.`name` AS `language`,`a`.`location` AS `location`,`a`.`start_time` AS `start_time`,`a`.`end_time` AS `end_time`,`a`.`finalized` AS `finalized` from ((`user` `u` join `languages` `l`) join `actions` `a`) where ((`u`.`id` = `a`.`user_id`) and (`u`.`languages_id` = `l`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `language_translations`
--

/*!50001 DROP VIEW IF EXISTS `language_translations`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `language_translations` AS select `l`.`name` AS `language_name`,`l`.`lang_key` AS `language_key`,`s`.`string_key` AS `string_key`,`t`.`translation` AS `translation` from ((`languages` `l` join `strings` `s`) join `translations` `t`) where ((`t`.`languages_id` = `l`.`id`) and (`t`.`strings_id` = `s`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `userList`
--

/*!50001 DROP VIEW IF EXISTS `userList`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `userList` AS select `u`.`id` AS `id`,`u`.`vorname` AS `vorname`,`u`.`nachname` AS `nachname`,`u`.`email` AS `email`,`l`.`name` AS `language`,`a`.`location` AS `location`,`a`.`finalized` AS `finalized`,`a`.`id` AS `action_id` from ((`user` `u` join `languages` `l`) join `actions` `a`) where ((`u`.`id` = `a`.`user_id`) and (`u`.`languages_id` = `l`.`id`)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-29 14:47:17
