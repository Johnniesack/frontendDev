const BASE_URL = "/api/proxy";

async function handleResponse(response: Response) {
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    } else {
        const text = await response.text();
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
        throw new Error(data?.message || data?.error || `Request failed with status ${response.status}`);
    }
    return data;
}

function getAuthHeaders(): HeadersInit {
    if (typeof window === "undefined") return { "Content-Type": "application/json" };
    const token = localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

/**
 * GET SHIPPING FUNCTION
 */
export async function getShipping() {
    const response = await fetch(`${BASE_URL}/shipping/get_shipping/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleResponse(response);
}

/**
 * ADD SHIPPING FUNCTION
 */
export async function addShipping(shippingData: any) {
    const response = await fetch(`${BASE_URL}/shipping/add_shipping/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(shippingData),
    });

    return handleResponse(response);
}

/**
 * DELETE SHIPPING FUNCTION
 */
export async function deleteShipping(id: number | string) {
    const response = await fetch(`${BASE_URL}/shipping/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    return handleResponse(response);
}

/**
 * EDIT SHIPPING FUNCTION
 */
export async function editShipping(shippingData: any) {
    const response = await fetch(`${BASE_URL}/shipping/update_shipping/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(shippingData),
    });

    return handleResponse(response);
}
