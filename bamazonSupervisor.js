"use strict";


(function() {

  var mysql = require("mysql");
  var Table = require("cli-table");
  var inquirer = require('inquirer');

//========================================================================
//      Connect to DB
//========================================================================
  var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;


  });


//========================================================================
//      Initialize app
//========================================================================


function init(){
  inquirer
  .prompt([
    {
      type: "list",
      message: "Please Choose an option",
      choices: ["View Product Sales by Department", "Create New Department","Quit"],
      name: "choice"
    }
    // Here we ask the user to confirm.
  ])
  .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    switch(inquirerResponse.choice){
      case "View Product Sales by Department":
        productSales();
          
        break;
      case "Create New Department":
  
        break;
      case "Quit":
        console.log("GOOD BYE");
        process.exit();
        break;
    }
  });
}




//========================================================================
//      Display Function
//========================================================================

  function productSales() {

    var tempTable = [];
    var table = new Table({
      head:["Department ID","Department Name","Over Head Cost", "Product Sales","Total Profit"], colWidths:[5,15,15,10,10]
    });

    console.log("Showing  all product sales...\n");
    
//     SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
// FROM Orders
// INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

    connection.query("SELECT departments.department_id, departments.department_name,departments.over_head_costs,SUM(products.product_sales)-departments.over_head_costs AS Total_Profit FROM products JOIN departments ON products.department_name= departments.department_name GROUP BY departments.department_id" , function(err, res) {
      if (err) throw err;

      console.log(res);
      // for(var i = 0 ; i < res.length ; i++){
      //   tempTable = [ res[i].id ,res[i].product_name , res[i].department_name ,res[i].customer_price ,res[i].stock_quantity];
      //   table.push(tempTable);
      // }

    
      // console.log(table.toString());
      init();
    });

  }


//========================================================================
//      Low Inventory
//========================================================================

  function showLowInventory() {
    
    var tempTable = [];
    var table = new Table({
      head:["ID","Product","Department", "Price","Qty"], colWidths:[5,15,15,10,10]
    });

    console.log("Showing  all products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
      if (err) throw err;

      for(var i = 0 ; i < res.length ; i++){
        tempTable = [ res[i].id ,res[i].product_name , res[i].department_name ,res[i].customer_price ,res[i].stock_quantity];
        table.push(tempTable);
      }

    
      console.log(table.toString());
      init();
    });
  }

//========================================================================
//      Add Product
//========================================================================
function addProduct(){
  inquirer.prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please type in new product name.",
        name: "product_name"
      },
      // Here we create a basic password-protected text prompt.
       {
        type: "input",
        message: "how much would you like to add?",
        name: "qty"
      },
      {
        type: "input",
        message: "what department does this product belong to?",
        name: "department"
      },
      {
        type: "input",
        message: "what is the cost of the item?",
        name: "cost"
      }
    ])
    .then(function(inquirerResponse) {
      var qty = parseInt(inquirerResponse.qty);
      var productName = inquirerResponse.product_name;
      var department = inquirerResponse.department;
      var cost = inquirerResponse.cost;

      console.log("Product Name: " + productName + " || Department: " + department + " || Quantity: " + qty + " || Cost: " + cost);
      inquirer.prompt([
      // Here we create a basic text prompt.
        {
          type: "list",
          message: "Is the Above correct?",
          choices: ["Yes","No"],
          name: "choice"
        }
      ])
      .then(function(inquirerResponse) {
          switch(inquirerResponse.choice){
            case "Yes":
              connection.query("INSERT INTO products (product_name,department_name,customer_price,stock_quantity) VALUES (?,?,?,?)", [productName,department,cost, qty],function(err,res) {      
                
                console.log("Product Added!")
                init();                 
                  
              })
              break;
            case "No":
              console.log("Please select add product and enter the correct information.")
                init();
              break;
          }
      });
    });
  }


init();

})();
