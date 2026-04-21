// 1. This is the main address for your backend
const BASE_URL = "/api/proxy";

// 2. This helper helps us handle errors in a simple way
async function handleResponse(response: Response) {
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        try {
            data = await response.json();
        } catch (e) {
            console.error("Failed to parse JSON response", e);
            throw new Error("Server returned an invalid response format.");
        }
    } else {
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 200));
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }
    return data;
}

/**
 * LOGIN FUNCTION
 */
export async function login(email: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
}

/**
 * REFRESH TOKEN FUNCTION
 */
export async function refreshAccessToken(refreshToken: string) {
    const response = await fetch(`${BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    return handleResponse(response);
}

/**
 * SIGNUP FUNCTION
 */
export async function signup(email: string, fullName: string, password: string, confirmPassword: string) {
    const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            full_name: fullName,
            password,
            confirm_password: confirmPassword
        }),
    });

    return handleResponse(response);
}

/**
 * VERIFY OTP FUNCTION
 */
export async function verifyOtp(email: string, otp: string) {
    const response = await fetch(`${BASE_URL}/auth/verify-otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
    });

    return handleResponse(response);
}
