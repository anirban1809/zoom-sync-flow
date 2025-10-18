import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, MessageSquare, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";

interface CreateAutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRecipe?: string | null;
}

const recipes = [
  {
    id: "slack-recap",
    name: "Send recap to Slack",
    description:
      "Post meeting summary to a Slack channel with decisions, action items, and links",
    icon: MessageSquare,
  },
  {
    id: "email-recap",
    name: "Email recap to attendees",
    description:
      "Email the recap to all attendees with optional additional recipients",
    icon: Mail,
  },
  {
    id: "create-tasks",
    name: "Create tasks from action items",
    description:
      "Automatically create tasks in Jira, Linear, or Asana from detected action items",
    icon: CheckSquare,
  },
];

export default function CreateAutomationModal({
  open,
  onOpenChange,
  selectedRecipe,
}: CreateAutomationModalProps) {
  const [step, setStep] = useState(1);
  const [recipe, setRecipe] = useState(selectedRecipe || "");

  // Step 2 - Configure
  const [scope, setScope] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Destination config
  const [slackChannel, setSlackChannel] = useState("");
  const [includeAttendees, setIncludeAttendees] = useState(true);
  const [additionalRecipients, setAdditionalRecipients] = useState("");
  const [emailSubjectPrefix, setEmailSubjectPrefix] = useState("[Meeting Recap]");
  const [taskApp, setTaskApp] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskAssigneeMode, setTaskAssigneeMode] = useState("speaker");
  const [taskPriority, setTaskPriority] = useState("medium");

  // Content & timing
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeDecisions, setIncludeDecisions] = useState(true);
  const [includeActionItems, setIncludeActionItems] = useState(true);
  const [includeTranscriptLink, setIncludeTranscriptLink] = useState(true);
  const [summaryLength, setSummaryLength] = useState("standard");
  const [timing, setTiming] = useState("immediate");
  const [delayMinutes, setDelayMinutes] = useState("5");
  const [requireReview, setRequireReview] = useState(false);

  const handleNext = () => {
    if (step === 1 && !recipe) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreate = (turnOn: boolean) => {
    console.log("Creating automation:", {
      recipe,
      scope,
      selectedTags,
      selectedProviders,
      destination: {
        slackChannel,
        includeAttendees,
        additionalRecipients,
        emailSubjectPrefix,
        taskApp,
        taskProject,
        taskAssigneeMode,
        taskPriority,
      },
      content: {
        includeSummary,
        includeDecisions,
        includeActionItems,
        includeTranscriptLink,
        summaryLength,
      },
      timing: timing === "immediate" ? "immediate" : `delay-${delayMinutes}`,
      requireReview,
      turnOn,
    });
    onOpenChange(false);
    // Reset form
    setStep(1);
    setRecipe("");
  };

  const selectedRecipeData = recipes.find((r) => r.id === recipe);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Choose Recipe"}
            {step === 2 && "Configure Automation"}
            {step === 3 && "Review & Create"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Select the type of automation you want to create"}
            {step === 2 && "Set up when and how this automation should run"}
            {step === 3 && "Review your automation before creating it"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 - Choose Recipe */}
          {step === 1 && (
            <RadioGroup value={recipe} onValueChange={setRecipe}>
              <div className="space-y-3">
                {recipes.map((r) => (
                  <Label
                    key={r.id}
                    htmlFor={r.id}
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
                      recipe === r.id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <RadioGroupItem value={r.id} id={r.id} className="mt-1" />
                    <div className="p-2 rounded-lg bg-primary/10">
                      <r.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {r.description}
                      </div>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Step 2 - Configure */}
          {step === 2 && (
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {/* Scope */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Scope</Label>
                <RadioGroup value={scope} onValueChange={setScope}>
                  <div className="space-y-2">
                    <Label
                      htmlFor="scope-all"
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                    >
                      <RadioGroupItem value="all" id="scope-all" />
                      <span>All meetings</span>
                    </Label>
                    <Label
                      htmlFor="scope-mine"
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                    >
                      <RadioGroupItem value="mine" id="scope-mine" />
                      <span>My meetings</span>
                    </Label>
                    <Label
                      htmlFor="scope-tags"
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                    >
                      <RadioGroupItem value="tags" id="scope-tags" />
                      <span>Meetings with specific tags</span>
                    </Label>
                    {scope === "tags" && (
                      <div className="ml-9 space-y-2">
                        {["Sales Standups", "Customer Calls", "1:1s"].map((tag) => (
                          <Label
                            key={tag}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTags([...selectedTags, tag]);
                                } else {
                                  setSelectedTags(
                                    selectedTags.filter((t) => t !== tag)
                                  );
                                }
                              }}
                            />
                            <span className="text-sm">{tag}</span>
                          </Label>
                        ))}
                      </div>
                    )}
                    <Label
                      htmlFor="scope-providers"
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                    >
                      <RadioGroupItem value="providers" id="scope-providers" />
                      <span>Meetings from specific providers</span>
                    </Label>
                    {scope === "providers" && (
                      <div className="ml-9 space-y-2">
                        {["Zoom", "Microsoft Teams", "Google Meet"].map(
                          (provider) => (
                            <Label
                              key={provider}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={selectedProviders.includes(provider)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProviders([
                                      ...selectedProviders,
                                      provider,
                                    ]);
                                  } else {
                                    setSelectedProviders(
                                      selectedProviders.filter(
                                        (p) => p !== provider
                                      )
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm">{provider}</span>
                            </Label>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Destination */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Destination</Label>
                {recipe === "slack-recap" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="slack-channel">Slack Channel</Label>
                      <Input
                        id="slack-channel"
                        placeholder="#general"
                        value={slackChannel}
                        onChange={(e) => setSlackChannel(e.target.value)}
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave empty to use the meeting's last Slack channel if
                        available
                      </p>
                    </div>
                  </div>
                )}
                {recipe === "email-recap" && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={includeAttendees}
                        onCheckedChange={(checked) =>
                          setIncludeAttendees(checked as boolean)
                        }
                      />
                      <span className="text-sm">Include all attendees</span>
                    </Label>
                    <div>
                      <Label htmlFor="additional-recipients">
                        Additional Recipients
                      </Label>
                      <Input
                        id="additional-recipients"
                        placeholder="email@example.com, team@example.com"
                        value={additionalRecipients}
                        onChange={(e) => setAdditionalRecipients(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject-prefix">Subject Prefix</Label>
                      <Input
                        id="subject-prefix"
                        value={emailSubjectPrefix}
                        onChange={(e) => setEmailSubjectPrefix(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                )}
                {recipe === "create-tasks" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="task-app">Task Management App</Label>
                      <Select value={taskApp} onValueChange={setTaskApp}>
                        <SelectTrigger id="task-app" className="mt-1.5">
                          <SelectValue placeholder="Select app" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jira">Jira</SelectItem>
                          <SelectItem value="linear">Linear</SelectItem>
                          <SelectItem value="asana">Asana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="task-project">Project / Team</Label>
                      <Input
                        id="task-project"
                        placeholder="e.g., SPRINT, ENG-TEAM"
                        value={taskProject}
                        onChange={(e) => setTaskProject(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignee-mode">Default Assignee</Label>
                      <Select
                        value={taskAssigneeMode}
                        onValueChange={setTaskAssigneeMode}
                      >
                        <SelectTrigger id="assignee-mode" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="speaker">
                            Detected speaker (from transcript)
                          </SelectItem>
                          <SelectItem value="owner">Meeting owner</SelectItem>
                          <SelectItem value="fallback">Unassigned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="task-priority">Default Priority</Label>
                      <Select
                        value={taskPriority}
                        onValueChange={setTaskPriority}
                      >
                        <SelectTrigger id="task-priority" className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Content */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Content</Label>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeSummary}
                      onCheckedChange={(checked) =>
                        setIncludeSummary(checked as boolean)
                      }
                    />
                    <span className="text-sm">Include summary</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeDecisions}
                      onCheckedChange={(checked) =>
                        setIncludeDecisions(checked as boolean)
                      }
                    />
                    <span className="text-sm">Include decisions</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeActionItems}
                      onCheckedChange={(checked) =>
                        setIncludeActionItems(checked as boolean)
                      }
                    />
                    <span className="text-sm">Include action items</span>
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={includeTranscriptLink}
                      onCheckedChange={(checked) =>
                        setIncludeTranscriptLink(checked as boolean)
                      }
                    />
                    <span className="text-sm">Include transcript link</span>
                  </Label>
                </div>
                <div>
                  <Label htmlFor="summary-length">Summary Length</Label>
                  <Select value={summaryLength} onValueChange={setSummaryLength}>
                    <SelectTrigger id="summary-length" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Timing */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Timing</Label>
                <RadioGroup value={timing} onValueChange={setTiming}>
                  <Label
                    htmlFor="timing-immediate"
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                  >
                    <RadioGroupItem value="immediate" id="timing-immediate" />
                    <span>Send immediately after meeting ends</span>
                  </Label>
                  <Label
                    htmlFor="timing-delay"
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50"
                  >
                    <RadioGroupItem value="delay" id="timing-delay" />
                    <span>Delay by</span>
                  </Label>
                </RadioGroup>
                {timing === "delay" && (
                  <div className="ml-9">
                    <Select value={delayMinutes} onValueChange={setDelayMinutes}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              {/* Safeguard */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Safeguard</Label>
                <Label className="flex items-start gap-2 cursor-pointer">
                  <Checkbox
                    checked={requireReview}
                    onCheckedChange={(checked) =>
                      setRequireReview(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div>
                    <span className="text-sm">Require manual review before sending/creating</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      A draft will be sent to you for approval before the action is executed
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          )}

          {/* Step 3 - Review */}
          {step === 3 && (
            <div className="space-y-4">
              {selectedRecipeData && (
                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <selectedRecipeData.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{selectedRecipeData.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedRecipeData.description}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Trigger</span>
                  <span className="font-medium">After meeting ends</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Scope</span>
                  <span className="font-medium">
                    {scope === "all" && "All meetings"}
                    {scope === "mine" && "My meetings"}
                    {scope === "tags" &&
                      `Meetings with tags: ${selectedTags.join(", ")}`}
                    {scope === "providers" &&
                      `Meetings from: ${selectedProviders.join(", ")}`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">
                    {recipe === "slack-recap" &&
                      (slackChannel || "Meeting's last channel")}
                    {recipe === "email-recap" &&
                      (includeAttendees
                        ? "All attendees"
                        : additionalRecipients)}
                    {recipe === "create-tasks" &&
                      `${taskApp}: ${taskProject || "Default project"}`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Content</span>
                  <div className="text-right">
                    {[
                      includeSummary && "Summary",
                      includeDecisions && "Decisions",
                      includeActionItems && "Action items",
                      includeTranscriptLink && "Transcript link",
                    ]
                      .filter(Boolean)
                      .map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="ml-1">
                          {item}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Timing</span>
                  <span className="font-medium">
                    {timing === "immediate"
                      ? "Immediate"
                      : `Delay ${delayMinutes} minutes`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Manual review</span>
                  <span className="font-medium">
                    {requireReview ? "Required" : "Not required"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-3">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext} disabled={step === 1 && !recipe}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleCreate(false)}>
                  Create as off
                </Button>
                <Button onClick={() => handleCreate(true)}>
                  Create & turn on
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
