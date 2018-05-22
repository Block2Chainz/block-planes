
DROP DATABASE IF EXISTS blockplanes;

CREATE DATABASE blockplanes;

USE blockplanes;

CREATE TABLE users (
  `id` INT AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `profile_picture` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total_points` VARCHAR(255) NOT NULL DEFAULT 0,
  `high_score` VARCHAR(255) NOT NULL DEFAULT 0,
  `blockchainAddress` VARCHAR(255) NOT NULL, 
  PRIMARY KEY (`id`),
  INDEX `username_idx` (`username`)
);

CREATE TABLE friends (
  `id` INT AUTO_INCREMENT,
  `id_one` INT,
  `id_two` INT,
  `pending` INT,
  `request_by` INT,
  `request_created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE messages (
  `id` INT AUTO_INCREMENT,
  `message_text` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `id_sender` INT,
  `id_sendee` INT,
  PRIMARY KEY (`id`)
);