const express = require("express");
const router = express.Router();

const Event = require("../model/event");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const {isSellerAuthenticated, isAdmin, isAuthenticated} = require('../middleware/auth')
const fs = require('fs');
const ErrorHandler = require("../utils/ErrorHandler");
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Not Found", 400));
      } else {
        const images = req.files.map((file) => `${file.filename}`);
        const eventData = req.body;
        eventData.images = images;
        eventData.shop = shop;
        const event = await Event.create(eventData);
        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler("Something went Wrong", 500));
    }
  }),
);


router.get('/getallevents',catchAsyncErrors(async (req,res,next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success : true,
      events
    })
  } catch (error) {
       return next(new ErrorHandler("Failed to Fetched All Events",500));
    }
}))
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);


router.delete('/delete-event/:id',isSellerAuthenticated, catchAsyncErrors(async (req,res,next) => {
  try {

    const productId = req.params.id;
    const eventData = await Event.findById(productId);
    if(!eventData){
      return next(new ErrorHandler("Event is not found" ,500));
    }
    eventData.images.forEach((imageUrl)=>{
      const filename = imageUrl;
      const filepath = `uploads/${filename}`;
      fs.unlink(filepath, (err)=>{
        console.log(err);
        res.status(500).json({message : "Error Deleting File"});
      })
    })
    const event = await Event.findByIdAndDelete(productId);
    res.status(200).json({
      message : "Event is deleted SuccessFully",
      success : true
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500))
  }
}))
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
