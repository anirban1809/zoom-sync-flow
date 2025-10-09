import { useState } from 'react';
import { Search as SearchIcon, Filter, Calendar, Users, FileText, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const searchResults = {
  meetings: [
    {
      id: '1',
      title: 'Q4 Product Roadmap Review',
      date: '2025-10-15',
      attendees: 8,
      duration: '1h 30m',
      tags: ['product', 'planning'],
    },
    {
      id: '2',
      title: 'Customer Success Strategy',
      date: '2025-10-12',
      attendees: 5,
      duration: '45m',
      tags: ['customer', 'strategy'],
    },
  ],
  accounts: [
    {
      id: '1',
      name: 'Acme Corporation',
      industry: 'Technology',
      meetings: 24,
      lastContact: '2 days ago',
    },
    {
      id: '2',
      name: 'TechStart Solutions',
      industry: 'SaaS',
      meetings: 15,
      lastContact: '1 week ago',
    },
  ],
  tasks: [
    {
      id: '1',
      title: 'Follow up on pricing discussion',
      account: 'Acme Corporation',
      dueDate: '2025-10-15',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Send product demo recording',
      account: 'TechStart Solutions',
      dueDate: '2025-10-16',
      priority: 'medium',
    },
  ],
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground mt-2">
          Search across meetings, accounts, tasks, and more
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings, accounts, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="meetings">
            Meetings ({searchResults.meetings.length})
          </TabsTrigger>
          <TabsTrigger value="accounts">
            Accounts ({searchResults.accounts.length})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks ({searchResults.tasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Meetings
            </h3>
            <div className="space-y-3">
              {searchResults.meetings.map((meeting) => (
                <Card key={meeting.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold">{meeting.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {meeting.attendees} attendees
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meeting.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {meeting.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Accounts
            </h3>
            <div className="space-y-3">
              {searchResults.accounts.map((account) => (
                <Card key={account.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{account.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{account.industry}</span>
                          <span>{account.meetings} meetings</span>
                          <span>Last contact: {account.lastContact}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tasks
            </h3>
            <div className="space-y-3">
              {searchResults.tasks.map((task) => (
                <Card key={task.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold">{task.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{task.account}</span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                      <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-3 mt-6">
          {searchResults.meetings.map((meeting) => (
            <Card key={meeting.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-semibold">{meeting.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {meeting.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {meeting.attendees} attendees
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meeting.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {meeting.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="accounts" className="space-y-3 mt-6">
          {searchResults.accounts.map((account) => (
            <Card key={account.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{account.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{account.industry}</span>
                      <span>{account.meetings} meetings</span>
                      <span>Last contact: {account.lastContact}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-3 mt-6">
          {searchResults.tasks.map((task) => (
            <Card key={task.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-semibold">{task.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{task.account}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
