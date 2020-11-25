const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");

const { uploadCloud, cloudinary } = require("../configs/cloudinary.config");

router.get("/edit/:id/product", (req, res, next) => {
  Product.findById(req.params.id)
    .then((selectedProduct) => {
      res.render("products/edit", { selectedProduct });
    })
    .catch((err) => next(err));
});

router.post(
  "/edit/:id/product",
  uploadCloud.array("images"),
  (req, res, next) => {
    const { name, price, availability, category, description } = req.body;
    const images = req.files.map((file) => file.path);
    let editedProduct;
    if (images.length === 0)
      editedProduct = { name, price, availability, category, description };
    else
      editedProduct = {
        name,
        price,
        availability,
        category,
        description,
        images,
      };
    //console.log(editedProduct)

    Product.findByIdAndUpdate(req.params.id, editedProduct)
      .then((foundProduct) => {
        //console.log(foundProduct)
        //res.render('',{message='product updated'})
        console.log("product updated");
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).render(
            "products/edit",
            { selectedProduct: editedProduct },
            {
              errorMessage: err.message,
            }
          );
        } else {
          next(err);
        }
      });
  }
);

router.get("/show/:id/product", (req, res, next) => {
  Product.findById(req.params.id)
    .then((foundProduct) => {
      res.render("products/show", { foundProduct });
      console.log(foundProduct.images);
    })
    .catch((err) => next(err));
});

router.get("/add/product", (req, res, next) => {
  res.render("products/add");
});

router.post("/add/product", uploadCloud.array("images"), (req, res, next) => {
  //console.log(req.body)

  const { name, price, availability, category, description } = req.body;
  const images = req.files.map((file) => file.path);
  //const owner=req.session.... //get and set the owner's id

  Product.create({ name, price, availability, category, description, images })
    .then(() => {
      //res.render('',{message:'Product Added!'}) //which view should we render here?
      console.log("product added");
      return;
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("products/add", {
          errorMessage: err.message,
        });
        //console.log('hi')
      } else {
        next(err);
      }
    });
});

module.exports = router;
