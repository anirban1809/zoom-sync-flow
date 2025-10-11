import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TimePicker({ value, onChange, placeholder = "Pick a time" }: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ["00", "15", "30", "45"];

  const [selectedHour, selectedMinute] = value
    ? value.split(":").map((v) => v.padStart(2, "0"))
    : ["09", "00"];

  const handleTimeSelect = (hour: string, minute: string) => {
    onChange(`${hour.padStart(2, "0")}:${minute}`);
    setOpen(false);
  };

  const formatTime = (time: string) => {
    if (!time) return null;
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatTime(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex pointer-events-auto">
          <ScrollArea className="h-[240px]">
            <div className="p-2">
              {hours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => handleTimeSelect(hour.toString(), selectedMinute)}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded hover:bg-accent text-left",
                    selectedHour === hour.toString().padStart(2, "0") && "bg-accent"
                  )}
                >
                  {hour.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="border-l" />
          <ScrollArea className="h-[240px]">
            <div className="p-2">
              {minutes.map((minute) => (
                <button
                  key={minute}
                  onClick={() => handleTimeSelect(selectedHour, minute)}
                  className={cn(
                    "w-full px-3 py-2 text-sm rounded hover:bg-accent text-left",
                    selectedMinute === minute && "bg-accent"
                  )}
                >
                  {minute}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
