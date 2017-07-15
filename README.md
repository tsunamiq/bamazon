I. File list
------------
bamazonCustomer.js          customer view
bamazonManager.js           manager view
bamazonSupervisor.js        supervisor view
bamazonDB.sql               sql file to build bamazon database with tables departments and products
departments.csv             CSV data to fill departments table
inventoryV1.csv             CSV data to fill inventory list
package.json                summary of NPM info. required packages are mysql and inquire cli-table, mysql, inquirer


II. Description
---------------
Goal of the project was to create 3 views. Customer, manager and superviser view to accomplish various tasks to meet design requirements. A bamazon database was created in mysql to store back end data.

DATABASE SUMMARY:

	Products Table:

		Columns are listed below
		-item_id (unique id for each product)
		-product_name (Name of product)
		-department_name
		-price (cost to customer)
		-stock_quantity (how much of the product is available in stores)
		-product sales

	Department Table:

		Columns are listed below
		-department ID
		-department Name
		-over-head-costs

FEATURES and FUNCTIONALITY:

	Customer View:
		-displays all inventory from products table
		-allows customer to order items and quantity and providing total cost

	Manager View:
		-List a set of menu options:
		-View Products for Sale
		-View Low Inventory
		-Add to Inventory
		-Add New Product

	Supervisor View:
		-View Product Sales by Department
		-Create New Department

DEMO:

	Demo was capture through youtube. Link: https://www.youtube.com/watch?v=YjNbSIQTJrM





