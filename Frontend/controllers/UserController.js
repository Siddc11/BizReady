export const followUser = async (userId, isFollow, authToken) => {
  console.log(userId, isFollow);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/user/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body:JSON.stringify({
            "other_user_id": userId,
            "follow": isFollow
          })
      });
  
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to like post");
      }
  
      console.log("Post liked successfully!");
      return responseData;
    } catch (error) {
      console.error("Error while liking post:", error.message);
      throw error;
    }
  };