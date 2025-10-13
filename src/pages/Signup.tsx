import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Mail, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleMagicLink = () => {
    setMagicLinkSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
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

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground w-full">
              <ChevronDown className={`h-4 w-4 mr-1 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
              Advanced fields
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

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

          <Button onClick={handleMagicLink} className="w-full h-12 text-base" size="lg">
            <Mail className="mr-2 h-5 w-5" />
            Get magic link
          </Button>

          {magicLinkSent && (
            <p className="text-sm text-muted-foreground text-center">
              We emailed you a secure sign-in link
            </p>
          )}

          <p className="text-sm text-muted-foreground text-center pt-2">
            You can add teammates later
          </p>
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
