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
        createDepartment()
  
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
      head:["Department ID","Department Name","Over Head Cost", "Product Sales","Total Profit"], colWidths:[15,17,17,15,15]
    });

    console.log("Showing  all product sales...\n");
    
//     SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
// FROM Orders
// INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

    connection.query("SELECT departments.department_id, departments.department_name,departments.over_head_costs,IFNULL(SUM(products.product_sales),0) AS total_product_sales,IFNULL(SUM(products.product_sales-departments.over_head_costs),0) AS total_profit FROM products RIGHT JOIN departments ON products.department_name= departments.department_name GROUP BY departments.department_id" , function(err, res) {
      if (err) throw err;

      console.log(res);
      for(var i = 0 ; i < res.length ; i++){
        tempTable = [ res[i].department_id ,res[i].department_name , res[i].over_head_costs ,res[i].total_product_sales,res[i].total_profit];
        table.push(tempTable);
      }

    
      console.log(table.toString());
      init();
    });

  }

//,SUM(products.product_sales)-departments.over_head_costs AS total_profit FROM products 

//========================================================================
//      Add Product
//========================================================================
function createDepartment(){
  inquirer.prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please type in a new department name.",
        name: "department_name"
      },
      // Here we create a basic password-protected text prompt.
       {
        type: "input",
        message: "Please enter the over head costs",
        name: "over_head_costs"
      }
    ])
    .then(function(inquirerResponse) {
      var overHeadCosts = parseInt(inquirerResponse.over_head_costs);
      var departmentName = inquirerResponse.department_name;

      console.log("Department Name: " + departmentName + " || Over Head Costs: " + overHeadCosts);
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
              connection.query("INSERT INTO departments (department_name,over_head_costs) VALUES (?,?)", [departmentName,overHeadCosts],function(err,res) {      
                
                console.log("Department Added!")
                init();                 
                  
              })
              break;
            case "No":
              console.log("Please select create department and enter the correct information.")
                init();
              break;
          }
      });
    });
  }


init();

})();
