import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { setAccessToken } from "@/lib/api/auth";
import {
    answerMfa,
    hostedUiRedirect,
    setNewPassword,
    signIn,
    type SignInResult,
} from "@/lib/cognito-auth";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const { theme, setTheme } = useTheme();
    const nav = useNavigate();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const [stage, setStage] = useState<"LOGIN" | "MFA" | "NEWPW">("LOGIN");
    const [session, setSession] = useState("");
    const [mfaCode, setMfaCode] = useState("");
    const [newPassword, setNewPasswordValue] = useState("");

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    async function handleLogin(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");
        setLoading(true);
        try {
            const res: SignInResult = await signIn(
                emailOrUsername.trim(),
                password
            );
            if (res.kind === "ERROR") {
                setErr(res.error);
                if (res.error === "User is not confirmed.") {
                    setTimeout(
                        () =>
                            nav(
                                `/signup?confirmation=pending&email=${emailOrUsername.trim()}`
                            ),
                        2000
                    );
                }
            } else {
                // Success — tokens are in memory in the helper
                setAccessToken(res.idToken, 3500);
                nav("/"); // or wherever your app's home is
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleMfaSubmit(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");
        setLoading(true);
        try {
            const res = await answerMfa(session, mfaCode.trim(), "SMS_MFA"); // if you support TOTP, detect which to pass
            if (res.kind === "NEW_PASSWORD_REQUIRED") {
                setSession(res.session);
                setStage("NEWPW");
            } else {
                nav("/");
            }
        } catch (e) {
            setErr(e?.message || "Invalid MFA code.");
        } finally {
            setLoading(false);
        }
    }

    async function handleNewPassword(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");
        setLoading(true);
        try {
            const res = await setNewPassword(session, newPassword);
            if (res.kind === "OK") nav("/");
        } catch (e) {
            setErr(e?.message || "Failed to set new password.");
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

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-8">
                        Log in to luminote.ai
                    </h1>
                </div>

                {/* Hosted UI buttons */}
                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full h-12 text-base"
                        size="lg"
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
                        className="w-full h-12 text-base"
                        size="lg"
                        onClick={() => hostedUiRedirect("AzureAD")} // match your IdP name in Cognito
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
                        className="w-full h-12 text-base"
                        size="lg"
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

                <div className="flex items-center gap-4 my-6">
                    <Separator className="flex-1" />
                    <span className="text-sm text-muted-foreground">or</span>
                    <Separator className="flex-1" />
                </div>

                {/* Stage: LOGIN */}
                {stage === "LOGIN" && (
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="Work email or username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="h-12 text-base"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 text-base"
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
                            <div className="text-sm text-red-600">{err}</div>
                        )}
                        {msg && (
                            <div className="text-sm text-green-600">{msg}</div>
                        )}
                        <Button
                            disabled={loading}
                            className="w-full h-12 text-base"
                            size="lg"
                            type="submit"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </Button>
                    </form>
                )}

                {/* Stage: MFA */}
                {stage === "MFA" && (
                    <form className="space-y-4" onSubmit={handleMfaSubmit}>
                        <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="MFA code"
                            value={mfaCode}
                            onChange={(e) => setMfaCode(e.target.value)}
                            className="h-12 text-base"
                            required
                        />
                        {err && (
                            <div className="text-sm text-red-600">{err}</div>
                        )}
                        {msg && (
                            <div className="text-sm text-green-600">{msg}</div>
                        )}
                        <div className="flex gap-2">
                            <Button
                                disabled={loading}
                                className="w-full h-12 text-base"
                                size="lg"
                                type="submit"
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                className="h-12 text-base"
                                onClick={() => setStage("LOGIN")}
                            >
                                Back
                            </Button>
                        </div>
                    </form>
                )}

                {/* Stage: NEW PASSWORD REQUIRED */}
                {stage === "NEWPW" && (
                    <form className="space-y-4" onSubmit={handleNewPassword}>
                        <Input
                            type="password"
                            placeholder="Set a new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPasswordValue(e.target.value)
                            }
                            className="h-12 text-base"
                            required
                        />
                        {err && (
                            <div className="text-sm text-red-600">{err}</div>
                        )}
                        {msg && (
                            <div className="text-sm text-green-600">{msg}</div>
                        )}
                        <div className="flex gap-2">
                            <Button
                                disabled={loading}
                                className="w-full h-12 text-base"
                                size="lg"
                                type="submit"
                            >
                                {loading ? "Updating..." : "Update password"}
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                className="h-12 text-base"
                                onClick={() => setStage("LOGIN")}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}

                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-4">
                    <Link to="/signup" className="hover:text-foreground">
                        Create account
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
        </div>
    );
};

export default Login;
