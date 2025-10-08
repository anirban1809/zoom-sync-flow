import { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Calendar, Users, ExternalLink, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const accounts = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    health: 85,
    sentiment: 'positive',
    meetings: 12,
    openTasks: 3,
    lastMeeting: '2 days ago',
    contacts: [
      { name: 'John Smith', role: 'CEO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
      { name: 'Sarah Johnson', role: 'CTO', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    ],
    revenue: '$250K',
  },
  {
    id: '2',
    name: 'TechFlow Solutions',
    domain: 'techflow.io',
    health: 92,
    sentiment: 'positive',
    meetings: 8,
    openTasks: 1,
    lastMeeting: '5 days ago',
    contacts: [
      { name: 'Mike Chen', role: 'VP Engineering', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
    ],
    revenue: '$180K',
  },
  {
    id: '3',
    name: 'Global Ventures Inc',
    domain: 'globalventures.com',
    health: 65,
    sentiment: 'neutral',
    meetings: 15,
    openTasks: 7,
    lastMeeting: '1 week ago',
    contacts: [
      { name: 'Lisa Wang', role: 'Director', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
      { name: 'Tom Brown', role: 'Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' },
    ],
    revenue: '$450K',
  },
  {
    id: '4',
    name: 'Innovation Labs',
    domain: 'innovationlabs.co',
    health: 45,
    sentiment: 'negative',
    meetings: 6,
    openTasks: 12,
    lastMeeting: '3 weeks ago',
    contacts: [
      { name: 'Alex Kim', role: 'Product Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    ],
    revenue: '$95K',
  },
];

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      positive: 'default',
      neutral: 'secondary',
      negative: 'destructive',
    };
    return variants[sentiment] || 'secondary';
  };

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Accounts List */}
      <div className="w-96 border-r bg-background overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Accounts</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="space-y-2">
            {filteredAccounts.map((account) => (
              <Card
                key={account.id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedAccount.id === account.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedAccount(account)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold text-sm">{account.name}</h3>
                        <p className="text-xs text-muted-foreground">{account.domain}</p>
                      </div>
                    </div>
                    <Badge variant={getSentimentBadge(account.sentiment)} className="text-xs">
                      {account.sentiment}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Health Score</span>
                      <span className={`font-medium ${getHealthColor(account.health)}`}>
                        {account.health}%
                      </span>
                    </div>
                    <Progress value={account.health} className="h-1" />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{account.meetings} meetings</span>
                    <span>{account.openTasks} open tasks</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Account Detail */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl font-semibold">{selectedAccount.name}</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedAccount.domain}</span>
                  <span>•</span>
                  <span>{selectedAccount.revenue} ARR</span>
                </div>
              </div>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                View in CRM
              </Button>
            </div>

            {/* Health & Sentiment Overview */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${getHealthColor(selectedAccount.health)}`}>
                    {selectedAccount.health}%
                  </div>
                  <Progress value={selectedAccount.health} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getSentimentBadge(selectedAccount.sentiment)} className="text-base">
                    {selectedAccount.sentiment === 'positive' && <TrendingUp className="h-4 w-4 mr-1" />}
                    {selectedAccount.sentiment === 'negative' && <TrendingDown className="h-4 w-4 mr-1" />}
                    {selectedAccount.sentiment}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Last Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedAccount.lastMeeting}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Key Contacts</CardTitle>
                <CardDescription>Primary stakeholders and decision makers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedAccount.contacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        View Meetings
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Tabs */}
            <Tabs defaultValue="meetings">
              <TabsList>
                <TabsTrigger value="meetings">Recent Meetings</TabsTrigger>
                <TabsTrigger value="tasks">Action Items</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="meetings" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { title: 'Q4 Planning Review', date: '2 days ago', attendees: 3 },
                        { title: 'Product Roadmap Discussion', date: '1 week ago', attendees: 5 },
                        { title: 'Contract Renewal Meeting', date: '2 weeks ago', attendees: 4 },
                      ].map((meeting, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <p className="text-sm text-muted-foreground">{meeting.date} • {meeting.attendees} attendees</p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { title: 'Send proposal for Q1 expansion', due: 'Tomorrow', priority: 'high' },
                        { title: 'Schedule technical deep-dive', due: 'This week', priority: 'medium' },
                        { title: 'Follow up on contract questions', due: 'Next week', priority: 'low' },
                      ].map((task, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                          </div>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Sentiment and topic analysis over time will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
