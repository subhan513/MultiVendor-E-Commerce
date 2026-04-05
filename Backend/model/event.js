const mongoose = require('mongoose');



const eventSchema  = new mongoose.Schema({
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
  startDate : {
    type : Date,
    require : [true,"Please Enter Product Start Date"]
  },
  endDate : {
    type : Date,
    require : [true,"Please Enter Product End Date"]
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
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  shopId : {
    type : String,
    required : [true,"Please Enter Product Shop Id"]
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
    default : Date.now,
  }
})


module.exports = mongoose.model("Event",eventSchema);
