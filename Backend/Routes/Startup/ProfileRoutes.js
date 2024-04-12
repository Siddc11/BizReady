const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  protect,
} = require("../../Controllers/UserControllers/UserAuthController");
const {
  updateStartupProfile,
  viewStartupProfile,
  deleteStartupProfile,
  searchStartupProfiles,
} = require("../../Controllers/StartupControllers/StartupProfileController");

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data/startup-profiles/logo");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// View Startup Profile by ID
router.get("/", protect, viewStartupProfile);

//Create or Update Startup Profile by ID
router.patch("/", protect, updateStartupProfile);

// Delete Startup Profile by ID
// router.delete("/", protect, deleteStartupProfile);

// Search Startup Profiles
// router.get("/search", searchStartupProfiles);

// Update Profile Logo by ID
// router.patch("/logo", protect, upload.single("profileLogo"), updateProfileLogo);

module.exports = router;
