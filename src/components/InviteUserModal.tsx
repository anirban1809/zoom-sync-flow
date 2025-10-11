import { useState } from 'react';
import { X, Upload, Copy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserModal({ open, onOpenChange }: InviteUserModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [selectedRole, setSelectedRole] = useState('member');
  const [licenseType, setLicenseType] = useState('seat');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [autoJoinMeetings, setAutoJoinMeetings] = useState(false);
  const [viewTranscripts, setViewTranscripts] = useState(true);

  const handleAddEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      e.preventDefault();
      const trimmedEmail = emailInput.trim();
      if (!emails.includes(trimmedEmail)) {
        setEmails([...emails, trimmedEmail]);
        setEmailInput('');
      }
    }
  };

  const handlePasteEmails = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteText = e.clipboardData.getData('text');
    const emailList = pasteText.split(/[\n,;]/).map(email => email.trim()).filter(email => email);
    const newEmails = emailList.filter(email => !emails.includes(email));
    if (newEmails.length > 0) {
      setEmails([...emails, ...newEmails]);
      setEmailInput('');
      e.preventDefault();
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleGenerateLink = () => {
    setInviteLink(`https://recordin.ai/invite/${Math.random().toString(36).substring(7)}`);
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  };

  const handleSendInvites = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Invite users</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6">
            {/* 1) Add people */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Add people</Label>
              
              <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px] bg-background">
                {emails.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-2 h-7">
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
                  placeholder="Enter email addresses (press Enter to add multiple)..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleAddEmail}
                  onPaste={handlePasteEmails}
                  className="flex-1 min-w-[250px] border-0 shadow-none focus-visible:ring-0 p-0"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from CSV
                </Button>
                <Button variant="outline" size="sm">
                  Add from Google Workspace
                </Button>
                <Button variant="outline" size="sm">
                  Add from Microsoft 365
                </Button>
              </div>
            </div>

            <Separator />

            {/* 2) Basics */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Basics</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">License type</Label>
                  <Select value={licenseType} onValueChange={setLicenseType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seat">Seat</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
            </div>

            <Separator />

            {/* 3) Advanced settings */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                  <Label className="text-base font-semibold cursor-pointer">Advanced settings</Label>
                  {advancedOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm">Workspace/project</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All workspaces</SelectItem>
                      <SelectItem value="sales">Sales workspace</SelectItem>
                      <SelectItem value="engineering">Engineering workspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Team/group</Label>
                  <Select defaultValue="none">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No team</SelectItem>
                      <SelectItem value="sales">Sales team</SelectItem>
                      <SelectItem value="engineering">Engineering team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Data scope</Label>
                  <Input placeholder="Search and select data scope..." />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-join" className="text-sm font-normal">
                    Allow auto-join to meetings
                  </Label>
                  <Switch
                    id="auto-join"
                    checked={autoJoinMeetings}
                    onCheckedChange={setAutoJoinMeetings}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="view-transcripts"
                    checked={viewTranscripts}
                    onCheckedChange={(checked) => setViewTranscripts(checked as boolean)}
                  />
                  <Label htmlFor="view-transcripts" className="text-sm font-normal">
                    View transcripts and recordings
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">DLP policy</Label>
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

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Invite link controls</Label>
                  
                  {!inviteLink ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGenerateLink}
                    >
                      Generate link
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input value={inviteLink} readOnly className="flex-1" />
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
                          <Label className="text-sm">Expiry</Label>
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
                          <Label className="text-sm">Max uses</Label>
                          <Input type="number" defaultValue="10" min="1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* 4) Summary */}
            <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
              <Label className="text-base font-semibold">Summary</Label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipients:</span>
                  <span className="font-medium">{emails.length} {emails.length === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium capitalize">{selectedRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License type:</span>
                  <span className="font-medium capitalize">{licenseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invite method:</span>
                  <span className="font-medium">
                    {sendWelcomeEmail ? 'Email' : 'Link only'}
                    {inviteLink && ' + Link'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
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
            <Button 
              onClick={handleSendInvites} 
              disabled={emails.length === 0 || isSending}
            >
              {isSending ? 'Sending...' : 'Send invites'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
