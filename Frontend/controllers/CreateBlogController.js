export const createBlogPost = async (postData, token) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create blog post");
    }

    console.log("Blog post created successfully!");
    return responseData;
  } catch (error) {
    console.error("Error creating blog post:", error.message);
    throw error;
  }
};
