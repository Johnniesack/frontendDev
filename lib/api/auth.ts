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
    const body = {
        email,
        full_name: fullName,
        password,
        confirm_password: confirmPassword
    };
    console.log("Signup Request Body:", JSON.stringify(body));
    
    const response = await fetch(`${BASE_URL}/auth/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(body),
    });

    return handleResponse(response);
}

/**
 * VERIFY OTP FUNCTION
 */
export async function verifyOtp(email: string, otp: string, tempToken?: string) {
    const response = await fetch(`${BASE_URL}/auth/verify-otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ 
            email, 
            otp,
            ...(tempToken ? { 
                TEMP_TOKEN: tempToken,
                temp_token: tempToken 
            } : {})
        }),
    });

    return handleResponse(response);
}
/**
 * RESEND OTP FUNCTION
 */
export async function resendOtp(email: string, tempToken?: string) {
    const response = await fetch(`${BASE_URL}/auth/resend-otp/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ 
            email,
            ...(tempToken ? { 
                TEMP_TOKEN: tempToken,
                temp_token: tempToken 
            } : {})
        }),
    });
    return handleResponse(response);
}
