const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Create Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce_uploads", // optional folder name
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    resource_type: "auto",
  },
});

// Create upload middleware
exports.upload = multer({ storage: storage });

// Export cloudinary for direct uploads
exports.cloudinary = cloudinary;
