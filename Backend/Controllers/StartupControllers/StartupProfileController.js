const SProfile = require("../../Models/StartupModel/ProfileModel");

exports.viewStartupProfile = async (req, res) => {
  try {
    const id = req.user.id; // Assuming the ID is sent as a route parameter

    // Find the startup profile using the ID
    let startupProfile = await SProfile.findOne({ user: id });

    if (startupProfile == null) {
      startupProfile = [
        {
          user: id,
          startupName: "",
          description: "",
          missionStatement: "",
          offerings: [],
          founders: [],
          industry: "",
          location: "",
          websiteUrl: "",
          contactInformation: {
            email: "",
            phone: "",
            socialMedia: {
              twitter: "",
              linkedin: "",
            },
          },
          isRegistered: false,
          // Add other profile fields with default values if needed
        },
      ];
    }

    return res.status(200).json({
      status: "success",
      message: "Startup profile found",
      data: startupProfile,
    });
  } catch (error) {
    console.error("Error viewing startup profile:", error);
    return res.status(500).json({
      message: "Failed to view startup profile",
      error: error.message,
    });
  }
};

exports.updateStartupProfile = async (req, res) => {
  try {
    const id = req.user.id; // Assuming the ID is sent in the request body
    let updates = req.body; // Assuming updates are sent in the request body
    updates.isRegistered = true;

    // Find the startup profile using the ID and update it
    let startupProfile = await SProfile.findOneAndUpdate(
      { user: id },
      updates,
      {
        new: true, // Return the modified document rather than the original
      }
    );

    // Check if the startup profile exists
    if (!startupProfile) {
      //create a new user profile based on the the field 'updates' and send it in response

      // Assuming SProfile is the model for startup profiles
      const newProfile = new SProfile({
        user: id, // Assuming user ID is required for the profile
        // Copy updates to the new profile
        // You may need to adjust this based on the structure of your SProfile model
        ...updates,
      });

      // Save the new profile
      const savedProfile = await newProfile.save();

      // Send the new profile in the response
      return res.status(201).json({
        status: "success",
        message: "Startup profile updated successfully",
        data: savedProfile,
      });
    }

    // If the startup profile was successfully updated, return a success response
    return res.status(200).json({
      status: "success",
      message: "Startup profile updated successfully",
      data: startupProfile,
    });
  } catch (error) {
    console.error("Error updating startup profile:", error);
    return res.status(500).json({
      message: "Failed to update startup profile",
      error: error.message,
    });
  }
};
