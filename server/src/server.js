require('dotenv').config();

// Módulos
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");

// Constantes globales
const app = express();
const client = new Client();
client.connect();

const LOGIN_QUERY = "SELECT email, password FROM users";

const CLIENT_URI = "http://localhost:3000";

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
  let body = req.body;
  let query = LOGIN_QUERY + " WHERE email='" + body.email + "'";

  client.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res.rows);
    if (res.rows.length > 0) {
      if (res.rows[0].password == body.password) {
        console.log("Access granted!");
      }
      else {
        console.log("Access denied!");
      }
    }
    else {
      console.log("User not found!");
    }

  });

  res.redirect(CLIENT_URI + "/login");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log("Server started on port " + PORT));
