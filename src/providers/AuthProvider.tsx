import { useAuthToken } from "@/hooks/use-auth";
import { refreshAccessToken } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api/api";

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
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">Loading...</p>
            </div>
        </div>
    ) : (
        <>{children}</>
    );
}
