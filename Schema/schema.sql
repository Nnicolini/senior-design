-- MySQL Script generated by MySQL Workbench
-- 07/08/14 11:31:47
-- Model: New Model    Version: 1.0
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema kaboom
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `kaboom` ;
CREATE SCHEMA IF NOT EXISTS `kaboom` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `kaboom` ;

-- -----------------------------------------------------
-- Table `kaboom`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kaboom`.`users` ;

CREATE TABLE IF NOT EXISTS `kaboom`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(40) NOT NULL,
  `password` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `kaboom`.`accounts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kaboom`.`accounts` ;

CREATE TABLE IF NOT EXISTS `kaboom`.`accounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `balance` DECIMAL NOT NULL,
  `type` VARCHAR(20),
  `interest_rate` DECIMAL,

  PRIMARY KEY (`id`),
  INDEX (`user_id`),

  FOREIGN KEY (`user_id`)
    REFERENCES users(`id`),

  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `kaboom`.`history`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kaboom`.`history` ;

CREATE TABLE IF NOT EXISTS `kaboom`.`history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `account_id` INT NOT NULL,
  `transaction_type` VARCHAR(20) NOT NULL,
  `amount` DECIMAL,
  `datetime` DATETIME,

  PRIMARY KEY (`id`),
  INDEX (`account_id`),

  FOREIGN KEY (`account_id`)
    REFERENCES accounts(`id`),

  UNIQUE INDEX `id_UNIQUE` (`id` ASC))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;