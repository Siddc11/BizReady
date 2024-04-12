// Model Imports
const Blog = require("../../Models/UserModel/BlogModel");
const Profile = require("../../Models/UserModel/ProfileModel");
const User = require("../../Models/UserModel/UserModel");

// Create A Blog Post
exports.createBlogPost = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, category, content, tags, comments } = req.body;

    // Validate required fields
    if (!title || !category || !content) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "Title, category, and content are required fields.",
      });
    }

    // Use the ObjectId of the authenticated user as the author
    const author = req.user.id; // Assuming userId is the ObjectId of the authenticated user

    // Set publishingTime to current timestamp
    const publishingTime = Date.now();

    // Create a new blog post
    const newBlogPost = await Blog.create({
      title,
      category,
      content,
      tags,
      author,
      comments,
      publishingTime,
    });

    // Return success response
    return res.status(201).json({
      status: "success",
      data: newBlogPost,
      message: "Blog post created successfully!",
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while creating the blog post.",
      error: error.message,
    });
  }
};
// View Blog Post By ID
exports.viewBlogPost = async (req, res) => {
  try {
    // Extract blog ID from request parameters
    const { id } = req.params;
    // If blog post not found, return 404 error
    if (!id) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "Blog id is required",
      });
    }

    // Find the blog post by ID
    const blogPost = await Blog.findById(id).populate("comments.user", "name");

    // If blog post not found, return 404 error
    if (!blogPost) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "Blog post not found.",
      });
    }

    // Return the blog post
    return res.status(200).json({
      status: "success",
      data: blogPost,
      message: "Blog post fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while fetching the blog post.",
      error: error.message,
    });
  }
};

// View All my blog posts
exports.viewAllMyBlogPosts = async (req, res) => {
  try {
    // Extract user ID from request
    const authorId = req.user.id;

    // Find all blog posts authored by the user
    const myBlogPosts = await Blog.find({ author: authorId });

    // Return the blog posts
    return res.status(200).json({
      status: "success",
      data: myBlogPosts,
      message: "My blog posts fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching my blog posts:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while fetching my blog posts.",
      error: error.message,
    });
  }
};

// Update Blog Post By Id
exports.updateBlogPost = async (req, res) => {
  try {
    // Extract blog ID from request parameters
    const { id } = req.params;

    // Check if the blog ID is provided
    if (!id) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "Blog ID is required for updating.",
      });
    }

    // Extract updated data from the request body
    const { title, category, content, tags, comments, publishingTime } =
      req.body;

    // Find the blog post by ID and update it
    const updatedBlogPost = await Blog.findByIdAndUpdate(
      id,
      { title, category, content, tags, comments, publishingTime },
      { new: true, runValidators: true }
    );

    // If blog post not found, return 404 error
    if (!updatedBlogPost) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "Blog post not found.",
      });
    }

    // Return success response
    return res.status(200).json({
      status: "success",
      data: updatedBlogPost,
      message: "Blog post updated successfully!",
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while updating the blog post.",
      error: error.message,
    });
  }
};

// Delete Blog Post By ID
exports.deleteBlogPost = async (req, res) => {
  try {
    // Extract blog ID from request parameters
    const { id } = req.params;

    // Check if the blog ID is provided
    if (!id) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "Blog ID is required for deletion.",
      });
    }

    // Find the blog post by ID and delete it
    const deletedBlogPost = await Blog.findByIdAndDelete(id);

    // If blog post not found, return 404 error
    if (!deletedBlogPost) {
      return res.status(404).json({
        status: "fail",
        data: null,
        message: "Blog post not found.",
      });
    }

    // Return success response
    return res.status(200).json({
      status: "success",
      data: null,
      message: "Blog post deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while deleting the blog post.",
      error: error.message,
    });
  }
};

