import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Video, ArrowLeft } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, addDays } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'call' | 'event';
  location?: string;
  attendees?: number;
  color: string;
}

interface CalendarViewProps {
  calendarName: string;
  calendarEmail: string;
  onBack: () => void;
}

// Mock events for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Sales Call with Acme Corp',
    start: new Date(2025, 9, 9, 10, 0),
    end: new Date(2025, 9, 9, 11, 0),
    type: 'call',
    attendees: 5,
    color: 'bg-primary/20 border-primary',
  },
  {
    id: '2',
    title: 'Product Demo',
    start: new Date(2025, 9, 9, 14, 0),
    end: new Date(2025, 9, 9, 15, 30),
    type: 'meeting',
    location: 'Zoom',
    attendees: 12,
    color: 'bg-accent/20 border-accent',
  },
  {
    id: '3',
    title: 'Team Standup',
    start: new Date(2025, 9, 10, 9, 0),
    end: new Date(2025, 9, 10, 9, 30),
    type: 'meeting',
    attendees: 8,
    color: 'bg-highlight/20 border-highlight',
  },
  {
    id: '4',
    title: 'Client Review Meeting',
    start: new Date(2025, 9, 10, 15, 0),
    end: new Date(2025, 9, 10, 16, 0),
    type: 'call',
    location: 'Google Meet',
    attendees: 3,
    color: 'bg-primary/20 border-primary',
  },
  {
    id: '5',
    title: 'Quarterly Business Review',
    start: new Date(2025, 9, 11, 13, 0),
    end: new Date(2025, 9, 11, 14, 30),
    type: 'meeting',
    attendees: 15,
    color: 'bg-accent/20 border-accent',
  },
];

export default function CalendarView({ calendarName, calendarEmail, onBack }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const navigate = useNavigate();

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => isSameDay(event.start, date));
  };

  const getEventsForWeek = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    return mockEvents.filter(event => 
      event.start >= weekStart && event.start <= weekEnd
    );
  };

  const getEventsForMonth = (date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return mockEvents.filter(event => 
      event.start >= monthStart && event.start <= monthEnd
    );
  };

  const renderDayView = () => {
    const events = getEventsForDate(selectedDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
          <Badge>{events.length} events</Badge>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[80px_1fr] max-h-[500px] overflow-y-auto">
            {hours.map(hour => (
              <div key={hour} className="contents">
                <div className="border-b border-r p-2 text-sm text-muted-foreground bg-muted/30">
                  {format(new Date().setHours(hour, 0), 'h:mm a')}
                </div>
                <div className="border-b p-2 min-h-[60px] relative">
                  {events
                    .filter(event => event.start.getHours() === hour)
                    .map(event => (
                      <div 
                        key={event.id} 
                        className={`border-l-4 ${event.color} p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => navigate(`/meetings/${event.id}`)}
                      >
                        <div className="font-medium text-sm">{event.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                          {event.attendees && (
                            <>
                              <Users className="h-3 w-3 ml-1" />
                              {event.attendees}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1 }) });
    const events = getEventsForWeek(selectedDate);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(weekStart, 'MMM d')} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </h3>
          <Badge>{events.length} events</Badge>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-border">
            {weekDays.map(day => (
              <div key={day.toString()} className="bg-background">
                <div className="p-2 text-center border-b bg-muted/30">
                  <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                  <div className={`text-lg ${isSameDay(day, new Date()) ? 'text-primary font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="p-2 min-h-[300px] space-y-1">
                  {getEventsForDate(day).map(event => (
                    <div 
                      key={event.id} 
                      className={`border-l-4 ${event.color} p-1.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => navigate(`/meetings/${event.id}`)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(event.start, 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const events = getEventsForMonth(selectedDate);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{format(selectedDate, 'MMMM yyyy')}</h3>
          <Badge>{events.length} events</Badge>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-border">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium bg-muted/30">
                {day}
              </div>
            ))}
            {days.map(day => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
              
              return (
                <div 
                  key={day.toString()} 
                  className={`bg-background p-2 min-h-[100px] ${!isCurrentMonth ? 'text-muted-foreground/40' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(event => (
                      <div 
                        key={event.id} 
                        className={`border-l-2 ${event.color} px-1 py-0.5 text-xs truncate cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => navigate(`/meetings/${event.id}`)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calendars
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold">{calendarName}</h2>
        <p className="text-muted-foreground">{calendarEmail}</p>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border pointer-events-auto"
          />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary/20 border-2 border-primary" />
                <span className="text-xs">Sales Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-accent/20 border-2 border-accent" />
                <span className="text-xs">Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-highlight/20 border-2 border-highlight" />
                <span className="text-xs">Internal</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>

            <div className="flex-1">
              <TabsContent value="day" className="mt-0">
                {renderDayView()}
              </TabsContent>

              <TabsContent value="week" className="mt-0">
                {renderWeekView()}
              </TabsContent>

              <TabsContent value="month" className="mt-0">
                {renderMonthView()}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
