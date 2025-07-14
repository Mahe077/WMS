"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  icon?: React.ElementType;
}

export function FormError({ message, icon: Icon }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
      {Icon ? <Icon className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {message}
    </p>
  );
}
