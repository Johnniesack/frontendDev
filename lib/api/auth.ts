import { apiRequest, type ApiPayload, type ApiRecord, authHeaders, cleanToken, handleResponse } from "./client";

export type AuthResponse = ApiRecord;

/**
 * LOGIN FUNCTION
 * Postman: account/login
 */
export async function login(username: string, password: string) {
    return apiRequest<AuthResponse>("/account/login/", {
        method: "POST",
        auth: false,
        body: { username, password },
    });
}

/**
 * REFRESH TOKEN FUNCTION
 * Postman: account/refresh_token
 */
export async function refreshAccessToken(refreshToken: string) {
    return apiRequest<AuthResponse>("/account/refresh_token/", {
        method: "POST",
        auth: false,
        body: { refresh: refreshToken },
    });
}

/**
 * VERIFY OTP FUNCTION
 * Postman: account/verify_otp
 */
export async function verifyOtp(userId: number | string, otpCode: string, tempToken?: string) {
    const token = cleanToken(tempToken);
    const response = await fetch(`${window.location.origin}/api/proxy/account/verify_otp/`, {
        method: "POST",
        headers: token ? authHeaders(token) : authHeaders(null),
        body: JSON.stringify({
            user_id: userId,
            otp_code: otpCode,
        }),
    });

    return handleResponse<AuthResponse>(response);
}

/**
 * RESEND OTP FUNCTION
 * Postman: account/resend_otp
 */
export async function resendOtp(userId: number | string) {
    return apiRequest<AuthResponse>("/account/resend_otp/", {
        method: "POST",
        auth: false,
        body: { user_id: userId },
    });
}

/**
 * GET PROFILE FUNCTION
 * Postman: account/get profile
 */
export async function getProfile() {
    return apiRequest<AuthResponse>("/account/profile/", {
        method: "GET",
        auth: true,
    });
}

/**
 * UPDATE PROFILE FUNCTION
 * Postman: account/update profile
 */
export async function updateProfile(profileData: ApiPayload) {
    return apiRequest<AuthResponse>("/account/update_profile/", {
        method: "PUT",
        auth: true,
        body: profileData,
    });
}

/**
 * FORGOT PASSWORD FUNCTION
 * Postman: account/forgot_password
 */
export async function forgotPassword(email: string) {
    return apiRequest<AuthResponse>("/account/forgot_password/", {
        method: "POST",
        auth: false,
        body: { email },
    });
}

/**
 * RESET PASSWORD FUNCTION
 * Postman: account/reset_password
 */
export async function resetPassword(userId: number | string, otpCode: string | number, newPassword: string) {
    return apiRequest<AuthResponse>("/account/reset_password/", {
        method: "POST",
        auth: false,
        body: { 
            user_id: userId,
            otp_code: otpCode,
            new_password: newPassword
        },
    });
}

/**
 * LOGOUT FUNCTION
 * Postman: account/logout
 */
export async function logout(refreshToken: string) {
    return apiRequest<AuthResponse>("/account/logout/", {
        method: "POST",
        auth: true,
        body: { 
            refresh: refreshToken
        },
    });
}

