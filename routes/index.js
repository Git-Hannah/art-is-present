const express = require('express');
const router  = express.Router();
const Product = require("../models/Product");


/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.passport ? req.session.passport.user : undefined;
  res.render('index', {user});
});

router.get('/categories/:categoryName', (req,res,next) => {
  const categoryName = req.params.categoryName;
  Product.find({category: categoryName}).populate("owner")
  .then (categoryProductList => {
    const user = req.session.passport ? req.session.passport.user : undefined;
    res.render('categories', {categoryProductList, categoryName, user});

  }).catch (err => console.log(err))
}) 

// router.post('/categories/:categoryName', (req, res, next) => {
//   const categoryName = req.params.categoryName;
//   const lower = +req.body.price.split("-")[0];

//   if (req.body.price.split("-").length > 1)
//   // const higher = +req.body.price.split("-")[1];

//  // console.log(+req.body.price.split("-")[0]);
//   // Product.find({category: categoryName, $and: [ { qty: { $lt: 100 } }, { qty: { $gt: 30 } } ]  })
//   // .then (categoryProductList => {
//   //   res.render('categories', {categoryProductList, categoryName, user: req.session.passport.user});

//   // }).catch (err => console.log(err))
// })


module.exports = router;


