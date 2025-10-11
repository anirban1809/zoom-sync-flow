import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { Calendar, Users, Video, ExternalLink, Download, Share2, Edit, Clock, CheckCircle2, AlertTriangle, HelpCircle, MessageSquare, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMeetings, mockSummaries, mockTranscripts, mockTasks } from '@/lib/mockData';
import { format } from 'date-fns';
import { TaskRow } from '@/components/TaskRow';

export default function MeetingDetail() {
  const { id } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  const meeting = mockMeetings.find(m => m.id === id);
  const summary = meeting?.summaryId ? mockSummaries[meeting.summaryId] : null;
  const transcript = meeting?.transcriptId ? mockTranscripts[meeting.transcriptId] : null;
  const tasks = mockTasks.filter(t => t.meetingId === id);

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
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
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
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
    </div>
  );
}
