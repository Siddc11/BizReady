const mongoose = require("mongoose");

// Define the schema for startup profiles
const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true, // UserID is required
      unique: true, // Each user should have only one profile
    },
    // Startup name
    startupName: {
      type: String,
      trim: true,
    },
    // Description of the startup
    description: {
      type: String,
    },
    // Mission statement of the startup
    missionStatement: {
      type: String,
    },
    // Offerings provided by the startup
    offerings: {
      type: [String],
    },

    // Founders of the startup
    founders: [
      {
        name: {
          type: String,
        },
        role: {
          type: String,
        },
        bio: String,
      },
    ],
    // Industry of the startup
    industry: {
      type: String,
    },
    // Location of the startup
    location: {
      type: String,
    },
    // Website URL of the startup
    websiteUrl: {
      type: String,
    },

    // Contact information of the startup
    contactInformation: {
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      socialMedia: {
        type: Map,
        of: {
          type: String,
        },
      },
    },
    // URL for the startup's logo
    logoUrl: {
      type: String,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt fields

// Add text indexes for searchable fields
// profileSchema.index({
//   startupName: "text",
//   description: "text",
//   missionStatement: "text",
//   "founders.name": "text",
//   industry: "text",
//   location: "text",
// });

// Create a model for the startup profile schema
const SProfile = mongoose.model("SProfile", profileSchema);

module.exports = SProfile;
