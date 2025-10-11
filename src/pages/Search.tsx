import { useState, useEffect } from 'react';
import {
  Search as SearchIcon,
  Filter,
  X,
  HelpCircle,
  Calendar,
  Users,
  FileText,
  Video,
  Paperclip,
  ChevronDown,
  Play,
  Check,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Download,
  Eye,
  UserPlus,
  Building2,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data
const mockMeetings = [
  {
    id: '1',
    title: 'Q4 Product Roadmap Review',
    date: '2025-10-15',
    time: '2:00 PM',
    owner: 'Sarah Chen',
    attendees: 8,
    account: 'Acme Corp',
    provider: 'Zoom',
    decisions: 3,
    actions: 5,
    summary: ['Agreed to prioritize mobile features', 'Timeline set for Q1 2026 launch'],
  },
  {
    id: '2',
    title: 'Customer Success Strategy',
    date: '2025-10-12',
    time: '10:00 AM',
    owner: 'Mike Johnson',
    attendees: 5,
    account: 'TechStart Inc',
    provider: 'Meet',
    decisions: 2,
    actions: 3,
    summary: ['New onboarding process approved', 'Quarterly review schedule confirmed'],
  },
];

const mockActionItems = [
  {
    id: '1',
    title: 'Follow up on pricing discussion',
    owner: 'Alex Kim',
    status: 'In Progress',
    dueDate: '2025-10-20',
    meeting: 'Q4 Product Roadmap Review',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Send product demo recording',
    owner: 'Sarah Chen',
    status: 'Pending',
    dueDate: '2025-10-18',
    meeting: 'Customer Success Strategy',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Schedule follow-up meeting',
    owner: 'Mike Johnson',
    status: 'Completed',
    dueDate: '2025-10-16',
    meeting: 'Q4 Product Roadmap Review',
    priority: 'low',
  },
];

const mockTranscripts = [
  {
    id: '1',
    speaker: 'Sarah Chen',
    timestamp: '12:45',
    content: 'I think we should prioritize the mobile app features for Q1 2026. The customer feedback has been overwhelming.',
    meeting: 'Q4 Product Roadmap Review',
    context: 'Discussing feature prioritization',
  },
  {
    id: '2',
    speaker: 'Mike Johnson',
    timestamp: '08:32',
    content: 'The new onboarding process needs to include a dedicated success manager for enterprise clients.',
    meeting: 'Customer Success Strategy',
    context: 'Reviewing onboarding improvements',
  },
];

const mockAccounts = [
  {
    id: '1',
    name: 'Acme Corp',
    type: 'Account',
    lastMeeting: '2025-10-15',
    meetingsCount: 24,
    openActions: 5,
  },
  {
    id: '2',
    name: 'TechStart Inc',
    type: 'Account',
    lastMeeting: '2025-10-12',
    meetingsCount: 15,
    openActions: 3,
  },
  {
    id: '3',
    name: 'Sarah Chen',
    type: 'Contact',
    lastMeeting: '2025-10-15',
    meetingsCount: 42,
    openActions: 8,
  },
];

const mockFiles = [
  {
    id: '1',
    filename: 'Q4-Roadmap-Presentation.pdf',
    type: 'PDF',
    meeting: 'Q4 Product Roadmap Review',
    owner: 'Sarah Chen',
    updated: '2025-10-15',
  },
  {
    id: '2',
    filename: 'Customer-Success-Metrics.xlsx',
    type: 'Excel',
    meeting: 'Customer Success Strategy',
    owner: 'Mike Johnson',
    updated: '2025-10-12',
  },
];


export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('meetings');
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchTips, setShowSearchTips] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Handle search with 2 second delay
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      setShowResults(false);
      
      const timer = setTimeout(() => {
        setIsSearching(false);
        setShowResults(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
      setShowResults(false);
    }
  }, [searchQuery]);

  const getTotalResults = () => {
    switch (activeTab) {
      case 'meetings':
        return mockMeetings.length;
      case 'actions':
        return mockActionItems.length;
      case 'transcripts':
        return mockTranscripts.length;
      case 'accounts':
        return mockAccounts.length;
      case 'files':
        return mockFiles.length;
      default:
        return 0;
    }
  };

  const removeFilter = (filter: string) => {
    setAppliedFilters(appliedFilters.filter((f) => f !== filter));
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (activeTab === 'actions') {
      setSelectedItems(mockActionItems.map((item) => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings, action items, transcripts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Popover open={showSearchTips} onOpenChange={setShowSearchTips}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Search tips
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Search Operators</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">owner:me</code> - Your meetings
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">account:Acme</code> - Specific account
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">speaker:"Jane Doe"</code> - Specific speaker
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">has:decision</code> - Has decisions
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">has:recording</code> - Has recording
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">before:2025-10-01</code> - Before date
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">after:2025-09-01</code> - After date
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Advanced</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">"exact phrase"</code> - Exact match
                    </div>
                    <div>
                      <code className="bg-muted px-1 py-0.5 rounded">-draft</code> - Exclude term
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
                  <div className="space-y-2 text-sm">
                    <div><kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">Enter</kbd> - Search</div>
                    <div><kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">Esc</kbd> - Clear</div>
                    <div><kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">↑</kbd> <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">↓</kbd> - Navigate</div>
                    <div><kbd className="bg-muted px-1.5 py-0.5 rounded text-xs">/</kbd> - Focus search</div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Filter pills row */}
        <div className="flex items-center gap-2 flex-wrap">
          {appliedFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="gap-1">
              {filter}
              <button onClick={() => removeFilter(filter)} className="hover:bg-background/50 rounded-full">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-3 w-3 mr-2" />
                Add filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search results with advanced filters
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                <div className="space-y-6 pr-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Range</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Owner / Participants</label>
                    <Input placeholder="Search people..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Account / Project</label>
                    <Input placeholder="Search accounts..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Provider</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Zoom</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Google Meet</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Microsoft Teams</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meeting Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Internal</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">External</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Customer</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Support</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Has</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Recording</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Transcript</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Decisions</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Action items</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">Risks</span>
                      </label>
                    </div>
                  </div>

                  {activeTab === 'actions' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Action Item Status</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Pending</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">In Progress</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Completed</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">High</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Medium</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Low</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'transcripts' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Speaker</label>
                        <Input placeholder="Search speakers..." />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sentiment</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Positive</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Neutral</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox />
                            <span className="text-sm">Negative</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={() => setAppliedFilters([])}>
                      Clear All
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Empty State, Searching State, or Results area */}
      {!searchQuery ? (
        <div className="flex flex-col items-center justify-center py-24 px-4">
          <SearchIcon className="h-16 w-16 text-muted-foreground/40 mb-6" />
          <h2 className="text-2xl font-semibold mb-3">Search your meetings and content</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Search across meetings, action items, transcripts, accounts, and files. Use operators like "owner:me" or "has:recording" for advanced searches.
          </p>
          <Button variant="outline" onClick={() => setShowSearchTips(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            View search tips
          </Button>
        </div>
      ) : isSearching ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="meetings">
                    <Calendar className="h-4 w-4 mr-2" />
                    Meetings
                  </TabsTrigger>
                  <TabsTrigger value="actions">
                    <Check className="h-4 w-4 mr-2" />
                    Action items
                  </TabsTrigger>
                  <TabsTrigger value="transcripts">
                    <FileText className="h-4 w-4 mr-2" />
                    Transcript & notes
                  </TabsTrigger>
                  <TabsTrigger value="accounts">
                    <Users className="h-4 w-4 mr-2" />
                    Accounts/People
                  </TabsTrigger>
                  <TabsTrigger value="files">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Files & attachments
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-9 w-[160px]" />
                </div>
              </div>

              {/* Skeleton for Meetings/Transcripts */}
              {(activeTab === 'meetings' || activeTab === 'transcripts') && (
                <TabsContent value={activeTab} className="space-y-6 mt-0">
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <Skeleton className="h-6 w-3/4" />
                              <div className="flex items-center gap-6">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-6 w-16" />
                              <Skeleton className="h-6 w-20" />
                            </div>
                          </div>
                          <div className="pl-5 border-l-2 border-muted space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                          <div className="flex gap-3">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-28" />
                            <Skeleton className="h-8 w-32" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}

              {/* Skeleton for Action Items */}
              {activeTab === 'actions' && (
                <TabsContent value="actions" className="space-y-3 mt-0">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-5 w-5" />
                          <div className="flex-1 grid grid-cols-5 gap-4">
                            <div className="col-span-2 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}

              {/* Skeleton for Accounts/Files */}
              {(activeTab === 'accounts' || activeTab === 'files') && (
                <TabsContent value={activeTab} className="space-y-3 mt-0">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-5 w-5" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-16" />
                              </div>
                            </div>
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      ) : showResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="meetings">
                  <Calendar className="h-4 w-4 mr-2" />
                  Meetings
                </TabsTrigger>
                <TabsTrigger value="actions">
                  <Check className="h-4 w-4 mr-2" />
                  Action items
                </TabsTrigger>
                <TabsTrigger value="transcripts">
                  <FileText className="h-4 w-4 mr-2" />
                  Transcript & notes
                </TabsTrigger>
                <TabsTrigger value="accounts">
                  <Users className="h-4 w-4 mr-2" />
                  Accounts/People
                </TabsTrigger>
                <TabsTrigger value="files">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Files & attachments
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {getTotalResults()} results
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6 mt-0">
              {mockMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <h3 className="font-semibold text-lg hover:text-primary cursor-pointer leading-relaxed">
                            {meeting.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {meeting.date} • {meeting.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {meeting.owner}
                            </span>
                            <span>{meeting.attendees} attendees</span>
                            <span>{meeting.account}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{meeting.provider}</Badge>
                          {meeting.decisions > 0 && (
                            <Badge variant="secondary">{meeting.decisions} decisions</Badge>
                          )}
                          {meeting.actions > 0 && (
                            <Badge variant="secondary">{meeting.actions} actions</Badge>
                          )}
                        </div>
                      </div>

                      <div className="pl-5 border-l-2 border-muted space-y-2 py-1">
                        {meeting.summary.map((item, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                            • {item}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Button size="sm">Open</Button>
                        <Button size="sm" variant="outline">
                          View summary
                        </Button>
                        <Button size="sm" variant="outline">
                          View transcript
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Play className="h-3 w-3 mr-1" />
                          Play from timestamp
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Action Items Tab */}
            <TabsContent value="actions" className="space-y-3 mt-0">
              {selectedItems.length > 0 && (
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                      </span>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Check className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                        <Button size="sm" variant="outline">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Reassign
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Change due date
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="ghost" onClick={clearSelection}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Button size="sm" variant="outline" onClick={selectAllItems}>
                  Select all on page
                </Button>
              </div>

              {mockActionItems.map((item) => (
                <Card key={item.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelectItem(item.id)}
                      />
                      <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                        <div className="col-span-2">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.meeting}</p>
                        </div>
                        <div className="text-sm">{item.owner}</div>
                        <div>
                          <Badge
                            variant={
                              item.status === 'Completed'
                                ? 'default'
                                : item.status === 'In Progress'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.dueDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Check className="h-3 w-3 mr-1" />
                          Mark done
                        </Button>
                        <Button size="sm" variant="outline">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Reassign
                        </Button>
                        <Button size="sm" variant="ghost">
                          Open task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Transcript & Notes Tab */}
            <TabsContent value="transcripts" className="space-y-6 mt-0">
              {mockTranscripts.map((transcript) => (
                <Card key={transcript.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-semibold text-base">{transcript.speaker}</span>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {transcript.timestamp}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {transcript.meeting}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{transcript.context}</p>
                        </div>
                      </div>

                      <div className="pl-5 border-l-2 border-primary/50 py-3">
                        <p className="text-sm leading-relaxed">
                          {transcript.content.split('mobile app features').map((part, idx, arr) => {
                            if (idx < arr.length - 1) {
                              return (
                                <span key={idx}>
                                  {part}
                                  <mark className="bg-primary/20 px-1.5 py-0.5 rounded">mobile app features</mark>
                                </span>
                              );
                            }
                            return part;
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Play from here
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open transcript
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Accounts/People Tab */}
            <TabsContent value="accounts" className="space-y-3 mt-0">
              {mockAccounts.map((account) => (
                <Card key={account.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          {account.type === 'Account' ? (
                            <Building2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {account.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Last meeting: {account.lastMeeting}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {account.meetingsCount} meetings
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {account.openActions} open actions
                        </div>
                      </div>
                      <Button size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Files & Attachments Tab */}
            <TabsContent value="files" className="space-y-3 mt-0">
              {mockFiles.map((file) => (
                <Card key={file.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-3 min-w-[250px]">
                          <Paperclip className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{file.filename}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {file.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{file.meeting}</div>
                        <div className="text-sm text-muted-foreground">{file.owner}</div>
                        <div className="text-sm text-muted-foreground">
                          Updated: {file.updated}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open in meeting
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      ) : null}
    </div>
  );
}
