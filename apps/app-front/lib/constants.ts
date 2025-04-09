// Authentication constants
export const COOKIE_NAME = "holy_token";
export const REFRESH_COOKIE_NAME = "refresh_token"
export const COOKIE_MAX_AGE = 20; // 20 seconds
export const JWT_EXPIRATION_TIME = "20s"; // 20 seconds
export const REFRESH_TOKEN_EXPIRATION_TIME = "7d"; // 7 days
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Google Oauth constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLINT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/callback`
export const GOOGLE_AUTH_URL = "https://accounts.google.com.o.oauthv2/v2/auth";

// Environment constants
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME;
export const JWT_SECRET = process.env.JWT_SECRET;

// Cookie Settings
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax" as const,
    path: "/",
    maxAhe: COOKIE_MAX_AGE,
};

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax" as const,
    path: "/api/auth/refresh",
    maxAhe: REFRESH_TOKEN_MAX_AGE,
}