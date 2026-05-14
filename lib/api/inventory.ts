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
 * GET INVENTORY FUNCTION
 */
export async function getInventory() {
    const response = await fetch(`${BASE_URL}/inventory/get_inventory/`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    return handleResponse(response);
}

/**
 * ADD INVENTORY FUNCTION
 */
export async function addInventory(productData: any) {
    const response = await fetch(`${BASE_URL}/inventory/add_inventory/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    });

    return handleResponse(response);
}

/**
 * DELETE INVENTORY FUNCTION
 */
export async function deleteInventory(id: number | string) {
    const response = await fetch(`${BASE_URL}/inventory/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    return handleResponse(response);
}

/**
 * EDIT INVENTORY FUNCTION
 */
export async function editInventory(productData: any) {
    const response = await fetch(`${BASE_URL}/inventory/update_inventory/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
    });

    return handleResponse(response);
}
