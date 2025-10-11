import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Calendar, Users, Video, ExternalLink, Download, Share2, Edit, Clock, CheckCircle2, AlertTriangle, HelpCircle, MessageSquare, Volume2, SkipBack, SkipForward, Link2, Mail, FileText, FileJson, Copy, Check, ArrowLeft, QrCode, X, ChevronDown, Lock, Eye, Download as DownloadIcon, MessageCircle, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMeetings, mockSummaries, mockTranscripts, mockTasks } from '@/lib/mockData';
import { format } from 'date-fns';
import { TaskRow } from '@/components/TaskRow';

export default function MeetingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Share modal state
  const [accessLevel, setAccessLevel] = useState<'invited' | 'link' | 'organization'>('invited');
  const [requirePassword, setRequirePassword] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('never');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState('');
  const [linkPermission, setLinkPermission] = useState<'view' | 'download'>('view');
  const [allowTranscriptDownload, setAllowTranscriptDownload] = useState(true);
  const [allowRecordingDownload, setAllowRecordingDownload] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [allowResharing, setAllowResharing] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [domainRestriction, setDomainRestriction] = useState('');
  const [defaultView, setDefaultView] = useState<'summary' | 'transcript' | 'recording'>('summary');
  const [notifyOnView, setNotifyOnView] = useState(false);
  const [utmTag, setUtmTag] = useState('');
  const meeting = mockMeetings.find(m => m.id === id);
  const summary = meeting?.summaryId ? mockSummaries[meeting.summaryId] : null;
  const transcript = meeting?.transcriptId ? mockTranscripts[meeting.transcriptId] : null;
  const tasks = mockTasks.filter(t => t.meetingId === id);

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const shareUrl = `${window.location.origin}/meetings/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddInvite = () => {
    if (inviteInput.trim() && !inviteEmails.includes(inviteInput.trim())) {
      setInviteEmails([...inviteEmails, inviteInput.trim()]);
      setInviteInput('');
    }
  };

  const handleRemoveInvite = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const handleSendInvites = () => {
    console.log('Sending invites to:', inviteEmails);
    // Implementation would send emails here
    setShareModalOpen(false);
  };

  const handleShare = () => {
    handleCopyLink();
    // Apply settings
    console.log('Share settings applied');
  };

  const handleExport = (format: string) => {
    console.log(`Exporting meeting in ${format} format`);
    // Export logic would go here
    setExportModalOpen(false);
  };

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Meeting not found</h2>
          <p className="text-muted-foreground">The meeting you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const providerColors = {
    zoom: 'bg-blue-500',
    teams: 'bg-purple-500',
    meet: 'bg-green-500',
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/meetings')}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Meetings
      </Button>
      
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-3 w-3 rounded-full ${providerColors[meeting.provider]}`} />
            <Badge>{meeting.provider}</Badge>
            {meeting.status === 'live' && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="h-2 w-2 rounded-full bg-white mr-1.5" />
                Live
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold">{meeting.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{format(meeting.start, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{format(meeting.start, 'h:mm a')} - {format(meeting.end, 'h:mm a')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{meeting.participants.length} participants</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setExportModalOpen(true)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          {meeting.status === 'scheduled' && (
            <Button size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Join Meeting
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {meeting.participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2 rounded-lg border bg-card p-2 pr-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatarUrl} />
                  <AvatarFallback>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{participant.name}</p>
                  {participant.role && (
                    <p className="text-xs text-muted-foreground">{participant.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {meeting.status === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Meeting Recording
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <audio 
                ref={audioRef}
                controls 
                className="w-full"
                style={{
                  height: '40px',
                  accentColor: 'hsl(var(--primary))'
                }}
              >
                <source src="/audio/meeting-recording.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => skipTime(-10)}
                  className="gap-2"
                >
                  <SkipBack className="h-4 w-4" />
                  10s
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => skipTime(10)}
                  className="gap-2"
                >
                  10s
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="tasks">Action Items ({tasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI Summary</CardTitle>
                    <CardDescription>
                      Generated with {Math.round(summary.confidence * 100)}% confidence
                    </CardDescription>
                  </div>
                  <Badge variant={summary.sentiment === 'positive' ? 'default' : summary.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                    {summary.sentiment}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {summary.bullets.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Key Points
                    </h3>
                    <ul className="space-y-3">
                      {summary.bullets.map((bullet, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-muted-foreground mt-0.5">•</span>
                          <div className="flex-1">
                            <p className="text-sm">{bullet.text}</p>
                            {bullet.evidence.length > 0 && (
                              <button className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                                View evidence ({bullet.evidence.length})
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.decisions.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Decisions
                      </h3>
                      <ul className="space-y-3">
                        {summary.decisions.map((decision, i) => (
                          <li key={i} className="rounded-lg border bg-success/5 p-3">
                            <p className="text-sm font-medium">{decision.text}</p>
                            {decision.owner && (
                              <p className="text-xs text-muted-foreground mt-1">Owner: {decision.owner}</p>
                            )}
                            {decision.evidence.length > 0 && (
                              <button className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                                View evidence ({decision.evidence.length})
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {summary.risks.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Risks
                      </h3>
                      <ul className="space-y-3">
                        {summary.risks.map((risk, i) => (
                          <li key={i} className="rounded-lg border bg-warning/5 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium flex-1">{risk.text}</p>
                              <Badge variant="outline">{risk.severity}</Badge>
                            </div>
                            {risk.evidence.length > 0 && (
                              <button className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                                View evidence ({risk.evidence.length})
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {summary.questions.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Open Questions
                      </h3>
                      <ul className="space-y-3">
                        {summary.questions.map((question, i) => (
                          <li key={i} className="rounded-lg border bg-info/5 p-3">
                            <p className="text-sm font-medium">{question.text}</p>
                            {question.askedBy && (
                              <p className="text-xs text-muted-foreground mt-1">Asked by: {question.askedBy}</p>
                            )}
                            {question.evidence.length > 0 && (
                              <button className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                                View evidence ({question.evidence.length})
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>Full conversation recording</CardDescription>
              </CardHeader>
              <CardContent>
                {transcript ? (
                  <div className="space-y-4">
                    {transcript.segments.map((segment) => (
                      <div key={segment.id} className="flex gap-3">
                        <span className="text-xs text-muted-foreground min-w-[48px] mt-0.5">
                          {Math.floor(segment.tStart / 60)}:{(segment.tStart % 60).toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{segment.speaker}</p>
                          <p className="text-sm text-muted-foreground">{segment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Transcript not available for this meeting</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>{tasks.length} tasks from this meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="mb-3">No action items yet</p>
                    <Button variant="outline" size="sm">Create Task</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!summary && meeting.status === 'completed' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="mb-3">AI summary is being generated...</p>
              <div className="h-2 w-48 mx-auto bg-muted rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Share meeting</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <div className="space-y-6">
              {/* Share Link */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Share link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={shareUrl} 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Create new link
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Reset link
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Access Level */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Access level</Label>
                <RadioGroup value={accessLevel} onValueChange={(v: any) => setAccessLevel(v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="invited" id="invited" />
                    <Label htmlFor="invited" className="font-normal cursor-pointer">
                      Only invited people
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="link" />
                    <Label htmlFor="link" className="font-normal cursor-pointer">
                      Anyone with the link
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organization" id="organization" />
                    <Label htmlFor="organization" className="font-normal cursor-pointer">
                      People in my organization (SSO)
                    </Label>
                  </div>
                </RadioGroup>

                {accessLevel !== 'invited' && (
                  <div className="space-y-3 ml-6 mt-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="password" 
                        checked={requirePassword}
                        onCheckedChange={(checked) => setRequirePassword(checked as boolean)}
                      />
                      <Label htmlFor="password" className="font-normal cursor-pointer">
                        Require password
                      </Label>
                    </div>
                    
                    {requirePassword && (
                      <Input 
                        type="password"
                        placeholder="Enter password"
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                        className="ml-6"
                      />
                    )}

                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Link expires:</Label>
                      <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="24h">24 hours</SelectItem>
                          <SelectItem value="7d">7 days</SelectItem>
                          <SelectItem value="30d">30 days</SelectItem>
                          <SelectItem value="custom">Custom date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Invite People */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Invite people</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter email addresses"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInvite()}
                  />
                  <Button onClick={handleAddInvite}>Add</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Add from Google Workspace
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Add from Microsoft 365
                  </Button>
                </div>
                
                {inviteEmails.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {inviteEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                        <span className="text-sm">{email}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveInvite(email)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Permissions */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Permissions</Label>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Link permission:</Label>
                  <Select value={linkPermission} onValueChange={(v: any) => setLinkPermission(v)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="download">View + download assets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transcript-download" className="font-normal cursor-pointer">
                      Allow transcript download
                    </Label>
                    <Switch 
                      id="transcript-download"
                      checked={allowTranscriptDownload}
                      onCheckedChange={setAllowTranscriptDownload}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recording-download" className="font-normal cursor-pointer">
                      Allow recording download
                    </Label>
                    <Switch 
                      id="recording-download"
                      checked={allowRecordingDownload}
                      onCheckedChange={setAllowRecordingDownload}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments" className="font-normal cursor-pointer">
                      Allow comments/notes
                    </Label>
                    <Switch 
                      id="comments"
                      checked={allowComments}
                      onCheckedChange={setAllowComments}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resharing" className="font-normal cursor-pointer">
                      Allow resharing
                    </Label>
                    <Switch 
                      id="resharing"
                      checked={allowResharing}
                      onCheckedChange={setAllowResharing}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message */}
              <div className="space-y-3">
                <Label htmlFor="message" className="text-base font-semibold">
                  Message (optional)
                </Label>
                <Textarea 
                  id="message"
                  placeholder="Add a message to your invite"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              {/* Advanced */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                    <Label className="text-base font-semibold cursor-pointer">Advanced</Label>
                    <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 mt-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="watermark" className="font-normal cursor-pointer">
                      Watermark on playback
                    </Label>
                    <Switch 
                      id="watermark"
                      checked={watermark}
                      onCheckedChange={setWatermark}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="domain-restriction" className="text-sm">
                      Limit downloads to specific domains
                    </Label>
                    <Input 
                      id="domain-restriction"
                      placeholder="example.com, company.com"
                      value={domainRestriction}
                      onChange={(e) => setDomainRestriction(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Default open view:</Label>
                    <Select value={defaultView} onValueChange={(v: any) => setDefaultView(v)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="transcript">Transcript</SelectItem>
                        <SelectItem value="recording">Recording</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-view" className="font-normal cursor-pointer">
                      Notify me on first view
                    </Label>
                    <Switch 
                      id="notify-view"
                      checked={notifyOnView}
                      onCheckedChange={setNotifyOnView}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utm-tag" className="text-sm">
                      UTM/source tag for link analytics
                    </Label>
                    <Input 
                      id="utm-tag"
                      placeholder="campaign_name"
                      value={utmTag}
                      onChange={(e) => setUtmTag(e.target.value)}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Summary */}
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <Label className="text-base font-semibold">Summary</Label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Access level:</span>
                    <span className="font-medium">
                      {accessLevel === 'invited' ? 'Only invited people' : 
                       accessLevel === 'link' ? 'Anyone with the link' : 
                       'Organization only'}
                    </span>
                  </div>
                  {accessLevel !== 'invited' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Link expires:</span>
                        <span className="font-medium">{linkExpiry === 'never' ? 'Never' : linkExpiry}</span>
                      </div>
                      {requirePassword && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Password:</span>
                          <span className="font-medium flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Required
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invitees:</span>
                    <span className="font-medium">{inviteEmails.length} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Permission tier:</span>
                    <span className="font-medium">
                      {linkPermission === 'view' ? 'View only' : 'View + download'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Manage & Safety */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-destructive">
                    Revoke link
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Remove all external viewers
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View current access
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setShareModalOpen(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              {inviteEmails.length > 0 && (
                <Button variant="outline" onClick={handleSendInvites} className="gap-2">
                  <Mail className="h-4 w-4" />
                  Send invites
                </Button>
              )}
              <Button onClick={handleShare} className="gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Meeting</DialogTitle>
            <DialogDescription>
              Choose a format to export the meeting data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-muted-foreground">
                  Summary, transcript, and action items
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => handleExport('json')}
            >
              <FileJson className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export as JSON</div>
                <div className="text-xs text-muted-foreground">
                  Raw meeting data for integrations
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={() => handleExport('audio')}
            >
              <Volume2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export Audio Recording</div>
                <div className="text-xs text-muted-foreground">
                  Download the meeting audio file
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
