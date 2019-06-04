CREATE DATABASE IF NOT EXISTS edissDB;

USE edissDB;

DROP TABLE IF EXISTS edissDB.UserProfile;

CREATE TABLE IF NOT EXISTS UserProfile(
userid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL,
password VARCHAR(128) NOT NULL,
fullName VARCHAR(1000) NOT NULL
);

INSERT INTO UserProfile VALUES ('1','hsmith', 'smith', 'Henry Smith'), ('2', 'tbucktoo', 'bucktoo', 'Tim Bucktoo');