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
    res.render('categories', {categoryProductList, categoryName, user: req.session.passport.user});

  }).catch (err => console.log(err))
}) 

router.post('/categories/:categoryName', (req, res, next) => {
  const categoryName = req.params.categoryName;
  const lower = +req.body.price.split("-")[0];

  if (req.body.price.split("-").length > 1)
  const higher = +req.body.price.split("-")[1];

 // console.log(+req.body.price.split("-")[0]);
  Product.find({category: categoryName, $and: [ { qty: { $lt: 100 } }, { qty: { $gt: 30 } } ]  })
  .then (categoryProductList => {
    res.render('categories', {categoryProductList, categoryName, user: req.session.passport.user});

  }).catch (err => console.log(err))
})


module.exports = router;


// query kveri 