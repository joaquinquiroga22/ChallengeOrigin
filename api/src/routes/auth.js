const server = require("express").Router();
const passport = require("passport");

server.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  function (req, res) {
  
    res.status(200).send({
      id: req.user.id,
      name: req.user.name,
      lastname: req.user.lastname,
      password: req.user.password
    });

  }
);

server.get ("/login", function (req, res) {
   res.status(401).send("Fallo el inicio de sesion");
});

server.get("/logout", function (req, res) {
  req.logout();
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    return res.send({ authenticated: req.isAuthenticated() });
  });

});

module.exports = server;
