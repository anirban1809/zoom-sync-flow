import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    cogConfirmSignUp,
    hostedUiRedirect,
    resendCode,
    signUp,
} from "@/lib/cognito";
import { setAccessToken } from "@/lib/api/auth";
import { signIn } from "@/lib/cognito-auth";
import { Moon, Sun, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { refreshAccessToken } from "@/lib/api/auth";

const Signup = () => {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const inviteToken = searchParams.get("invite");
    const isInviteFlow = !!inviteToken;

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");
    const [workspaceDescription, setWorkspaceDescription] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [step, setStep] = useState<"account" | "verify">("account");
    const [confirmCode, setConfirmCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string>("");
    const [err, setErr] = useState<string>("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [initialLoading, setInitialLoading] = useState(isInviteFlow);
    const [invitationRole, setInvitationRole] = useState("MEMBER");
    const [invitationStatus, setInvitationStatus] = useState<
        "valid" | "invalid" | "expired" | "revoked"
    >("valid");

    // Mock: Check if user already owns a workspace
    const [userOwnsWorkspace, setUserOwnsWorkspace] = useState(false);

    // Redirect if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const token = await refreshAccessToken();
            if (token) {
                navigate("/");
            }
        };
        checkAuth();
    }, [navigate]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCooldown > 0) {
            timer = setTimeout(
                () => setResendCooldown(resendCooldown - 1),
                1000
            );
        }
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    useEffect(() => {
        if (!isInviteFlow) {
            return;
        }

        (async () => {
            try {
                const res = await fetch(
                    `https://stagingapi.luminote.ai/auth/invitations?inviteId=${inviteToken}`,
                    {
                        method: "GET",
                    }
                );

                const result = await res.json();

                // Check for error responses
                if (result.error) {
                    if (result.error === "TOKEN_NOT_FOUND") {
                        setInvitationStatus("invalid");
                    } else if (result.error === "TOKEN_EXPIRED") {
                        setInvitationStatus("expired");
                    } else if (result.error === "TOKEN_REVOKED") {
                        setInvitationStatus("revoked");
                    } else {
                        setInvitationStatus("invalid");
                    }
                } else {
                    // Valid invite
                    setWorkspaceName(result.workspace_name);
                    setInvitationRole(result.role);
                    setEmail(result.email);
                    setInvitationStatus("valid");
                }
            } catch (error) {
                // Network error or invalid response
                setInvitationStatus("invalid");
            } finally {
                setInitialLoading(false);
            }
        })();
    }, [inviteToken, isInviteFlow]);

    const disabled =
        loading ||
        !agreedToTerms ||
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        (!isInviteFlow && !workspaceName);

    async function handleSignup(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");

        if (!agreedToTerms) {
            setErr("Please agree to Terms & Privacy.");
            return;
        }

        try {
            setLoading(true);

            // Mock: Check if user already exists and owns workspace
            // In production: const { exists, ownsWorkspace } = await checkUserStatus(email);
            const mockUserExists = false; // Set to true to test error flow
            const mockOwnsWorkspace = false;

            if (mockUserExists && mockOwnsWorkspace && !isInviteFlow) {
                setUserOwnsWorkspace(true);
                setLoading(false);
                return;
            }

            const response = await signUp(
                email.trim(),
                password,
                firstName.trim(),
                lastName.trim()
            );

            if (response.kind === "ERROR") {
                // Check for specific error: user already owns a workspace
                if (response.error === "WORKSPACE_OWNER_ALREADY_EXISTS") {
                    setUserOwnsWorkspace(true);
                    setLoading(false);
                    return;
                }
                throw new Error(response.error);
            }

            // Mock: In production, create workspace or attach invite membership here
            if (!isInviteFlow) {
                // await createWorkspace({ name: workspaceName, description: workspaceDescription });
            } else {
                // await acceptInvite(inviteToken);
            }

            setStep("verify");
            setMsg("We've sent a verification code to your email.");
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm(e?: React.FormEvent) {
        e?.preventDefault?.();
        setErr("");
        setMsg("");
        try {
            setLoading(true);
            const response = await cogConfirmSignUp(
                workspaceName,
                email.trim(),
                confirmCode.trim(),
                firstName.trim(),
                lastName.trim()
            );

            if (response.error) {
                throw new Error(response.error);
            }

            setMsg("Email confirmed! Signing you in...");

            // Auto sign in after verification
            const signInResult = await signIn(email.trim(), password);
            if (signInResult.kind === "ERROR") {
                throw new Error(signInResult.error);
            }

            setAccessToken(signInResult.idToken!, 3500);

            // Mock: Get workspace ID from response
            const workspaceId = "mock-workspace-id";

            setTimeout(() => {
                navigate(`/onboarding`); // In production: navigate(`/app/${workspaceId}`)
            }, 1000);
        } catch (e: any) {
            setErr(e?.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleResendCode() {
        if (resendCooldown > 0) return;

        setErr("");
        setMsg("");
        try {
            await resendCode(email);
            setMsg("Verification code resent.");
            setResendCooldown(60);
        } catch (e: any) {
            setErr(e?.message || "Failed to resend code.");
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

            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">
                        {isInviteFlow
                            ? "Create your account"
                            : "Create your new workspace"}
                    </h2>
                </div>
                {/* Step 1: Create Account */}
                {step === "account" && (
                    <div className="space-y-6">
                        {/* Loading state while checking invite */}
                        {isInviteFlow && initialLoading && (
                            <div className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-11 w-full" />
                                <Skeleton className="h-11 w-full" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                        )}

                        {/* Expired Invite Error */}
                        {!initialLoading && invitationStatus === "expired" && (
                            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-3">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2 flex-1">
                                        <p className="font-semibold text-destructive">
                                            Invite link expired
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            This invitation link has expired.
                                            Invitation links are valid for 7
                                            days. Please contact the workspace
                                            admin to send you a new invitation.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() =>
                                            (window.location.href = "/signup")
                                        }
                                        className="flex-1"
                                    >
                                        Create new workspace
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/login")}
                                    >
                                        Log in
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/*Invalid invite token */}
                        {invitationStatus === "invalid" && (
                            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-3">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2 flex-1">
                                        <p className="font-semibold text-destructive">
                                            Invalid invite link
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            This invite link is invalid. If you
                                            believe this is a mistake, please
                                            contact the workspace admin for a
                                            new invitation.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => {
                                            window.location.href = "/signup";
                                        }}
                                        className="flex-1"
                                    >
                                        Create new workspace
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/login")}
                                    >
                                        Log in
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Revoked Invite Error */}
                        {invitationStatus === "revoked" && (
                            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-3">
                                <div className="flex gap-2">
                                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2 flex-1">
                                        <p className="font-semibold text-destructive">
                                            Invite link revoked
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            This invitation has been revoked by
                                            the workspace admin. If you believe
                                            this is a mistake, please contact
                                            the workspace admin for a new
                                            invitation.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={() => {
                                            window.location.href = "/signup";
                                        }}
                                        className="flex-1"
                                    >
                                        Create new workspace
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate("/login")}
                                    >
                                        Log in
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Invite Summary */}
                        {isInviteFlow && invitationStatus === "valid" && (
                            <div className="bg-accent-light border border-border rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Joining workspace
                                        </p>
                                        {initialLoading ? (
                                            <Skeleton className="h-5 w-full my-2" />
                                        ) : (
                                            <p className="font-semibold text-lg">
                                                {workspaceName}
                                            </p>
                                        )}
                                    </div>
                                    {initialLoading ? (
                                        <Skeleton className="h-4 w-10" />
                                    ) : (
                                        <>
                                            <Badge
                                                variant={
                                                    invitationRole === "ADMIN"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {invitationRole}
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* User Already Owns Workspace Error */}
                        {!initialLoading && userOwnsWorkspace && (
                                <div className="bg-destructive/10 border border-destructive rounded-lg p-4 space-y-3">
                                    <div className="flex gap-2">
                                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                        <div className="space-y-2 flex-1">
                                            <p className="font-semibold text-destructive">
                                                You already own a workspace
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                The email {email} already owns a
                                                workspace. Each account can own
                                                only one workspace. Log in to
                                                manage your existing workspace
                                                or use a different email to
                                                create another workspace.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    inviteToken
                                                        ? `/login?invite=${inviteToken}`
                                                        : "/login"
                                                )
                                            }
                                            className="flex-1"
                                        >
                                            Log in to existing workspace
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEmail("");
                                                setUserOwnsWorkspace(false);
                                            }}
                                        >
                                            Use different email
                                        </Button>
                                    </div>
                                </div>
                            )}

                        {!initialLoading &&
                            !userOwnsWorkspace &&
                            invitationStatus === "valid" && (
                                <>
                                    {/* Social Login */}
                                    <div className="space-y-3">
                                        <Button
                                            variant="outline"
                                            className="w-full h-11"
                                            onClick={() =>
                                                hostedUiRedirect("Google")
                                            }
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
                                            onClick={() =>
                                                hostedUiRedirect("AzureAD")
                                            }
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
                                            onClick={() =>
                                                hostedUiRedirect("Slack")
                                            }
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
                                        <span className="text-sm text-muted-foreground">
                                            or
                                        </span>
                                        <Separator className="flex-1" />
                                    </div>

                                    {/* Signup Form */}
                                    <form
                                        className="space-y-4"
                                        onSubmit={handleSignup}
                                    >
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Your account
                                                </Label>
                                                <div className="space-y-3">
                                                    <Input
                                                        type="text"
                                                        placeholder="First name"
                                                        value={firstName}
                                                        onChange={(e) =>
                                                            setFirstName(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-11"
                                                        required
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="Last name"
                                                        value={lastName}
                                                        onChange={(e) =>
                                                            setLastName(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-11"
                                                        required
                                                    />
                                                    <Input
                                                        type="email"
                                                        readOnly={isInviteFlow}
                                                        placeholder="Work email"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-11"
                                                        required
                                                    />
                                                    <Input
                                                        type="password"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-11"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {!isInviteFlow && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">
                                                        Your workspace
                                                    </Label>
                                                    <div className="space-y-3">
                                                        <Input
                                                            type="text"
                                                            placeholder="Workspace name"
                                                            value={
                                                                workspaceName
                                                            }
                                                            onChange={(e) =>
                                                                setWorkspaceName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="h-11"
                                                            required
                                                        />
                                                        <Input
                                                            type="text"
                                                            placeholder="Short description (optional)"
                                                            value={
                                                                workspaceDescription
                                                            }
                                                            onChange={(e) =>
                                                                setWorkspaceDescription(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="h-11"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id="terms"
                                                checked={agreedToTerms}
                                                onCheckedChange={(checked) =>
                                                    setAgreedToTerms(!!checked)
                                                }
                                            />
                                            <Label
                                                htmlFor="terms"
                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                I agree to{" "}
                                                <a
                                                    href="#"
                                                    className="text-primary hover:underline"
                                                >
                                                    Terms
                                                </a>{" "}
                                                and{" "}
                                                <a
                                                    href="#"
                                                    className="text-primary hover:underline"
                                                >
                                                    Privacy Policy
                                                </a>
                                            </Label>
                                        </div>

                                        {err && (
                                            <div className="text-sm text-destructive">
                                                {err}
                                            </div>
                                        )}
                                        {msg && (
                                            <div className="text-sm text-success">
                                                {msg}
                                            </div>
                                        )}

                                        <Button
                                            disabled={disabled}
                                            className="w-full h-11"
                                            type="submit"
                                        >
                                            {loading
                                                ? "Creating..."
                                                : isInviteFlow
                                                ? "Create account and join workspace"
                                                : "Create workspace"}
                                        </Button>
                                    </form>

                                    <div className="text-center text-sm text-muted-foreground">
                                        Already have an account?{" "}
                                        <Link
                                            to={
                                                inviteToken
                                                    ? `/login?invite=${inviteToken}`
                                                    : "/login"
                                            }
                                            className="text-primary hover:underline font-medium"
                                        >
                                            Log in
                                        </Link>
                                    </div>
                                </>
                            )}
                    </div>
                )}

                {/* Step 2: Verify Email */}
                {step === "verify" && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold">
                                Verify your email
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                We've sent a 6-digit verification code to{" "}
                                <span className="font-medium text-foreground">
                                    {email}
                                </span>
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleConfirm}>
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="000000"
                                    value={confirmCode}
                                    onChange={(e) =>
                                        setConfirmCode(e.target.value)
                                    }
                                    className="h-11 text-center text-lg tracking-widest"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            {err && (
                                <div className="text-sm text-destructive">
                                    {err}
                                </div>
                            )}
                            {msg && (
                                <div className="text-sm text-success">
                                    {msg}
                                </div>
                            )}

                            <Button
                                disabled={loading || confirmCode.length !== 6}
                                className="w-full h-11"
                                type="submit"
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </Button>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={handleResendCode}
                                    disabled={resendCooldown > 0}
                                    className="text-sm"
                                >
                                    {resendCooldown > 0
                                        ? `Resend code (${resendCooldown}s)`
                                        : "Resend code"}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
