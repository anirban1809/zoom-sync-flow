import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, RefreshCw, Check, X, Settings, Clock, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CalendarView from '@/components/CalendarView';

const connectedCalendars = [
  {
    id: '1',
    provider: 'Google Calendar',
    email: 'john.doe@company.com',
    status: 'connected',
    lastSync: '2 minutes ago',
    autoJoin: true,
    meetings: 42,
  },
  {
    id: '2',
    provider: 'Microsoft 365',
    email: 'john@microsoft-account.com',
    status: 'connected',
    lastSync: '5 minutes ago',
    autoJoin: true,
    meetings: 28,
  },
];

const availableProviders = [
  { name: 'Zoom', icon: '🎥', connected: false },
  { name: 'Google Meet', icon: '📹', connected: false },
  { name: 'Microsoft Teams', icon: '💼', connected: false },
];

const autoJoinRules = [
  {
    id: '1',
    name: 'All Sales Calls',
    conditions: 'Title contains "Sales" OR Organizer is sales@company.com',
    actions: 'Auto-join, Record, Transcript',
    enabled: true,
    matched: 156,
  },
  {
    id: '2',
    name: 'Customer Meetings',
    conditions: 'Domain is customer.com',
    actions: 'Auto-join, Transcript only',
    enabled: true,
    matched: 89,
  },
  {
    id: '3',
    name: 'Internal Standups',
    conditions: 'Title contains "Standup" AND Internal only',
    actions: 'No recording, Notes only',
    enabled: false,
    matched: 234,
  },
];

export default function Calendars() {
  const [selectedCalendar, setSelectedCalendar] = useState<typeof connectedCalendars[0] | null>(null);

  if (selectedCalendar) {
    return (
      <CalendarView
        calendarName={selectedCalendar.provider}
        calendarEmail={selectedCalendar.email}
        onBack={() => setSelectedCalendar(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendars</h1>
        <p className="text-muted-foreground mt-2">
          Connect your calendars and configure auto-join rules for meetings
        </p>
      </div>

      <Tabs defaultValue="calendars" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendars">Connected Calendars</TabsTrigger>
          <TabsTrigger value="rules">Auto-Join Rules</TabsTrigger>
          <TabsTrigger value="providers">Meeting Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="calendars" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Calendars</CardTitle>
                  <CardDescription>
                    Manage calendar connections and sync settings
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Calendar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Meetings</TableHead>
                    <TableHead>Auto-join</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connectedCalendars.map((calendar) => (
                    <TableRow 
                      key={calendar.id}
                      className="cursor-pointer"
                      onClick={(e) => {
                        // Don't navigate if clicking on interactive elements
                        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="switch"]')) {
                          return;
                        }
                        setSelectedCalendar(calendar);
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">{calendar.provider}</p>
                            <p className="text-sm text-muted-foreground">{calendar.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <Check className="h-3 w-3 mr-1" />
                          {calendar.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {calendar.lastSync}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {calendar.meetings}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id={`auto-join-${calendar.id}`} 
                            checked={calendar.autoJoin}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Label 
                            htmlFor={`auto-join-${calendar.id}`}
                            className="text-sm cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Enabled
                          </Label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle settings
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle sync
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Sync
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle disconnect
                            }}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Auto-Join Rules</CardTitle>
                  <CardDescription>
                    Define when to automatically join and record meetings
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {autoJoinRules.map((rule) => (
                <div key={rule.id} className="border rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                          {rule.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">When:</span> {rule.conditions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Then:</span> {rule.actions}
                      </p>
                    </div>
                    <Switch checked={rule.enabled} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Matched {rule.matched} meetings
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit Rule</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Providers</CardTitle>
              <CardDescription>
                Connect meeting platforms to enable bot joining and recording
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableProviders.map((provider) => (
                <div key={provider.name} className="flex items-center justify-between border rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.connected ? 'Connected and ready' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button variant={provider.connected ? 'outline' : 'default'}>
                    {provider.connected ? 'Manage' : 'Connect'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
