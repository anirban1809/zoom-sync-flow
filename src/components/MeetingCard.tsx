import { Calendar, Users, Video, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Meeting } from '@/types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface MeetingCardProps {
  meeting: Meeting;
  showActions?: boolean;
  onClick?: () => void;
}

const providerColors = {
  zoom: 'bg-blue-500',
  teams: 'bg-purple-500',
  meet: 'bg-green-500',
};

const statusColors = {
  scheduled: 'default',
  live: 'destructive',
  completed: 'secondary',
  cancelled: 'outline',
} as const;

export function MeetingCard({ meeting, showActions = true, onClick }: MeetingCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/meetings/${meeting.id}`);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-2 w-2 rounded-full ${providerColors[meeting.provider]}`} />
              <h3 className="font-semibold text-base truncate">{meeting.title}</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(meeting.start, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{format(meeting.start, 'h:mm a')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>{meeting.participants.length} participants</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={participant.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {meeting.participants.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                    +{meeting.participants.length - 3}
                  </div>
                )}
              </div>
              
              {meeting.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {meeting.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={statusColors[meeting.status]}>
              {meeting.status}
            </Badge>
            
            {showActions && meeting.status === 'scheduled' && (
              <Button size="sm" variant="outline" className="gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Join
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            
            {showActions && meeting.status === 'live' && (
              <Button size="sm" variant="destructive" className="gap-1.5 animate-pulse">
                <div className="h-2 w-2 rounded-full bg-white" />
                Live Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
