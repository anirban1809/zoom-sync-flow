// simple cache using sessionStorage
export function setAccessToken(token: string, expiresInSec: number) {
    const expiry = Date.now() + expiresInSec * 1000;
    sessionStorage.setItem("access_token", token);
    sessionStorage.setItem("access_token_expiry", expiry.toString());
}

export function getAccessToken(): string | null {
    const token = sessionStorage.getItem("access_token");
    const expiry = parseInt(
        sessionStorage.getItem("access_token_expiry") || "0",
        10
    );
    if (!token || Date.now() > expiry) return null;
    return token;
}

// optional: fetch a new one using your backend /auth/refresh endpoint
export async function refreshAccessToken(): Promise<string | null> {
    const res = await fetch(`https://stagingapi.luminote.ai/auth/refresh`, {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        // Only redirect if not already on login or signup page
        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
            window.location.href = "/login";
        }
        return null;
    }
    const data = await res.json();
    setAccessToken(data.idToken, data.expiresIn);
    return data.idToken;
}
