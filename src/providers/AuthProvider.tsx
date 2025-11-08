import { Skeleton } from "@/components/ui/skeleton";
import { useAuthToken } from "@/hooks/use-auth";
import { refreshAccessToken } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function AuthProvider({ children }: any) {
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
                console.log({ t });
                if (!t) {
                    await refreshAccessToken();
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    return loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Skeleton className="h-9 w-64 mx-auto" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                </div>
            </div>
        </div>
    ) : (
        <>{children}</>
    );
}
