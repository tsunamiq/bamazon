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
//      Initilize app
//========================================================================

function init(){
  inquirer
  .prompt([
    {
      type: "list",
      message: "Please Choose an option",
      choices: ["SHOP", "QUIT"],
      name: "choice"
    },
    // Here we ask the user to confirm.
  ])
  .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.choice === "QUIT") {
      console.log("GOOD BYE");
      process.exit();
  
    }
    else {
     showAllItems();
    }
  });
}

//========================================================================
//      User Prompt
//========================================================================
function prompt(){
  inquirer.prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please type the id number of the product you would like to buy.",
        name: "id"
      },
      // Here we create a basic password-protected text prompt.
       {
        type: "input",
        message: "how many would you like to purchase?",
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
            }else if(qty > res[0].stock_quantity){
              console.log("Insufficient Quantity! Try Again!");
              init();
            }else{
              var productName = res[0].product_name;
              var newQty = res[0].stock_quantity -qty;
              var totalCost = qty*res[0].customer_price;
              var newProductSales = totalCost + res[0].product_sales;

              console.log(newQty)
              connection.query("UPDATE products SET stock_quantity=?,product_sales=? WHERE ?",[newQty,newProductSales, {id: idChoice}], function(err,res){
                
              console.log("You ordered: " + qty + " of " + productName + ".");
              console.log("Your total cost is: " + totalCost.toFixed(2));
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
      prompt();
    });
  }


init();

})();

