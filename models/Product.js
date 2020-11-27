const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
 
  name: {
    type: String,
    required: [true, 'Name is required!']
  },
  //ask about:
  price: {
    type: Number    
  },

  availability: {
    type: String,
    enum: ['available', 'currently unavailable'],
    required: [true, 'Availability info is required!']
  },

  images: [String],
    
  description: {
    type: String,
    required: [true, 'Description is required!']
  },
  owner: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Artist' 
  }],

  category: {
    type: String,
    enum: [
      'Painting', 
      'Drawing', 
      'Photography', 
      'Performance', 
      'Music']
  }

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

