const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");

const { uploadCloud, cloudinary } = require("../configs/cloudinary.config");

router.get("/edit/:id/product", (req, res, next) => {
  Product.findById(req.params.id)
    .then(selectedProduct=>{
      console.log(selectedProduct);
      let selectedAvailability='';
      let availabilityOptions='';
      const availabilityArr=['available','currently unavailable'];
      availabilityArr.forEach(el=>{
        selectedAvailability= el===selectedProduct.availability ? 'selected':'';
        availabilityOptions+=`<option value="${el}" ${selectedAvailability}>${el}</option>`;
      })
    

      let categoryOptions='';
      let selectedCategory='';
      const categoriesArr=['Painting','Drawing','Photography','Performance','Music'];
      categoriesArr.forEach(el=>{
        selectedCategory= el===selectedProduct.category ? 'selected':'';
        categoryOptions+=`<option value="${el}" ${selectedCategory}>${el}</option>`;
      })

      res.render('products/edit',{selectedProduct,availabilityOptions,categoryOptions});
    })
    .catch(err=>next(err))
}); 

router.post('/edit/:id/product',uploadCloud.array('images'),(req,res,next)=>{
  const {name,price,availability,category,description}=req.body;
  const images=req.files.map(file=>file.path);
  let editedProduct;
  if(images.length===0)
  editedProduct={name,price,availability,category,description}
  else
  editedProduct={name,price,availability,category,description,images}
  

  Product.findByIdAndUpdate(req.params.id,editedProduct,{new:true})
  .then(foundProduct=>{
    const price= new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(foundProduct.price);
    res.render('products/show',{foundProduct,price})
    })
    .catch(err=>{
      if(err instanceof mongoose.Error.ValidationError){
        res.status(500).render('products/edit',{selectedProduct:editedProduct},{
          errorMessage: err.message});
      }else{
        next(err);
      }
    })
});

router.get('/show/:id/product',(req,res,next)=>{
  Product.findById(req.params.id).populate('owner')
    .then(foundProduct=>{
      const price= new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(foundProduct.price);
      res.render('products/show',{foundProduct,price})

    })
    .catch((err) => next(err));
});

router.get("/add/product", (req, res, next) => {
  res.render("products/add");
});

router.post("/add/product", uploadCloud.array("images"), (req, res, next) => {
  //console.log(req.body)

  const {name,price,availability,category,description}=req.body;
  const images=req.files.map(file=>file.path);
  const owner=req.session.passport.user //get and set the owner's id
  

  Product.create({name,price,availability,category,description,images,owner})
    .then(()=>{
      //res.render('products/show',{foundProduct={name,price,availability,description,category,owner}})
      console.log('product added');
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

router.post('/delete/:id/product',(req,res,next)=>{
  Product.findByIdAndDelete(req.params.id)
   .then(()=>{
     //res.render() //redirect to artist profile
     console.log('product deleted');
   })
})

module.exports =router;
