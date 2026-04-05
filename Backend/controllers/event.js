const express = require("express");
const router = express.Router();

const Event = require("../model/event");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const { upload, cloudinary, uploadMultiple } = require("../cloudinary");
const {
  isSellerAuthenticated,
  isAdmin,
  isAuthenticated,
} = require("../middleware/auth");
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
        let images = [];
        const results = await uploadMultiple(req.files,"ecommerce_uploads");
        images = results.map((result)=>{
          return {
            public_id : result.public_id,
            url : result.secure_url
          }
        })
        const eventData = {
          ...req.body,
          images,
          shop
        };
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

router.get(
  "/getallevents",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to Fetched All Events", 500));
    }
  }),
);
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

router.delete(
  "/delete-event/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const eventData = await Event.findById(productId);
      if (!eventData) {
        return next(new ErrorHandler("Event is not found", 500));
      }
      for (const  image of eventData.images) {
        if(image.public_id){
          await cloudinary.uploader.destroy(image.public_id);
        }
      }
      const event = await Event.findByIdAndDelete(productId);
      res.status(200).json({
        message: "Event is deleted SuccessFully",
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);
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
  }),
);

module.exports = router;
