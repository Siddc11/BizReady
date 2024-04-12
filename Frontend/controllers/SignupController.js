// SignupController.js

export const signupUser = async (userData) => {
  // Exporting the function using named export syntax
  try {
    const response = await fetch("http://localhost:8000/api/v1/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json(); // Parse JSON response

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to sign up"); // Use error message from response if available
    }

    console.log("User signed up successfully!");
    // Additional logic after successful signup

    return responseData; // Return the parsed response data
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error; // Propagate the error to the caller if needed
  }
};
