const mongoose = require('mongoose');
const productSchema  = new mongoose.Schema({
  name : {
    type : String,
    required :[true,"Please Enter Product Name"],
  },
  description : {
    type : String,
    require : [true,"Please Enter Product Description"]
  },
  category : {
    type : String,
    require : [true,"Please Enter Product Category"]
  },
  tags : {
    type : String,
    require : [true,"Please Enter Product Tags"]
  },
originalPrice : {
    type : Number,
  },
  discountPrice : {
    type : Number,
  },
  stock : {
    type : Number,
    required : [true,"Please Enter Product Stock"],
    maxLength : [5,"Stock cannot exceed 5 characters"]
  },
  images : [
    {
      type : String,
    }
  ],
  shopId : {
    type : String,
    required : [true,"Please Enter Product Shop Id"]
  },
  reviews: [
    {
     user : {
      type : Object
     },
     rating : {
      type  :Number
     },
     message : {
      type  :String
     },
     productId : {
      type : String
     },
     createdAt : {
      type : Date,
      default : Date.now()
     }
    }
  ],
  ratings : {
    type : Number
  },
  shop : {
    type : Object,
    required : [true,"Please Enter Product Shop Details"]
  },
  sold_out : {
    type :Number,
    default : 0,
  },
  createdAt : {
    type : Date,
    default : Date.now(),
  }
})


module.exports = mongoose.model("Product",productSchema);
