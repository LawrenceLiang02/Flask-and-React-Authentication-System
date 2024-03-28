CREATE DATABASE lab5db;

use lab5db;

CREATE TABLE users(
    user_id int not null AUTO_INCREMENT,
    username varchar(100) NOT NULL UNIQUE,
    user_password varchar(100) NOT NULL,
    user_role ENUM('ADMIN', 'PREP_RESIDENTIEL', 'PREP_AFFAIRE', 'CLIENT') NOT NULL,
    salt varchar(100) NOT NULL,
    past_passwords VARCHAR(255),
    password_expiration_date INT,
    failed_login_attempts int DEFAULT 0,
    PRIMARY KEY(user_id)
);

use lab5db;

CREATE TABLE security_log (
    log_id INT AUTO_INCREMENT,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_type ENUM('LOGIN_SUCCESS', 'LOGIN_FAIL', 'PASSWORD_CHANGE', 'LOGOUT', 'OTHER'),
    user_id INT,
    PRIMARY KEY(log_id)
);

INSERT INTO users(username, user_password, salt, user_role) VALUES ('TestUser', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'ADMIN');