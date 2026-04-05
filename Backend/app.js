const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Controllers
const user = require("./controllers/user.js");
const shop = require("./controllers/shop.js");
const product = require("./controllers/product.js");
const event = require("./controllers/event.js");
const couponCode = require("./controllers/couponCode.js");
const payment = require("./controllers/payment.js");
const order = require("./controllers/order.js");
const conversation = require("./controllers/conversation.js");
const message = require("./controllers/messages.js");
const withdraw = require("./controllers/withdraw.js");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
  origin: "https://multi-vendor-e-commerce-zrmx.vercel.app",
  credentials: true
}));

// API routes
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/message", message);
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", couponCode);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/withdraw", withdraw);

// Default route
app.get("/test", (req, res) => {
  res.send("Welcome to the Multi Vendor E-Commerce API");
});

module.exports = app;
