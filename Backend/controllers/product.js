const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload, cloudinary, uploadMultiple } = require("../cloudinary");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const {
  isSellerAuthenticated,
  isAuthenticated,
  isAdmin,
} = require("../middleware/auth");
const Order = require("../model/order");
router.post(
  "/create-product",
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
        const productData = {
          ...req.body,
          images,
          shop
        }
        const product = await Product.create(productData);
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.response.data.message));
    }
  }),
);

router.get(
  "/get-all-products/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }),
);

router.get(
  "/getallproducts",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({});

      res.status(200).json({
        success: true,
        products,
        message: "Products are fetched successfully",
      });
    } catch (error) {
      return next(new ErrorHandler("Someting went wrong", 500));
    }
  }),
);

router.delete(
  "/delete-product/:id",
  isSellerAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productData = await Product.findById(req.params.id);
      if (!productData) {
        return next(new ErrorHandler("Product Not Found", 400));
      }
      for (const image of productData.images) {
        if(image.public_id){
        await cloudinary.uploader.destroy(image.public_id);
        }
      }
      const product = await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { user, rating, message, productId, orderId } = req.body;
    console.log(productId);
    console.log("Received productId:", productId);
    const product = await Product.findById(productId);
    console.log("Found product:", productId);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    const review = { user, rating, message, productId };

    const isReviewed = product.reviews.find(
      (rev) => rev.user._id === req.user._id,
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user?._id === req.user._id) {
          rev.rating = rating;
          rev.message = message;
          rev.user = user;
        }
      });
    } else {
      product.reviews.push(review);
    }

    product.ratings =
      product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    // Update order cart item
    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true },
    );

    res.status(200).json({
      success: true,
      message: "Reviewed successfully!",
    });
  }),
);

router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);
module.exports = router;
