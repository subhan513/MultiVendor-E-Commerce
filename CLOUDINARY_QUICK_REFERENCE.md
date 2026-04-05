# 🚀 Cloudinary Migration - Quick Reference Guide

## For Future Development

### 📥 Adding New Image Upload Routes

```javascript
// Import from cloudinary.js
const { upload, cloudinary } = require("../cloudinary");

// Single image upload
router.post("/endpoint", upload.single("fieldName"), async (req, res) => {
  const imageUrl = req.file.path;  // Full Cloudinary URL
  // Save imageUrl to database
});

// Multiple images upload
router.post("/endpoint", upload.array("fieldName"), async (req, res) => {
  const imageUrls = req.files.map(file => file.path);  // Array of Cloudinary URLs
  // Save imageUrls to database
});
```

### 📤 Deleting Images

```javascript
// Option 1: Extract public_id from Cloudinary URL
router.delete("/endpoint/:id", async (req, res) => {
  const imageUrl = data.image;  // "https://res.cloudinary.com/.../ecommerce_uploads/file.jpg"
  
  const urlParts = imageUrl.split('/');
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = `ecommerce_uploads/${publicIdWithExtension.split('.')[0]}`;
  
  await cloudinary.uploader.destroy(publicId);
});

// Option 2: Store public_id in database (recommended for future)
// When uploading: const publicId = req.file.public_id;
// When deleting: await cloudinary.uploader.destroy(publicId);
```

### 🔧 Cloudinary Configuration

**File**: `Backend/cloudinary.js`

```javascript
// Current settings:
- Folder: ecommerce_uploads
- Allowed formats: jpg, jpeg, png, gif, webp
- Resource type: auto
- Credentials from: .env file
```

### 📝 Database Schema Notes

**No changes needed!** Just store the full URL:

```javascript
// Before (Multer)
avatar: "1234567890-avatar.jpg"

// After (Cloudinary)
avatar: "https://res.cloudinary.com/dzyofseqw/image/upload/v1234567890/ecommerce_uploads/avatar.jpg"
```

### ⚡ Environment Variables

```bash
# Required in .env
CLOUDINARY_CLOUD_NAME=dzyofseqw
CLOUDINARY_API_KEY=795111452159344
CLOUDINARY_SECRET_KEY=Dibwn919gxCGyLh2AT6hlIszbls
```

### 🎨 Image Transformations (Advanced)

```javascript
// Add URL transformations (optional, for future use):
const imageUrl = req.file.path;

// Resize image
const resizedUrl = imageUrl.replace('/upload/', '/upload/w_300,h_300,c_fill/');

// Add filters
const filteredUrl = imageUrl.replace('/upload/', '/upload/e_grayscale/');

// Multiple transformations
const transformedUrl = imageUrl.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto/');
```

### 🧪 Testing Upload Routes

```bash
# Using curl for testing
curl -X POST http://localhost:8000/api/v2/user/create-user \
  -F "file=@image.jpg" \
  -F "name=John" \
  -F "email=john@example.com" \
  -F "password=password123"

# Expected response:
{
  "success": true,
  "message": "please check your email to activate your account!"
}

# Database will have:
{
  "avatar": "https://res.cloudinary.com/dzyofseqw/image/upload/v1234567890/ecommerce_uploads/abc123.jpg"
}
```

---

## ✅ Checklist When Adding New Features

- [ ] Use `upload.single()` or `upload.array()` from cloudinary
- [ ] Extract URL with `req.file.path` or `req.files.map(f => f.path)`
- [ ] Store full Cloudinary URLs in database
- [ ] For deletion, use `cloudinary.uploader.destroy(publicId)`
- [ ] No need to import `fs` or `path` modules
- [ ] No need for `fs.unlink` or `fs.unlinkSync`
- [ ] Test file upload and display
- [ ] Verify deletion removes from Cloudinary
- [ ] Check Cloudinary dashboard for uploaded files

---

## 🗑️ Cleanup Note

### Files to Remove (Safe to Delete)
```
Backend/multer.js           ← Old multer configuration
Backend/uploads/            ← Old uploads directory
```

### When Safe to Remove
- After testing all upload features
- After confirming Cloudinary is working in production
- After migrating any existing images if needed

---

## 📚 Useful Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Multer Storage Cloudinary**: https://github.com/afzaliwala/multer-storage-cloudinary
- **Node.js Multer**: https://github.com/expressjs/multer

---

## 🔍 Troubleshooting

### Issue: "Cloudinary credentials not found"
**Solution**: Check `.env` file has all three variables:
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_SECRET_KEY

### Issue: "File upload returns null"
**Solution**: Ensure `upload` middleware is applied to route:
```javascript
router.post("/endpoint", upload.single("fieldName"), handler);
```

### Issue: "Cannot read property 'path' of undefined"
**Solution**: Check that file was actually sent:
```javascript
if (!req.file) {
  return res.status(400).json({error: "No file uploaded"});
}
const url = req.file.path;
```

### Issue: "Cannot delete image"
**Solution**: Verify public_id extraction:
```javascript
console.log("Image URL:", imageUrl);
console.log("Public ID:", publicId);
// Then test deletetion with correct public_id
```

---

## 📞 Need Help?

Check these files for reference:
- `Backend/cloudinary.js` - Configuration
- `Backend/controllers/user.js` - Single upload example
- `Backend/controllers/product.js` - Multiple upload example
- `Backend/controllers/product.js` - Delete example

---

**Last Updated**: April 5, 2026  
**Version**: 1.0  
**Status**: Complete ✅
