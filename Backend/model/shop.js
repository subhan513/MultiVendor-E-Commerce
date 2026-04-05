const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const shopSchema = new mongoose.Schema({
  name : {
    type : String,
    required  : [true,"Please Enter Your Shop Name"]
  },
  email : {
    type : String,
    required : [true,"Please Enter Your Email Address"]
  },
  password :{
    type : String,
    required : [true, "Please  Enter Your correct password"],
    minLength : [6,"Password must be greater than the 6 characters"],
    select : false
  },
  description : {
    type : String,
  },
  address :{
    type : String,
    required : true,
  },
  phoneNumber :  {
    type : Number,
    required : true
  },
  role : {
    type : String,
    default : "seller"
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  zipCode : {
    type : Number,
    required : true,
  },
  withDrawMethod: {
    type : Object
  },
  availableBalance : {
    type : Number,
    default : 0,
  },
  transections : [
    {
  amount :{
    type : Number,
    required : true,
  },
  status : {
    type : String,
    required : true,
    default : "Processing"
  },
  createdAt : {
    type : Date,
    default : Date.now()
  },
  updatedAt : {
    type : Date,
  }
    }
  ],
  createdAt : {
    type : Date,
    default : Date.now()
  },
    resetPasswordToken : String,
    resetPasswordTime : Date,
})



shopSchema.pre("save", async function(){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
  }
});
shopSchema.methods.getJwTToken = function() {
  return jwt.sign({id : this._id},process.env.JWT_SECRET_KEY,{
    expiresIn : process.env.JWT_EXPIRES
  })  
};

// compare password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword,this.password);
}

module.exports = mongoose.model('Shop',shopSchema);