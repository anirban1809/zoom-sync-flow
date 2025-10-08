import { useState } from 'react';
import { Settings, Users, Shield, Database, Key, FileText, Clock, CheckCircle2, XCircle, MoreVertical, Plus, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const users = [
  {
    id: '1',
    name: 'Alex Kim',
    email: 'alex@acme.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2 minutes ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@acme.com',
    role: 'Manager',
    status: 'active',
    lastActive: '1 hour ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john@acme.com',
    role: 'Member',
    status: 'active',
    lastActive: '3 hours ago',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '4',
    name: 'Lisa Wang',
    email: 'lisa@acme.com',
    role: 'Member',
    status: 'invited',
    lastActive: 'Never',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
];

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('users');

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-semibold">Admin Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users, roles, and workspace settings
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="workspace">
              <Database className="h-4 w-4 mr-2" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Users & Roles Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage user access and permissions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.status === 'active' ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : (
                              <Clock className="h-4 w-4 text-warning" />
                            )}
                            <span className="capitalize">{user.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Role</DropdownMenuItem>
                              <DropdownMenuItem>View Activity</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Remove User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Define what each role can do</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4">
                  {[
                    { label: 'View all meetings', enabled: true },
                    { label: 'View transcripts', enabled: true },
                    { label: 'Export meetings', enabled: true },
                    { label: 'Share externally', enabled: false },
                    { label: 'Manage integrations', enabled: false },
                    { label: 'Manage users', enabled: false },
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Label htmlFor={`perm-${index}`}>{permission.label}</Label>
                      <Switch id={`perm-${index}`} defaultChecked={permission.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recording & Bot Settings</CardTitle>
                <CardDescription>Configure meeting recording behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-join meetings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically join scheduled meetings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Record video</Label>
                    <p className="text-sm text-muted-foreground">Save video along with audio</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Speaker identification</Label>
                    <p className="text-sm text-muted-foreground">Identify speakers in transcript</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
                <CardDescription>Control how long data is stored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Transcript retention</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Recording retention</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PII Redaction</CardTitle>
                <CardDescription>Automatically remove sensitive information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Credit card numbers',
                  'Social security numbers',
                  'Email addresses',
                  'Phone numbers',
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Label htmlFor={`pii-${index}`}>{item}</Label>
                    <Switch id={`pii-${index}`} defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Configure sign-in methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enforce SSO</Label>
                    <p className="text-sm text-muted-foreground">
                      Require single sign-on for all users
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-factor authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Domain restrictions</Label>
                    <p className="text-sm text-muted-foreground">
                      Only allow emails from approved domains
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sharing & Export</CardTitle>
                <CardDescription>Control how data can be shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>External sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing with external emails
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Download permissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to download transcripts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Watermark exports</Label>
                    <p className="text-sm text-muted-foreground">
                      Add user info to exported files
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Recent security events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: 'User role changed',
                      user: 'Alex Kim',
                      time: '2 hours ago',
                      details: 'Sarah Johnson promoted to Manager',
                    },
                    {
                      action: 'Export created',
                      user: 'John Smith',
                      time: '5 hours ago',
                      details: 'Exported 12 meeting transcripts',
                    },
                    {
                      action: 'Settings modified',
                      user: 'Alex Kim',
                      time: '1 day ago',
                      details: 'Enabled PII redaction',
                    },
                  ].map((event, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.user} • {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
