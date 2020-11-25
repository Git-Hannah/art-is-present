const express = require("express");
const router = express.Router();

const Artist = require("../models/Artist");

const bcrypt = require("bcrypt");
// const bcryptSalt = 10;

const passport = require("passport");
const { deserializeUser } = require("passport");

//routes:

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { owner: req.session.passport.user });
});

router.get("/login", (req, res) => {
  res.render("auth/login", { owner: req.session.passport.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/artist/show",
    failureRedirect: "/login",
    passReqToCallback: true,
  })
);

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("/auth/signup", {
      owner: req.session.passport.user,
      errorMessage: "Email and password are mandatory",
    });
    return;
  }
  Artist.findOne({ email }).then((artistEmail) => {
    if (artistEmail !== null) {
      res.render("auth/signup", {
        owner: req.session.passport.user,
        message: "Email already exists",
      });
      return;
    } else {
      // Encrypt the password
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      Artist.create({ email: email, password: hash }).then((dbArtist) => {
        //login with passport
        // console.log("dbartist", dbArtist);
        req.login(dbArtist, (err) => {
          if (err) {
            console.log("error in signup - creating artist", err);
            next(err);
          } else {
            res.redirect("/artist/add");
          }
        });
      });
    }
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;
