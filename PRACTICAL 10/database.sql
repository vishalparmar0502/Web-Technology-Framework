CREATE DATABASE IF NOT EXISTS finsecure;

USE finsecure;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passwords are stored as bcrypt hashes, never plain text.

-- SQL statements use placeholders (?) with values passed separately.