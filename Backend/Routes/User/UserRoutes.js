// **********************User***********************

const express = require("express");

// Router Import
const router = express.Router();

// Controller Imports
const {
  createUserAccount,
  updateUserAccount,
  viewUserProfile,
  deleteUserAccount,
  logUserIn,
  updateUserPassword,
  followOtherUsers,
  protect,
} = require("../../Controllers/UserControllers/UserAuthController");

//  Account Creation
router.post("/", createUserAccount);

// Account Updation
router.patch("/", protect, updateUserAccount);

// View Profile
router.get("/", protect, viewUserProfile);

// Account Deletion
router.delete("/", protect, deleteUserAccount);

// Login User Account
router.post("/login", logUserIn);

// Update User Account Password
router.patch("/password", protect, updateUserPassword);

// Follow other users
router.post("/follow", protect, followOtherUsers);

module.exports = router;
