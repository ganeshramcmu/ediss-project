CREATE DATABASE IF NOT EXISTS edissDB;

USE edissDB;

DROP TABLE IF EXISTS edissDB.ProductOrderMap;
DROP TABLE IF EXISTS edissDB.recommendations;
DROP TABLE IF EXISTS edissDB.Orders;
DROP TABLE IF EXISTS edissDB.UserProfile;
DROP TABLE IF EXISTS edissDB.products;

CREATE TABLE IF NOT EXISTS UserProfile(
userid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
fname VARCHAR(200) NOT NULL,
lname VARCHAR(200) NOT NULL,
address VARCHAR(500) NOT NULL,
city VARCHAR(150) NOT NULL,
state VARCHAR(100) NOT NULL,
zip VARCHAR(50) NOT NULL,
email VARCHAR(200) NOT NULL,
username VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS products(
asin INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
productName VARCHAR(300) NOT NULL,
productDescription VARCHAR(1000) NOT NULL,
pgroup VARCHAR(128) NOT NULL
);

CREATE TABLE IF NOT EXISTS Orders(
orderid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
userid INT UNSIGNED NOT NULL,
FOREIGN KEY(userid) REFERENCES edissDB.UserProfile(userid)
);

CREATE TABLE IF NOT EXISTS ProductOrderMap(
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
orderid INT UNSIGNED NOT NULL,
FOREIGN KEY (orderid) REFERENCES edissDB.Orders(orderid),
asin INT UNSIGNED NOT NULL,
FOREIGN KEY (asin) REFERENCES edissDB.products(asin)
);

CREATE TABLE recommendations(
    asin varchar(20),
    productId varchar(20) NOT NULL,
    together_index INT
);

INSERT INTO edissDB.UserProfile(fname,lname,address,city,state,zip,email,username,password) VALUES('Jenny','Admin','d','d','d','d','d','jadmin','admin');