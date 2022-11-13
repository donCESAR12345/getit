require('dotenv').config();

// Módulos
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
  if (isLoggedIn(req)) {
    res.redirect("/");
    return;
  }

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
  if (isLoggedIn(req)) {
    res.redirect("/");
    return;
  }

  let error = req.query.error;
  if (error === undefined) {
    error = 0;
  }
  res.render("login", {
    name: "login",
    error: error
  });
});

app.get("/logout", function(req, res) {
  console.log(req.session.userid + " has logged out!");
  req.session.destroy();
  res.redirect("/");
});

// Manejar solicitudes POST
app.post("/login", loginSession);
app.post("/register", registerNewUser);

function isLoggedIn(req) {
  // Si está loggueado, regresar a la página principal
  session = req.session;
  // Averiguar si la cookie de loggeado existe
  return session.userid;
}

function loginSession(req, res) {
  let body = req.body;
  const query = `SELECT email, password FROM users 
    WHERE email='${body.email}';`;

  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    if (result.rows.length > 0) {
      console.log("Usuario encontrado.");
      if (result.rows[0].password === body.password) {
        session = req.session;
        session.userid = body.email;
        console.log(session.userid + " has logged in!");
        res.redirect("/");
      }
      else {
        console.log("Access denied!");
        res.redirect("/login?error=1");
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
  const query = `SELECT email, password FROM users 
    WHERE email='${body.email}';`;
  client.query(query, (err, result) => {
    if (err) {
      throw (err);
    }
    if (result === undefined) {
      body.is_admin = false;
      createUserInDB(body);
      res.redirect("/login");
    }
    else {
      console.log("Usuario ya existe.");
      res.redirect("/register?error=2")
    }
  });
}

function createUserInDB(data) {
  const query = `INSERT INTO users(
    email, password, is_admin, first_name,
    last_name, country, birthdate)
    VALUES(
    '${data.email}', '${data.password}', ${data.is_admin},
    '${data.first_name}', '${data.last_name}',
    '${data.country}', '${data.birthdate}'
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

function deleteUserInDB(email) {
  const query = `DELETE FROM users WHERE
    email = '${email}';`;
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
