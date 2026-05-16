import { apiRequest, type ApiRecord } from "./client";

/**
 * FETCH SHOP CATEGORIES
 * Postman: general codes/shop categories
 */
export async function getShopCategories() {
    return apiRequest<ApiRecord[] | ApiRecord>("/general-codes/shop_category", {
        method: "GET",
        auth: true,
    });
}

/**
 * FETCH BRAND GOALS
 * Postman: general codes/brand goals
 */
export async function getBrandGoals() {
    return apiRequest<ApiRecord[] | ApiRecord>("/general-codes/brand_goals", {
        method: "GET",
        auth: true,
    });
}

/**
 * FETCH PLANS (Sign up fees)
 * Postman: general codes/plans
 */
export async function getPlans() {
    return apiRequest<ApiRecord[] | ApiRecord>("/general-codes/sign_up_fee", {
        method: "GET",
        auth: true,
    });
}

/**
 * FETCH CURRENCIES
 * Postman: general codes/currency
 */
export async function getCurrencies() {
    return apiRequest<ApiRecord[] | ApiRecord>("/general-codes/currency", {
        method: "GET",
        auth: true,
    });
}
