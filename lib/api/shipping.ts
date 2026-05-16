import { apiRequest, type ApiPayload, type ApiRecord } from "./client";

/**
 * GET SHIPPING FUNCTION
 */
export async function getShipping() {
    return apiRequest<ApiRecord[] | ApiRecord>("/shipping/get_shipping/", {
        method: "GET",
        auth: true,
    });
}

/**
 * ADD SHIPPING FUNCTION
 */
export async function addShipping(shippingData: ApiPayload) {
    return apiRequest<ApiRecord>("/shipping/add_shipping/", {
        method: "POST",
        auth: true,
        body: shippingData,
    });
}

/**
 * DELETE SHIPPING FUNCTION
 */
export async function deleteShipping(id: number | string) {
    return apiRequest<ApiRecord>(`/shipping/${id}/`, {
        method: "DELETE",
        auth: true,
    });
}

/**
 * EDIT SHIPPING FUNCTION
 */
export async function editShipping(shippingData: ApiPayload) {
    return apiRequest<ApiRecord>("/shipping/update_shipping/", {
        method: "POST",
        auth: true,
        body: shippingData,
    });
}
