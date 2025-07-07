import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  count?: number;
}

interface SelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  widthClass?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  value,
  onChange,
  options,
  placeholder,
  label,
  widthClass = "w-48",
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={widthClass}>
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && (
              <span className="ml-2 text-muted-foreground">
                ({option.count})
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
