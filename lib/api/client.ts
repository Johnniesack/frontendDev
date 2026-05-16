const BASE_URL = "/api/proxy";

export type ApiValue =
  | string
  | number
  | boolean
  | null
  | ApiValue[]
  | { [key: string]: ApiValue };

export type ApiRecord = Record<string, ApiValue>;
export type ApiPayload = Record<string, ApiValue | undefined>;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: ApiPayload;
  auth?: boolean;
  query?: Record<string, string | number | boolean | null | undefined>;
  retryOnUnauthorized?: boolean;
};

export function cleanToken(rawToken: string | null | undefined) {
  if (!rawToken) return null;

  let token = rawToken.trim();
  if (!token || token === "undefined" || token === "null") return null;

  while (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1).trim();
  }

  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  return token && token !== "undefined" && token !== "null" ? token : null;
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return cleanToken(localStorage.getItem("access_token"));
}

export function getStoredRefreshToken() {
  if (typeof window === "undefined") return null;
  return cleanToken(localStorage.getItem("refresh_token"));
}

export function authHeaders(token = getStoredAccessToken()): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
}

export async function apiRequest<T = ApiRecord>(path: string, options: RequestOptions = {}) {
  const method = options.method ?? "GET";
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    method,
    headers: options.auth === false ? { "Content-Type": "application/json", "Accept": "application/json" } : authHeaders(),
    ...(method !== "GET" && options.body ? { body: JSON.stringify(stripUndefined(options.body)) } : {}),
  });

  if (response.status === 401 && options.auth !== false && options.retryOnUnauthorized !== false) {
    const refreshed = await refreshStoredAccessToken();

    if (refreshed) {
      const retryResponse = await fetch(url.toString(), {
        method,
        headers: authHeaders(refreshed),
        ...(method !== "GET" && options.body ? { body: JSON.stringify(stripUndefined(options.body)) } : {}),
      });

      return handleResponse<T>(retryResponse);
    }
  }

  return handleResponse<T>(response);
}

export async function handleResponse<T>(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();
  const data = parseResponseBody(text, contentType);

  if (!response.ok) {
    throw new Error(extractErrorMessage(data, response));
  }

  return data as T;
}

export function extractString(data: unknown, paths: string[][]) {
  for (const path of paths) {
    const value = readPath(data, path);
    if (typeof value === "string" && cleanToken(value)) return value;
  }

  return undefined;
}

export function extractNumberLike(data: unknown, paths: string[][]) {
  for (const path of paths) {
    const value = readPath(data, path);
    if (typeof value === "number" || typeof value === "string") return value;
  }

  return undefined;
}

export function extractBoolean(data: unknown, paths: string[][]) {
  for (const path of paths) {
    const value = readPath(data, path);
    if (typeof value === "boolean") return value;
  }

  return undefined;
}

async function refreshStoredAccessToken() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${window.location.origin}${BASE_URL}/account/refresh_token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await handleResponse<ApiRecord>(response);
    const accessToken = cleanToken(extractString(data, [["access"], ["access_token"], ["data", "access"], ["data", "access_token"]]));
    const nextRefreshToken = cleanToken(extractString(data, [["refresh"], ["refresh_token"], ["data", "refresh"], ["data", "refresh_token"]]));

    if (!accessToken) return null;

    localStorage.setItem("access_token", accessToken);
    if (nextRefreshToken) localStorage.setItem("refresh_token", nextRefreshToken);

    return accessToken;
  } catch (error) {
    console.warn("Failed to refresh access token:", error);
    return null;
  }
}

function stripUndefined(body: ApiPayload) {
  return Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined));
}

function parseResponseBody(text: string, contentType: string): unknown {
  if (!text) return {};

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response format.");
    }
  }

  return { message: text };
}

function extractErrorMessage(data: unknown, response: Response) {
  if (isRecord(data)) {
    if (typeof data.error === "string") return data.error;
    if (typeof data.message === "string") return data.message;

    const firstValue = Object.values(data)[0];
    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      const firstKey = Object.keys(data)[0];
      return `${firstKey}: ${firstValue[0]}`;
    }
    if (typeof firstValue === "string") return firstValue;
  }

  return `Request failed with status ${response.status}`;
}

function readPath(data: unknown, path: string[]) {
  return path.reduce<unknown>((current, key) => {
    if (!isRecord(current)) return undefined;
    return current[key];
  }, data);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
