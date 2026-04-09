// const express = require("express");
// const User = require("../model/user.js");
// const jwt = require("jsonwebtoken");
// const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
// const ErrorHandler = require("../utils/ErrorHandler.js");
// const { upload, cloudinary } = require("../cloudinary.js");
// const sendMail = require("../utils/sendMail.js");
// const sendToken = require("../middleware/jwtToken.js");
// const { isAuthenticated, isAdmin } = require("../middleware/auth.js");
// const router = express.Router();

// // create activation token
// const createActivationToken = (user) => {
//   return jwt.sign(user, process.env.ACTIVATION_SECRET, {
//     expiresIn: "5m",
//   });
// };

// router.post("/create-user", upload.single("file"), async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     const userEmail = await User.findOne({ email });
//     if (userEmail) {
//       return next(new ErrorHandler("User already exists", 400));
//     }
//     const fileUrl = req.file.path; // Cloudinary URL
//     const user = {
//       name: name,
//       email: email,
//       password: password,
//       avatar: fileUrl,
//     };
//     const activationToken = createActivationToken(user);
//     const frontendUrl =
//       process.env.FRONTEND_URL ||
//       "https://multi-vendor-e-commerce-zrmx.vercel.app";
//     const activationUrl = `${frontendUrl}/activation/${activationToken}`;

//     try {
//       await sendMail({
//         email: user.email,
//         subject: "Activate your acccount",
//         message: `hello ${user.name}, Please click on link to activate your account : ${activationUrl}`,
//       });
//       res.status(201).json({
//         success: true,
//         message: `please check your email:- ${user.email} to activate your account!`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// });

// router.post(
//   "/activation",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { activation_token } = req.body;

//       console.log("Activation token:", activation_token);

//       const newUser = jwt.verify(
//         activation_token,
//         process.env.ACTIVATION_SECRET,
//       );

//       console.log("Decoded token:", newUser);

//       const { name, email, password, avatar } = newUser;

//       console.log("Fields:", { name, email, password, avatar });

//       let user = await User.findOne({ email });
//       console.log("Existing user:", user);

//       if (user) {
//         return next(new ErrorHandler("User Already exists", 500));
//       }

//       // This is where the error happens
//       user = await User.create({
//         name,
//         email,
//         password,
//         avatar,
//       });

//       console.log("User created:", user);

//       sendToken(user, 201, res);
//     } catch (error) {
//       console.log("Activation error:", error);
//     }
//   }),
// );

// router.post(
//   "/login",
//   catchAsyncErrors(async (req, res, next) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return next(new ErrorHandler("Please provide all fields", 400));
//     }

//     const user = await User.findOne({ email }).select("+password");

//     if (!user) {
//       return next(new ErrorHandler("Invalid email or password", 401));
//     }

//     const isValidPassword = await user.comparePassword(password);

//     if (!isValidPassword) {
//       return next(new ErrorHandler("Invalid email or password", 401));
//     }

//     sendToken(user, 200, res);
//   }),
// );

// router.get(
//   "/getuser",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const user = await User.findById(req.user.id);
//       if (!user) {
//         return next(new ErrorHandler("User does not Found", 400));
//       }
//       res.status(200).json({
//         success: true,
//         message: "Home Page",
//         user,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }),
// );

// router.get(
//   "/logout",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const isProduction = process.env.NODE_ENV === "production";
//       res.clearCookie("token", {
//         expires: new Date(Date.now()),
//         httpOnly: true,
//         secure: isProduction,
//         sameSite: isProduction ? "none" : "lax",
//       });

//       res.status(200).json({
//         message: "Logged Out Successfully",
//         success: true,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }),
// );

// router.put(
//   "/update-user-info",
//   isAuthenticated,
//   catchAsyncErrors(async (req, res, next) => {
//     const { email, password, phoneNumber, name } = req.body;

