const express = require("express");
const router = express.Router();

const Artist = require("../models/Artist");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

//routes:

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

module.exports = router;
