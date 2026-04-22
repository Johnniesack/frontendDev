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
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }
    return data;
}

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    };
}

/**
 * SAVE ONBOARDING STEP
 */
export async function saveOnboardingStep(stepData: any) {
    const response = await fetch(`${BASE_URL}/onboarding/step/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(stepData),
    });

    return handleResponse(response);
}

/**
 * COMPLETE ONBOARDING
 */
export async function completeOnboarding() {
    const response = await fetch(`${BASE_URL}/onboarding/complete/`, {
        method: "POST",
        headers: getAuthHeaders(),
    });

    return handleResponse(response);
}
