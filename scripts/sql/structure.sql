--
-- Current Database: `resilienz`
--

CREATE DATABASE `resilienz`;
USE `resilienz`;

CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `lang_key` varchar(5) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lang_key_UNIQUE` (`lang_key`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `string_key` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `string_key_UNIQUE` (`string_key`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8;

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


CREATE TABLE `layouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

CREATE TABLE `actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `finalized` tinyint(4) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `book` varchar(1) NOT NULL DEFAULT 'N' COMMENT 'N = No\nY = Yes\nO = Old, Changes have been made',
  PRIMARY KEY (`id`),
  KEY `fk_actions_user1_idx` (`user_id`),
  CONSTRAINT `fk_actions_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `pages` int(11) NOT NULL,
  `ordering` int(11) NOT NULL,
  `lang_string_key` varchar(255) CHARACTER SET latin1 COLLATE latin1_german1_ci NOT NULL,
  `start_page` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

CREATE TABLE `categories_has_layouts` (
  `categories_id` int(11) NOT NULL,
  `layouts_id` int(11) NOT NULL,
  PRIMARY KEY (`categories_id`,`layouts_id`),
  KEY `fk_categories_has_layouts_layouts1_idx` (`layouts_id`),
  KEY `fk_categories_has_layouts_categories1_idx` (`categories_id`),
  CONSTRAINT `fk_categories_has_layouts_categories1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_categories_has_layouts_layouts1` FOREIGN KEY (`layouts_id`) REFERENCES `layouts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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


CREATE TABLE `layout_backgrounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page` int(11) NOT NULL,
  `background` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;

CREATE VIEW `actionList` AS
    SELECT
        `u`.`email` AS `email`,
        `u`.`id` AS `user_id`,
        `l`.`name` AS `language`,
        `a`.`location` AS `location`,
        `a`.`start_time` AS `start_time`,
        `a`.`end_time` AS `end_time`,
        `a`.`finalized` AS `finalized`,
        `a`.`book` AS `book`
    FROM
        ((`user` `u`
        JOIN `languages` `l`)
        JOIN `actions` `a`)
    WHERE
        ((`u`.`id` = `a`.`user_id`)
            AND (`u`.`languages_id` = `l`.`id`));


CREATE VIEW `language_translations` AS
    SELECT
        `l`.`name` AS `language_name`,
        `l`.`lang_key` AS `language_key`,
        `s`.`string_key` AS `string_key`,
        `t`.`translation` AS `translation`
    FROM
        ((`languages` `l`
        JOIN `strings` `s`)
        JOIN `translations` `t`)
    WHERE
        ((`t`.`languages_id` = `l`.`id`)
            AND (`t`.`strings_id` = `s`.`id`));

CREATE VIEW `positions_on_actions` AS
    SELECT
        `p`.`id` AS `position_id`,
        `p`.`name` AS `position_name`,
        `p`.`x` AS `x`,
        `p`.`y` AS `y`,
        `p`.`width` AS `width`,
        `p`.`height` AS `height`,
        `p`.`spin` AS `spin`,
        `ahl`.`id` AS `action_has_layouts_id`,
        `ahl`.`layouts_id` AS `layouts_id`,
        `ahl`.`page` AS `page`,
        `ahl`.`actions_id` AS `actions_id`
    FROM
        (`positions` `p`
        JOIN `actions_has_layouts` `ahl`)
    WHERE
        (`p`.`layouts_id` = `ahl`.`layouts_id`);

CREATE VIEW `userList` AS
    SELECT
        `u`.`id` AS `id`,
        `u`.`vorname` AS `vorname`,
        `u`.`nachname` AS `nachname`,
        `u`.`email` AS `email`,
        `u`.`admin` AS `admin`,
        `l`.`name` AS `language`,
        `a`.`location` AS `location`,
        `a`.`finalized` AS `finalized`,
        `a`.`id` AS `action_id`
    FROM
        ((`user` `u`
        JOIN `languages` `l`)
        JOIN `actions` `a`)
    WHERE
        ((`u`.`id` = `a`.`user_id`)
            AND (`u`.`languages_id` = `l`.`id`));
