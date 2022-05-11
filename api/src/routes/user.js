const server = require("express").Router();
const bcrypt = require("bcryptjs");
const { User } = require("../db.js");
const { response } = require("../app.js");

server.post("/", (req, res, next) => {
  let { email, name, lastname, password, role } = req.body;
  if (email && name && lastname && password) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        // Store hash in your password DB.
        const newUser = {
          email: email,
          name: name,
          lastname: lastname,
          password: hash,
          role: role,
        };
        User.create(newUser)
          .then((users) => {
            res.status(201);
            res.send(users.dataValues);
          })
          .catch((error) => {
            res.status(400);
            res.send(error);
          });
      });
    });
  } else {
    return res
      .status(400)
      .json({ message: "Debe pasar los parametros requeridos." });
  }
});

server.get("/:id", (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
    
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "No se encontro el usuario" });
      }
      return res.send(user);
    })
    .catch((error) => next(error));
});

module.exports = server;
