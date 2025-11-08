import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { refreshAccessToken, setAccessToken } from "@/lib/api/auth";
import { hostedUiRedirect, signIn } from "@/lib/cognito-auth";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
    const { theme, setTheme } = useTheme();
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get("invite");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [authCheckLoading, setAuthCheckLoading] = useState(true);

    // Redirect if user is already logged in
    useEffect(() => {
        let hasChecked = false;
        const checkAuth = async () => {
            if (hasChecked) return;
            hasChecked = true;
            
            try {
                const token = await refreshAccessToken();
                if (token) {
                    nav("/");
                }
            } finally {
                setAuthCheckLoading(false);
            }
        };
        checkAuth();
    }, [nav]);

    async function handleLogin(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setLoading(true);

        try {
            const res = await signIn(email.trim(), password);

            if (res.kind === "ERROR") {
                setErr(res.error || "Invalid email or password");
                if (res.error === "User is not confirmed.") {
                    setTimeout(
                        () =>
                            nav(
                                `/signup?confirmation=pending&email=${email.trim()}`
                            ),
                        2000
                    );
                }
            } else {
                // Success — store tokens
                setAccessToken(res.idToken!, 3500);

                // Mock: In production, fetch user's workspace memberships
                // const memberships = await fetchUserMemberships();

                // Navigate to workspace selection or directly to workspace if invite
                if (inviteToken) {
                    // Mock: Accept invite and redirect to that workspace
                    // await acceptInvite(inviteToken);
                    // const workspaceId = await getWorkspaceIdFromInvite(inviteToken);
                    nav("/onboarding"); // In production: nav(`/app/${workspaceId}`)
                } else {
                    nav("/login/workspaces");
                }
            }
        } catch (error: any) {
            setErr(error?.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="absolute top-4 right-4"
                aria-label="Toggle theme"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>

            {authCheckLoading ? (
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-4">
                        <Skeleton className="h-9 w-64 mx-auto" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                    </div>
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <div className="space-y-4">
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                        <Skeleton className="h-11 w-full" />
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold">
                            Log in to luminote.ai
                        </h1>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-11"
                            onClick={() => hostedUiRedirect("Google")}
                        >
                            <img
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                className="w-5 h-5 mr-2"
                            />
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11"
                            onClick={() => hostedUiRedirect("AzureAD")}
                        >
                            <img
                                src="https://www.microsoft.com/favicon.ico"
                                alt="Microsoft"
                                className="w-5 h-5 mr-2"
                            />
                            Continue with Microsoft
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-11"
                            onClick={() => hostedUiRedirect("Slack")}
                        >
                            <img
                                src="https://slack.com/favicon.ico"
                                alt="Slack"
                                className="w-5 h-5 mr-2"
                            />
                            Continue with Slack
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="text-sm text-muted-foreground">or</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Login Form */}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="Work email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11"
                            required
                        />

                        <div className="text-right">
                            <Link
                                to="/password-reset"
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {err && (
                            <div className="text-sm text-destructive">{err}</div>
                        )}

                        <Button
                            disabled={loading}
                            className="w-full h-11"
                            type="submit"
                        >
                            {loading ? "Signing in..." : "Continue"}
                        </Button>
                    </form>

                    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-4">
                        <Link to="/signup" className="hover:text-foreground">
                            Create an account
                        </Link>
                        <span>•</span>
                        <Link to="/help-support" className="hover:text-foreground">
                            Help
                        </Link>
                        <span>•</span>
                        <a href="#" className="hover:text-foreground">
                            Privacy
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
