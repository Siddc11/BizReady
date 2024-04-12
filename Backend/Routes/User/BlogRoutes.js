const express = require("express");

// Router Import
const router = express.Router();

// Controller Imports
const {
  protect,
} = require("../../Controllers/UserControllers/UserAuthController");

// Controller Import for blog operations
const {
  createBlogPost,
  viewBlogPost,
  viewAllMyBlogPosts,
  deleteBlogPost,
  updateBlogPost,
  getFeed,
  likeBlogPost,
  commentOnBlogPost,
} = require("../../Controllers/UserControllers/BlogController");

// Get Relevent Feed
router.get("/feed", protect, getFeed);

//  Create A Blog Post
router.post("/", protect, createBlogPost);

// View All Blog Posts
router.get("/all", protect, viewAllMyBlogPosts);

// View Blog Post By ID
router.get("/:id", protect, viewBlogPost);

// Update
router.patch("/:id", protect, updateBlogPost);

// Delete
router.delete("/:id", protect, deleteBlogPost);

// like on blog post
router.post("/like", protect, likeBlogPost);

//comment on blog post
router.post("/comment", protect, commentOnBlogPost);

module.exports = router;
