import { useAuthToken } from "@/hooks/use-auth";
import { refreshAccessToken } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const routes = {
    "/admin": {
        roles: ["OWNER", "ADMIN"],
    },
    "/billing": {
        roles: ["OWNER", "ADMIN"],
    },
    "/data-management": {
        roles: ["OWNER", "ADMIN"],
    },
};

export function AuthProvider({ children }: any) {
    const location = useLocation();

    const { token, ensureToken } = useAuthToken();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        let hasChecked = false;
        const checkAuth = async () => {
            if (hasChecked) return;
            hasChecked = true;

            try {
                const t = await ensureToken();
                if (!t) {
                    await refreshAccessToken();
                }
            } finally {
                const path = location.pathname;
                const res = await apiFetch("/me/role");
                const role = await res.json();

                const allowed = routes[path];

                if (!allowed) {
                    setLoading(false);
                    return;
                }

                if (!allowed.roles.includes(role.role)) {
                    navigate("/");
                }

                setLoading(false);
            }
        };
        checkAuth();

        (async () => {})();
    }, [navigate]);

    return loading ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="w-full max-w-2xl space-y-6">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
            </div>
        </div>
    ) : (
        <>{children}</>
    );
}
