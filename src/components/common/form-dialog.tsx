import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  className = "",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 space-y-0" onClick={onClose}>
      <Card
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto relative ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
