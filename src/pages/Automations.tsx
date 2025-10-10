import { useState } from 'react';
import { Plus, Zap, Play, Pause, Edit, Trash2, Clock, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import CreateAutomationModal from '@/components/CreateAutomationModal';

const automations = [
  {
    id: '1',
    name: 'Auto-create tasks from action items',
    description: 'Automatically create tasks when action items are mentioned in meetings',
    trigger: 'Meeting ends',
    actions: ['Extract action items', 'Create tasks', 'Assign to attendees'],
    enabled: true,
    runs: 342,
    lastRun: '2 hours ago',
  },
  {
    id: '2',
    name: 'Send meeting summary emails',
    description: 'Send summary emails to all participants after meetings',
    trigger: 'Transcript complete',
    actions: ['Generate summary', 'Send email to attendees'],
    enabled: true,
    runs: 287,
    lastRun: '5 hours ago',
  },
  {
    id: '3',
    name: 'Update CRM with meeting notes',
    description: 'Sync meeting notes and outcomes to your CRM',
    trigger: 'Meeting tagged as "customer"',
    actions: ['Format notes', 'Update CRM record', 'Log activity'],
    enabled: false,
    runs: 156,
    lastRun: '2 days ago',
  },
  {
    id: '4',
    name: 'Alert on competitor mentions',
    description: 'Get notified when competitors are mentioned in meetings',
    trigger: 'Competitor keyword detected',
    actions: ['Send Slack notification', 'Tag meeting', 'Create alert'],
    enabled: true,
    runs: 45,
    lastRun: '1 day ago',
  },
];

const templates = [
  {
    id: '1',
    name: 'Lead Qualification Workflow',
    description: 'Automatically score and qualify leads from sales calls',
    category: 'Sales',
  },
  {
    id: '2',
    name: 'Customer Onboarding',
    description: 'Create onboarding tasks and follow-ups from kickoff meetings',
    category: 'Customer Success',
  },
  {
    id: '3',
    name: 'Weekly Report Generation',
    description: 'Compile weekly meeting insights and send to team',
    category: 'Reporting',
  },
];

export default function Automations() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automations</h1>
          <p className="text-muted-foreground mt-2">
            Automate workflows and tasks based on meeting insights
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      <CreateAutomationModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{automations.filter(a => a.enabled).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {automations.length} total created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {automations.reduce((sum, a) => sum + a.runs, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42h</div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
          <CardDescription>Manage and monitor your automation workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className="border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{automation.name}</h3>
                    <Badge variant={automation.enabled ? 'default' : 'secondary'}>
                      {automation.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{automation.description}</p>
                </div>
                <Switch checked={automation.enabled} />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Play className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">Trigger:</span>
                  <span className="text-muted-foreground">{automation.trigger}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Check className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium">Actions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {automation.actions.map((action, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{automation.runs} runs</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last run: {automation.lastRun}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Templates</CardTitle>
          <CardDescription>Get started quickly with pre-built workflows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between border rounded-xl p-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{template.name}</h4>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <Button variant="outline" size="sm">
                Use Template
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
