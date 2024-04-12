// **********************User***********************

const express = require("express");

// Router Import
const router = express.Router();
// for image upload
const multer = require("multer");
const path = require("path");

// Controller Imports
const {
  protect,
} = require("../../Controllers/UserControllers/UserAuthController");
const {
  updateUserProfile,
  viewUserProfile,
  updateUserProfileImage,
  searchUserProfile,
} = require("../../Controllers/UserControllers/UserProfileController");

// Account Updation
router.patch("/", protect, updateUserProfile);

// this is common route for user as well as startup
router.post("/search", protect, searchUserProfile);

// View Profile
router.get("/", protect, viewUserProfile);

// Profile Photo Updation
//************** */ Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data/users/profileImages");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
// Route to handle image upload
router.patch(
  "/uploadphoto",
  upload.single("profileImage"),
  protect,
  updateUserProfileImage
);
module.exports = router;
