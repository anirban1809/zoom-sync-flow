import { useState } from 'react';
import { Bell, CheckCheck, Trash2, Settings, Calendar, CheckSquare, Zap, AlertCircle, AtSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const notifications = [
  {
    id: '1',
    type: 'task',
    title: 'New task assigned',
    message: 'Sarah Johnson assigned you "Review Q4 proposal"',
    time: '5 minutes ago',
    read: false,
    icon: CheckSquare,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    actionable: true,
  },
  {
    id: '2',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Alex Kim mentioned you in "Product Roadmap Planning"',
    time: '1 hour ago',
    read: false,
    icon: AtSign,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    actionable: true,
  },
  {
    id: '3',
    type: 'automation',
    title: 'Automation completed',
    message: 'Successfully created 3 Jira tickets from Sales Call',
    time: '2 hours ago',
    read: false,
    icon: Zap,
    actionable: false,
  },
  {
    id: '4',
    type: 'meeting',
    title: 'Meeting starting soon',
    message: 'Sprint Planning starts in 15 minutes',
    time: '3 hours ago',
    read: true,
    icon: Calendar,
    actionable: true,
  },
  {
    id: '5',
    type: 'failure',
    title: 'Automation failed',
    message: 'Failed to sync with HubSpot - Authentication expired',
    time: '5 hours ago',
    read: false,
    icon: AlertCircle,
    actionable: true,
  },
  {
    id: '6',
    type: 'task',
    title: 'Task completed',
    message: 'John Smith marked "Send contract" as complete',
    time: '1 day ago',
    read: true,
    icon: CheckSquare,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    actionable: false,
  },
];

export default function Notifications() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [selectedTab, setSelectedTab] = useState('all');

  const markAsRead = (id: string) => {
    setNotificationList(notificationList.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotificationList(notificationList.filter((n) => n.id !== id));
  };

  const getFilteredNotifications = () => {
    if (selectedTab === 'all') return notificationList;
    return notificationList.filter((n) => n.type === selectedTab || (selectedTab === 'failures' && n.type === 'failure'));
  };

  const unreadCount = notificationList.filter((n) => !n.read).length;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-3xl font-semibold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Preferences</DialogTitle>
                  <DialogDescription>
                    Configure how you receive notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">Email notifications</Label>
                    <Switch id="email" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push">Browser notifications</Label>
                    <Switch id="push" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack">Slack notifications</Label>
                    <Switch id="slack" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="digest">Daily digest</Label>
                    <Switch id="digest" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mentions">Mentions only</Label>
                    <Switch id="mentions" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="task">Tasks</TabsTrigger>
            <TabsTrigger value="mention">Mentions</TabsTrigger>
            <TabsTrigger value="automation">Automations</TabsTrigger>
            <TabsTrigger value="failures">Failures</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-2 mt-4">
            {getFilteredNotifications().length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              getFilteredNotifications().map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`transition-colors ${
                      notification.read ? 'bg-background' : 'bg-accent/20'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {notification.avatar ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>{notification.title[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {notification.time}
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {notification.actionable && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm">View</Button>
                              {notification.type === 'task' && (
                                <Button size="sm" variant="outline">
                                  Mark Complete
                                </Button>
                              )}
                              {notification.type === 'failure' && (
                                <Button size="sm" variant="outline">
                                  Retry
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
