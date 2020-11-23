const express = require("express");
const router = express.Router();

const Artist = require("../models/Artist");

const bcrypt = require("bcrypt");
// const bcryptSalt = 10;

const passport = require("passport");
const { deserializeUser } = require("passport");

//routes:

//signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render("/auth/signup", {
      errorMessage: "Email and password are mandatory",
    });
    return;
  }
  Artist.findOne({ email }).then((artistEmail) => {
    if (artistEmail !== null) {
      res.render("auth/signup", { message: "Email already exists" });
      return;
    } else {
      // Encrypt the password
      // const salt = bcrypt.genSaltSync(bcryptSalt);
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      Artist.create({ email: email, password: hash }).then((dbArtist) => {
        //login with passport
        console.log("dbartist", dbArtist);
        req.login(dbArtist, (err) => {
          if (err) {
            console.log("error in signup - creating artist", err);
            next(err);
          } else {
            res.redirect("/");
          }
        });
      });
    }
  });
});

module.exports = router;
