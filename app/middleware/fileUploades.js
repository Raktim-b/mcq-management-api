const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Rbac",
    allowed_formats: ["jpg", "png", "jpeg","avif"],
  },
});
const UserImage = multer({ storage: storage });
module.exports = UserImage;
