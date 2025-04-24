CREATE DATABASE IF NOT EXISTS gamedb;
USE gamedb;

-- Users Table (Tracks player info)
CREATE TABLE IF NOT EXISTS `user` (  -- Escape 'user' table name
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(300) NOT NULL,
    `first_name` VARCHAR(50),
    `last_name` VARCHAR(50),
    `user_role` VARCHAR(20) DEFAULT 'player',  -- Escape 'role' column name
    `best_score` INT DEFAULT 0
    `active` BOOLEAN DEFAULT TRUE
);


-- Characters Table (Stores character personalities)
CREATE TABLE IF NOT EXISTS characters(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    likes VARCHAR(255),   -- Actions that increase happiness
    dislikes VARCHAR(255) -- Actions that decrease happiness
);

-- Game Rounds Table (Tracks each round the player plays)
CREATE TABLE IF NOT EXISTS `game_round` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `round_number` INT NOT NULL, 
    `action` VARCHAR(50) NOT NULL, -- Action the player took
    `circle_selected` INT NOT NULL, -- Which of the 3 circles was chosen
    `happiness_score` INT NOT NULL, -- Overall happiness score for that round
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);

-- Actions Table (Defines how actions affect characters)
CREATE TABLE IF NOT EXISTS `action_effect` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `character_id` INT NOT NULL,
    `action` VARCHAR(50) NOT NULL CHECK (action IN ('compliment', 'offer help', 'invite to event')),
    `happiness_change` INT NOT NULL, -- Can be positive or negative
    FOREIGN KEY (`character_id`) REFERENCES `characters`(`id`)
);

-- Reviews Table (Stores player feedback on the game)
CREATE TABLE IF NOT EXISTS `review` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `rating` DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    `comment` TEXT NOT NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