//     const user = await User.findById(req.user._id).select("+password");
//     if (!user) return next(new ErrorHandler("User Not Found", 400));

//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid)
//       return next(new ErrorHandler("Please provide correct password", 400));

//     user.name = name;
//     user.email = email;
//     user.phoneNumber = phoneNumber;

//     await user.save();

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   }),
// );

// router.put(
//   "/update-avatar",
//   isAuthenticated,
//   upload.single("image"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const fileUrl = req.file.path; // Cloudinary URL
//       const user = await User.findByIdAndUpdate(req.user._id, {
//         avatar: fileUrl,
//       });

//       res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       console.log(error.message);
//       return next(new ErrorHandler("Failed to Update the avatar", 500));
//     }
//   }),
// );
// router.get(
//   "/get-all-user-info/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const user = await User.findById(req.params.id);
//       res.status(201).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   }),
// );
// module.exports = router;
const express = require("express");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { upload, uploadSingle, cloudinary } = require("../cloudinary.js");
const sendMail = require("../utils/sendMail.js");
const sendToken = require("../middleware/jwtToken.js");
const { isAuthenticated, isAdmin } = require("../middleware/auth.js");

const router = express.Router();

// ================= CREATE ACTIVATION TOKEN =================
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// ================= CREATE USER =================
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    let avatarData = {};

    if (req.file) {
      const result = await uploadSingle(req.file, "users");

      avatarData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const user = {
      name,
      email,
      password,
      avatar: avatarData,
    };

    const activationToken = createActivationToken(user);

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://multi-vendor-e-commerce-zrmx.vercel.app";

    const activationUrl = `${frontendUrl}/activation/${activationToken}`;

    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.name}, click to activate: ${activationUrl}`,
    });

    res.status(201).json({
      success: true,
      message: `Check your email: ${user.email}`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// ================= ACTIVATE USER =================
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
        avatar,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// ================= LOGIN =================
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

// ================= GET USER =================
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  }),
);

// ================= LOGOUT =================
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully!",
    });
  }),
);

// ================= UPDATE USER INFO =================
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) return next(new ErrorHandler("User not found", 400));

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return next(new ErrorHandler("Wrong password", 400));
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({ success: true, user });
  }),
);

// ================= UPDATE AVATAR =================
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      // delete old image
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const result = await uploadSingle(req.file, "users");

      user.avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler("Avatar update failed", 500));
    }
  }),
);

// ================= DELETE USER =================
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    // delete image from cloudinary
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  }),
);
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find({}).sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400),
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
  }),
);

router.put(
  "/update-user-address",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      const sameAddressType = user.addresses.find(
        (address) => address.addressType === req.body.addressType,
      );
      if (sameAddressType) {
        return next(
          new ErrorHandler(`${req.body.addressType} are Already Exists`),
        );
      }
      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id,
      );
      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new addresses in array
        user.addresses.push(req.body);
      }
      await user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler("Failed to Update the Addresses", 500));
    }
  }),
);

router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      const { OldPassword, NewPassword, ConfirmPassword } = req.body;
      const OldPasswordValid = user.comparePassword(OldPassword);
      if (!OldPasswordValid) {
        return next(new ErrorHandler("Password Is Not Valid", 500));
      }

      if (NewPassword !== ConfirmPassword) {
        return next(new ErrorHandler("Password is not Matched", 400));
      }
      user.password = NewPassword;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password Updated SuccessFully",
      });
    } catch (error) {
      return next(new ErrorHandler("Somthing went Wrong", 400));
    }
  }),
);

router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("User not Found", 400));
      }
      const addressId = req.params.id;

      user.addresses = user.addresses.filter((address) => {
        return address._id.toString() !== addressId;
      });

      await user.save();
      res.status(200).json({
        success: true,
        message: "User Address Deleted Successfully",
      });
    } catch (error) {
      next(new ErrorHandler("Somthing Went Wrong", 500));
    }
  }),
);
module.exports = router;
