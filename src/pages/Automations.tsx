import { useState } from 'react';
import { Plus, Zap, Play, Pause, Edit, Trash2, Clock, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Runs</TableHead>
                <TableHead className="text-right">Last Run</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation) => (
                <TableRow key={automation.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">{automation.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{automation.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Play className="h-3 w-3 text-muted-foreground" />
                      <span>{automation.trigger}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {automation.actions.map((action, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={automation.enabled} />
                      <Badge variant={automation.enabled ? 'default' : 'secondary'}>
                        {automation.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{automation.runs}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {automation.lastRun}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Templates</CardTitle>
          <CardDescription>Get started quickly with pre-built workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{template.category}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{template.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
