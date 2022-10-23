
CREATE DATABASE IF NOT EXISTS sosure;

USE sosure;

CREATE TABLE IF NOT EXISTS phone (
  id                UNSIGNED INTEGER NOT NULL,
  make              VARCHAR(80)      NOT NULL,
  model             VARCHAR(80)      NOT NULL,
  storage           UNSIGNED INTEGER NOT NULL,
  monthly_premium   DECIMAL(8,2)     NOT NULL,
  excess            UNSIGNED INTEGER NOT NULL,
  PRIMARY KEY (id)
);

REPLACE INTO phone VALUES
(1, 'LG'     , 'G6'        ,  32, 4.49,  75),
(2, 'Apple'  , 'iPhone 11' , 128, 7.99, 125),
(3, 'Samsung', 'Galaxy S10', 512, 9.99, 150);
