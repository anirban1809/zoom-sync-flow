import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { cogSignUp, cogConfirmSignUp, hostedUiRedirect } from "@/lib/cognito";

const Signup = () => {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // new state for Cognito flow
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const disabled =
    loading ||
    !agreedToTerms ||
    !email ||
    !password ||
    password !== confirmPassword;

  async function handleSignup(e?: React.FormEvent) {
    e?.preventDefault?.();
    setErr("");
    setMsg("");
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setErr("Please agree to Terms & Privacy.");
      return;
    }
    try {
      setLoading(true);
      // Map first/last to standard Cognito attributes (optional)
      await cogSignUp(email.trim(), password, {
        given_name: firstName.trim(),
        family_name: lastName.trim(),
        // Add custom attrs like "custom:tenantId": "..." if configured in the pool
      });
      setNeedsConfirm(true);
      setMsg("We’ve sent a verification code to your email.");
    } catch (e: any) {
      setErr(
        e?.name === "UsernameExistsException"
          ? "An account with this email already exists."
          : e?.message || "Signup failed."
      );
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
      await cogConfirmSignUp(email.trim(), confirmCode.trim());
      setMsg("Email confirmed. You can log in now.");
      // optional: navigate("/login")
    } catch (e: any) {
      setErr(e?.message || "Confirmation failed.");
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
          <h1 className="text-4xl font-bold mb-2">Create your account</h1>
        </div>

        {/* Social via Hosted UI */}
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
            onClick={() => hostedUiRedirect("AzureAD")} // or "LoginWithAmazon", "Facebook", etc. per your IdP name
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
            onClick={() => hostedUiRedirect("Slack")} // only if Slack OIDC is configured in Cognito
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

        {/* Step 1: Sign up form */}
        {!needsConfirm && (
          <form className="space-y-4" onSubmit={handleSignup}>
            <Input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
              required
            />
            <Input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12 text-base"
            />
            <Input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 text-base"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
              required
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 text-base"
              required
            />

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
              />
              <Label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy
                </a>
              </Label>
            </div>

            {err && <div className="text-sm text-red-600">{err}</div>}
            {msg && <div className="text-sm text-green-600">{msg}</div>}

            <Button
              disabled={disabled}
              className="w-full h-12 text-base"
              size="lg"
              type="submit"
            >
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
        )}

        {/* Step 2: Email confirmation code */}
        {needsConfirm && (
          <form className="space-y-4" onSubmit={handleConfirm}>
            <Label htmlFor="code">
              Enter the verification code sent to {email}
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="6-digit code"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              className="h-12 text-base"
              required
            />
            {err && <div className="text-sm text-red-600">{err}</div>}
            {msg && <div className="text-sm text-green-600">{msg}</div>}
            <div className="flex gap-2">
              <Button
                disabled={loading}
                className="w-full h-12 text-base"
                size="lg"
                type="submit"
              >
                {loading ? "Confirming..." : "Confirm email"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-12 text-base"
                onClick={() => setNeedsConfirm(false)}
              >
                Edit email
              </Button>
            </div>
          </form>
        )}

        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-4">
          <Link to="/login" className="hover:text-foreground">
            Already have an account?
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

export default Signup;
