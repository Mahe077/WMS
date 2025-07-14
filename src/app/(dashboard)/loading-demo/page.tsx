"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner, LoadingOverlay, InlineLoading, Skeleton, LoadingButton } from "@/components/ui/loading-spinner"

export default function LoadingDemo() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [inlineLoading, setInlineLoading] = useState(false)

  const handleButtonClick = () => {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 3000)
  }

  const handleOverlayClick = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  const handleInlineClick = () => {
    setInlineLoading(true)
    setTimeout(() => setInlineLoading(false), 2000)
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Loading Spinners Collection</h1>
        <p className="text-muted-foreground">Professional loading indicators for the WMS application</p>
      </div>

      {/* Basic Spinners */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Spinners</CardTitle>
          <CardDescription>Different spinner variants with various sizes and colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Default Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Default Spinner
              <Badge variant="secondary">Classic</Badge>
            </h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="default" size="sm" />
              <LoadingSpinner variant="default" size="md" />
              <LoadingSpinner variant="default" size="lg" />
              <LoadingSpinner variant="default" size="xl" />
            </div>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="default" size="md" color="blue" />
              <LoadingSpinner variant="default" size="md" color="green" />
              <LoadingSpinner variant="default" size="md" color="orange" />
              <LoadingSpinner variant="default" size="md" color="red" />
            </div>
          </div>

          {/* Warehouse Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Warehouse Spinner
              <Badge variant="default">WMS Theme</Badge>
            </h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="warehouse" size="sm" />
              <LoadingSpinner variant="warehouse" size="md" />
              <LoadingSpinner variant="warehouse" size="lg" />
              <LoadingSpinner variant="warehouse" size="xl" />
            </div>
          </div>

          {/* Pulse Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Pulse Spinner
              <Badge variant="outline">Smooth</Badge>
            </h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="pulse" size="sm" color="blue" />
              <LoadingSpinner variant="pulse" size="md" color="green" />
              <LoadingSpinner variant="pulse" size="lg" color="orange" />
              <LoadingSpinner variant="pulse" size="xl" color="red" />
            </div>
          </div>

          {/* Dots Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Dots Spinner
              <Badge variant="secondary">Playful</Badge>
            </h3>
            <div className="flex items-center space-x-6">
              <LoadingSpinner variant="dots" size="sm" />
              <LoadingSpinner variant="dots" size="md" />
              <LoadingSpinner variant="dots" size="lg" />
            </div>
          </div>

          {/* Bars Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Bars Spinner
              <Badge variant="outline">Audio Style</Badge>
            </h3>
            <div className="flex items-center space-x-6">
              <LoadingSpinner variant="bars" size="sm" />
              <LoadingSpinner variant="bars" size="md" />
              <LoadingSpinner variant="bars" size="lg" />
            </div>
          </div>

          {/* Orbit Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Orbit Spinner
              <Badge variant="default">Dual Ring</Badge>
            </h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="orbit" size="sm" />
              <LoadingSpinner variant="orbit" size="md" />
              <LoadingSpinner variant="orbit" size="lg" />
              <LoadingSpinner variant="orbit" size="xl" />
            </div>
          </div>

          {/* Gear Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Gear Spinner
              <Badge variant="secondary">Industrial</Badge>
            </h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="gear" size="sm" />
              <LoadingSpinner variant="gear" size="md" />
              <LoadingSpinner variant="gear" size="lg" />
              <LoadingSpinner variant="gear" size="xl" />
            </div>
          </div>

          {/* Truck Spinner */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Truck Spinner
              <Badge variant="default">Logistics</Badge>
            </h3>
            <div className="flex items-center space-x-4">
              <LoadingSpinner variant="truck" size="sm" />
              <LoadingSpinner variant="truck" size="md" />
              <LoadingSpinner variant="truck" size="lg" />
              <LoadingSpinner variant="truck" size="xl" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Loading Components</CardTitle>
          <CardDescription>Loading states for buttons, overlays, and inline content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loading Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Loading Buttons</h3>
            <div className="flex items-center space-x-4">
              <LoadingButton isLoading={buttonLoading} onClick={handleButtonClick} loadingText="Processing...">
                Process Order
              </LoadingButton>
              <Button variant="outline" onClick={handleOverlayClick}>
                Show Loading Overlay
              </Button>
            </div>
          </div>

          {/* Inline Loading */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Inline Loading</h3>
            <div className="space-y-2">
              <InlineLoading isLoading={inlineLoading} variant="warehouse" loadingText="Updating inventory...">
                <div className="flex items-center space-x-2">
                  <span>Inventory Status: </span>
                  <Badge variant="default">In Stock</Badge>
                </div>
              </InlineLoading>
              <Button variant="outline" size="sm" onClick={handleInlineClick}>
                Toggle Inline Loading
              </Button>
            </div>
          </div>

          {/* Skeleton Loading */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Skeleton Loading</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2" />
                </div>
              </div>
              <Skeleton variant="rectangular" className="w-full h-32" />
              <div className="flex space-x-2">
                <Skeleton variant="rectangular" className="w-20 h-8" />
                <Skeleton variant="rectangular" className="w-16 h-8" />
                <Skeleton variant="rectangular" className="w-24 h-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>Common loading patterns in warehouse operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <LoadingSpinner variant="warehouse" size="sm" color="blue" />
                <span className="text-sm font-medium">Processing ASN...</span>
              </div>
              <p className="text-xs text-muted-foreground">Receiving module loading state</p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <LoadingSpinner variant="truck" size="sm" color="green" />
                <span className="text-sm font-medium">Dispatching order...</span>
              </div>
              <p className="text-xs text-muted-foreground">Dispatch module loading state</p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <LoadingSpinner variant="gear" size="sm" color="orange" />
                <span className="text-sm font-medium">Updating inventory...</span>
              </div>
              <p className="text-xs text-muted-foreground">Inventory sync loading state</p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <LoadingSpinner variant="orbit" size="sm" color="red" />
                <span className="text-sm font-medium">Generating report...</span>
              </div>
              <p className="text-xs text-muted-foreground">Reports module loading state</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={showOverlay}
        message="Processing warehouse operations..."
        variant="warehouse"
        backdrop="blur"
      />
    </div>
  )
}
