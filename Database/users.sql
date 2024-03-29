CREATE DATABASE lab5db;

use lab5db;

CREATE TABLE users(
    user_id int not null AUTO_INCREMENT,
    username varchar(100) NOT NULL UNIQUE,
    user_password varchar(100) NOT NULL,
    user_role ENUM('ADMIN', 'PREP_RESIDENTIEL', 'PREP_AFFAIRE', 'CLIENT_RESIDENTIEL', 'CLIENT_AFFAIRE') NOT NULL,
    salt varchar(100) NOT NULL,
    past_passwords VARCHAR(255),
    password_expiration_date INT,
    failed_login_attempts int DEFAULT 0,
    PRIMARY KEY(user_id)
);

use lab5db;

CREATE TABLE security_log (
    log_id INT NOT NULL AUTO_INCREMENT,
    event_time INT,
    event_type ENUM('LOGIN_SUCCESS', 'LOGIN_FAIL', 'PASSWORD_CHANGE', 'LOGOUT', 'OTHER'),
    user_id INT,
    PRIMARY KEY(log_id)
);

INSERT INTO users(username, user_password, salt, user_role) 
VALUES 
('Admin', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'ADMIN'),
('PreRes', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'PREP_RESIDENTIEL'),
('PreAff', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'PREP_AFFAIRE'),
('CliRes1', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_RESIDENTIEL'),
('CliRes2', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_RESIDENTIEL'),
('CliRes3', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_RESIDENTIEL'),
('CliAff1', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_AFFAIRE'),
('CliAff2', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_AFFAIRE'),
('CliAff3', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_AFFAIRE')
;

INSERT INTO security_log(event_time, event_type, user_id) VALUES (1711593766, "LOGIN_SUCCESS", 1);