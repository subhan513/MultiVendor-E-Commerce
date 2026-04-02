const mongoose = require("mongoose")

const couponCodeSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true,"Please Enter yout CouponCode name"],
    unique : true
  },
  value : {
    type : Number,
    required : true
  },
  MinAmount : {
    type : Number
  },
  
  MaxAmount : {
    type : Number
  },
  shop : {
    type : Object,
    required : true
  },
  SelectedProducts : {
    type : String,
  },
  createdAt : {
    type : Date,
    default : Date.now(),
  }
})


module.exports = mongoose.model('CouponCode',couponCodeSchema);
