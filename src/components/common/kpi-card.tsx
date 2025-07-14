"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface KpiCardProps {
  metric: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export function KpiCard({ metric, value, change, trend }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{metric}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          <TrendingUp className={`h-3 w-3 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
          {change} from last period
        </p>
      </CardContent>
    </Card>
  );
}
