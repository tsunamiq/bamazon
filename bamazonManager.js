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
      choices: ["View Products for Sale", "View Low Inventory","Add to Inventory","Add New Product","Quit"],
      name: "choice"
    }
    // Here we ask the user to confirm.
  ])
  .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    switch(inquirerResponse.choice){
      case "View Products for Sale":
          showAllItems();
          
        break;
      case "View Low Inventory":
          showLowInventory()
          
        break;

      case "Add to Inventory":
          addToInentory()
        break;
      case "Add New Product":
        addProduct();
        break;
      case "Quit":
        console.log("GOOD BYE");
        process.exit();
        break;
    }
  });
}

//========================================================================
//      Add to Inventory
//========================================================================
function addToInentory(){
  inquirer.prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please type the id number of the product you would like to add inventory to.",
        name: "id"
      },
      // Here we create a basic password-protected text prompt.
       {
        type: "input",
        message: "how much would you like to add?",
        name: "qty"
      }
    ])
    .then(function(inquirerResponse) {
      var idChoice = parseInt(inquirerResponse.id);
      var qty = parseInt(inquirerResponse.qty);
      if(inquirerResponse.id === "" || inquirerResponse.qty === ""){
        console.log("Please enter a valid ID and Qty.");
        init();
      }else{
      
        connection.query("SELECT * FROM products WHERE ?", {id: idChoice},function(err,res) {
            if(res.length === 0){
              console.log("Please choose a valid ID!");
              init();
            }else{
              var productName = res[0].product_name;
              var newQty = res[0].stock_quantity +qty;
            

             
              connection.query("UPDATE products SET stock_quantity=? WHERE ?",[newQty, {id: idChoice}], function(err,res){
                
              console.log("You added: " + qty + " of " + productName + ".");
              console.log("Your total qty is: " + newQty);
              init();
              })
            }
          })
       }
 
    });

}


//========================================================================
//      Display Function
//========================================================================

  function showAllItems() {

    var tempTable = [];
    var table = new Table({
      head:["ID","Product","Department", "Price","Qty"], colWidths:[5,15,15,10,10]
    });

    console.log("Showing  all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
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
