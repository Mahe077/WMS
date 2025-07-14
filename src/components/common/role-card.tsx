"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Shield } from "lucide-react";

interface RoleCardProps {
  role: {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    userCount: number;
  };
  onEdit?: (roleId: string) => void;
}

export function RoleCard({ role, onEdit }: RoleCardProps) {
  return (
    <div key={role.id} className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{role.name}</h4>
          <Badge variant="outline">{role.userCount} users</Badge>
        </div>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(role.id)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
      <div className="flex flex-wrap gap-1">
        {role.permissions.map((permission, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {permission}
          </Badge>
        ))}
      </div>
    </div>
  );
}
