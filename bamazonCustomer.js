var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});


// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});


// query all product in product table
function readProducts() {
  connection.query("SELECT * FROM products", function(err, result) {
    if (err) throw err;

    // Log all results of the SELECT statement
    // console.log(result);
    	for (var i = 0; i < result.length; i++) {
		console.log('------------------------');
		console.log('ItemID: ' + result[i].id);
		console.log('Product: ' + result[i].product_name);
		console.log('Department: ' + result[i].department_name);
		console.log('Quantity: ' + result[i].stock_quantity);
		console.log('Price: $' + result[i].price);
	}
		console.log('------------------------');

		start();
    	// connection.end();
  });
 }

// ask the user for  the ID of the product they would like to buy.
 function start() {
  inquirer
    .prompt([
    {
      name: "id",
      type: "input",
      message: "Please enter the Item ID of the product you would like to buy?",
      filter: Number
    },
    {
      name: "quantityToPurchase",
      type: "input",
      message: "Please enter the quantity that you would like to buy?",
      filter: Number
    }
	]).
	then(function(answer) {

		var idToPurchase = answer.id;
		var qty = answer.quantityToPurchase;

		// console.log(idToPurchase, qty);
		console.log('You are placing an order for Item ID: ' + idToPurchase + '  Quantity: ' + qty);
		console.log("\n---------------------------------------------------------------------\n");

		//query for product availability
		var query = 'SELECT * FROM products WHERE ?';

		connection.query(query, {id: idToPurchase}, function(err, data) {
			if (err) throw err;

		else {
		
			var itemData = data[0];

				// If product quantity is available
				if (qty <= itemData.stock_quantity) {
					console.log('Product is in stock and your order is now being placed.');

					var updateQuery = 'UPDATE products SET stock_quantity = ' + (itemData.stock_quantity - qty) + ' WHERE id = ' + idToPurchase;

					// Update the product quantity
					connection.query(updateQuery, function(err, data) {
						if (err) throw err;

						console.log('Order has been placed and the total is $' + itemData.price * qty);
						console.log("\n---------------------------------------------------------------------\n");

						// End the database connection
						connection.end();
					})
				} else {
					console.log('The quantity you have requested is not in stock and the order cannot be placed.');
					console.log('Please review the available product inventory and choose a different quantity');
					console.log("\n---------------------------------------------------------------------\n");

					readProducts();

				};
			}
		})
	  });
	};


// 	function showStock() {

// 	//Query the database to present inventory to the user
// 	query = 'SELECT * FROM products';

// 	connection.query(query, function(err, data) {
// 		if (err) throw err;

// 		console.log('Product Inventory: ');
// 		console.log('...................\n');

// 		var strOut = '';
// 		for (var i = 0; i < data.length; i++) {
// 			strOut = '';
// 			strOut += 'Item ID: ' + data[i].id + '  //  ';
// 			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
// 			strOut += 'Department: ' + data[i].department_name + '  //  ';
// 			strOut += 'Quantity: ' + data[i].stock_quantity + '  //  ';
// 			strOut += 'Price: $' + data[i].price + '\n';

// 			console.log(strOut);
// 		}

// 	  	console.log("---------------------------------------------------------------------\n");

// 	  	//Let the user place a new order
// 	  	start();

// 	})
// }



