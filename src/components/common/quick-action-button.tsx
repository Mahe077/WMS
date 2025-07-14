"use client";

import { Button } from "@/components/ui/button";
import { ProtectedComponent } from "@/components/common/protected-component";

interface QuickActionButtonProps {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  permission?: string;
}

export function QuickActionButton({ label, icon: Icon, onClick, permission }: QuickActionButtonProps) {
  return (
    <ProtectedComponent requiredPermission={permission}>
      <Button className="w-full justify-start" variant="outline" onClick={onClick}>
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </ProtectedComponent>
  );
}
