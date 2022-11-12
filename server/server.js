require('dotenv').config();

// Módulos
const path = require("path");
const express = require("express");
const sessions = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Client } = require("pg");

// Constantes globales
const app = express();
var session;
const oneDay = 1000 * 60 * 60 * 24;

// Conexión a la base de datos
const client = new Client();
const REGISTER_QUERY = "SELECT email FROM users"
const LOGIN_QUERY = "SELECT email, password FROM users";
client.connect();

// Directorio estático 
app.use(express.static("public"));

// Módulo de plantillas
app.set("view engine", "pug");
app.set("views", "./views");

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessions({
  secret: "UbZpT3tEzDHqHsIZm5kWNmJCmvVnp7j8",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

// Renderizar página principal
app.get("/", function(req, res) {
  // Bandera para saber si está loggeado
  let loggedIn = false;
  session = req.session;
  // Averiguar si la cookie de loggeado existe
  if (session.userid) {
    loggedIn = true;
  }

  res.render("home", {
    name: "home",
    loggedIn: loggedIn
  });
});

// Renderizar página de registro
app.get("/register", function(req, res) {
  res.render("register", {
    name: "register",
    error: 0
  });
});

// Renderizar página de ingreso
app.get("/login", function(req, res) {
  let error = req.query.error;
  if (error === undefined) {
    error = 0;
  }
  res.render("login", {
    name: "login",
    error: error
  });
});

// Manejar solicitudes POST en registro
app.post("/register", registerNewUser);
app.post("/login", loginSession);

function loginSession(req, res) {
  let body = req.body;
  let query = LOGIN_QUERY + " WHERE email='" + body.email + "';";

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result.rows.length > 0) {
      if (result.rows[0].password === body.password) {
        session = req.session;
        session.userid = body.username;
        console.log(req.session + " has logged in!");
        res.redirect("/");
      }
      else {
        console.log("Access denied!");
      }
    }
    else {
      console.log("User not found!");
      res.redirect("/login?error=1");
    }
  });
}

function registerNewUser(req, res) {
  let body = req.body;
  let query = REGISTER_QUERY + " WHERE email='" + body.email + "';";

  if (query.rows.length > 0) {
    res.render("/register", {
      error: 1
    });
  }
  else {
    console.log("Usuario registrado");
  }
}

//app.post("/login", (req, res) => {
//  let body = req.body;
//  let query = LOGIN_QUERY + " WHERE email='" + body.email + "'";
//
//
//  res.redirect(CLIENT_URI + "/login");
//});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log("Server started on port " + PORT));
