DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

	
USE bamazon;

CREATE TABLE products(
  id int not null primary key auto_increment,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  customer_price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) NULL
);

CREATE TABLE departments(
  department_id int not null primary key auto_increment,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,2) NULL
);

