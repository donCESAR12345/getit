require('dotenv').config();

// Módulos
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { Client } = require("pg");

// Constantes globales
const app = express();
const client = new Client();
client.connect();

// Módulo de plantillas
app.set("view engine", "pug");
app.set("views", "./views");

const LOGIN_QUERY = "SELECT email, password FROM users";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "123" }));

app.get("/login", function(req, res) {
  res.render("home");
});

app.post("/login", function(req, res) {
  if (user.id === req.body.id) {
    res.render('signup', {
      message: "User Already Exists! Login or choose another user id"
    });
  }
  var newUser = { id: req.body.id, password: req.body.password };
  Users.push(newUser);
  req.session.user = newUser;
  res.redirect('/protected_page');
});

app.post("/login", (req, res) => {
  let body = req.body;
  let query = LOGIN_QUERY + " WHERE email='" + body.email + "'";

  client.query(query, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }

    if (res.rows.length > 0) {
      if (res.rows[0].password == body.password) {
        console.log(res.rows[0].email + "Has logged in!");
        req.session.user = res.rows[0].email;
        let url = new URL(CLIENT_URI);
        res.redirect();
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

function checkSignIn(req, res) {
  if (req.session.user) {
    next();     //If session exists, proceed to page
  }
  else {
    const err = new Error("Not logged in!");
    console.log(req.session.user);
    next(err);  //Error, trying to access unauthorized page!
  }
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log("Server started on port " + PORT));
