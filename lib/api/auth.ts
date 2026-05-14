// 1. This is the main address for your backend
const BASE_URL = "/api/proxy";

// 2. This helper helps us handle errors in a simple way
async function handleResponse(response: Response) {
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        try {
            data = await response.json();
            console.log(`API Response [${response.url}]:`, data);
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
        let errorMessage = `Request failed with status ${response.status}`;
        if (data) {
            if (typeof data.error === 'string') errorMessage = data.error;
            else if (typeof data.message === 'string') errorMessage = data.message;
            else if (typeof data === 'object') {
                // Handle cases like { "email": ["Already exists"] }
                const firstKey = Object.keys(data)[0];
                if (firstKey && Array.isArray(data[firstKey])) {
                    errorMessage = `${firstKey}: ${data[firstKey][0]}`;
                } else if (firstKey && typeof data[firstKey] === 'string') {
                    errorMessage = data[firstKey];
                }
            }
        }
        throw new Error(errorMessage);
    }
    return data;
}

/**
 * LOGIN FUNCTION
 * Postman: account/login
 */
export async function login(username: string, password: string) {
    const response = await fetch(`${BASE_URL}/account/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    return handleResponse(response);
}

/**
 * REFRESH TOKEN FUNCTION
 * Postman: account/refresh_token
 */
export async function refreshAccessToken(refreshToken: string) {
    const response = await fetch(`${BASE_URL}/account/refresh_token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    return handleResponse(response);
}

/**
 * VERIFY OTP FUNCTION
 * Postman: account/verify_otp
 */
export async function verifyOtp(userId: number | string, otpCode: string) {
    const response = await fetch(`${BASE_URL}/account/verify_otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ 
            user_id: userId, 
            otp: otpCode 
        }),
    });

    return handleResponse(response);
}

/**
 * RESEND OTP FUNCTION
 * Postman: account/resend_otp
 */
export async function resendOtp(userId: number | string) {
    const response = await fetch(`${BASE_URL}/account/resend_otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
    });

    return handleResponse(response);
}

/**
 * GET PROFILE FUNCTION
 * Postman: account/get profile
 */
export async function getProfile() {
    const response = await fetch(`${BASE_URL}/account/profile/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleResponse(response);
}

/**
 * UPDATE PROFILE FUNCTION
 * Postman: account/update profile
 */
export async function updateProfile(profileData: any) {
    const response = await fetch(`${BASE_URL}/account/update_profile/`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });

    return handleResponse(response);
}

// Helper to get headers with token
function getAuthHeaders(): HeadersInit {
    if (typeof window === "undefined") return { "Content-Type": "application/json" };
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}
