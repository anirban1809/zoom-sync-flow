import { useAuthToken } from "@/hooks/use-auth";
import { refreshAccessToken } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api/api";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="min-h-screen flex bg-background">
            {/* Sidebar skeleton */}
            <div className="w-64 border-r border-border p-4 space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2 mt-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            
            {/* Main content skeleton */}
            <div className="flex-1 flex flex-col">
                {/* Top bar skeleton */}
                <div className="h-16 border-b border-border px-6 flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                
                {/* Content area skeleton */}
                <div className="flex-1 p-6 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    ) : (
        <>{children}</>
    );
}
