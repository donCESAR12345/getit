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
const INSERT_QUERY = "INSERT INTO users(email, password, is_admin, first_name, last_name, country, birthdate)";
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
  let error = req.query.error;
  if (error === undefined) {
    error = 0;
  }
  res.render("register", {
    name: "register",
    error: error
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

// Manejar solicitudes POST
app.post("/login", loginSession);
app.post("/register", registerNewUser);

function loginSession(req, res) {
  let body = req.body;
  let result = findUserInDB(body.email);

  if (result.rows.length > 0) {
    if (result.rows[0].password === body.password) {
      session = req.session;
      session.userid = body.username;
      console.log(session.userid + " has logged in!");
      res.redirect("/");
    }
    else {
      console.log("Access denied!");
    }
  }
  else {
    console.log("User not found!");
  }
  res.redirect("/login?error=1");
}

function registerNewUser(req, res) {
  let body = req.body;
  let result = findUserInDB(body.email);

  if (result.rows.length === 0) {
    console.log(body);
  }
}

function findUserInDB(email) {
  const query = `SELECT email, password FROM users 
    WHERE email=${email};`;
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result.rows.length > 0) {
      return result;
    }
    else {
      console.log("User not found!");
      return;
    }
  });
}

function insertUserInDB(data) {
  const query = `INSERT INTO users(
    email, password, is_admin, first_name,
    last_name, country, birthdate)
    VALUES(
    ${data.email}, ${data.password}, ${data.is_admin},
    ${data.first_name}, ${data.last_name},
    ${data.country}, ${data.birthdate}
    );`;
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    else {
      return result;
    }
  });
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log("Server started on port " + PORT));

/*
  ERRORES:
  0: No hubo errores,
  1: Usuario no existente o contraseña incorrecta,
  2: Usuario ya existente (registro),
*/
