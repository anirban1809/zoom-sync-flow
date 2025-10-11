import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  CheckSquare,
  AlertTriangle,
  Video,
  TrendingUp,
  TrendingDown,
  Download,
  Link as LinkIcon,
  HelpCircle,
  Filter,
  X,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Target,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data
const kpiData = [
  { title: 'Total meetings', value: '234', change: '+12%', trend: 'up', icon: Calendar },
  { title: 'Avg meeting duration', value: '42m', change: '-8%', trend: 'down', icon: Clock },
  { title: 'Attendance rate', value: '87%', change: '+3%', trend: 'up', icon: Users },
  { title: 'Summaries generated', value: '92%', change: '+5%', trend: 'up', icon: FileText },
  { title: 'Action items', value: '156', change: '+18%', trend: 'up', icon: CheckSquare },
  { title: 'Decisions captured', value: '89', change: '+7%', trend: 'up', icon: Target },
  { title: 'Customer meetings', value: '78', change: '+15%', trend: 'up', icon: Phone },
  { title: 'NPS Score', value: '8.4', change: '+0.3', trend: 'up', icon: TrendingUp },
];

const meetingsOverTime = [
  { period: 'Week 1', count: 18 },
  { period: 'Week 2', count: 22 },
  { period: 'Week 3', count: 19 },
  { period: 'Week 4', count: 25 },
  { period: 'Week 5', count: 21 },
  { period: 'Week 6', count: 28 },
  { period: 'Week 7', count: 24 },
  { period: 'Week 8', count: 30 },
];

const topAccounts = [
  { name: 'Acme Corp', meetings: 24, participants: 18, topics: 'Pricing, Integration', score: 92 },
  { name: 'TechStart Inc', meetings: 18, participants: 12, topics: 'Features, Timeline', score: 88 },
  { name: 'Global Systems', meetings: 15, participants: 10, topics: 'Implementation', score: 85 },
  { name: 'Innovation Labs', meetings: 12, participants: 8, topics: 'Support, SLA', score: 82 },
];

const recentMeetings = [
  {
    date: '2024-01-15',
    title: 'Q1 Planning Session',
    owner: 'Sarah Johnson',
    account: 'Acme Corp',
    participants: 8,
    outcomes: ['Action items', 'Decisions'],
  },
  {
    date: '2024-01-14',
    title: 'Product Demo',
    owner: 'Michael Chen',
    account: 'TechStart Inc',
    participants: 5,
    outcomes: ['Follow-up scheduled'],
  },
  {
    date: '2024-01-14',
    title: 'Integration Review',
    owner: 'Emily Rodriguez',
    account: 'Global Systems',
    participants: 6,
    outcomes: ['Decisions', 'Risks flagged'],
  },
];

const openActionItems = [
  { item: 'Send pricing proposal', owner: 'Sarah Johnson', due: '2024-01-18', meeting: 'Q1 Planning Session', status: 'In Progress' },
  { item: 'Schedule follow-up demo', owner: 'Michael Chen', due: '2024-01-17', meeting: 'Product Demo', status: 'Not Started' },
  { item: 'Prepare integration docs', owner: 'Emily Rodriguez', due: '2024-01-20', meeting: 'Integration Review', status: 'In Progress' },
];

const risksBlockers = [
  { risk: 'Budget constraints', account: 'Acme Corp', owner: 'Sarah Johnson', detected: '2024-01-15', notes: 'Need exec approval' },
  { risk: 'Timeline concerns', account: 'TechStart Inc', owner: 'Michael Chen', detected: '2024-01-14', notes: 'Q2 deadline tight' },
];

const quickInsightQuestions = [
  { question: 'Which accounts are going quiet?', count: 3 },
  { question: 'Where are action items piling up?', count: 12 },
  { question: 'Which meetings lack summaries?', count: 8 },
  { question: 'Who\'s overloaded with follow-ups?', count: 2 },
];

const accountHealth = [
  { account: 'Acme Corp', score: 92, lastMeeting: '2024-01-15', meetings30d: 8, openActions: 3 },
  { account: 'TechStart Inc', score: 88, lastMeeting: '2024-01-14', meetings30d: 6, openActions: 2 },
  { account: 'Global Systems', score: 85, lastMeeting: '2024-01-14', meetings30d: 5, openActions: 1 },
];

const teamPerformance = [
  { user: 'Sarah Johnson', meetings: 42, avgDuration: '45m', participation: 'Balanced', actionsClosed: 28, responseSLA: '95%' },
  { user: 'Michael Chen', meetings: 38, avgDuration: '40m', participation: 'Host-heavy', actionsClosed: 24, responseSLA: '92%' },
  { user: 'Emily Rodriguez', meetings: 35, avgDuration: '38m', participation: 'Balanced', actionsClosed: 22, responseSLA: '89%' },
];

const dataQuality = [
  { type: 'Missing recordings', count: 3 },
  { type: 'Unassigned speakers', count: 5 },
  { type: 'Failed transcriptions', count: 2 },
  { type: 'Integration sync errors', count: 1 },
];

