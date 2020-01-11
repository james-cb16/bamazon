var mysql = require("mysql");
var inquirer = require("inquirer");

// Creates connection information for the sql database
var connection = mysql.createConnection({
    host: "u0zbt18wwjva9e0v.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",

    port: 3306,

    user: "c8cswvixj0mjb280",

    password: "d2pf8mudmadx8v67",
    database: "ren7kbjw9m3kw1qg"
});

// Connects to mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;

    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM ren7kbjw9m3kw1qg.bamazon_products", function (err, res) {
        if (err) throw err;

        console.table(res);

        chooseItem(res);
    });
}

function chooseItem(inventory) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'choice',
            message: 'What would you like to purchase? Please enter the ID of the item that you choose. Type [Quit] to exit.'
        }
    ]).then(function (val) {
        var choiceId = parseInt(val.choice)
        if (val.choice.toLowerCase() === 'quit') {
            exit();
        } else if (isNaN(val.choice)) {
            console.log('Please enter a valid input.');
            setTimeout(displayProducts, 2000);
        }
        else {
            for (var i = 0; i < inventory.length; i++) {
                if (inventory[i].item_id === choiceId) {
                    productQuantity(inventory[i]);

                }
            }

        }

    })
}

function productQuantity(product) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'quantity',
            message: 'Please enter an amount. Type [Quit] to exit.'
        }
    ]).then(function (val) {
        if (val.quantity.toLowerCase() === 'quit') {
            exit();
        } else {
            if (val.quantity > product.stock_quantity) {
                console.log('The amount you have chosen exceeds the number of products available.');
                setTimeout(displayProducts, 2000);
            } else if (parseInt(val.quantity) < 1) {
                console.log('You must enter a number greater than 0.')
                setTimeout(displayProducts, 2000);
            }
            else {
                purchaseProduct(product, val.quantity);
            }
        }
    })
}

function purchaseProduct(product, quantity) {
    connection.query(
        "UPDATE ren7kbjw9m3kw1qg.bamazon_products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, product.item_id],
        function (err, res) {
            console.log('You have purchased ' + quantity + " " + product.product_name + '(s)!');
            setTimeout(displayProducts, 2000);
        }
    )
}

function exit() {
    console.log("Closing application. Have a great day!");
    setTimeout(function () { process.exit(0) }, 2000);
}