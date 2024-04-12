// Model Imports
const Profile = require("../../Models/UserModel/ProfileModel");
const User = require("../../Models/UserModel/UserModel");
const SProfile = require("../../Models/StartupModel/ProfileModel");

// Utility function which filters only the allowed data for updation
const filterObjectForUpdation = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
};
// User Account Updation
/*
Expected request object sample:
{
  "profilePhotoURL": "https://example.com/profile.jpg",
  "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "links": [
    "https://linkedin.com/user123",
    "https://github.com/user123"
  ],
  "pastExperiences": [
    {
      "jobTitle": "Software Engineer",
      "company": "ABC Company",
      "duration": "2020 - 2022",
      "description": "Worked on developing web applications using React and Node.js."
    },
    {
      "jobTitle": "Intern",
      "company": "XYZ Inc.",
      "duration": "2019",
      "description": "Assisted in testing and debugging code for mobile applications."
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  "interests": ["Reading", "Traveling", "Photography"]
}


*/
exports.updateUserProfile = async (req, res) => {
  try {
    // Only take allowed fields for profile updation
    const filteredBody = filterObjectForUpdation(
      req.body,
      "bio",
      "links",
      "pastExperiences",
      "skills",
      "interests"
    );

    // Find the user's profile
    let userProfile = await Profile.findOne({ user: req.user.id });

    // If no profile exists, create one
    if (!userProfile) {
      const newProfileData = {
        user: req.user.id,
        // Set default values for other profile fields if necessary
      };
      userProfile = await Profile.create(newProfileData);
    }

    // Update the profile data
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    // Sending successful response
    return res.status(200).json({
      status: "success",
      data: updatedProfile,
      message: "Profile updated successfully!",
    });
  } catch (exception) {
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong at our side!",
      exception: exception.message,
    });
  }
};

// View User Profile
exports.viewUserProfile = async (req, res) => {
  try {
    // Check if the user ID is valid
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "Invalid user ID provided.",
      });
    }

    // Find the user profile by user ID, along with associated user details
    const userProfile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      "name emailId phoneNumber following followers"
    );


    // If the profile doesn't exist, return user details without profile
    if (!userProfile) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: "fail",
          data: null,
          message: "User not found.",
        });
      }
      return res.status(200).json({
        status: "success",
        data: {
          name: user.name,
          emailId: user.emailId,
          phoneNumber: user.phoneNumber,
          followers:user.followers,
          following:user.following
        },
        message: "Profile fetched successfully!",
      });
    }

    // If the profile exists, return it in the response along with user details
    return res.status(200).json({
      status: "success",
      data: {
        ...userProfile.toObject(),
        name: userProfile.user.name,
        emailId: userProfile.user.emailId,
        phoneNumber: userProfile.user.phoneNumber,
        profilePhotoURL: `http://localhost:8000${userProfile.profilePhotoURL}`,
        followers:userProfile.followers,
        following:userProfile.following
      },
      message: "Profile fetched successfully!",
    });
  } catch (exception) {
    // If an error occurs, return a 500 error
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong at our side!",
      exception: exception.message,
    });
  }
};
exports.updateUserProfileImage = async (req, res) => {
  try {
    // Check if file is present in the request
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.file, "request");
    // Update the profile photo URL in the database
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { profilePhotoURL: `/data/users/profileImages/${req.file.filename}` },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return success response with the updated profile
    res.status(200).json({
      message: "Image uploaded successfully",
      profile: {
        _id: updatedProfile._id,
        profilePhotoURL: updatedProfile.profilePhotoURL,
        // Add any other relevant fields you want to return
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.searchUserProfile = async (req, res) => {
  console.log("hey")
  try {
    const searchQuery = req.body.searchQuery;

    // Split the search query into individual words
    const searchWords = searchQuery.split(" ");

    // Search in Profile model
    const userProfileResults = await Profile.find({
      $or: [
        { bio: { $in: searchWords.map((word) => new RegExp(word, "i")) } }, // Case-insensitive search for each word in bio
        { links: { $in: searchWords.map((word) => new RegExp(word, "i")) } }, // Case-insensitive search for each word in links array
        {
          "pastExperiences.company": {
            $in: searchWords.map((word) => new RegExp(word, "i")),
          },
        }, // Case-insensitive search for each word in pastExperiences array
        { skills: { $in: searchWords.map((word) => new RegExp(word, "i")) } }, // Case-insensitive search for each word in skills array
        {
          interests: { $in: searchWords.map((word) => new RegExp(word, "i")) },
        }, // Case-insensitive search for each word in interests array
      ],
    }).populate("user", "name emailId role followers following"); // Populate user field with name, emailId, and role from User model

    // Search in SProfile model
    const startupProfileResults = await SProfile.find({
      $or: [
        {
          startupName: {
            $in: searchWords.map((word) => new RegExp(word, "i")),
          },
        }, // Case-insensitive search for each word in startupName
        {
          description: {
            $in: searchWords.map((word) => new RegExp(word, "i")),
          },
        }, // Case-insensitive search for each word in description
        {
          missionStatement: {
            $in: searchWords.map((word) => new RegExp(word, "i")),
          },
        }, // Case-insensitive search for each word in missionStatement
        {
          founders: {
            $elemMatch: {
              name: { $in: searchWords.map((word) => new RegExp(word, "i")) },
            },
          },
        }, // Case-insensitive search for each word in founders array
        { industry: { $in: searchWords.map((word) => new RegExp(word, "i")) } }, // Case-insensitive search for each word in industry
        { location: { $in: searchWords.map((word) => new RegExp(word, "i")) } }, // Case-insensitive search for each word in location
      ],
    }).populate("user", "name emailId role followers following");

    // Combine and sort the results by relevance
    const allResults = [...userProfileResults, ...startupProfileResults];
    console.log("Getting all from backend", allResults)
    return res.status(200).json({
      status: "success",
      data: allResults.map((result) => ({
        ...result.toObject(),
        name: result.user.name,
        email: result.user.emailId,
        role: result.user.role,
        followers: result.user.followers,
        following: result.user.following
      })),
      message: "Search results fetched successfully!",
    });
  } catch (error) {
    console.error("Error searching user profiles:", error);
    return res.status(500).json({
      status: "fail",
      data: null,
      message: "Something went wrong while searching user profiles.",
      error: error.message,
    });
  }
};
