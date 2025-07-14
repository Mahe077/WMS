"use client";

import { AlertType } from "@/lib/enum";
import { Clock, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface ActivityItemProps {
  message: string;
  time?: string;
  type?: AlertType | 'info' | 'warning' | 'error' | 'success';
  icon?: React.ElementType;
  secondaryDetail?: string;
}

export function ActivityItem({ message, time, type, icon: Icon, secondaryDetail }: ActivityItemProps) {
  let indicatorColorClass = "";
  let defaultIcon: React.ElementType | null = null;

  if (type) {
    switch (type.toLowerCase()) {
      case AlertType.Error.toLowerCase():
      case "error":
        indicatorColorClass = "bg-red-500";
        defaultIcon = AlertTriangle;
        break;
      case AlertType.Warning.toLowerCase():
      case "warning":
        indicatorColorClass = "bg-orange-500";
        defaultIcon = AlertTriangle;
        break;
      case AlertType.Info.toLowerCase():
      case "info":
        indicatorColorClass = "bg-blue-500";
        defaultIcon = Info;
        break;
      case AlertType.Success.toLowerCase():
      case "success":
        indicatorColorClass = "bg-green-500";
        defaultIcon = CheckCircle;
        break;
      default:
        indicatorColorClass = "bg-gray-500";
        defaultIcon = Clock;
        break;
    }
  } else {
    indicatorColorClass = "bg-gray-500";
    defaultIcon = Clock;
  }

  const DisplayIcon = Icon || defaultIcon;

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
      {DisplayIcon && (
        <DisplayIcon className={`h-5 w-5 flex-shrink-0 ${indicatorColorClass.replace('bg-', 'text-')}`} />
      )}
      {!DisplayIcon && (
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${indicatorColorClass}`} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">
          {message}
        </p>
        {(time || secondaryDetail) && (
          <p className="text-xs text-gray-500">
            {time && <span>{time}</span>}
            {time && secondaryDetail && <span className="mx-1">•</span>}
            {secondaryDetail && <span>{secondaryDetail}</span>}
          </p>
        )}
      </div>
    </div>
  );
}
