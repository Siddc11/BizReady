export const getSearchResult = async (query, authToken) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/profile/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(query),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to search");
        }

        console.log("Query executed successfully!");
        return responseData;
    } catch (error) {
        console.error("Error while searching:", error.message);
        throw error;
    }
};