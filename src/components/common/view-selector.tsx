"use client";

import { Button } from "@/components/ui/button";

interface ViewOption {
  label: string;
  value: string;
}

interface ViewSelectorProps {
  options: ViewOption[];
  selectedView: string;
  onSelectView: (view: string) => void;
}

export function ViewSelector({ options, selectedView, onSelectView }: ViewSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          variant={selectedView === option.value ? "default" : "outline"}
          onClick={() => onSelectView(option.value)}
          size="sm"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
