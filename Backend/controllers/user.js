const express = require("express");
const path = require("path");
const User = require("../model/user.js");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { upload } = require("../multer.js");
const sendMail = require("../utils/sendMail.js");
const sendToken = require("../middleware/jwtToken.js");
const { isAuthenticated, isAdmin } = require("../middleware/auth.js");
const router = express.Router();

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
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
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your acccount",
        message: `hello ${user.name}, Please click on link to activate your account : ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      console.log("Activation token:", activation_token);

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );

      console.log("Decoded token:", newUser);

      const { name, email, password, avatar } = newUser;

      console.log("Fields:", { name, email, password, avatar });

      let user = await User.findOne({ email });
      console.log("Existing user:", user);

      if (user) {
        return next(new ErrorHandler("User Already exists", 500));
      }

      // This is where the error happens
      user = await User.create({
        name,
        email,
        password,
        avatar,
      });

      console.log("User created:", user);

      sendToken(user, 201, res);
    } catch (error) {
      console.log("Activation error:", error);
    }
  }),
);

router.post(
  "/login",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  }),
);

router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User does not Found", 400));
      }
      res.status(200).json({
        success: true,
        message: "Home Page",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        message: "Logged Out Successfully",
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return next(new ErrorHandler("User Not Found", 400));

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return next(new ErrorHandler("Please provide correct password", 400));

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  }),
);

router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const ExistingUser = await User.findById(req.user._id);
      const ExistingUserAvatarPath = `uploads/${ExistingUser.avatar}`;
      fs.unlinkSync(ExistingUserAvatarPath);

      const fileUrl = path.join(req.file.filename);
      const user = await User.findByIdAndUpdate(req.user._id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error.message)
      return next(new ErrorHandler("Failed to Update the avatar", 500));
    }
  }),
);


router.put('/update-user-address',isAuthenticated, catchAsyncErrors(async (req,res,next) => {
  try {
    const user = await User.findById(req.user._id);
    const sameAddressType = user.addresses.find(address=>address.addressType === req.body.addressType);
    if(sameAddressType){
      return next(new ErrorHandler(`${req.body.addressType} are Already Exists`))
    }
    const existsAddress =user.addresses.find(address=>address._id === req.body._id);
    if(existsAddress){
      Object.assign(existsAddress,req.body);
    }
    else {
      // add the new addresses in array
     user.addresses.push(req.body);
    }
    await user.save();
    res.status(200).json({
      success : true,
      user
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to Update the Addresses", 500));
  }
}))


router.delete('/delete-user-address/:id',isAuthenticated,catchAsyncErrors(async (req,res,next) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user){
      return next(new ErrorHandler("User not Found",400));
    };
    const addressId = req.params.id;

    user.addresses = user.addresses.filter((address)=>{
      return address._id.toString() !== addressId;
    })
     
    await user.save();
  res.status(200).json({
    success : true,
    message : "User Address Deleted Successfully"
  })
  } catch (error) {
    next(new ErrorHandler("Somthing Went Wrong", 500));
  }
}))


router.put('/update-user-password',isAuthenticated, catchAsyncErrors(async (req,res,next) => {
  try {
    const user = await User.findById(req.user._id);
    const {OldPassword,NewPassword,ConfirmPassword} = req.body;
    const OldPasswordValid = user.comparePassword(OldPassword);
    if(!OldPasswordValid){
      return next(new ErrorHandler("Password Is Not Valid",500));
    }

    if(NewPassword !== ConfirmPassword){
      return next(new ErrorHandler("Password is not Matched",400));
    }
    user.password = NewPassword;
    await user.save();
    res.status(200).json({
      success : true,
      message : "Password Updated SuccessFully"
    })
  } catch (error) {
    return next(new ErrorHandler("Somthing went Wrong",400)); 
  }
}))


router.get('/get-all-user-info/:id',catchAsyncErrors(async (req,res,next) => {

  try {
    const user =await User.findById(req.params.id);
    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500))
  }
}))


router.get('/admin-all-users',isAuthenticated,isAdmin("Admin"),catchAsyncErrors(async (req,res,next) => {
  try {
    const users = await User.find({}).sort({
      createdAt : -1
    })

    res.status(201).json({
      success : true,
      users
    })
  } catch (error) {
    return next(new ErrorHandler(error.message,500));
  }
}))

router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      // const imageId = user.avatar.public_id;

      // await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
