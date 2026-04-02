const express = require('express');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const {isSellerAuthenticated} = require('../middleware/auth');
const CouponCode = require('../model/couponCode');
const router = express.Router();
const ErrorHandler = require('../utils/ErrorHandler');


router.post('/create-coupon-code',
  isSellerAuthenticated,
  catchAsyncErrors(async (req,res,next) => {
  try {
    const isCouponExists = await CouponCode.findOne({name : req.body.name});
    if(isCouponExists){
      return next(new ErrorHandler("Coupon Code Already Exists",400))
    }
    const couponCode = await CouponCode.create(req.body);
    res.status(201).json({
      success : true,
      couponCode,
    })
  } catch (error) {
    return next(new ErrorHandler(error,400));
  }
}))


router.get(
  "/get-all-coupons/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCodes = await CouponCode.find({
        "shop._id": req.params.id,
      });

      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler("Something Went Wrong", 500));
    }
  })
);

router.delete('/delete-coupon/:id',isSellerAuthenticated,catchAsyncErrors(async (req,res,next) => {
  try {
    await CouponCode.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message : "Coupon Code is Deleted SuccessFully"
    })
  } catch (error) {
    return next(new ErroHandler("SomeThing went Wrong", 500));
  }
}))



router.get(
  "/get-coupon-value/:name",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
module.exports=router;