import { useEffect, useState, useCallback } from "react";
import { getAccessToken, refreshAccessToken } from "@/lib/api/auth";

export function useAuthToken() {
    const [token, setToken] = useState<string | null>(getAccessToken());
    const [loading, setLoading] = useState(!token);

    const ensureToken = useCallback(async () => {
        let t = getAccessToken();
        if (!t) {
            setLoading(true);
            t = await refreshAccessToken();
            setLoading(false);
        }
        if (t) setToken(t);
        return t;
    }, []);

    useEffect(() => {
        // refresh token periodically before expiry (optional)
        const interval = setInterval(() => {
            ensureToken();
        }, 5 * 60 * 1000); // every 5 min
        return () => clearInterval(interval);
    }, [ensureToken]);

    return { token, loading, ensureToken };
}
