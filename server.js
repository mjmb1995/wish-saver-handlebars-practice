var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");

var app = express();
var port = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sets up handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connecting to mySQL
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "TsUbAsA330",
  database: "task_saver_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// routes go here
app.get("/", function(req, res) {
  connection.query("SELECT * FROM wishes;", function(err, data) {
    if (err) throw err;

    res.render("wishes-index", { wishes: data });
  });
});

app.post("/", function(req, res) {

  console.log('req.body')
  console.log(req.body)

  connection.query("INSERT INTO wishes (wish) VALUES (?)", [req.body.wish], function(err, result) {
    if (err) throw err;

    res.redirect("/");
  });
});



app.listen(port);