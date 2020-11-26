const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Artist = require("../models/Artist");
const mongoose = require("mongoose");

const { uploadCloud, cloudinary } = require("../configs/cloudinary.config");

//routes
router.get("/add", (req, res, next) => {
  res.render("artist/add", { user: req.session.passport.user });
});

router.get("/show/:artistId", (req, res, next) => {
  Artist.findById(req.params.artistId)
    .then((artistFromDB) => {
    const artist = artistFromDB;
    console.log(artist, "artist");
    Product.find({ owner: { $in: artist._id} })
      .then(productList => {
      //const isArtist= req.session.passport.user==artist._id;
        res.render("artist/showArtist", {
          productList,
          artist,
          //isArtist,
          user: req.session.passport.user,
        });
      })
      .catch((err) => {
        console.log("error from artist profile", err);
        next(err);
      })
    })
})

router.get("/show/", (req, res, next) => {
  Artist.findById(req.session.passport.user).then((artist) => {
    Product.find({ owner: { $in: req.session.passport.user } })


      .then((productList) => {
        const isArtist= req.session.passport.user==artist._id;
        console.log(isArtist);
        res.render("artist/show", {
          productList,
          artist,
          isArtist,
          user: req.session.passport.user,
        });
      })
      .catch((err) => {
        console.log("error from artist profile", err);
        next(err);
      });
  });
});

// router.get("/your-products", (req, res, next) => {
//   Product.find({ owner: { $in: req.session.passport.user } }).then(
//     (productList) => {
//       console.log("productList", productList);
//       res.render("artist/products", { productList });
//     }
//   );
// });

router.get("/edit", (req, res, next) => {
  Artist.findById(req.session.passport.user)
    .then((selectedArtist) => {
      res.render("artist/edit", {
        selectedArtist,
        user: req.session.passport.user,
      });
    })
    .catch((err) => next(err));
});

router.post("/edit", uploadCloud.single("avatar"), (req, res, next) => {
  const { name, city, country, about } = req.body;
  const avatar = req.file ? req.file.path : "";
  let editedProfile;
  if (avatar === "") {
    editedProfile = { name, city, country, about };
  } else {
    editedProfile = {
      name,
      city,
      country,
      about,
      avatar,
    };
  }
  Artist.findByIdAndUpdate(req.session.passport.user, editedProfile)
    .then(() => {
      res.redirect("show");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render(
          "artist/edit",
          { selectedArtist: editedProfile, user: req.session.passport.user },
          {
            errorMessage: err.message,
          }
        );
      } else {
        next(err);
      }
    });
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
  })
    .then((dbArtist) => {
      console.log("profile created", dbArtist);
      res.redirect("show");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render(
          "artist/add",
          { selectedArtist: editedProfile, user: req.session.passport.user },
          {
            errorMessage: err.message,
          }
        );
      } else {
        next(err);
      }
    });
});

module.exports = router;
