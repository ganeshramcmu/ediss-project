# To be run after createTables.sql
DROP TABLE IF EXISTS edissDB.Orders;
DROP TABLE IF EXISTS edissDB.ProductOrderMap;
DROP TABLE IF EXISTS edissDB.recommendations;

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