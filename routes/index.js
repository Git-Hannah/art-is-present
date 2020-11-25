const express = require('express');
const router  = express.Router();
const Product = require("../models/Product");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user: req.session.passport.user});
});

router.get('/categories/:categoryName', (req,res,next) => {
  const categoryName = req.params.categoryName;
  Product.find({category: categoryName})
  .then (categoryProductList => {
    res.render('categories', {categoryProductList})

  }).catch (err => console.log(err))
}) 

module.exports = router;


// query kveri 