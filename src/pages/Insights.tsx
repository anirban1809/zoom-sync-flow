import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  Link as LinkIcon,
  HelpCircle,
  X,
  ExternalLink,
  Target,
  Phone,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock data - Spotlight KPIs
const spotlightKpis = [
  { title: 'Total meetings', value: '234', change: '+12%', trend: 'up' as const, icon: Calendar },
  { title: 'Attendance rate', value: '87%', change: '+3%', trend: 'up' as const, icon: Users },
  { title: 'Follow-through', value: '73%', change: '+5%', trend: 'up' as const, icon: CheckSquare },
];

// Expanded KPIs (below fold)
const expandedKpis = [
  { title: 'Avg duration', value: '42m', change: '-8%', trend: 'down' as const, icon: Clock },
  { title: 'Summaries', value: '92%', change: '+5%', trend: 'up' as const, icon: FileText },
  { title: 'Action items', value: '156', change: '+18%', trend: 'up' as const, icon: CheckSquare },
  { title: 'Decisions', value: '89', change: '+7%', trend: 'up' as const, icon: Target },
  { title: 'Customer meetings', value: '78', change: '+15%', trend: 'up' as const, icon: Phone },
  { title: 'NPS/CSAT', value: '8.4', change: '+0.3', trend: 'up' as const, icon: TrendingUp },
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
  { question: 'Which integrations are failing to push notes?', count: 1 },
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
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [showDefinitions, setShowDefinitions] = useState(false);

  const handleResetFilters = () => {
    setDateRange('last-30-days');
    setTeamFilter('all');
    setAccountFilter('');
    setMeetingTypeFilter('all');
    setProviderFilter('all');
  };

  const hasActiveFilters = dateRange !== 'last-30-days' || teamFilter !== 'all' || accountFilter || meetingTypeFilter !== 'all' || providerFilter !== 'all';
  const activeFilterCount = [teamFilter !== 'all', accountFilter, meetingTypeFilter !== 'all', providerFilter !== 'all'].filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* ========== TOP (CLEAN & MINIMAL) ========== */}
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">Key signals from your meetings.</p>
      </div>

      {/* Compact controls (single row) */}
      <div className="flex flex-wrap items-center gap-3">
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

        {teamFilter !== 'all' && (
          <Badge variant="secondary" className="gap-1">
            Team: {teamFilter === 'sarah' ? 'Sarah' : teamFilter === 'michael' ? 'Michael' : 'Emily'}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setTeamFilter('all')} />
          </Badge>
        )}

        <Sheet open={showFiltersDrawer} onOpenChange={setShowFiltersDrawer}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-2 rounded-full h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your insights with advanced filters
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team / Owner</label>
                  <Select value={teamFilter} onValueChange={setTeamFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All team members</SelectItem>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="michael">Michael Chen</SelectItem>
                      <SelectItem value="emily">Emily Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account / Project</label>
                  <Input
                    placeholder="Search accounts..."
                    value={accountFilter}
                    onChange={(e) => setAccountFilter(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting type</label>
                  <Select value={meetingTypeFilter} onValueChange={setMeetingTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Provider</label>
                  <Select value={providerFilter} onValueChange={setProviderFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All providers</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={handleResetFilters} className="w-fit">
                  <X className="h-4 w-4 mr-2" />
                  Reset all filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ========== SPOTLIGHT (ABOVE THE FOLD) ========== */}
      
      {/* KPI cards (just three) */}
      <div className="grid gap-4 md:grid-cols-3">
        {spotlightKpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </span>
                <span>vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Primary trend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Meetings over time</CardTitle>
          <CardDescription>Click to drill down to list view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] flex items-end justify-between gap-2">
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

      {/* ========== BELOW THE FOLD (EVERYTHING ELSE) ========== */}
      
      <div className="border-t pt-8 space-y-8">
        {/* Expanded KPIs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Detailed metrics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expandedKpis.map((kpi) => (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {kpi.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chart gallery */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Chart gallery</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Engagement by stage</CardTitle>
                <CardDescription>Talk-time balance and participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Host talk time</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Attendee participation</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <div className="pt-2 text-sm text-muted-foreground">
                    Avg participants: <span className="font-medium">6.2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcomes snapshot</CardTitle>
                <CardDescription>Actions, decisions, and risks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Action items</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '120px' }} />
                      <span className="font-medium">156</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Decisions</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '80px' }} />
                      <span className="font-medium">89</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risks flagged</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-orange-500 rounded-full" style={{ width: '40px' }} />
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coverage & cadence</CardTitle>
                <CardDescription>Account touch frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-8 rounded ${
                          i % 5 === 0 ? 'bg-green-500' : i % 3 === 0 ? 'bg-yellow-500' : 'bg-secondary'
                        }`}
                        title={`Day ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span>4 weeks ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow-through over time</CardTitle>
                <CardDescription>Completion vs due dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[160px] flex items-end justify-between gap-2">
                  {[85, 92, 78, 88, 95, 73, 91].map((value, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                        style={{ height: `${value}%` }}
                        title={`Week ${idx + 1}: ${value}%`}
                      />
                      <span className="text-xs text-muted-foreground">W{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top accounts by activity</CardTitle>
                <CardDescription>Ranked by meeting count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topAccounts.map((account, idx) => (
                    <div
                      key={account.name}
                      className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {idx + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-sm">{account.name}</div>
                          <div className="text-xs text-muted-foreground">{account.meetings} meetings</div>
                        </div>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Insights by question */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Insights by question</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
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
        </div>

        {/* Actionable lists */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Actionable lists</h2>
          <Tabs defaultValue="meetings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="meetings">Recent meetings</TabsTrigger>
              <TabsTrigger value="actions">Open action items</TabsTrigger>
              <TabsTrigger value="risks">Risks & blockers</TabsTrigger>
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
                              Open
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
                  <CardDescription>Quick actions to mark items as complete</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Source meeting</TableHead>
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
                          <TableCell>{item.meeting}</TableCell>
                          <TableCell>
                            <Badge variant={item.status === 'In Progress' ? 'default' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Mark done
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
                  <CardTitle>Risks & blockers</CardTitle>
                  <CardDescription>Issues flagged in meetings</CardDescription>
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
                          <TableCell className="font-medium">
                            <Badge variant="destructive">{risk.risk}</Badge>
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
        </div>

        {/* Account health, Team performance, Data quality */}
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
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 w-full">
                      Open profile
                    </Button>
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
            <div className="flex flex-wrap gap-3">
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

        {/* Definitions & help */}
        <Collapsible>
          <Card>
            <CardContent className="pt-6">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Metric definitions
                  </span>
                  <span className="text-xs text-muted-foreground">
                    How insights are calculated
                  </span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Total meetings:</span> Count of all meetings in the selected period
                  </div>
                  <div>
                    <span className="font-medium">Attendance rate:</span> Percentage of invited participants who joined
                  </div>
                  <div>
                    <span className="font-medium">Follow-through:</span> Percentage of action items completed on time
                  </div>
                  <div>
                    <span className="font-medium">Health score:</span> Derived from meeting frequency, engagement, and follow-through
                  </div>
                </div>
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
