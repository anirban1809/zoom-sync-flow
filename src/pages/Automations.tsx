import { useState } from "react";
import {
  Plus,
  Zap,
  Play,
  Edit,
  Trash2,
  HelpCircle,
  Mail,
  MessageSquare,
  CheckSquare,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CreateAutomationModal from "@/components/CreateAutomationModal";

const recipes = [
  {
    id: "slack-recap",
    name: "Send recap to Slack",
    description:
      "After a meeting ends, post the summary (decisions, action items, link) to a chosen Slack channel or thread.",
    icon: MessageSquare,
  },
  {
    id: "email-recap",
    name: "Email recap to attendees",
    description:
      "After a meeting ends, email the recap to attendees and optional CCs.",
    icon: Mail,
  },
  {
    id: "create-tasks",
    name: "Create tasks from action items",
    description:
      "After a meeting ends, push detected action items to Jira/Linear/Asana with assignee and due date.",
    icon: CheckSquare,
  },
];

const mockAutomations = [
  {
    id: "1",
    name: "Sales standup recaps",
    enabled: true,
    destination: "#sales-standup",
    scope: "Tag: Sales Standups",
    lastRun: "2 hours ago",
    recipe: "slack-recap",
    config: {
      trigger: "After meeting ends",
      scope: "Meetings with tags: Sales Standups",
      destination: "Slack: #sales-standup",
      content: "Summary, decisions, action items, transcript link",
      timing: "Immediate",
      safeguard: false,
    },
    recentRuns: [
      {
        id: "1",
        timestamp: "2 hours ago",
        status: "success",
        meetingId: "m1",
        meetingTitle: "Sales Standup - Jan 15",
      },
      {
        id: "2",
        timestamp: "1 day ago",
        status: "success",
        meetingId: "m2",
        meetingTitle: "Sales Standup - Jan 14",
      },
      {
        id: "3",
        timestamp: "2 days ago",
        status: "failed",
        meetingId: "m3",
        meetingTitle: "Sales Standup - Jan 13",
        error: "Slack channel not found",
      },
    ],
  },
  {
    id: "2",
    name: "Customer call summaries",
    enabled: true,
    destination: "All attendees",
    scope: "Tag: Customer Calls",
    lastRun: "5 hours ago",
    recipe: "email-recap",
    config: {
      trigger: "After meeting ends",
      scope: "Meetings with tags: Customer Calls",
      destination: "Email: All attendees + cs-team@company.com",
      content: "Summary, decisions, action items, transcript link",
      timing: "Delay 5 minutes",
      safeguard: false,
    },
    recentRuns: [
      {
        id: "1",
        timestamp: "5 hours ago",
        status: "success",
        meetingId: "m4",
        meetingTitle: "Customer Call - Acme Corp",
      },
    ],
  },
  {
    id: "3",
    name: "Sprint planning tasks",
    enabled: false,
    destination: "Jira: SPRINT",
    scope: "My meetings",
    lastRun: "3 days ago",
    recipe: "create-tasks",
    config: {
      trigger: "After meeting ends",
      scope: "My meetings",
      destination: "Jira: SPRINT project",
      content: "Action items with assignee and due date",
      timing: "Immediate",
      safeguard: true,
    },
    recentRuns: [
      {
        id: "1",
        timestamp: "3 days ago",
        status: "success",
        meetingId: "m5",
        meetingTitle: "Sprint Planning",
      },
    ],
  },
];

export default function Automations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<
    (typeof mockAutomations)[0] | null
  >(null);
  const [automations, setAutomations] = useState(mockAutomations);

  const handleSetupRecipe = (recipeId: string) => {
    setSelectedRecipe(recipeId);
    setIsCreateModalOpen(true);
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((auto) => auto.id !== id));
  };

  return (
    <div className="pt-8 pl-8 pr-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground mt-2">
            Automatically handle recap delivery and task creation based on
            meeting events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            What can automations do?
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
        </div>
      </div>

      {/* Recipes Row */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Setup</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:border-primary transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <recipe.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{recipe.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {recipe.description}
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSetupRecipe(recipe.id)}
                >
                  Set up
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* My Automations List */}
      <Card>
        <CardHeader>
          <CardTitle>My Automations</CardTitle>
          <CardDescription>
            Manage your active automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {automations.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first automation
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Automation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAutomation(automation)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Switch
                      checked={automation.enabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAutomation(automation.id);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{automation.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
                        <Badge variant="outline" className="text-xs">
                          {automation.destination}
                        </Badge>
                        <span>•</span>
                        <span>{automation.scope}</span>
                        <span>•</span>
                        <span>Last run {automation.lastRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Run test", automation.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run test
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecipe(automation.recipe);
                        setIsCreateModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAutomation(automation.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Automation Modal */}
      <CreateAutomationModal
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setSelectedRecipe(null);
        }}
        selectedRecipe={selectedRecipe}
      />

      {/* Help Panel */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>What can automations do?</DialogTitle>
            <DialogDescription>
              Learn about the different types of automations you can create
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="flex gap-3">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <recipe.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{recipe.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {recipe.description}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Privacy & Data</h4>
              <p className="text-sm text-muted-foreground">
                Automations only send data to destinations you explicitly
                configure. Meeting summaries include only the information you
                choose (summary, decisions, action items, links). Full
                transcripts are never shared unless you specifically enable that
                option.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Automation Details Drawer */}
      <Sheet
        open={selectedAutomation !== null}
        onOpenChange={(open) => !open && setSelectedAutomation(null)}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedAutomation && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>{selectedAutomation.name}</SheetTitle>
                  <Switch
                    checked={selectedAutomation.enabled}
                    onClick={() => handleToggleAutomation(selectedAutomation.id)}
                  />
                </div>
                <SheetDescription>
                  Automation configuration and recent activity
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Configuration Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Configuration</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Trigger</span>
                      <span className="font-medium">
                        {selectedAutomation.config.trigger}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Scope</span>
                      <span className="font-medium">
                        {selectedAutomation.config.scope}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Destination</span>
                      <span className="font-medium">
                        {selectedAutomation.config.destination}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Content</span>
                      <span className="font-medium">
                        {selectedAutomation.config.content}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Timing</span>
                      <span className="font-medium">
                        {selectedAutomation.config.timing}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Manual review</span>
                      <span className="font-medium">
                        {selectedAutomation.config.safeguard ? "Required" : "Not required"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      setSelectedRecipe(selectedAutomation.recipe);
                      setIsCreateModalOpen(true);
                      setSelectedAutomation(null);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Configuration
                  </Button>
                </div>

                {/* Recent Runs */}
                <div>
                  <h3 className="font-semibold mb-3">Recent Runs</h3>
                  <div className="space-y-2">
                    {selectedAutomation.recentRuns.map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        {run.status === "success" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">
                            {run.meetingTitle}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {run.timestamp}
                            {run.error && (
                              <span className="text-destructive ml-2">
                                • {run.error}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={
                            run.status === "success" ? "default" : "destructive"
                          }
                        >
                          {run.status === "success" ? "Succeeded" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => console.log("Run test")}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Test
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
