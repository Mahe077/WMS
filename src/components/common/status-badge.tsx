"use client";

import { Badge } from "@/components/ui/badge";
import { AlertType } from "@/lib/enum";

interface StatusBadgeProps {
  status: string;
  type?: AlertType | string;
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" | "success" = "outline";
  let colorClass = "";

  const statusLower = status.toLowerCase();

  // Define color schemes for different status categories
  const statusConfig = {
    // Success/Positive states - Green variants
    success: {
      statuses: ["available", "completed", "active", "received", "restocked", "success", "packed"],
      variant: "success" as const,
      colorClass: "bg-green-500 text-white hover:bg-green-600"
    },
    
    // In Progress/Processing - Blue variants
    inProgress: {
      statuses: ["picking", "in transit", "loading"],
      variant: "default" as const,
      colorClass: "bg-blue-500 text-white hover:bg-blue-600"
    },
    
    // Pending/Waiting - Yellow variants
    pending: {
      statuses: ["pending", "scheduled", "qc hold"],
      variant: "secondary" as const,
      colorClass: "bg-yellow-500 text-white hover:bg-yellow-600"
    },
    
    // On Hold/Paused - Orange variants
    onHold: {
      statuses: ["on hold", "occupied"],
      variant: "outline" as const,
      colorClass: "bg-orange-500 text-white hover:bg-orange-600"
    },
    
    // Stock Related - Purple variants
    stockIssues: {
      statuses: ["out of stock", "low stock", "overstock"],
      variant: "secondary" as const,
      colorClass: "bg-purple-500 text-white hover:bg-purple-600"
    },
    
    // Medium priority - Indigo
    medium: {
      statuses: ["medium"],
      variant: "secondary" as const,
      colorClass: "bg-indigo-500 text-white hover:bg-indigo-600"
    },
    
    // High priority - Red variants
    high: {
      statuses: ["high"],
      variant: "destructive" as const,
      colorClass: "bg-red-600 text-white hover:bg-red-700"
    },
    
    // Critical/Error states - Dark Red variants
    critical: {
      statuses: ["critical", "failed", "quarantine", "damage", "expired"],
      variant: "destructive" as const,
      colorClass: "bg-red-700 text-white hover:bg-red-800"
    },
    
    // Warning states - Amber
    warning: {
      statuses: ["expiring soon", "delayed", "warning"],
      variant: "outline" as const,
      colorClass: "bg-amber-500 text-white hover:bg-amber-600"
    },
    
    // Information/Neutral - Gray variants
    info: {
      statuses: ["no-show", "wrong sku", "info"],
      variant: "outline" as const,
      colorClass: "bg-gray-500 text-white hover:bg-gray-600"
    }
  };

  // Find matching status configuration
  let matchedConfig = null;
  for (const [, config] of Object.entries(statusConfig)) {
    if (config.statuses.includes(statusLower)) {
      matchedConfig = config;
      break;
    }
  }

  // Apply matched configuration or defaults
  if (matchedConfig) {
    variant = matchedConfig.variant;
    colorClass = matchedConfig.colorClass;
  } else {
    variant = "outline";
    colorClass = "bg-gray-400 text-white hover:bg-gray-500";
  }

  // Override with type-specific colors if provided
  if (type) {
    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case AlertType.Error?.toLowerCase():
      case "error":
      case "critical":
        colorClass = "bg-red-600 text-white hover:bg-red-700";
        variant = "destructive";
        break;
      case AlertType.Warning?.toLowerCase():
      case "warning":
        colorClass = "bg-amber-500 text-white hover:bg-amber-600";
        variant = "outline";
        break;
      case AlertType.Info?.toLowerCase():
      case "info":
        colorClass = "bg-blue-500 text-white hover:bg-blue-600";
        variant = "default";
        break;
      case "success":
        colorClass = "bg-green-500 text-white hover:bg-green-600";
        variant = "success";
        break;
    }
  }

  return (
    <Badge 
      variant={variant} 
      className={`${colorClass} border-0 font-medium`}
    >
      {status}
    </Badge>
  );
}