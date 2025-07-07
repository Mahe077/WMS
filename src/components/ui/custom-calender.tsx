import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "./calendar";
import { ChevronDownIcon } from "lucide-react";

interface DateFilterPopoverProps {
  value: string | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  widthClass?: string;
}

export const CustomCalender: React.FC<DateFilterPopoverProps> = ({
  value,
  onChange,
  placeholder,
  label,
  widthClass = "w-48",
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={`${widthClass} justify-between font-normal`}
        >
          {value ? (
            new Date(value).toLocaleDateString()
          ) : (
            <span className="text-muted-foreground">{placeholder || label}</span>
          )}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          captionLayout="dropdown"
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  );
};
