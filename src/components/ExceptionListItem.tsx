import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExceptionListItemProps {
  icon: LucideIcon;
  title: string;
  metadata: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  quickAction?: {
    label: string;
    onClick: () => void;
  };
  onClick: () => void;
}

export function ExceptionListItem({ 
  icon: Icon, 
  title, 
  metadata, 
  badge, 
  quickAction, 
  onClick 
}: ExceptionListItemProps) {
  return (
    <div 
      className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-b-0"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 flex-1">
        <Icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">{metadata}</p>
            {badge && (
              <Badge variant={badge.variant || "outline"} className="text-xs">
                {badge.text}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {quickAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            quickAction.onClick();
          }}
        >
          {quickAction.label}
        </Button>
      )}
    </div>
  );
}
