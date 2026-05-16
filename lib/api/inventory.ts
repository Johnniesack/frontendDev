import { apiRequest, type ApiPayload, type ApiRecord } from "./client";

/**
 * GET INVENTORY FUNCTION
 */
export async function getInventory() {
    return apiRequest<ApiRecord[] | ApiRecord>("/inventory/get_inventory/", {
        method: "GET",
        auth: true,
    });
}

/**
 * ADD INVENTORY FUNCTION
 */
export async function addInventory(productData: ApiPayload) {
    return apiRequest<ApiRecord>("/inventory/add_inventory/", {
        method: "POST",
        auth: true,
        body: productData,
    });
}

/**
 * DELETE INVENTORY FUNCTION
 */
export async function deleteInventory(id: number | string) {
    return apiRequest<ApiRecord>(`/inventory/${id}/`, {
        method: "DELETE",
        auth: true,
    });
}

/**
 * EDIT INVENTORY FUNCTION
 */
export async function editInventory(productData: ApiPayload) {
    return apiRequest<ApiRecord>("/inventory/update_inventory/", {
        method: "POST",
        auth: true,
        body: productData,
    });
}
