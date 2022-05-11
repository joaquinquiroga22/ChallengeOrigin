const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
require("./db.js");
//Modelo de usuario
const { User } = require("./db.js");

passport.use(
  new Strategy({ usernameField: "email", passwordField: "password" }, function (
    username,
    password,
    done
  ) {
    User.findOne({ where: { email: username } })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password).then((res) => {
          if (res) {
            return done(null, user);
          }
          return done(null, false);
        });
      })
      .catch((err) => {
        return done(err);
      });
  })
);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ where: { id: id } })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});

const server = express();

//Usamos el modulo cors para las politics cors

server.name = "API";
server.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(
  session({
    secret: "apiLocal",
    resave: false,
    saveUninitialized: false,
  })
);

server.use(passport.initialize());
server.use(passport.session());
server.use((req, res, next) => {
  next();
});
server.use("/", routes);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("Usuario no logeado");
  }
}

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;