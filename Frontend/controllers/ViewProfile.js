export const viewProfile = async (authToken) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        }
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to to view profile");
      }
  
      console.log("Profile fetched successfully!");
      return responseData;
    } catch (error) {
      console.error("Error while accessing profile:", error.message);
      throw error;
    }
  };
  