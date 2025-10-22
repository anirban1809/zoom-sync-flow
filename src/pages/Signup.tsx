import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const Signup = () => {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = () => {
    // Handle signup logic here
    console.log("Signup submitted");
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
          <h1 className="text-4xl font-bold mb-2">Create your account</h1>
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

          <div>
            <Input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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

          <Button onClick={handleSignup} className="w-full h-12 text-base" size="lg">
            Create account
          </Button>
        </div>

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
