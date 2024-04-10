CREATE DATABASE lab5db;

use lab5db;

CREATE TABLE users(
    user_id int not null AUTO_INCREMENT,
    username varchar(100) NOT NULL UNIQUE,
    user_password varchar(100) NOT NULL,
    user_role ENUM('SUPER_ADMIN', 'ADMIN', 'PREP_RESIDENTIEL', 'PREP_AFFAIRE', 'CLIENT_RESIDENTIEL', 'CLIENT_AFFAIRE') NOT NULL,
    salt varchar(100) NOT NULL,
    past_passwords VARCHAR(255),
    session_token VARCHAR(255),
    session_expiration INT,
    password_creation_date INT,
    next_login_time INT DEFAULT 0,
    failed_login_attempts int DEFAULT 0,
    PRIMARY KEY(user_id)
);

use lab5db;

CREATE TABLE security_log (
    log_id INT NOT NULL AUTO_INCREMENT,
    event_time INT,
    event_type ENUM('LOGIN_SUCCESS', 'LOGIN_FAIL', 'PASSWORD_CHANGE', 'ROLE_CHANGE', 'LOGOUT', 'OTHER'),
    user_id INT,
    PRIMARY KEY(log_id)
);

use lab5db;

CREATE TABLE password_config_changes (
    change_id INT NOT NULL AUTO_INCREMENT,
    min_length INT NOT NULL,
    max_length INT NOT NULL,
    require_lowercase BOOLEAN NOT NULL,
    require_uppercase BOOLEAN NOT NULL,
    require_numbers BOOLEAN NOT NULL,
    require_special_chars BOOLEAN NOT NULL,
    password_expiration_time INT NOT NULL,
    tentative_intervale INT NOT NULL,
    nb_tentative INT NOT NULL,
    nb_mdp_ancien INT NOT NULL,
    change_date INT,
    PRIMARY KEY (change_id)
);

use lab5db;

CREATE TABLE old_passwords (
    passwordId INT NOT NULL AUTO_INCREMENT,
    user_id int not null,
    salt varchar(100) NOT NULL,
    user_password varchar(100) NOT NULL,
    PRIMARY KEY (passwordId)
);

INSERT INTO users(username, user_password, salt, user_role, password_creation_date) 
VALUES 
('SuperAdmin', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'SUPER_ADMIN', 1712464089),
('Admin', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'ADMIN', 1712464089),
('PreRes', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'PREP_RESIDENTIEL', 1712464089),
('PreAff', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'PREP_AFFAIRE', 1712464089),
('CliRes1', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_RESIDENTIEL', 1712464089),
('CliRes2', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_RESIDENTIEL', 1712464089),
('CliRes3', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_RESIDENTIEL', 1712464089),
('CliAff1', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_AFFAIRE', 1712464089),
('CliAff2', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_AFFAIRE', 1712464089),
('CliAff3', 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392', 'CLIENT_AFFAIRE', 1712464089)
;

INSERT INTO security_log(event_time, event_type, user_id) VALUES (1711593766, "LOGIN_SUCCESS", 1);
INSERT INTO password_config_changes(min_length, max_length, require_lowercase, require_uppercase, require_numbers, require_special_chars, password_expiration_time, tentative_intervale, nb_tentative, nb_mdp_ancien) VALUES (8, 16, TRUE, TRUE, TRUE, TRUE, 30, 1, 3, 3);
INSERT INTO old_passwords(user_id, user_password, salt) VALUES (1, 'd07a567a0d46b7309451b5bfaf2e076684f7e7035aea6e21a694e7f2932fb056', 'b5ba71acfd9a42318a2427d0ceac4392')