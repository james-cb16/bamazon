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
            message: 'What would you like to purchase? Please enter the ID of the item that you choose. Type [Quit] to exit.',
            validate: function (val) {
                return !isNaN(val);
            }
        }
    ])
}