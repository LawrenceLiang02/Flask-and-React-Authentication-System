CREATE DATABASE lab5db;

use lab5db;

CREATE TABLE users(
    UserId int not null AUTO_INCREMENT,
    Username varchar(100) NOT NULL,
    UserPassword varchar(100) NOT NULL,
    UserRole varchar(100) NOT NULL,
    UserToken varchar(100),
    Salt varchar(100) NOT NULL,
    PastPassword VARCHAR(255) NOT NULL,
    ExpirationDate TIMESTAMP,
    CreationDate TIMESTAMP,
    FailedLoginAttemps int DEFAULT 0,
    PRIMARY KEY(UserId)
);

INSERT INTO users(Username, UserPassword, UserRole) VALUES ('TestUser', 'Password', 'Admin');
SELECT * FROM users;