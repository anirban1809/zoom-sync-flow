import { CheckSquare, Square, ExternalLink, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskRowProps {
  task: Task;
  onToggle?: (taskId: string) => void;
}

const statusColors = {
  'todo': 'bg-muted',
  'in-progress': 'bg-info',
  'done': 'bg-success',
  'cancelled': 'bg-muted',
} as const;

export function TaskRow({ task, onToggle }: TaskRowProps) {
  const isDone = task.status === 'done';

  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(task.id);
        }}
      >
        {isDone ? (
          <CheckSquare className="h-5 w-5 text-success" />
        ) : (
          <Square className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", isDone && "line-through text-muted-foreground")}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {task.ownerName && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.ownerName}</span>
            </div>
          )}
          {task.due && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(task.due, 'MMM d')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", statusColors[task.status])} />
        
        {task.externalLinks.length > 0 && (
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
