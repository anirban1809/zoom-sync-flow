import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cogConfirmForgotPassword, forgotPassword } from "@/lib/cognito";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PasswordReset = () => {
    const { theme, setTheme } = useTheme();
    const nav = useNavigate();

    const [stage, setStage] = useState<"REQUEST" | "CONFIRM">("REQUEST");

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    async function handleRequest(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");
        if (!emailOrUsername) {
            setErr("Please enter your email or username.");
            return;
        }
        try {
            setLoading(true);
            await forgotPassword(emailOrUsername.trim());
            setStage("CONFIRM");
            setMsg("We’ve sent a verification code to your email.");
        } catch (e) {
            // Common cases: UserNotFoundException, LimitExceededException, InvalidParameterException
            const m =
                e?.name === "UserNotFoundException"
                    ? "We couldn’t find an account with that email/username."
                    : e?.message || "Failed to start password reset.";
            setErr(m);
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");
        if (newPassword !== confirmNewPassword) {
            setErr("Passwords do not match.");
            return;
        }
        try {
            setLoading(true);
            await cogConfirmForgotPassword(
                emailOrUsername.trim(),
                code.trim(),
                newPassword
            );
            setMsg("Password reset successful. You can now log in.");
            // optional: small delay, then navigate
            setTimeout(() => nav("/login"), 800);
        } catch (e) {
            // Common: CodeMismatchException, ExpiredCodeException, InvalidPasswordException
            const m =
                e?.name === "CodeMismatchException"
                    ? "Invalid verification code."
                    : e?.name === "ExpiredCodeException"
                    ? "The code has expired. Request a new one."
                    : e?.message || "Failed to reset password.";
            setErr(m);
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
                    <h1 className="text-4xl font-bold mb-2">luminote.ai</h1>
                    <h2 className="text-2xl font-semibold mb-2">
                        Reset Password
                    </h2>
                    <p className="text-muted-foreground">
                        {stage === "REQUEST"
                            ? "Enter your email (or username) and we’ll send you a verification code."
                            : `Enter the verification code sent to ${emailOrUsername} and choose a new password.`}
                    </p>
                </div>

                {stage === "REQUEST" && (
                    <form className="space-y-4" onSubmit={handleRequest}>
                        <Input
                            type="email"
                            placeholder="Work email or username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="h-12 text-base"
                            required
                        />
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
                            {loading ? "Sending..." : "Send code"}
                        </Button>
                    </form>
                )}

                {stage === "CONFIRM" && (
                    <form className="space-y-4" onSubmit={handleConfirm}>
                        <Input
                            type="text"
                            placeholder="Verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="h-12 text-base"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 text-base"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmNewPassword}
                            onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
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
                                {loading ? "Resetting..." : "Reset password"}
                            </Button>
                            <Button
                                variant="secondary"
                                type="button"
                                className="h-12 text-base"
                                onClick={() => setStage("REQUEST")}
                            >
                                Back
                            </Button>
                        </div>
                    </form>
                )}

                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-4">
                    <Link to="/login" className="hover:text-foreground">
                        Back to login
                    </Link>
                    <span>•</span>
                    <Link to="/signup" className="hover:text-foreground">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
