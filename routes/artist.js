const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Artist = require("../models/Artist");
const mongoose = require("mongoose");

const { uploadCloud, cloudinary } = require("../configs/cloudinary.config");

//routes
router.get("/add", (req, res, next) => {
  res.render("artist/add");
});

router.get("/show", (req, res, next) => {
  Artist.findById(req.session.passport.user).then((artist) => {
    // console.log("------------artist", artist);
    res.render("artist/show", { artist });
  });
});

router.get("/edit", (req, res, next) => {
  Artist.findById(req.session.passport.user)
    .then((selectedArtist) => {
      console.log("edit artist", selectedArtist);
      res.render("artist/edit", { selectedArtist });
    })
    .catch((err) => next(err));
});

router.post("/add", uploadCloud.single("avatar"), (req, res, next) => {
  const { name, city, country, about } = req.body;
  // console.log(req.file.path);
  console.log("req.body", req.body);
  console.log("-------------id", req.session.passport.user);

  const avatar = req.file ? req.file.path : "";
  // { $set: { <field1>: <value1>, ... } }
  Artist.findByIdAndUpdate(req.session.passport.user, {
    name: name,
    city: city,
    country: country,
    about: about,
    avatar: avatar,
  }).then((dbArtist) => {
    console.log("profile created", dbArtist);
    res.redirect("show");
  });
});

module.exports = router;
