const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Artist = require("../models/Artist");

/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.passport ? req.session.passport.user : undefined;
  Product.aggregate([ { $sample: { size: 6 } } ])
    //.populate("owner")
    .then(randomProducts=>{
      res.render("index", { user, randomProducts});
      //console.log(randomProducts)
    
    })
    .catch(err=>next(err))
});

router.get("/categories/:categoryName", (req, res, next) => {
  const categoryName = req.params.categoryName;
  Product.find({ category: categoryName })
    .populate("owner")
    .then((categoryProductList) => {
      const user = req.session.passport ? req.session.passport.user : undefined;
      res.render("categories", { categoryProductList, categoryName, user });
    })
    .catch((err) => console.log(err));
});

router.post('/categories/:categoryName', (req, res, next) => {
  const categoryName = req.params.categoryName;
  const user = req.session.passport ? req.session.passport.user : undefined;

  if(req.body.price){
    //console.log(req.body)
    if (req.body.price[0].split("-")[1]== ''){
      const lower = req.body.price[0].split("-")[0];
      Product.find({category: categoryName, price: { $gte: lower }})
      .then (categoryProductList => {
        res.render('categories', {categoryProductList, categoryName, user});
      })
      .catch (err => console.log(err))
      
    }else{
      const lower = req.body.price[0].split("-")[0];
      const higher = req.body.price[0].split("-")[1];
      Product.find({category: categoryName, $and: [ { price: { $lte: higher } }, { price: { $gt: lower } } ]  })
      .then (categoryProductList => {
        //console.log(categoryProductList,higher,lower)
        res.render('categories', {categoryProductList, categoryName, user});
      })
      .catch (err => console.log(err))
    }
  }

  if(req.body.availability){
    //console.log('heeeere',req.body.availability)
    Product.find({category: categoryName, availability: req.body.availability})
    .then(categoryProductList=>{
      res.render('categories', {categoryProductList, categoryName, user});
    })
      .catch(err=>next(err))

  }

})

router.post('/search/results',(req, res, next)=>{
  console.log(req.body.query)
  const query=req.body.query;
  const user = req.session.passport ? req.session.passport.user : undefined;

  Product.find().populate("owner")//change the query to search for products which name or description contain the string in the search bar
    .then(productList=>{
      const searchedProducts = productList.filter(product => {
        return product.name.toLowerCase().includes(query.toLowerCase()) || product.description.toLowerCase().includes(query.toLowerCase()) 
      })
      //console.log(searchedProducts)
      res.render('all-categories',{user, searchedProducts})
    })
    .catch(err=>next(err))
})

// router.post('/search/results/filter',(req,res,next)=>{

  // if(req.body.price){
  //   if (req.body.price.split("-")[1]== ''){
  //     const lower = req.body.price.split("-")[0];
  //     Product.find({price: { $gte: lower }})
  //     .then (categoryProductList => {
  //       res.render('all-categories', {categoryProductList, user: req.session.passport.user});
  //     })
  //     .catch (err => console.log(err))
      
  //   }else{
  //     const lower = req.body.price.split("-")[0];
  //     const higher = req.body.price.split("-")[1];
  //     Product.find({$and: [ { price: { $lte: higher } }, { price: { $gt: lower } } ]  })
  //     .then (categoryProductList => {
  //       //console.log(categoryProductList,higher,lower)
  //       res.render('all-categories', {categoryProductList, user: req.session.passport.user});
  //     })
  //     .catch (err => console.log(err))
  //   }
  // }

  // if(req.body.availability){
  //   console.log('heeeere',req.body.availability)
  //   Product.find({availability: req.body.availability})
  //   .then(categoryProductList=>{
  //     res.render('all-categories', {categoryProductList, user: req.session.passport.user});
  //   })
  //     .catch(err=>next(err))

  // }


// })

module.exports = router;

