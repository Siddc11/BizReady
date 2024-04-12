const mongoose = require("mongoose");

// Define the profile schema
const profileSchema = new mongoose.Schema({
  // UserID (foreign key)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true, // UserID is required
    unique: true, // Each user should have only one profile
  },
  // Profile Photo URL
  profilePhotoURL: {
    type: String,
    default: "/data/users/profileImages/defaultImg.png", // Default profile photo URL
  },
  // Bio
  bio: {
    type: String,
    maxlength: [500, "Bio cannot exceed 500 characters."], // Maximum length of the bio
    default: "", // Default empty bio
  },
  // Links (list of URLs)
  links: {
    type: [String], // Array of strings for multiple URLs
    validate: {
      // Custom validator to validate each URL in the array
      validator: function (value) {
        // Validate each URL using a regular expression
        return value.every((url) => {
          const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/; // Regular expression for URL validation
          return urlRegex.test(url);
        });
      },
      // Error message for invalid URL
      message: (props) => `${props.value} is not a valid URL!`,
    },
    default: [], // Default empty array for links
  },
  // Past Experiences (list of experiences)
  pastExperiences: [
    {
      jobTitle: {
        type: String,
        required: true, // Job title is required
      },
      company: {
        type: String,
        required: true, // Company name is required
      },
      duration: {
        type: String,
        required: true, // Duration is required
      },
      description: {
        type: String,
        maxlength: [1000, "Description cannot exceed 1000 characters."], // Maximum length of the description
        default: "", // Default empty description
      },
    },
  ],
  // Skills (list of skills)
  skills: {
    type: [String], // Array of strings for multiple skills
    default: [], // Default empty array for skills
  },
  // Interests (list of interests)
  interests: {
    type: [String], // Array of strings for multiple interests
    default: [], // Default empty array for interests
  },
});

// Create the Profile model
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile; // Export the Profile model