export default function Insights() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [teamFilter, setTeamFilter] = useState('all');
  const [accountFilter, setAccountFilter] = useState('');
  const [meetingTypeFilter, setMeetingTypeFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [showDefinitions, setShowDefinitions] = useState(false);

  const handleResetFilters = () => {
    setDateRange('last-30-days');
    setTeamFilter('all');
    setAccountFilter('');
    setMeetingTypeFilter('all');
    setProviderFilter('all');
  };

  const hasActiveFilters = dateRange !== 'last-30-days' || teamFilter !== 'all' || accountFilter || meetingTypeFilter !== 'all' || providerFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground mt-2">
          High-level view of meeting activity, outcomes, and trends.
        </p>
      </div>

      {/* Global controls (sticky) */}
      <Card className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Team / Owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All team members</SelectItem>
                <SelectItem value="sarah">Sarah Johnson</SelectItem>
                <SelectItem value="michael">Michael Chen</SelectItem>
                <SelectItem value="emily">Emily Rodriguez</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search accounts..."
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-[200px]"
            />

            <Select value={meetingTypeFilter} onValueChange={setMeetingTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All providers</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="meet">Google Meet</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleResetFilters}>
                <X className="h-4 w-4 mr-2" />
                Reset filters
              </Button>
            )}

            <Sheet open={showDefinitions} onOpenChange={setShowDefinitions}>
              <SheetTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Metric definitions
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Metric Definitions</SheetTitle>
                  <SheetDescription>
                    Understanding the key metrics and charts on this page
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-full mt-6">
                  <div className="space-y-4 pr-4">
                    <div>
                      <h4 className="font-semibold mb-1">Total meetings</h4>
                      <p className="text-sm text-muted-foreground">Count of all meetings in the selected period</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Avg meeting duration</h4>
                      <p className="text-sm text-muted-foreground">Average length across all meetings</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Attendance rate</h4>
                      <p className="text-sm text-muted-foreground">Percentage of invited participants who joined</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Health score</h4>
                      <p className="text-sm text-muted-foreground">Derived from meeting frequency, engagement, and follow-through</p>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* Overview KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={kpi.trend === 'up' ? 'text-success' : 'text-destructive'}>
                  {kpi.change}
                </span>
                <span>vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meetings over time</CardTitle>
            <CardDescription>Click to drill into the list for that period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {meetingsOverTime.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors cursor-pointer"
                    style={{ height: `${(item.count / 30) * 100}%` }}
                    title={`${item.period}: ${item.count} meetings`}
                  />
                  <span className="text-xs text-muted-foreground">{item.period.replace('Week ', 'W')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top accounts by activity</CardTitle>
            <CardDescription>Click an account to open its page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAccounts.map((account, idx) => (
                <div
                  key={account.name}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">
                      {idx + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-muted-foreground">{account.meetings} meetings, {account.participants} participants</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights by question */}
      <Card>
        <CardHeader>
          <CardTitle>Insights by question</CardTitle>
          <CardDescription>Guided quick answers to common queries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickInsightQuestions.map((insight) => (
              <Button
                key={insight.question}
                variant="outline"
                className="h-auto p-4 justify-start text-left hover:bg-accent"
              >
                <div className="w-full">
                  <div className="text-sm font-medium mb-1">{insight.question}</div>
                  <Badge variant="secondary" className="text-xs">{insight.count} found</Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lists (tabs) */}
      <Tabs defaultValue="meetings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meetings">Recent meetings</TabsTrigger>
          <TabsTrigger value="actions">Open action items</TabsTrigger>
          <TabsTrigger value="risks">Risk & blockers</TabsTrigger>
        </TabsList>

        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle>Recent meetings with outcomes</CardTitle>
              <CardDescription>Filter-aware list of meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Outcomes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMeetings.map((meeting) => (
                    <TableRow key={meeting.title}>
                      <TableCell className="text-sm">{meeting.date}</TableCell>
                      <TableCell className="font-medium">{meeting.title}</TableCell>
                      <TableCell>{meeting.owner}</TableCell>
                      <TableCell>{meeting.account}</TableCell>
                      <TableCell>{meeting.participants}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {meeting.outcomes.map((outcome) => (
                            <Badge key={outcome} variant="secondary" className="text-xs">
                              {outcome}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Open action items</CardTitle>
              <CardDescription>Quick mark done available</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due date</TableHead>
                    <TableHead>Meeting source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openActionItems.map((item) => (
                    <TableRow key={item.item}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.owner}</TableCell>
                      <TableCell>{item.due}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.meeting}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'In Progress' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <CheckSquare className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Risk & blockers</CardTitle>
              <CardDescription>Quick assign available</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk tag</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Detected on</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risksBlockers.map((risk) => (
                    <TableRow key={risk.risk}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="font-medium">{risk.risk}</span>
                        </div>
                      </TableCell>
                      <TableCell>{risk.account}</TableCell>
                      <TableCell>{risk.owner}</TableCell>
                      <TableCell>{risk.detected}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{risk.notes}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom row: Account health, Team performance, Data quality */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account health</CardTitle>
            <CardDescription>Derived health scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountHealth.map((account) => (
                <div key={account.account} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{account.account}</span>
                    <Badge variant={account.score >= 90 ? 'default' : 'secondary'}>
                      {account.score}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Last: {account.lastMeeting}</div>
                    <div>{account.meetings30d} meetings (30d), {account.openActions} open actions</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3">
                <ExternalLink className="h-4 w-4 mr-2" />
                View all accounts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team performance</CardTitle>
            <CardDescription>Individual metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamPerformance.map((member) => (
                <div key={member.user} className="p-3 rounded-lg border">
                  <div className="font-medium mb-2">{member.user}</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>{member.meetings} meetings, avg {member.avgDuration}</div>
                    <div>{member.participation}, {member.actionsClosed} actions closed</div>
                    <div>SLA: {member.responseSLA}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data quality</CardTitle>
            <CardDescription>Issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataQuality.map((issue) => (
                <div key={issue.type} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <div>
                      <div className="text-sm font-medium">{issue.type}</div>
                      <div className="text-xs text-muted-foreground">{issue.count} found</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Fix now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exports & sharing */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export chart image
            </Button>
            <Button variant="outline">
              <LinkIcon className="h-4 w-4 mr-2" />
              Copy link with filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
