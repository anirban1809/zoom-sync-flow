import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  sparklineData?: number[];
  info?: string;
  onClick?: () => void;
}

export function KPICard({ label, value, delta, sparklineData, info, onClick }: KPICardProps) {
  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {info && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{info}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{value}</div>
            {delta && (
              <div className={cn(
                "flex items-center text-sm font-medium mt-1",
                delta.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {delta.isPositive ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(delta.value)}%
              </div>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <div className="h-12 w-24">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                  points={sparklineData.map((val, i) => {
                    const x = (i / (sparklineData.length - 1)) * 100;
                    const y = 50 - ((val - Math.min(...sparklineData)) / 
                      (Math.max(...sparklineData) - Math.min(...sparklineData)) * 40);
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
