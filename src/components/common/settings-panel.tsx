"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Settings, Bell, Monitor, Shield, Zap } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    // General Settings
    warehouseName: "Main Distribution Center",
    timezone: "America/New_York",
    language: "en",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    desktopNotifications: false,

    // Display Settings
    theme: "light",
    compactMode: false,
    showLabels: true,
    animationsEnabled: true,

    // Operational Settings
    autoRefresh: true,
    refreshInterval: 30,
    defaultView: "dashboard",
    confirmActions: true,

    // Security Settings
    sessionTimeout: 60,
    requireReauth: false,
    auditLogging: true,
  });

  type SettingsKey = keyof typeof settings;
  type SettingsValue = typeof settings[SettingsKey];

  const handleSettingChange = (key: SettingsKey, value: SettingsValue) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
    onClose();
  };

  const handleReset = () => {
    // Reset to defaults
    setSettings({
      warehouseName: "Main Distribution Center",
      timezone: "America/New_York",
      language: "en",
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      desktopNotifications: false,
      theme: "light",
      compactMode: false,
      showLabels: true,
      animationsEnabled: true,
      autoRefresh: true,
      refreshInterval: 30,
      defaultView: "dashboard",
      confirmActions: true,
      sessionTimeout: 60,
      requireReauth: false,
      auditLogging: true,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        className={`
        fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div className="p-4 space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">General</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="warehouseName"
                    className="text-xs font-medium"
                  >
                    Warehouse Name
                  </Label>
                  <Input
                    id="warehouseName"
                    value={settings.warehouseName}
                    onChange={(e) =>
                      handleSettingChange("warehouseName", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-xs font-medium">
                    Timezone
                  </Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) =>
                      handleSettingChange("timezone", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-xs font-medium">
                    Language
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      handleSettingChange("language", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notification Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="emailNotifications"
                    className="text-xs font-medium"
                  >
                    Email Notifications
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="pushNotifications"
                    className="text-xs font-medium"
                  >
                    Push Notifications
                  </Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("pushNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="soundEnabled" className="text-xs font-medium">
                    Sound Enabled
                  </Label>
                  <Switch
                    id="soundEnabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange("soundEnabled", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="desktopNotifications"
                    className="text-xs font-medium"
                  >
                    Desktop Notifications
                  </Label>
                  <Switch
                    id="desktopNotifications"
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("desktopNotifications", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* <Separator />*/}

            {/* Display Settings */}
            {/*
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">Display</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-xs font-medium">
                    Theme
                  </Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compactMode" className="text-xs font-medium">
                    Compact Mode
                  </Label>
                  <Switch
                    id="compactMode"
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showLabels" className="text-xs font-medium">
                    Show Labels
                  </Label>
                  <Switch
                    id="showLabels"
                    checked={settings.showLabels}
                    onCheckedChange={(checked) => handleSettingChange("showLabels", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animationsEnabled" className="text-xs font-medium">
                    Animations
                  </Label>
                  <Switch
                    id="animationsEnabled"
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange("animationsEnabled", checked)}
                  />
                </div>
              </div>
            </div>

            <Separator /> */}

            {/* Operational Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Operations
                </h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRefresh" className="text-xs font-medium">
                    Auto Refresh
                  </Label>
                  <Switch
                    id="autoRefresh"
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoRefresh", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="refreshInterval"
                    className="text-xs font-medium"
                  >
                    Refresh Interval (seconds)
                  </Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="10"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) =>
                      handleSettingChange(
                        "refreshInterval",
                        Number.parseInt(e.target.value)
                      )
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultView" className="text-xs font-medium">
                    Default View
                  </Label>
                  <Select
                    value={settings.defaultView}
                    onValueChange={(value) =>
                      handleSettingChange("defaultView", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="receiving">Receiving</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="orders">Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="confirmActions"
                    className="text-xs font-medium"
                  >
                    Confirm Actions
                  </Label>
                  <Switch
                    id="confirmActions"
                    checked={settings.confirmActions}
                    onCheckedChange={(checked) =>
                      handleSettingChange("confirmActions", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Security Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">Security</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="sessionTimeout"
                    className="text-xs font-medium"
                  >
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="15"
                    max="480"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "sessionTimeout",
                        Number.parseInt(e.target.value)
                      )
                    }
                    className="h-8 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="requireReauth"
                    className="text-xs font-medium"
                  >
                    Require Re-authentication
                  </Label>
                  <Switch
                    id="requireReauth"
                    checked={settings.requireReauth}
                    onCheckedChange={(checked) =>
                      handleSettingChange("requireReauth", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auditLogging" className="text-xs font-medium">
                    Audit Logging
                  </Label>
                  <Switch
                    id="auditLogging"
                    checked={settings.auditLogging}
                    onCheckedChange={(checked) =>
                      handleSettingChange("auditLogging", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
