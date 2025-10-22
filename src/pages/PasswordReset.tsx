import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const PasswordReset = () => {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const handlePasswordReset = () => {
    setResetLinkSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-4 right-4"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      </Button>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Recordin</h1>
          <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
          <p className="text-muted-foreground">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <Button onClick={handlePasswordReset} className="w-full h-12 text-base" size="lg">
            Send reset link
          </Button>

          {resetLinkSent && (
            <p className="text-sm text-muted-foreground text-center">
              We've sent a password reset link to your email
            </p>
          )}
        </div>

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
