"use client";

import { useState, useEffect } from "react";
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
import { X, Settings, Bell, Monitor, Palette, Shield, Zap } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
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

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Small delay to ensure DOM is ready before starting animation
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    } else {
      setIsAnimating(false)
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 350) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when panel is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleSettingChange = (key: SettingsKey, value: SettingsValue) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings);
    onClose();
  };

  const handleReset = () => {
    // Reset to defaults with smooth transition
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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Optimized Overlay with backdrop blur */}
      <div
        className={`
          absolute inset-0 bg-black/20 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isAnimating ? "opacity-100" : "opacity-0"}
        `}
        style={{
          willChange: "opacity, backdrop-filter",
        }}
        onClick={handleOverlayClick}
      />

      {/* Optimized Panel with hardware acceleration */}
      <div
        className={`
          relative h-full w-full sm:w-96 lg:w-[420px] bg-white shadow-2xl
          transform transition-all duration-300 ease-out
          ${isAnimating ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
        `}
        style={{
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        {/* Header with subtle animation */}
        <div
          className={`
            flex items-center justify-between p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm
            transition-all duration-200 ease-out delay-100
            ${isAnimating ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
          `}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`
              transition-transform duration-200 ease-out delay-150
              ${isAnimating ? "rotate-0 scale-100" : "rotate-45 scale-75"}
            `}
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <Badge
              variant="secondary"
              className={`
                text-xs transition-all duration-200 ease-out delay-200
                ${isAnimating ? "scale-100 opacity-100" : "scale-75 opacity-0"}
              `}
            >
              Admin
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className={`
              transition-all duration-200 ease-out hover:scale-110 active:scale-95
              ${isAnimating ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}
            `}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content with staggered animations */}
        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div
            className={`
              p-4 space-y-6 transition-all duration-300 ease-out delay-200
              ${isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
            `}
          >
            {/* General Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`
                  transition-all duration-200 ease-out delay-300
                  ${isAnimating ? "scale-100 rotate-0" : "scale-75 rotate-12"}
                `}
                >
                  <Monitor className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">General</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="warehouseName" className="text-xs font-medium">
                    Warehouse Name
                  </Label>
                  <Input
                    id="warehouseName"
                    value={settings.warehouseName}
                    onChange={(e) => handleSettingChange("warehouseName", e.target.value)}
                    className="h-8 text-sm transition-all duration-200 focus:scale-[1.02] hover:shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-xs font-medium">
                    Timezone
                  </Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger className="h-8 text-sm transition-all duration-200 hover:shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-xs font-medium">
                    Language
                  </Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger className="h-8 text-sm transition-all duration-200 hover:shadow-sm">
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

            <Separator className="transition-opacity duration-300 delay-400" />

            {/* Notification Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`
                  transition-all duration-200 ease-out delay-500
                  ${isAnimating ? "scale-100 rotate-0" : "scale-75 -rotate-12"}
                `}
                >
                  <Bell className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications" className="text-xs font-medium">
                    Email Notifications
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications" className="text-xs font-medium">
                    Push Notifications
                  </Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="soundEnabled" className="text-xs font-medium">
                    Sound Enabled
                  </Label>
                  <Switch
                    id="soundEnabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="desktopNotifications" className="text-xs font-medium">
                    Desktop Notifications
                  </Label>
                  <Switch
                    id="desktopNotifications"
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => handleSettingChange("desktopNotifications", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>
              </div>
            </div>

            <Separator className="transition-opacity duration-300 delay-600" />

            {/* Display Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`
                  transition-all duration-200 ease-out delay-700
                  ${isAnimating ? "scale-100 rotate-0" : "scale-75 rotate-45"}
                `}
                >
                  <Palette className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Display</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-xs font-medium">
                    Theme
                  </Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                    <SelectTrigger className="h-8 text-sm transition-all duration-200 hover:shadow-sm">
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
                    className="transition-transform duration-200 hover:scale-110"
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
                    className="transition-transform duration-200 hover:scale-110"
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
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>
              </div>
            </div>

            <Separator className="transition-opacity duration-300 delay-800" />

            {/* Operational Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`
                  transition-all duration-200 ease-out delay-900
                  ${isAnimating ? "scale-100 rotate-0" : "scale-75 -rotate-45"}
                `}
                >
                  <Zap className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Operations</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRefresh" className="text-xs font-medium">
                    Auto Refresh
                  </Label>
                  <Switch
                    id="autoRefresh"
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => handleSettingChange("autoRefresh", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshInterval" className="text-xs font-medium">
                    Refresh Interval (seconds)
                  </Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="10"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingChange("refreshInterval", Number.parseInt(e.target.value))}
                    className="h-8 text-sm transition-all duration-200 focus:scale-[1.02] hover:shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultView" className="text-xs font-medium">
                    Default View
                  </Label>
                  <Select
                    value={settings.defaultView}
                    onValueChange={(value) => handleSettingChange("defaultView", value)}
                  >
                    <SelectTrigger className="h-8 text-sm transition-all duration-200 hover:shadow-sm">
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
                  <Label htmlFor="confirmActions" className="text-xs font-medium">
                    Confirm Actions
                  </Label>
                  <Switch
                    id="confirmActions"
                    checked={settings.confirmActions}
                    onCheckedChange={(checked) => handleSettingChange("confirmActions", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>
              </div>
            </div>

            <Separator className="transition-opacity duration-300 delay-1000" />

            {/* Security Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`
                  transition-all duration-200 ease-out delay-1100
                  ${isAnimating ? "scale-100 rotate-0" : "scale-75 rotate-180"}
                `}
                >
                  <Shield className="h-4 w-4 text-gray-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">Security</h3>
              </div>

              <div className="space-y-3 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-xs font-medium">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="15"
                    max="480"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                    className="h-8 text-sm transition-all duration-200 focus:scale-[1.02] hover:shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireReauth" className="text-xs font-medium">
                    Require Re-authentication
                  </Label>
                  <Switch
                    id="requireReauth"
                    checked={settings.requireReauth}
                    onCheckedChange={(checked) => handleSettingChange("requireReauth", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auditLogging" className="text-xs font-medium">
                    Audit Logging
                  </Label>
                  <Switch
                    id="auditLogging"
                    checked={settings.auditLogging}
                    onCheckedChange={(checked) => handleSettingChange("auditLogging", checked)}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with slide-up animation */}
        <div
          className={`
            flex items-center justify-between p-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm
            transition-all duration-300 ease-out delay-300
            ${isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
          `}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="transition-all duration-200 hover:scale-105 active:scale-95 bg-transparent"
          >
            Reset to Defaults
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
