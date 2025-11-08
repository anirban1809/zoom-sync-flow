import { useAuthToken } from "@/hooks/use-auth";
import { refreshAccessToken } from "@/lib/api/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
