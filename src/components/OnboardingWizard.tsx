import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, Calendar, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type OnboardingStep = "welcome" | "calendar" | "capture" | "recap" | "finish" | "invite";

const OnboardingWizard = ({ open, onOpenChange }: OnboardingWizardProps) => {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  
  // Calendar state
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<"google" | "outlook" | null>(null);
  const [connectedEmail, setConnectedEmail] = useState("");
  
  // Capture state
  const [autoJoinEnabled, setAutoJoinEnabled] = useState(true);
  const [captureScope, setCaptureScope] = useState<"organize" | "all">("organize");
  
  // Recap state
  const [recapMethod, setRecapMethod] = useState<"email" | "slack">("email");
  const [slackConnected, setSlackConnected] = useState(false);
  const [slackChannel, setSlackChannel] = useState("");
  const [includeDecisions, setIncludeDecisions] = useState(true);
  const [includeTranscript, setIncludeTranscript] = useState(true);
  
  // Invite state
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  
  // Privacy acknowledgement
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleConnectCalendar = (provider: "google" | "outlook") => {
    setSelectedCalendar(provider);
    setCalendarConnected(true);
    setConnectedEmail(`user@${provider === "google" ? "gmail.com" : "outlook.com"}`);
  };

  const handleConnectSlack = () => {
    setSlackConnected(true);
    setSlackChannel("general");
  };

  const addInviteEmail = () => {
    if (currentEmail && currentEmail.includes("@")) {
      setInviteEmails([...inviteEmails, currentEmail]);
      setCurrentEmail("");
    }
  };

  const removeInviteEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const handleNext = () => {
    const stepOrder: OnboardingStep[] = ["welcome", "calendar", "capture", "recap", "finish"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: OnboardingStep[] = ["welcome", "calendar", "capture", "recap", "finish"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const handleFinish = () => {
    if (!privacyAccepted) return;
    setStep("invite");
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Step 1: Welcome */}
        {step === "welcome" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Welcome to Recordin</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <p className="text-base text-muted-foreground">
                Capture meetings, generate accurate summaries, and share action items automatically.
              </p>
              
              <div className="space-y-3">
                <p className="text-sm font-medium">What happens next:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Connect your calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Enable automatic capture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Choose where recaps go</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleNext} size="lg">
                Get started
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Connect Calendar */}
        {step === "calendar" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Connect calendar</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleConnectCalendar("google")}
                  className={`flex items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                    calendarConnected && selectedCalendar === "google"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Calendar className="h-6 w-6" />
                  <span className="font-medium">Google Calendar</span>
                </button>
                
                <button
                  onClick={() => handleConnectCalendar("outlook")}
                  className={`flex items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all ${
                    calendarConnected && selectedCalendar === "outlook"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Calendar className="h-6 w-6" />
                  <span className="font-medium">Microsoft Outlook</span>
                </button>
              </div>

              {calendarConnected && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="font-medium">Connected:</span>
                    <span className="text-muted-foreground">{connectedEmail}</span>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Used only to find meetings you organize or attend. No emails are read.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button 
                onClick={handleNext} 
                size="lg"
                disabled={!calendarConnected}
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Turn on Capture */}
        {step === "capture" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Turn on capture</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="auto-join" className="text-base font-medium">
                    Auto-join with recorder
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Joins your online meetings and captures transcript + audio where supported.
                  </p>
                </div>
                <Switch 
                  id="auto-join" 
                  checked={autoJoinEnabled} 
                  onCheckedChange={setAutoJoinEnabled} 
                />
              </div>

              {autoJoinEnabled && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">Capture scope</Label>
                  <RadioGroup value={captureScope} onValueChange={(val) => setCaptureScope(val as "organize" | "all")}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="organize" id="organize" />
                      <Label htmlFor="organize" className="flex-1 cursor-pointer">
                        Only meetings I organize
                        <Badge variant="secondary" className="ml-2">Default</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="flex-1 cursor-pointer">
                        All meetings I'm invited to
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {!calendarConnected && (
                <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                  Auto-join works best with a connected calendar.
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                Participants may see a recording notice. You're responsible for obtaining consent.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} size="lg">
                Continue
              </Button>
            </div>
          </>
        )}

        {/* Step 4: Choose Recap Destination */}
        {step === "recap" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Choose recap destination</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Where should recaps go?</Label>
                <RadioGroup value={recapMethod} onValueChange={(val) => setRecapMethod(val as "email" | "slack")}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex-1 cursor-pointer">
                      Email attendees
                      <Badge variant="secondary" className="ml-2">Default</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="slack" id="slack" />
                    <Label htmlFor="slack" className="flex-1 cursor-pointer">
                      Slack channel
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {recapMethod === "slack" && !slackConnected && (
                <div className="p-4 border rounded-lg">
                  <Button onClick={handleConnectSlack} variant="outline" className="w-full">
                    Connect Slack
                  </Button>
                </div>
              )}

              {recapMethod === "slack" && slackConnected && (
                <div className="space-y-2">
                  <Label>Channel</Label>
                  <Input 
                    value={slackChannel} 
                    onChange={(e) => setSlackChannel(e.target.value)}
                    placeholder="#general"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-base font-medium">Content options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="decisions" 
                    checked={includeDecisions} 
                    onCheckedChange={(checked) => setIncludeDecisions(checked as boolean)}
                  />
                  <Label htmlFor="decisions" className="cursor-pointer">
                    Include decisions and action items
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="transcript" 
                    checked={includeTranscript} 
                    onCheckedChange={(checked) => setIncludeTranscript(checked as boolean)}
                  />
                  <Label htmlFor="transcript" className="cursor-pointer">
                    Include link to transcript
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} size="lg">
                Continue
              </Button>
            </div>
          </>
        )}

        {/* Finish: Review & Done */}
        {step === "finish" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Review & done</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Calendar</span>
                  <span className="text-sm text-muted-foreground">
                    {calendarConnected ? `Connected (${selectedCalendar})` : "Not connected"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Capture</span>
                  <span className="text-sm text-muted-foreground">
                    {autoJoinEnabled ? `Auto-join On (${captureScope === "organize" ? "Organize only" : "All meetings"})` : "Off"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Recap</span>
                  <span className="text-sm text-muted-foreground">
                    {recapMethod === "email" ? "Email attendees" : slackConnected ? `Slack #${slackChannel}` : "Not set"}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 p-4 border rounded-lg">
                <Checkbox 
                  id="privacy" 
                  checked={privacyAccepted} 
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                />
                <Label htmlFor="privacy" className="text-sm cursor-pointer leading-relaxed">
                  I understand how meeting data is captured and shared within my workspace.
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button 
                onClick={handleFinish} 
                size="lg"
                disabled={!privacyAccepted}
              >
                Finish
              </Button>
            </div>
          </>
        )}

        {/* Post-finish: Success & Invite */}
        {step === "invite" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">You're set!</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="flex flex-col gap-3">
                <Button onClick={() => onOpenChange(false)} size="lg">
                  Create a test meeting
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)} size="lg">
                  View upcoming meetings
                </Button>
              </div>

              <div className="border-t pt-6 space-y-4">
                <Label className="text-base font-medium">Invite teammates (optional)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="email"
                    placeholder="colleague@company.com"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addInviteEmail()}
                  />
                  <Button onClick={addInviteEmail} variant="outline">
                    Add
                  </Button>
                </div>

                {inviteEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inviteEmails.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1 pr-1">
                        {email}
                        <button 
                          onClick={() => removeInviteEmail(email)}
                          className="ml-1 hover:bg-background/50 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Do this later
              </Button>
              <Button 
                onClick={() => onOpenChange(false)} 
                size="lg"
                disabled={inviteEmails.length === 0}
              >
                Send invites
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
