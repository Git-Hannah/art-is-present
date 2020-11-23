const express=require('express');
const router=express.Router();
const Artist=require('../models/Artist');

const {uploadCloud,cloudinary}=require('../configs/cloudinary.config');

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

router.post('/add/product',uploadCloud.array('images'), async (req,res,next)=>{
const imagesUrls=req.files.map(file=>file.path)
console.log(imagesUrls);
});

module.exports =router;
