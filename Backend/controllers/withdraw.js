const WithDraw = require("../model/withdraw");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const {
  isSellerAuthenticated,
  isAuthenticated,
  isAdmin,
} = require("../middleware/auth");
const sendMail = require("../utils/sendMail");
const router = express.Router();

router.post(
  "/create-withdraw-request",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;
      const data = {
        seller: req.seller,
        amount,
      };

      await  sendMail({
        email: req.seller.email,
        subject: "Withdraw Request Received",
        message: `hello ${req.seller.name}, Your withdraw request of amount ${amount} has been received and is being processed. We will notify you once the request is completed.`,
      });
      const withdraw = await WithDraw.create(data);

      const shop = await Shop.findById(req.seller._id);
      shop.availableBalance = shop.availableBalance - amount;
      await shop.save();
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);


router.get('/get-all-withdraw-request',isAuthenticated,isAdmin("Admin"),catchAsyncErrors(async (req,res,next) => {
  try {
    const withdraws = await WithDraw.find({}).sort({
      createdAt : -1
    })
    res.status(201).json({
      success : true,
      withdraws,
      message : "All Withdraw Requests Fetched Successfully"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}))

router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await WithDraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transection = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transections = [...seller.transections, transection];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
