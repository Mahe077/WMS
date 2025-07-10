import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { BarcodeScannerActions, BarcodeScannerState } from "@/hooks/use-barcode-scanner";

export interface BarcodeScannerDialogProps {
  state: BarcodeScannerState;
  actions: BarcodeScannerActions;
  title?: string;
  supportedFormats?: string[];
  showManualEntry?: boolean;
  onManualEntry?: (code: string) => void;
}

export function BarcodeScannerDialog({
  state,
  actions,
  title = "Barcode Scanner",
  supportedFormats = [
    "Code 128",
    "Code 39", 
    "EAN-13",
    "EAN-8",
    "UPC-A",
    "UPC-E",
    "QR Code"
  ],
  showManualEntry = true,
  onManualEntry,
}: BarcodeScannerDialogProps) {
  const {
    isOpen,
    isScanning,
    scanError,
    scanSuccess,
    scannedCode,
    videoDevices,
    selectedDeviceId,
    scanningActive,
  } = state;

  const {
    closeScanner,
    startScanning,
    switchCamera,
    setScannedCode,
  } = actions;

  const handleManualEntry = () => {
    if (scannedCode.trim()) {
      onManualEntry?.(scannedCode.trim());
      closeScanner();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeScanner}>
      <DialogContent className="sm:max-w-md w-full max-w-[95vw] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Camera Preview Area */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              id="barcode-video-preview"
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />

            {/* Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Scanning Frame */}
              <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-60">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
              </div>

              {/* Scanning Line Animation */}
              {isScanning && scanningActive && (
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-blue-400 animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Status Overlays */}
            {isScanning && !scanningActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center space-y-2">
                  <div className="animate-spin">
                    <Camera className="h-8 w-8 mx-auto" />
                  </div>
                  <p className="text-sm">Initializing camera...</p>
                </div>
              </div>
            )}

            {scanSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-600 bg-opacity-90">
                <div className="text-white text-center space-y-2">
                  <CheckCircle2 className="h-12 w-12 mx-auto" />
                  <p className="font-medium">Barcode Scanned!</p>
                  <p className="text-sm opacity-90 break-all px-4">
                    {scannedCode}
                  </p>
                </div>
              </div>
            )}

            {scanError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-90">
                <div className="text-white text-center space-y-2 px-4">
                  <AlertTriangle className="h-12 w-12 mx-auto" />
                  <p className="font-medium">Scanning Error</p>
                  <p className="text-sm opacity-90">{scanError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="space-y-3">
            {/* Camera Selection */}
            {videoDevices.length > 1 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Camera</Label>
                <Select value={selectedDeviceId} onValueChange={switchCamera}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoDevices.map((device) => (
                      <SelectItem
                        key={device.deviceId}
                        value={device.deviceId}
                      >
                        {device.label ||
                          `Camera ${device.deviceId.slice(0, 8)}...`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status and Controls */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {isScanning && scanningActive
                  ? "Scanning for barcodes..."
                  : scanSuccess
                  ? "Success!"
                  : scanError
                  ? "Error occurred"
                  : "Ready to scan"}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeScanner}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>

                {scanError && !isScanning && (
                  <Button size="sm" onClick={startScanning}>
                    <Camera className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Manual Entry Fallback */}
          {showManualEntry && (
            <div className="pt-3 border-t space-y-2">
              <Label className="text-xs text-muted-foreground">
                Having trouble? Enter barcode manually:
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode manually"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualEntry}
                  disabled={!scannedCode.trim()}
                >
                  Use
                </Button>
              </div>
            </div>
          )}

          {/* Supported Formats */}
          {supportedFormats.length > 0 && (
            <div className="text-xs text-muted-foreground text-center">
              Supports: {supportedFormats.join(", ")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}