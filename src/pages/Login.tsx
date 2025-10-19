import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Login = () => {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLink = () => {
    setMagicLinkSent(true);
  };

  const handleLogin = () => {
    console.log("Login with password");
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
          <h1 className="text-4xl font-bold mb-8">Recordin</h1>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full h-12 text-base" size="lg">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full h-12 text-base" size="lg">
            <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="w-5 h-5 mr-2" />
            Continue with Microsoft
          </Button>
          <Button variant="outline" className="w-full h-12 text-base" size="lg">
            <img src="https://slack.com/favicon.ico" alt="Slack" className="w-5 h-5 mr-2" />
            Continue with Slack
          </Button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
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

          {!showPassword ? (
            <>
              <Button onClick={handleMagicLink} className="w-full h-12 text-base" size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Get magic link
              </Button>
              {magicLinkSent && (
                <p className="text-sm text-muted-foreground text-center">
                  We emailed you a secure sign-in link
                </p>
              )}
            </>
          ) : (
            <>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <Button onClick={handleLogin} className="w-full h-12 text-base" size="lg">
                Login
              </Button>
            </>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-primary hover:underline"
            >
              {showPassword ? "Use magic link instead" : "Use password instead"}
            </button>
          </div>
        </div>

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
