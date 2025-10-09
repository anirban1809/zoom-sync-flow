import { TrendingUp, TrendingDown, Users, Clock, Calendar, Target, BarChart3, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const metrics = [
  {
    title: 'Total Meetings',
    value: '234',
    change: '+12%',
    trend: 'up',
    icon: Calendar,
  },
  {
    title: 'Avg. Meeting Duration',
    value: '42m',
    change: '-8%',
    trend: 'down',
    icon: Clock,
  },
  {
    title: 'Active Accounts',
    value: '89',
    change: '+23%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Conversion Rate',
    value: '34%',
    change: '+5%',
    trend: 'up',
    icon: Target,
  },
];

const topAccounts = [
  { name: 'Acme Corporation', meetings: 24, revenue: '$450K', score: 92 },
  { name: 'TechStart Solutions', meetings: 18, revenue: '$380K', score: 88 },
  { name: 'Global Systems Inc', meetings: 15, revenue: '$320K', score: 85 },
  { name: 'Innovation Labs', meetings: 12, revenue: '$280K', score: 82 },
];

const meetingInsights = [
  {
    title: 'Most Discussed Topics',
    items: [
      { name: 'Pricing', count: 45, percentage: 78 },
      { name: 'Product Features', count: 38, percentage: 65 },
      { name: 'Implementation', count: 32, percentage: 55 },
      { name: 'Support', count: 28, percentage: 48 },
    ],
  },
  {
    title: 'Common Objections',
    items: [
      { name: 'Price concerns', count: 23, percentage: 45 },
      { name: 'Integration complexity', count: 18, percentage: 35 },
      { name: 'Timeline constraints', count: 15, percentage: 30 },
      { name: 'Resource availability', count: 12, percentage: 25 },
    ],
  },
];

const teamPerformance = [
  { name: 'Sarah Johnson', meetings: 42, deals: 8, rate: '85%' },
  { name: 'Michael Chen', meetings: 38, deals: 7, rate: '82%' },
  { name: 'Emily Rodriguez', meetings: 35, deals: 6, rate: '78%' },
  { name: 'David Kim', meetings: 31, deals: 5, rate: '75%' },
];

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground mt-2">
          Analytics and insights from your meetings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={metric.trend === 'up' ? 'text-success' : 'text-destructive'}>
                  {metric.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {meetingInsights.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>Based on the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">{item.count} mentions</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meeting Activity Trend</CardTitle>
                  <CardDescription>Weekly meeting volume over time</CardDescription>
                </div>
                <Badge variant="secondary">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Last 12 weeks
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2">
                {[42, 38, 45, 52, 48, 55, 58, 62, 59, 65, 70, 68].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t hover:from-primary/80 hover:to-primary/40 transition-colors cursor-pointer"
                      style={{ height: `${(value / 70) * 100}%` }}
                    />
                    <span className="text-xs text-muted-foreground">W{idx + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Accounts</CardTitle>
              <CardDescription>Ranked by engagement and opportunity value</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topAccounts.map((account, idx) => (
                <div key={account.name} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="rounded-full w-8 h-8 flex items-center justify-center">
                        {idx + 1}
                      </Badge>
                      <div>
                        <h4 className="font-semibold">{account.name}</h4>
                        <p className="text-sm text-muted-foreground">{account.meetings} meetings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{account.revenue}</div>
                      <div className="text-sm text-muted-foreground">Pipeline value</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Health Score</span>
                      <span className="font-medium">{account.score}/100</span>
                    </div>
                    <Progress value={account.score} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Individual metrics and success rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamPerformance.map((member, idx) => (
                <div key={member.name} className="border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          {idx === 0 && (
                            <Badge variant="outline" className="bg-highlight/10 text-highlight border-highlight/20">
                              <Award className="h-3 w-3 mr-1" />
                              Top Performer
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                          <span>{member.meetings} meetings</span>
                          <span>{member.deals} deals closed</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{member.rate}</div>
                      <div className="text-xs text-muted-foreground">Success rate</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
