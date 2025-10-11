import { useState } from 'react';
import { X, Plus, Upload, Copy, RefreshCw, Users, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserModal({ open, onOpenChange }: InviteUserModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [showCSVDialog, setShowCSVDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [autoJoinMeetings, setAutoJoinMeetings] = useState(false);
  const [generateLinkMode, setGenerateLinkMode] = useState(false);
  const [reserveSeat, setReserveSeat] = useState(true);

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      e.preventDefault();
      if (!emails.includes(emailInput.trim())) {
        setEmails([...emails, emailInput.trim()]);
        setEmailInput('');
      }
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleGenerateLink = () => {
    setInviteLink(`https://recordin.ai/invite/${Math.random().toString(36).substring(7)}`);
    setGenerateLinkMode(true);
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle>Invite users</DialogTitle>
              <DialogDescription>
                Add team members and configure their access
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 pb-6">
                {/* Recipients Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Recipients</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCSVDialog(!showCSVDialog)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Paste CSV
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[80px]">
                    {emails.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-2">
                        {email}
                        <button
                          onClick={() => handleRemoveEmail(email)}
                          className="hover:bg-destructive/20 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Input
                      placeholder="Enter email addresses..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={handleAddEmail}
                      className="flex-1 min-w-[200px] border-0 shadow-none focus-visible:ring-0"
                    />
                  </div>

                  {showCSVDialog && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4 space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Email</Label>
                            <Input placeholder="Column 1" className="h-8" />
                          </div>
                          <div>
                            <Label className="text-xs">First name</Label>
                            <Input placeholder="Column 2" className="h-8" />
                          </div>
                          <div>
                            <Label className="text-xs">Last name</Label>
                            <Input placeholder="Column 3" className="h-8" />
                          </div>
                        </div>
                        <Button size="sm" className="w-full">Import</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Separator />

                {/* Role & Access */}
                <div className="space-y-3">
                  <Label>Role & Access</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Role</Label>
                      <Select defaultValue="member">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">License type</Label>
                      <Select defaultValue="full">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full seat</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Workspace access</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All workspaces</SelectItem>
                        <SelectItem value="sales">Sales workspace</SelectItem>
                        <SelectItem value="engineering">Engineering workspace</SelectItem>
                        <SelectItem value="custom">Custom selection...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Team/group</Label>
                    <Select defaultValue="none">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No team</SelectItem>
                        <SelectItem value="sales">Sales team</SelectItem>
                        <SelectItem value="engineering">Engineering team</SelectItem>
                        <SelectItem value="marketing">Marketing team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Data scope</Label>
                    <Input placeholder="Search data scope..." />
                  </div>
                </div>

                <Separator />

                {/* Meeting & Data Permissions */}
                <div className="space-y-3">
                  <Label>Meeting & Data Permissions</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-join" className="text-sm font-normal">
                          Allow joining meetings automatically
                        </Label>
                      </div>
                      <Switch
                        id="auto-join"
                        checked={autoJoinMeetings}
                        onCheckedChange={setAutoJoinMeetings}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="view-transcripts" className="text-sm font-normal">
                        Can view transcripts and recordings
                      </Label>
                      <Checkbox id="view-transcripts" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">DLP policy</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard policy</SelectItem>
                          <SelectItem value="strict">Strict policy</SelectItem>
                          <SelectItem value="custom">Custom policy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Onboarding & Notifications */}
                <div className="space-y-3">
                  <Label>Onboarding & Notifications</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="welcome-email" className="text-sm font-normal">
                        Send welcome email
                      </Label>
                      <Switch
                        id="welcome-email"
                        checked={sendWelcomeEmail}
                        onCheckedChange={setSendWelcomeEmail}
                      />
                    </div>
                    {sendWelcomeEmail && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Custom welcome note</Label>
                        <Textarea
                          placeholder="Add a personal message to the invitation..."
                          className="h-20 resize-none"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Default notifications</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notif-recap" defaultChecked />
                          <Label htmlFor="notif-recap" className="text-sm font-normal">
                            Meeting recap
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notif-action" defaultChecked />
                          <Label htmlFor="notif-action" className="text-sm font-normal">
                            Action items
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notif-mentions" defaultChecked />
                          <Label htmlFor="notif-mentions" className="text-sm font-normal">
                            Mentions
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Timezone</Label>
                        <Select defaultValue="utc">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">EST</SelectItem>
                            <SelectItem value="pst">PST</SelectItem>
                            <SelectItem value="cet">CET</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* SSO & Security */}
                <div className="space-y-3">
                  <Label>SSO & Security</Label>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        SSO domain: <span className="font-medium text-foreground">acme.com</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="2fa-req" className="text-sm font-normal">
                          Require 2FA
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          User must enable 2FA on first login
                        </p>
                      </div>
                      <Switch id="2fa-req" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Invite Link */}
                <div className="space-y-3">
                  <Label>Invite Link (optional)</Label>
                  {!inviteLink ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGenerateLink}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate invite link
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input value={inviteLink} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyLink}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleGenerateLink}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Expiry</Label>
                          <Select defaultValue="7">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">Max uses</Label>
                          <Input type="number" defaultValue="10" min="1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Advanced */}
                <div className="space-y-3">
                  <Label>Advanced</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reserve-seat" className="text-sm font-normal">
                          Reserve seat on send
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Otherwise assign on first sign-in
                        </p>
                      </div>
                      <Switch
                        id="reserve-seat"
                        checked={reserveSeat}
                        onCheckedChange={setReserveSeat}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Auto-assign templates</Label>
                      <Select defaultValue="none">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="onboarding">Onboarding template</SelectItem>
                          <SelectItem value="standard">Standard template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Optional attributes</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="First name" />
                        <Input placeholder="Last name" />
                        <Input placeholder="Title" />
                        <Input placeholder="Department" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/30">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <div className="flex gap-2">
                {inviteLink && (
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy invite link
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Send invite
                      <span className="ml-2">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Send & close</DropdownMenuItem>
                    <DropdownMenuItem>Send & invite more</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Right Rail */}
          <div className="w-80 border-l bg-muted/30 p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Seats
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current</span>
                      <span className="font-medium">12 / 25</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[48%]" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">After invite</span>
                      <span className="font-medium">{12 + emails.length} / 25</span>
                    </div>
                    <Button variant="link" className="h-auto p-0 text-xs">
                      Manage seats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Summary</h3>
              <Card>
                <CardContent className="pt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipients</span>
                    <span className="font-medium">{emails.length} emails</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium">Member</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Access</span>
                    <span className="font-medium">All workspaces</span>
                  </div>
                  {inviteLink && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Link expires</span>
                      <span className="font-medium">7 days</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Welcome email</span>
                    <span className="font-medium">{sendWelcomeEmail ? 'Yes' : 'No'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {emails.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-900 dark:text-blue-100">
                    <p className="font-medium mb-1">Policy notes</p>
                    <p>New members will have access to all historical meetings in their assigned workspaces.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
