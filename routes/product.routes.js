const express=require('express');
const router=express.Router();
const Artist=require('../models/Artist');

router.get('/edit/product/:id',(req,res,next)=>{
  res.render('products/show');
});

router.get('/show/product/:id',(req,res,next)=>{
  res.render('products/edit');

});

router.get('/add/product',(req,res,next)=>{
  res.render('products/add');
});

router.post('/edit/product/:id',(req,res,next)=>{
 console.log('adding to DB')
});

router.post('/add/product',(req,res,next)=>{

});

module.exports = router;