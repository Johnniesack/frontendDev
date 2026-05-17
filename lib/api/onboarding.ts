import { apiRequest, type ApiPayload, type ApiRecord } from "./client";

export type SignUpPayload = {
    username: string;
    password: string;
    name: string;
    email: string;
    phone: string;
};

export type OnboardingStatus = "approved" | "rejected";
export type OnboardingResponse = ApiRecord;

/**
 * SIGN UP FUNCTION
 * Postman: onboarding/sign_up
 */
export async function signUp(userData: SignUpPayload) {
    return apiRequest<OnboardingResponse>("/onboarding/sign_up/", {
        method: "POST",
        auth: false,
        body: userData,
    });
}

/**
 * UPDATE STATUS FUNCTION
 * Postman: onboarding/approved
 */
export async function updateOnboardingStatus(id: number, status: OnboardingStatus) {
    return apiRequest<OnboardingResponse>("/onboarding/update_status/", {
        method: "PUT",
        auth: false,
        body: { id, status },
    });
}

/**
 * SAVE ONBOARDING STEP
 */
export async function saveOnboardingStep(stepData: ApiPayload) {
    console.log("Local save for step:", stepData);
    return Promise.resolve({ success: true });
}

/**
 * COMPLETE ONBOARDING
 * Postman: onboarding/update_onboarding
 */
export async function completeOnboarding(userId: string | number, onboardingData: ApiPayload = {}) {
    return apiRequest<OnboardingResponse>("/onboarding/update_onboarding/", {
        method: "PUT",
        auth: true,
        body: {
            user_id: userId,
            ...onboardingData,
        },
    });
}

/**
 * GET ONBOARDING STATUS
 * Postman: onboarding/get_onboarding
 */
export async function getOnboarding(userId: string | number) {
    return apiRequest<OnboardingResponse>("/onboarding/get_onboarding/", {
        method: "GET",
        auth: true,
        query: { user_id: userId },
    });
}

/**
 * SEND LOGIN OTP
 * Postman: onboarding/send_login_otp
 */
export async function sendLoginOtp(userId: number | string) {
    return apiRequest<ApiRecord>("/onboarding/send_login_otp/", {
        method: "POST",
        auth: false,
        body: { user_id: userId },
    });
}

