const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload single file
const uploadSingle = (file, folder = "ecommerce_uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

// Helper function to upload multiple files
const uploadMultiple = (files, folder = "ecommerce_uploads") => {
  return Promise.all(files.map(file => uploadSingle(file, folder)));
};

module.exports = { upload, uploadSingle, uploadMultiple, cloudinary };