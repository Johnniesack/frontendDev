// 1. This is the main address for your backend
const BASE_URL = "https://api-test.krifth.com";

// 2. This helper helps us handle errors in a simple way
async function handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        // If something went wrong, we "throw" an error with the message from the backend
        throw new Error(data.message || data.error || "Something went wrong");
    }
    return data;
}

/**
 * LOGIN FUNCTION
 * This function takes the user's email and password and sends them to the server.
 */
export async function login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // We turn the email and password into a JSON string
        body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
}

/**
 * REFRESH TOKEN FUNCTION
 * This function uses your "Refresh Token" (Master Key) to get a new "Access Token" (Temporary Key).
 */
export async function refreshAccessToken(refreshToken: string) {
    const response = await fetch(`${BASE_URL}/api/auth/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    return handleResponse(response);
}
