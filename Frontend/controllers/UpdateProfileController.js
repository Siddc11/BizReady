export const updateProfile = async (profileData, authToken) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(profileData),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update profile");
      }
  
      console.log("Profile updated successfully!");
      return responseData;
    } catch (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
  };
  