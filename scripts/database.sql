CREATE SCHEMA `resilienz` ;
CREATE USER resilienz;
GRANT ALL PRIVILEGES ON `resilienz`.* TO 'resilienz'@'%' IDENTIFIED BY 'resilienz';

ALTER SCHEMA `resilienz`  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema resilienz
-- -----------------------------------------------------
USE `resilienz` ;
-- -----------------------------------------------------
-- Table `languages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `languages` ;

CREATE TABLE IF NOT EXISTS `languages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `lang_key` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `lang_key_UNIQUE` (`lang_key` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `user` ;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `vorname` VARCHAR(255) NOT NULL,
  `nachname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(64) NOT NULL,
  `active` TINYINT NOT NULL DEFAULT 0,
  `languages_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `fk_user_languages1_idx` (`languages_id` ASC),
  CONSTRAINT `fk_user_languages1`
    FOREIGN KEY (`languages_id`)
    REFERENCES `languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `strings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `strings` ;

CREATE TABLE IF NOT EXISTS `strings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NOT NULL,
  `string_key` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `string_key_UNIQUE` (`string_key` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `translations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `translations` ;

CREATE TABLE IF NOT EXISTS `translations` (
  `languages_id` INT NOT NULL,
  `strings_id` INT NOT NULL,
  `translation` TEXT NOT NULL,
  PRIMARY KEY (`languages_id`, `strings_id`),
  INDEX `fk_languages_has_strings_strings1_idx` (`strings_id` ASC),
  INDEX `fk_languages_has_strings_languages1_idx` (`languages_id` ASC),
  CONSTRAINT `fk_languages_has_strings_languages1`
    FOREIGN KEY (`languages_id`)
    REFERENCES `languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_languages_has_strings_strings1`
    FOREIGN KEY (`strings_id`)
    REFERENCES `strings` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `layouts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `layouts` ;

CREATE TABLE IF NOT EXISTS `layouts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `categories` ;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `pages` INT NOT NULL,
  `ordering` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `actions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `actions` ;

CREATE TABLE IF NOT EXISTS `actions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `location` VARCHAR(255) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `finalized` TINYINT NOT NULL DEFAULT 0,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_actions_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_actions_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `positions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `positions` ;

CREATE TABLE IF NOT EXISTS `positions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `x` INT NOT NULL,
  `y` INT NOT NULL,
  `width` INT NOT NULL,
  `height` INT NOT NULL,
  `layouts_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_positions_layouts1_idx` (`layouts_id` ASC),
  CONSTRAINT `fk_positions_layouts1`
    FOREIGN KEY (`layouts_id`)
    REFERENCES `layouts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `layout_has_languages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `layout_has_languages` ;

CREATE TABLE IF NOT EXISTS `layout_has_languages` (
  `layouts_id` INT NOT NULL,
  `languages_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`layouts_id`, `languages_id`),
  INDEX `fk_layouts_has_languages_languages1_idx` (`languages_id` ASC),
  INDEX `fk_layouts_has_languages_layouts1_idx` (`layouts_id` ASC),
  UNIQUE INDEX `filename_UNIQUE` (`filename` ASC),
  CONSTRAINT `fk_layouts_has_languages_layouts1`
    FOREIGN KEY (`layouts_id`)
    REFERENCES `layouts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_layouts_has_languages_languages1`
    FOREIGN KEY (`languages_id`)
    REFERENCES `languages` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `categories_has_layouts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `categories_has_layouts` ;

CREATE TABLE IF NOT EXISTS `categories_has_layouts` (
  `categories_id` INT NOT NULL,
  `layouts_id` INT NOT NULL,
  PRIMARY KEY (`categories_id`, `layouts_id`),
  INDEX `fk_categories_has_layouts_layouts1_idx` (`layouts_id` ASC),
  INDEX `fk_categories_has_layouts_categories1_idx` (`categories_id` ASC),
  CONSTRAINT `fk_categories_has_layouts_categories1`
    FOREIGN KEY (`categories_id`)
    REFERENCES `categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_categories_has_layouts_layouts1`
    FOREIGN KEY (`layouts_id`)
    REFERENCES `layouts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `actions_has_layouts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `actions_has_layouts` ;

CREATE TABLE IF NOT EXISTS `actions_has_layouts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actions_id` INT NOT NULL,
  `layouts_id` INT NOT NULL,
  `page` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_actions_has_layouts_layouts1_idx` (`layouts_id` ASC),
  INDEX `fk_actions_has_layouts_actions1_idx` (`actions_id` ASC),
  CONSTRAINT `fk_actions_has_layouts_actions1`
    FOREIGN KEY (`actions_id`)
    REFERENCES `actions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_actions_has_layouts_layouts1`
    FOREIGN KEY (`layouts_id`)
    REFERENCES `layouts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `images`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `images` ;

CREATE TABLE IF NOT EXISTS `images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `filename_UNIQUE` (`filename` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `images_has_actions_has_layouts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `images_has_actions_has_layouts` ;

CREATE TABLE IF NOT EXISTS `images_has_actions_has_layouts` (
  `actions_has_layouts_id` INT NOT NULL,
  `images_id` INT NOT NULL,
  `positions_id` INT NOT NULL,
  PRIMARY KEY (`actions_has_layouts_id`, `images_id`, `positions_id`),
  INDEX `fk_images_has_actions_has_layouts_actions_has_layouts1_idx` (`actions_has_layouts_id` ASC),
  INDEX `fk_images_has_actions_has_layouts_images1_idx` (`images_id` ASC),
  INDEX `fk_images_has_actions_has_layouts_positions1_idx` (`positions_id` ASC),
  CONSTRAINT `fk_images_has_actions_has_layouts_images1`
    FOREIGN KEY (`images_id`)
    REFERENCES `images` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_images_has_actions_has_layouts_actions_has_layouts1`
    FOREIGN KEY (`actions_has_layouts_id`)
    REFERENCES `actions_has_layouts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_images_has_actions_has_layouts_positions1`
    FOREIGN KEY (`positions_id`)
    REFERENCES `positions` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- View `language_translations`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `language_translations` ;
DROP TABLE IF EXISTS `language_translations`;
CREATE  OR REPLACE VIEW `language_translations` AS
SELECT l.`name` AS language_name, l.lang_key As language_key, s.string_key AS string_key, t.translation AS translation
FROM languages l, strings s, translations t
WHERE t.languages_id = l.id
AND t.strings_id = s.id;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
