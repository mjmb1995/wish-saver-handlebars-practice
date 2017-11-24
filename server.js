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
  database: "wishes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// Use Handlebars to render the main wishes-index.html page with the wishes in it.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM wishes;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.render("wishes-index", { wishes: data });
  });
});


// Create a new wish
app.post("/wish", function(req, res) {
  connection.query("INSERT INTO wishes (wish) VALUES (?)", [req.body.wish], function(err, result) {
    if (err) {
      return res.status(500).end();
    }

    // Send back the ID of the new wish
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});


// Retrieve all wishes
app.get("/wish", function(req, res) {
  connection.query("SELECT * FROM wishes;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }

    res.json(data);
  });
});


// Update a wish
app.put("/wish/:id", function(req, res) {
  connection.query("UPDATE wishes SET wish = ? WHERE id = ?", [req.body.wish, req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server faliure
      return res.status(500).end();
    } else if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});


// Delete a wish
app.delete("/wish/:id", function(req, res) {
  connection.query("DELETE FROM wishes WHERE id = ?", [req.params.id], function(err, result) {
    if (err) {
      // If an error occurred, send a generic server faliure
      return res.status(500).end();
    } else if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});


app.listen(port, function() {
  console.log("listening on port", port);
});
