import { Plus, Check, Settings, ExternalLink, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const connectedIntegrations = [
  {
    id: "1",
    name: "Salesforce",
    category: "CRM",
    icon: "☁️",
    description: "Sync accounts, contacts, and meeting notes",
    connected: true,
    syncStatus: "Active",
    lastSync: "5 minutes ago",
    records: 2847,
  },
  {
    id: "2",
    name: "Slack",
    category: "Communication",
    icon: "💬",
    description: "Send meeting summaries and notifications",
    connected: true,
    syncStatus: "Active",
    lastSync: "2 minutes ago",
    channels: 12,
  },
  {
    id: "3",
    name: "HubSpot",
    category: "CRM",
    icon: "🟠",
    description: "Update deals and log activities",
    connected: true,
    syncStatus: "Active",
    lastSync: "1 hour ago",
    records: 1523,
  },
];

const availableIntegrations = [
  {
    id: "4",
    name: "Zoom",
    category: "Meeting Platform",
    icon: "🎥",
    description: "Record and transcribe Zoom meetings automatically",
    popular: true,
  },
  {
    id: "5",
    name: "Microsoft Teams",
    category: "Meeting Platform",
    icon: "💼",
    description: "Join and record Teams meetings",
    popular: true,
  },
  {
    id: "6",
    name: "Google Meet",
    category: "Meeting Platform",
    icon: "📹",
    description: "Capture Google Meet conversations",
    popular: true,
  },
  {
    id: "7",
    name: "Notion",
    category: "Productivity",
    icon: "📝",
    description: "Sync meeting notes to your Notion workspace",
    popular: false,
  },
  {
    id: "8",
    name: "Zapier",
    category: "Automation",
    icon: "⚡",
    description: "Connect to 5000+ apps via Zapier",
    popular: true,
  },
  {
    id: "9",
    name: "Jira",
    category: "Project Management",
    icon: "🔷",
    description: "Create and update issues from meetings",
    popular: false,
  },
];

export default function Integrations() {
  return (
    <div className="pt-8 pl-8 pr-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect your tools and automate your workflows
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Connected Apps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {connectedIntegrations.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {availableIntegrations.length} available
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                connectedIntegrations.filter((i) => i.syncStatus === "Active")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Records Synced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.3K</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connected">
            Connected ({connectedIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available ({availableIntegrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Integrations</CardTitle>
              <CardDescription>
                Manage your connected apps and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectedIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <span className="text-3xl">{integration.icon}</span>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge
                            variant="outline"
                            className="bg-success/10 text-success border-success/20"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {integration.syncStatus}
                          </Badge>
                          <Badge variant="secondary">
                            {integration.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>Last sync: {integration.lastSync}</span>
                      {integration.records && (
                        <span>
                          {integration.records.toLocaleString()} records
                        </span>
                      )}
                      {integration.channels && (
                        <span>{integration.channels} channels</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Sync Now
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>
                Connect new apps to extend functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between border rounded-xl p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex gap-3 flex-1">
                    <span className="text-3xl">{integration.icon}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{integration.name}</h4>
                        <Badge variant="secondary">
                          {integration.category}
                        </Badge>
                        {integration.popular && (
                          <Badge
                            variant="outline"
                            className="bg-highlight/10 text-highlight border-highlight/20"
                          >
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      Learn More
                    </Button>
                    <Button size="sm">
                      <Plus className="h-3 w-3 mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Need a Custom Integration?</CardTitle>
              </div>
              <CardDescription>
                Use our API or Zapier to connect any app
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline">View API Docs</Button>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Connect via Zapier
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
