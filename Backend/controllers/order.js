const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const { isAuthenticated, isSellerAuthenticated, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cartItems, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      // group cart items by shopID

      const ShopItemsMap = new Map();
      for (const item of cartItems) {
        const shopId = item.shopId;
        if (!ShopItemsMap.has(shopId)) {
          ShopItemsMap.set(shopId, []);
        }
        ShopItemsMap.get(shopId).push(item);
      }

      // create an order for each item

      const orders = [];
      for (const [shopId, items] of ShopItemsMap) {
        const order = await Order.create({ cart: items,shippingAddress,user,totalPrice,paymentInfo});
        orders.push(order);
      }
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);
router.get('/get-all-orders/:userId',catchAsyncErrors(async (req,res,next) => {
  try {
    const id  = req.params.userId;
    const orders = await Order.find({"user._id" : id}).sort({
      createdAt : -1
    });
    res.status(201).json({
      success : true,
      orders,
      message : "All Orders Fetched Successfully"
    })
  } catch (error) {
    next(new ErrorHandler(error.message,500));
  }
}))


router.get('/get-all-shop-orders/:shopId',catchAsyncErrors(async (req,res,next) => {
  try {
    const id = req.params.shopId;
    const Allorders = await Order.find({"cart.shopId" :id}).sort({
      createdAt : -1
    })

    res.status(201).json({
      success : true,
      message : "All Seller Orders Fetched SuccessFully",
      Allorders
    })
  } catch (error) {
    return next(new ErrorHandler(error.message ,500));
  }
}))



router.put('/update-order-status/:id',isSellerAuthenticated,catchAsyncErrors(async (req,res,next) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order){
      return next(new ErrorHandler("Order does Not Found",500))
    }
    if(req.body.status === "Transform to Deleivery Partner"){
      order.cart.forEach(async(o)=>{
        await updateOrder(o._id,o.qty)
      })
    }
    
    order.status = req.body.status;
    if(req.body.status === "Delivered"){
      order.deliveredAt = Date.now();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1;
      await UpdateSellerInfo(order.totalPrice - serviceCharge);
    }

    await order.save({validateBeforeSave : false})

    res.status(200).json({
      success : true,
      order
    })
    async function updateOrder(id,qty){
      const product = await Product.findById(id);
      product.stock-=qty;
      product.sold_out+=qty; 

    await product.save({validateBeforeSave : false})
    }
    async function UpdateSellerInfo(amount){
      const shop = await Shop.findById(req.seller._id);
      shop.availableBalance+=amount;
      await shop.save({validateBeforeSave : false})
    }
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
}))

router.put('/refund-Status/:id',catchAsyncErrors(async (req,res,next) => {
  try {
    const order = await Order.findById(req.params.id);
    if(!order){
      return next(new ErrorHandler("Order Not Found",500));
    }
    order.status = req.body.status;

    await order.save();
    res.status(200).json({
      success : true,
      message : "Order Refund Request Successfully"
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500))
  }
}))

router.put('/refund-order-success/:id',isSellerAuthenticated,catchAsyncErrors(async (req,res,next) => {
  try {
    const order = await Order.findById(req.parma.id);
    if(!order){
      return next(new ErrorHandler("Order Not Found",500));
    }
    order.status = req.body.status;

    await order.save();

    res.status(200).json({
      succes : true,
      message :" Order Refunded SuccessFully"
    })
    if(req.body.status === "Refund Success"){
      order.cart.forEach(async(o)=>{
        await updateOrder(o._id,o.qty);
    })
    }
     async function updateOrder(id,qty){
      const product = await Product.findById(id);
      product.stock+=qty;
      product.sold_out-=qty; 

    await product.save({validateBeforeSave : false})
    }
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
}))

router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
