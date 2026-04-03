const express = require("express");
const path   = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sendMail  = require('../utils/sendMail');
const ShopToken = require('../middleware/sendToken.js');
const {isAuthenticated, isSellerAuthenticated, isAdmin} = require('../middleware/auth');
const  {upload} = require('../multer');
const Shop  = require('../model/shop')
const catchAsyncErrors  = require('../middleware/catchAsyncErrors');
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require('fs');



const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};
router.post('/shop-create', upload.single('avatar'), async (req,res,next) => {
  console.log("FILE:", req.file.filename);
  try {
    const {email} = req.body;
    const SellerEmail = await Shop.findOne({email});
    if(SellerEmail){
      const filename = req.file.filename;
      const filepath = `uploads/${filename}`;
      fs.unlink(filepath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "file deleted failed" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const seller = {
      name : req.body.name,
      email : req.body.email,
      password : req.body.password,
      avatar : fileUrl,
      address : req.body.address,
      phoneNumber : req.body.phoneNumber,
      zipCode : req.body.zipCode
    };

    const activationtoken = createActivationToken(seller)

    const activationUrl = `https://multi-vendor-e-commerce-zrmx.vercel.app/seller/activation/${activationtoken}`;
 try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `hello ${seller.name}, Please click on link to activate your Shop : ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${seller.email} to activate your Shop Account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

  } catch (error) {
    return next(new ErrorHandler(error.message ,400)); 
  }
  
})


router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newSeller) {
        return next(new ErrorHandler("invalid Token", 400));
      }
      const { name, email, password, avatar ,zipCode,address,phoneNumber} = newSeller;
      let seller = await Shop.findOne({ email });
      if (seller) {
        return next(new ErrorHandler("Seller Already exists", 500));
      }
      seller = await Shop.create({
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber
      });
      ShopToken(seller, 201, res);
    } catch (error) {
      console.log(error);
    }
  })
);


router.post('/shop-login',async (req,res,next) => {
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return next(new ErrorHandler("Please Provide all the fields", 500))
    }
    const user = await Shop.findOne({email}).select("+password");
    if(!user){
      return next(new ErrorHandler("Shop is not registered with this email",500))
    }
    const isValidPassword = await user.comparePassword(password);
    if(!isValidPassword){
      return next(new ErrorHandler("Password is Not Valid",401))
    }
    ShopToken(user,200,res)
  } catch (error) {
    
  }
});



router.get('/getSeller',isSellerAuthenticated, catchAsyncErrors((async(req,res,next)=>{
  try {
    const seller = await Shop.findById(req.seller._id);
    if(!seller){
      return next(new ErrorHandler("User does not Found",400))
    }
    res.status(200).json({
      success : true,
      message : "Home Page",
      seller
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500))
  }
})))


router.get(
  "/shop-logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.clearCookie("seller_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        success: true,
        message: "Logout Successfully",
      });

    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




router.get('/get-shop-info/:id',catchAsyncErrors(async (req,res,next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(200).json({
      success : true,
      shop
    })
  } catch (error) {
    return next(new ErrorHandler("Somthing Went Wrong", 500));
  }
}))

// Update Shop Profile image

router.put('/update-shop-profile',isSellerAuthenticated,
  upload.single("image")
  ,catchAsyncErrors(async (req,res,next) => {
  try {
    const existingShop = await Shop.findById(req.seller._id);
    if(!existingShop){
      return next(new ErrorHandler("Shop Not found",400));
    }
    const ExistingAvatarPath = `uploads/${existingShop.avatar}`;
    fs.unlinkSync(ExistingAvatarPath);
    const fileUrl = path.join(req.file.filename);
    const shop = await Shop.findByIdAndUpdate(req.seller._id,{
      avatar : fileUrl
    },{ new: true })
    res.status(200).json({
      success : true,
      shop,
      message : "Shop Profile Updated SuccessFully"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
}))

router.put(
  "/update-seller-info",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


router.get('/getAllsellers',isAuthenticated,isAdmin("Admin"),catchAsyncErrors(async (req,res,next) => {
  try {
    const sellers = await Shop.find({}).sort({
      createdAt : -1
    })
      res.status(201).json({
        success: true,
        sellers,
      });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

router.delete('/delete-seller/:id',isAuthenticated,isAdmin("Admin"),catchAsyncErrors(async (req,res,next) => {
  try {

    await Shop.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success : true,
      message : "Shop is deleted SuccessFully"
    })
  } catch (error) {
    return next(new Errorhandler(error.message,500))
  }
}))


//  Update Seller Withdraw Methods  -- sellers

router.put('/update-payment-methods',isSellerAuthenticated,catchAsyncErrors(async (req,res,next) => {
  try {
    const {withDrawMethod} = req.body;
    const seller = await Shop.findByIdAndUpdate(req.seller._id,{
      withDrawMethod
    });
    res.status(201).json({
      success : true,
      seller,
      message : "WithDraw Method Added Successfully"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
}))
router.delete('/delete-withdraw-method',isSellerAuthenticated,catchAsyncErrors(async (req,res,next) => {
  try {
    const seller = await Shop.findById(req.seller._id);
    seller.withDrawMethod = null;
    await seller.save();
    res.status(201).json({
      success : true,
      message : "WithDraw Method Deleted Successfully"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
}))
module.exports = router;