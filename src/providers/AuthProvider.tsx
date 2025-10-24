import { useAuthToken } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthProvider({ children }: any) {
  const { token, loading, ensureToken } = useAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      (async () => {
        const t = await ensureToken();
      })();
    }

    if (!token) {
      navigate("/login");
    }
  }, [loading, token, ensureToken]);

  return <>{children}</>;
}
