CREATE DATABASE lab5db;

use lab5db;

CREATE TABLE users(
    user_id int not null AUTO_INCREMENT,
    username varchar(100) NOT NULL,
    user_password varchar(100) NOT NULL,
    user_role ENUM('ADMIN', 'PREP_RESIDENTIEL', 'PREP_AFFAIRE', 'CLIENT') NOT NULL,
    user_token varchar(100),
    salt varchar(100),
    past_passwords VARCHAR(255),
    token_expiration_date TIMESTAMP,
    password_expiration_date TIMESTAMP,
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

INSERT INTO users(username, user_password, user_role) VALUES ('TestUser', 'Password', 'ADMIN');