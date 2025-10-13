import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Video } from "lucide-react";
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

type OnboardingStep = 1 | 2 | 3 | 4;

interface ProviderState {
  googleCalendar: boolean;
  microsoft365: boolean;
  zoom: boolean;
  teams: boolean;
  meet: boolean;
}

const OnboardingWizard = ({ open, onOpenChange }: OnboardingWizardProps) => {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [providers, setProviders] = useState<ProviderState>({
    googleCalendar: false,
    microsoft365: false,
    zoom: false,
    teams: false,
    meet: false,
  });
  const [autoJoin, setAutoJoin] = useState(true);
  const [captureRule, setCaptureRule] = useState("host");
  const [askBeforeJoining, setAskBeforeJoining] = useState(false);
  const [announceRecording, setAnnounceRecording] = useState(true);
  const [saveLocation, setSaveLocation] = useState("cloud");
  const [keepAudio, setKeepAudio] = useState("90");
  const [keepTranscripts, setKeepTranscripts] = useState("1year");

  const toggleProvider = (provider: keyof ProviderState) => {
    setProviders((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleContinue = () => {
    if (step < 4) {
      setStep((step + 1) as OnboardingStep);
    } else {
      onOpenChange(false);
    }
  };

  const handleSkip = () => {
    if (step < 4) {
      setStep((step + 1) as OnboardingStep);
    } else {
      onOpenChange(false);
    }
  };

  const ProviderTile = ({
    name,
    icon,
    connected,
    onClick,
  }: {
    name: string;
    icon: React.ReactNode;
    connected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
        connected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground"
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium">{name}</span>
      {connected && (
        <Badge variant="secondary" className="ml-auto">
          <Check className="h-3 w-3 mr-1" />
          Connected
        </Badge>
      )}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Connect your calendar and meetings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ProviderTile
                  name="Google Calendar"
                  icon={<Calendar className="h-5 w-5" />}
                  connected={providers.googleCalendar}
                  onClick={() => toggleProvider("googleCalendar")}
                />
                <ProviderTile
                  name="Microsoft 365 Calendar"
                  icon={<Calendar className="h-5 w-5" />}
                  connected={providers.microsoft365}
                  onClick={() => toggleProvider("microsoft365")}
                />
                <ProviderTile
                  name="Zoom"
                  icon={<Video className="h-5 w-5" />}
                  connected={providers.zoom}
                  onClick={() => toggleProvider("zoom")}
                />
                <ProviderTile
                  name="Microsoft Teams"
                  icon={<Video className="h-5 w-5" />}
                  connected={providers.teams}
                  onClick={() => toggleProvider("teams")}
                />
                <ProviderTile
                  name="Google Meet"
                  icon={<Video className="h-5 w-5" />}
                  connected={providers.meet}
                  onClick={() => toggleProvider("meet")}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="auto-join" className="text-base">
                    Auto join meetings you host
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    We only join meetings you host or explicitly choose
                  </p>
                </div>
                <Switch id="auto-join" checked={autoJoin} onCheckedChange={setAutoJoin} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="link" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleContinue} size="lg">
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Choose what to capture</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <Label className="text-base">What should Recordin capture by default?</Label>
                <RadioGroup value={captureRule} onValueChange={setCaptureRule}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="host" id="host" />
                    <Label htmlFor="host" className="flex-1 cursor-pointer">
                      Only meetings I host
                      <Badge variant="secondary" className="ml-2">
                        Recommended
                      </Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="invited" id="invited" />
                    <Label htmlFor="invited" className="flex-1 cursor-pointer">
                      Meetings I am invited to
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual" className="flex-1 cursor-pointer">
                      I will choose per meeting
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="ask-before" className="text-base">
                    Ask before joining every meeting
                  </Label>
                  <Switch
                    id="ask-before"
                    checked={askBeforeJoining}
                    onCheckedChange={setAskBeforeJoining}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="announce" className="text-base">
                    Announce when recording starts
                  </Label>
                  <Switch
                    id="announce"
                    checked={announceRecording}
                    onCheckedChange={setAnnounceRecording}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                You can change this anytime from Settings
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="link" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleContinue} size="lg">
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Where to save and how long to keep</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Save location</Label>
                  <Select value={saveLocation} onValueChange={setSaveLocation}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cloud">Recordin secure cloud</SelectItem>
                      <SelectItem value="custom">Connect my cloud storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Keep audio for</Label>
                  <Select value={keepAudio} onValueChange={setKeepAudio}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Keep transcripts for</Label>
                  <Select value={keepTranscripts} onValueChange={setKeepTranscripts}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="link" className="p-0 h-auto text-sm">
                Advanced settings
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button variant="link" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleContinue} size="lg">
                Finish setup
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">You are set!</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base">Calendar connected</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base">Default capture rule applied</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base">Data saved to Recordin secure cloud</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => onOpenChange(false)} size="lg">
                Create a test meeting
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} size="lg">
                Invite teammates
              </Button>
              <Button variant="link" onClick={() => onOpenChange(false)}>
                Open Settings
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
