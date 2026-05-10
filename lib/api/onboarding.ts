const BASE_URL = "/api/proxy";

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
        let errorMessage = `Request failed with status ${response.status}`;
        if (data) {
            if (typeof data.error === 'string') errorMessage = data.error;
            else if (typeof data.message === 'string') errorMessage = data.message;
            else if (typeof data === 'object') {
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

function getAuthHeaders(): HeadersInit {
    // SSR Check: Prevent crashing during Next.js build
    if (typeof window === "undefined") {
        return { "Content-Type": "application/json" };
    }

    let token = localStorage.getItem("access_token");
    
    // Defensive check: if it's null or literally the string "undefined"/"null"
    if (!token || token === "undefined" || token === "null") {
        return { "Content-Type": "application/json" };
    }

    // Clean token: remove any surrounding quotes and whitespace
    // We do this repeatedly to handle double-quoting or mixed padding
    token = token.trim();
    while (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1).trim();
    }

    // Ensure we don't double-prefix if Bearer was accidentally saved
    if (token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7).trim();
    }

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

/**
 * SAVE ONBOARDING STEP
 */
export async function saveOnboardingStep(stepData: any) {
    const response = await fetch(`${BASE_URL}/auth/onboarding/step/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(stepData),
    });

    return handleResponse(response);
}

/**
 * COMPLETE ONBOARDING
 */
export async function completeOnboarding(plan: string) {
    const response = await fetch(`${BASE_URL}/auth/onboarding/complete/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ plan }),
    });
 
    return handleResponse(response);
}
