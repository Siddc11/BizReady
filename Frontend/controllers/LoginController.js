// loginController.js

export const loginUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to log in");
    }

    console.log("Logged in successfully!");
    return responseData;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};
