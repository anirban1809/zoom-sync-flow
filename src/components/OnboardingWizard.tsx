import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, Calendar, Video, Mail, MessageSquare, X, Settings, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type OnboardingStep = "welcome" | "connect" | "workspace" | "defaults" | "privacy" | "complete";
type IntentType = "personal" | "team" | "company" | null;

const OnboardingWizard = ({ open, onOpenChange }: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  
  // Step 1: Welcome & Intent
  const [intent, setIntent] = useState<IntentType>(null);
  const [autoStart, setAutoStart] = useState(true);
  const [language, setLanguage] = useState("en");
  const [locale, setLocale] = useState("US");
  
  // Step 2: Connect
  const [calendarProvider, setCalendarProvider] = useState<string | null>(null);
  const [calendarEmail, setCalendarEmail] = useState("");
  const [conferencingProvider, setConferencingProvider] = useState<string | null>(null);
  const [conferencingEmail, setConferencingEmail] = useState("");
  const [autoJoinOrganizer, setAutoJoinOrganizer] = useState(true);
  const [askBeforeExternal, setAskBeforeExternal] = useState(true);
  
  // Step 3: Workspace
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [requireSSO, setRequireSSO] = useState(false);
  
  // Step 4: Meeting Defaults
  const [recordMeetings, setRecordMeetings] = useState(true);
  const [autoAnnounce, setAutoAnnounce] = useState(true);
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("en");
  const [diarizeSpeakers, setDiarizeSpeakers] = useState(true);
  const [captureMainRoom, setCaptureMainRoom] = useState(true);
  const [captureBreakout, setCaptureBreakout] = useState(false);
  const [captureChat, setCaptureChat] = useState(true);
  const [detectActionItems, setDetectActionItems] = useState(true);
  const [actionDestination, setActionDestination] = useState("tasks");
  
  // Step 5: Privacy
  const [retentionDays, setRetentionDays] = useState("90");
  const [allowAnalytics, setAllowAnalytics] = useState(false);

  const handleConnectCalendar = (provider: string) => {
    setCalendarProvider(provider);
    setCalendarEmail(`user@${provider === "google" ? "gmail.com" : "outlook.com"}`);
  };

  const handleConnectConferencing = (provider: string) => {
    setConferencingProvider(provider);
    setConferencingEmail(`user@${provider === "google-meet" ? "gmail.com" : provider}.com`);
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

  const stepOrder: OnboardingStep[] = ["welcome", "connect", "workspace", "defaults", "privacy", "complete"];
  
  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const handleFinish = () => {
    setStep("complete");
  };

  const getStepNumber = () => stepOrder.indexOf(step);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">Recordin</span>
          </div>
          
          {step !== "complete" && (
            <>
              {/* Stepper */}
              <div className="flex items-center gap-2">
                {stepOrder.slice(0, -1).map((s, idx) => (
                  <div
                    key={s}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx <= getStepNumber() ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleSkip}>
                  Skip for now
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleNext}
                  disabled={
                    (step === "welcome" && !intent) ||
                    (step === "connect" && (!calendarProvider || !conferencingProvider))
                  }
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-8">
            
            {/* Step 1: Welcome & Intent */}
            {step === "welcome" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Set up your workspace in under a minute.</h1>
                  <p className="text-muted-foreground">You can change all of this later.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">What will you use this for?</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "personal", label: "Personal notes" },
                      { value: "team", label: "Small team" },
                      { value: "company", label: "Company rollout" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setIntent(option.value as IntentType)}
                        className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${
                          intent === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="auto-start" className="font-medium">
                      Auto-start on calendar events
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically join and record scheduled meetings
                    </p>
                  </div>
                  <Switch 
                    id="auto-start" 
                    checked={autoStart} 
                    onCheckedChange={setAutoStart} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <Select value={locale} onValueChange={setLocale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="EU">Europe</SelectItem>
                        <SelectItem value="AS">Asia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Connect Meetings */}
            {step === "connect" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Connect meetings</h1>
                  <p className="text-muted-foreground">
                    Connect your calendar and conferencing tools with one tap each.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Calendar</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "google", name: "Google Calendar", icon: Calendar },
                        { id: "microsoft", name: "Microsoft 365", icon: Calendar }
                      ].map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => handleConnectCalendar(provider.id)}
                          className={`flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all ${
                            calendarProvider === provider.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <provider.icon className="h-8 w-8" />
                          <div className="text-center">
                            <div className="font-medium">{provider.name}</div>
                            {calendarProvider === provider.id && (
                              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                <Check className="h-3 w-3" />
                                <span>{calendarEmail}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Conferencing</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "google-meet", name: "Google Meet", icon: Video },
                        { id: "zoom", name: "Zoom", icon: Video },
                        { id: "teams", name: "Microsoft Teams", icon: Video }
                      ].map((provider) => (
                        <button
                          key={provider.id}
                          onClick={() => handleConnectConferencing(provider.id)}
                          className={`flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-all ${
                            conferencingProvider === provider.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <provider.icon className="h-8 w-8" />
                          <div className="text-center">
                            <div className="font-medium text-sm">{provider.name}</div>
                            {conferencingProvider === provider.id && (
                              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                <Check className="h-3 w-3" />
                                <span>Connected</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <Label className="text-base font-medium">Default behavior</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-join-org" className="text-sm">
                          Auto-join when I'm the organizer
                        </Label>
                        <Switch 
                          id="auto-join-org" 
                          checked={autoJoinOrganizer} 
                          onCheckedChange={setAutoJoinOrganizer} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ask-external" className="text-sm">
                          Ask before joining external meetings
                        </Label>
                        <Switch 
                          id="ask-external" 
                          checked={askBeforeExternal} 
                          onCheckedChange={setAskBeforeExternal} 
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Read upcoming events; only record with explicit consent.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!calendarProvider || !conferencingProvider}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Workspace & Collaborators */}
            {step === "workspace" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Workspace & collaborators</h1>
                  <p className="text-muted-foreground">
                    Name your workspace and optionally invite teammates.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Workspace name</Label>
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="My Workspace"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Add teammates (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInviteEmail())}
                        placeholder="colleague@company.com"
                      />
                      <Button onClick={addInviteEmail} variant="outline">
                        Add
                      </Button>
                    </div>

                    {inviteEmails.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {inviteEmails.map((email) => (
                          <Badge key={email} variant="secondary" className="gap-1">
                            {email}
                            <button onClick={() => removeInviteEmail(email)} className="ml-1">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {inviteEmails.length > 0 && (
                    <>
                      <div className="space-y-3">
                        <Label>Default role for invited users</Label>
                        <RadioGroup value={inviteRole} onValueChange={(val) => setInviteRole(val as "member" | "admin")}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="member" id="member" />
                            <Label htmlFor="member" className="cursor-pointer">Member</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="admin" />
                            <Label htmlFor="admin" className="cursor-pointer">Admin</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <Label htmlFor="require-sso" className="text-sm">
                          Require SSO for invited users
                        </Label>
                        <Switch 
                          id="require-sso" 
                          checked={requireSSO} 
                          onCheckedChange={setRequireSSO} 
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Meeting Defaults */}
            {step === "defaults" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Meeting defaults</h1>
                  <p className="text-muted-foreground">
                    Set your minimum viable capture rules.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Recording & consent</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="record" className="text-sm">Record meetings I organize</Label>
                          <Switch id="record" checked={recordMeetings} onCheckedChange={setRecordMeetings} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="announce" className="text-sm">Auto-announce recording</Label>
                          <Switch id="announce" checked={autoAnnounce} onCheckedChange={setAutoAnnounce} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Transcription</Label>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Language</Label>
                          <Select value={transcriptionLanguage} onValueChange={setTranscriptionLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="diarize" className="text-sm">Diarize speakers</Label>
                            <p className="text-xs text-muted-foreground">Label speakers by name if possible</p>
                          </div>
                          <Switch id="diarize" checked={diarizeSpeakers} onCheckedChange={setDiarizeSpeakers} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Capture scope</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="main-room" checked={captureMainRoom} onCheckedChange={(c) => setCaptureMainRoom(c as boolean)} />
                          <Label htmlFor="main-room" className="text-sm cursor-pointer">Main room</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="breakout" checked={captureBreakout} onCheckedChange={(c) => setCaptureBreakout(c as boolean)} disabled />
                          <Label htmlFor="breakout" className="text-sm cursor-not-allowed text-muted-foreground">
                            Breakout rooms <Badge variant="outline" className="ml-1">Coming soon</Badge>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="chat" checked={captureChat} onCheckedChange={(c) => setCaptureChat(c as boolean)} />
                          <Label htmlFor="chat" className="text-sm cursor-pointer">Chat messages summary</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Action items</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="action-items" className="text-sm">Detect action items & owners</Label>
                          <Switch id="action-items" checked={detectActionItems} onCheckedChange={setDetectActionItems} />
                        </div>
                        {detectActionItems && (
                          <div className="space-y-2">
                            <Label className="text-sm">Destination</Label>
                            <div className="flex gap-2">
                              {["tasks", "jira", "slack", "email"].map((dest) => (
                                <button
                                  key={dest}
                                  onClick={() => setActionDestination(dest)}
                                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    actionDestination === dest
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                  }`}
                                >
                                  {dest.charAt(0).toUpperCase() + dest.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Preview</Label>
                    <div className="p-4 border rounded-lg space-y-4 bg-muted/30">
                      <div className="space-y-2">
                        <div className="font-medium">Weekly Sync - Product Team</div>
                        <div className="text-xs text-muted-foreground">Nov 15, 2024 • 45 min</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Key Points</div>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                          <li>• Q4 roadmap priorities discussed</li>
                          <li>• Launch date confirmed for Dec 1</li>
                          <li>• Budget approved for additional resources</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Action Items</div>
                        <div className="space-y-2">
                          <div className="text-xs p-2 bg-background rounded border">
                            <div className="font-medium">Update timeline doc</div>
                            <div className="text-muted-foreground">Sarah Chen • Due Nov 17</div>
                          </div>
                          <div className="text-xs p-2 bg-background rounded border">
                            <div className="font-medium">Review design mocks</div>
                            <div className="text-muted-foreground">Alex Kim • Due Nov 18</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-xs">
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-muted-foreground">Send to Slack → #project-alpha</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Privacy & Data Control */}
            {step === "privacy" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Privacy & data control</h1>
                  <p className="text-muted-foreground">
                    Set retention policies and control your data.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Data retention</Label>
                    <Select value={retentionDays} onValueChange={setRetentionDays}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days (recommended)</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Where your data lives</Label>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Open Data Management
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All recordings, transcripts, and summaries are encrypted at rest and in transit.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="analytics" 
                      checked={allowAnalytics} 
                      onCheckedChange={(c) => setAllowAnalytics(c as boolean)} 
                    />
                    <Label htmlFor="analytics" className="text-sm cursor-pointer">
                      Allow anonymized product analytics
                    </Label>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 You can export transcripts, summaries, and tasks anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleFinish}>
                    Finish setup
                  </Button>
                </div>
              </div>
            )}

            {/* Completion Screen */}
            {step === "complete" && (
              <div className="space-y-8 text-center">
                <div className="space-y-3">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold">You're set.</h1>
                  <p className="text-muted-foreground">Your workspace is ready to capture and summarize meetings.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/meetings");
                    }}
                    className="group p-6 border-2 rounded-lg hover:border-primary transition-all text-left"
                  >
                    <Calendar className="h-8 w-8 text-primary mb-3" />
                    <div className="font-semibold mb-1">Create a test meeting</div>
                    <div className="text-sm text-muted-foreground">
                      Schedule a meeting and see the capture flow in action
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/ai-chat");
                    }}
                    className="group p-6 border-2 rounded-lg hover:border-primary transition-all text-left"
                  >
                    <MessageSquare className="h-8 w-8 text-primary mb-3" />
                    <div className="font-semibold mb-1">Try AI chat</div>
                    <div className="text-sm text-muted-foreground">
                      Ask questions about your meetings and get instant answers
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/integrations")}
                  >
                    Manage integrations
                  </Button>
                  <span className="text-muted-foreground">•</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/");
                    }}
                  >
                    Go to dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {step !== "complete" && (
          <div className="border-t px-6 py-3 bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Your privacy matters.{" "}
              <button 
                onClick={() => navigate("/data-management")}
                className="underline hover:text-foreground"
              >
                Learn about data management
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