// Get Feed
exports.getFeed = async (req, res) => {
  try {
    // Extract user ID from request
    const userId = req.user.id;

    // Fetch user's profile to access interests, pastExperiences, and skills
    const userProfile = await Profile.findOne({ user: userId });

    if (userProfile == null) {
      // Find all other blog posts that do not match the above criteria
      const allBlogPosts = await Blog.find().sort({ createdAt: -1 });
      return res.status(200).json({
        status: "success",
        data: allBlogPosts,
        message: "Feed fetched successfully!",
      });
    }

    // Extract user's interests, past experiences, and skills
    const userInterests = userProfile.interests;

    const userPastExperiences = userProfile.pastExperiences.map(
      (exp) => exp.jobTitle
    );
    const userSkills = userProfile.skills;

    // Find relevant blog posts based on user's interests, past experiences, skills, tags, content, and category
    const relevantBlogPosts = await Blog.find({
      $or: [
        { category: { $in: userInterests } },
        { "pastExperiences.jobTitle": { $in: userPastExperiences } },
        { tags: { $in: userSkills } },
        { tags: { $in: userInterests } },
        { content: { $regex: new RegExp(req.query.search, "i") } },
        { title: { $regex: new RegExp(req.query.search, "i") } },
        { category: { $regex: new RegExp(req.query.search, "i") } },
      ],
    }).sort({ createdAt: -1 });

    // Find all other blog posts that do not match the above criteria
    const otherBlogPosts = await Blog.find({
      _id: { $nin: relevantBlogPosts.map((post) => post._id) }, // Exclude relevant blog posts
    }).sort({ createdAt: -1 });

    // Combine relevant and other blog posts into a single feed array
    const feed = [...relevantBlogPosts, ...otherBlogPosts];

    // Fetch user details from the User model
    const user = await User.findById(userId);
    const { email, name, phoneNumber } = user;

    // Map blog posts to include user details
    const feedWithUserDetails = feed.map((post) => ({
      ...post.toObject(),
      author: {
        email,
        name,
        phoneNumber,
      },
    }));

    // Return the feed with user details
    return res.status(200).json({
      status: "success",
      data: feedWithUserDetails,
      message: "Feed fetched successfully!",
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while fetching the feed.",
      error: error.message,
    });
  }
};

exports.likeBlogPost = async (req, res) => {
  try {
    const { post_id, like } = req.body;
    const user_id = req.user.id;

    // Check if post_id and like are provided
    if (!post_id || like === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "Post ID and like value are required.",
      });
    }

    // Find the blog post by ID
    const blogPost = await Blog.findById(post_id);

    // If blog post not found, return 404 error
    if (!blogPost) {
      return res.status(404).json({
        status: "fail",
        message: "Blog post not found.",
      });
    }

    // Check if the user has already liked the post
    const alreadyLiked = blogPost.likedBy.includes(user_id);

    // If like is true and the user hasn't already liked the post, increment likeCount and add user_id to likedBy array
    if (like && !alreadyLiked) {
      blogPost.likeCount++;
      blogPost.likedBy.push(user_id);
    }
    // If like is false and the user has already liked the post, decrement likeCount and remove user_id from likedBy array
    else if (!like && alreadyLiked) {
      blogPost.likeCount--;
      blogPost.likedBy = blogPost.likedBy.filter(
        (id) => id.toString() !== user_id
      );
    }
    // If user tries to like the post again or unlike without having previously liked it, return 400 error
    else {
      return res.status(400).json({
        status: "fail",
        message: "You have already liked this post.",
      });
    }

    // Save the updated blog post
    await blogPost.save();

    // Return success response
    return res.status(200).json({
      status: "success",
      message: like
        ? "Blog post liked successfully!"
        : "Blog post unliked successfully!",
    });
  } catch (error) {
    console.error("Error liking/unliking blog post:", error);
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong while liking/unliking the blog post.",
      error: error.message,
    });
  }
};

exports.commentOnBlogPost = async (req, res) => {
  try {
    // Extract user ID and comment from request
    const { post_id, comment } = req.body;
    const userId = req.user.id;

    // Check if post_id and comment are provided
    if (!post_id || !comment) {
      return res.status(400).json({
        status: "fail",
        message: "Post ID and comment are required fields.",
      });
    }

    // Find the blog post by ID
    const blogPost = await Blog.findById(post_id);

    // If blog post not found, return 404 error
    if (!blogPost) {
      return res.status(404).json({
        status: "fail",
        message: "Blog post not found.",
      });
    }

    // Fetch the user's name from the User model
    const user = await User.findById(userId);
    const userName = user ? user.name : "Unknown"; // If user not found, use 'Unknown'

    // Add the comment to the blog post along with the user's name
    blogPost.comments.push({
      user: userId,
      userName: userName,
      content: comment,
    });

    // Save the updated blog post
    await blogPost.save();

    // Return success response
    return res.status(200).json({
      status: "success",
      message: "Comment added successfully!",
    });
  } catch (error) {
    console.error("Error adding comment to blog post:", error);
    return res.status(500).json({
      status: "fail",
      message:
        "Something went wrong while adding the comment to the blog post.",
      error: error.message,
    });
  }
};
