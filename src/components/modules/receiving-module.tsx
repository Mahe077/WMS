"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Scan,
  Package,
  AlertCircle,
  CheckCircle,
  Printer,
  Camera,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  usePagination,
  // useFilters,
  useNotifications,
} from "@/contexts/app-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  ChecksumException,
  FormatException,
} from "@zxing/library";
import { CustomTable, TableColumn } from "../common/custom-table";

export function ReceivingModule() {
  const [scanMode, setScanMode] = useState(false);
  const [scannedLPN, setScannedLPN] = useState("");
  const { addNotification } = useNotifications();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanSuccess, setScanSuccess] = useState(false);

  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanningActive, setScanningActive] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);
  // Add this state to track the active stream
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  const tempReceipt: ReceiptItem = {
    lpn: "LPN001234",
    sku: "SKU-12345",
    lot: "LOT240101",
    qty: 100,
    status: "Received",
    bay: "A-12",
  }

  const pendingASNs = [
    {
      id: "ASN-2024-001",
      supplier: "ABC Foods",
      items: 15,
      status: "Pending",
      eta: "Today 2:00 PM",
    },
    {
      id: "ASN-2024-002",
      supplier: "XYZ Beverages",
      items: 8,
      status: "In Transit",
      eta: "Tomorrow 9:00 AM",
    },
    {
      id: "ASN-2024-003",
      supplier: "Fresh Produce Co",
      items: 22,
      status: "Delayed",
      eta: "Tomorrow 3:00 PM",
    },
    // Add more mock data for pagination
    ...Array.from({ length: 27 }, (_, i) => ({
      id: `ASN-2024-${String(i + 4).padStart(3, "0")}`,
      supplier: `Supplier ${i + 1}`,
      items: Math.floor(Math.random() * 50) + 1,
      status: ["Pending", "In Transit", "Delayed"][
        Math.floor(Math.random() * 3)
      ],
      eta: `Day ${i + 1} ${Math.floor(Math.random() * 12) + 1}:00 ${
        Math.random() > 0.5 ? "AM" : "PM"
      }`,
    })),
  ];

  const allRecentReceipts: ReceiptItem[] = [
    {
      lpn: "LPN001234",
      sku: "SKU-12345",
      lot: "LOT240101",
      qty: 100,
      status: "Received",
      bay: "A-12",
    },
    {
      lpn: "LPN001235",
      sku: "SKU-12346",
      lot: "LOT240102",
      qty: 50,
      status: "QC Hold",
      bay: "Q-01",
    },
    {
      lpn: "LPN001236",
      sku: "SKU-12347",
      lot: "LOT240103",
      qty: 75,
      status: "Received",
      bay: "B-05",
    },
    // Add more mock data
    ...Array.from({ length: 47 }, (_, i) => ({
      lpn: `LPN${String(i + 1237).padStart(6, "0")}`,
      sku: `SKU-${12348 + i}`,
      lot: `LOT24${String(i + 104).padStart(4, "0")}`,
      qty: Math.floor(Math.random() * 200) + 10,
      status: Math.random() > 0.8 ? "QC Hold" : "Received",
      bay: `${String.fromCharCode(65 + (i % 5))}-${String(i + 13).padStart(
        2,
        "0"
      )}`,
    })),
  ];

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("receiving-receipts", allRecentReceipts.length, 10);

  const paginatedReceipts = getPageItems(allRecentReceipts);

  const handleScanToggle = () => {
    setScanMode(!scanMode);
    addNotification({
      type: "info",
      message: scanMode ? "Scan mode disabled" : "Scan mode enabled",
    });
  };

  type ReceiptItem = {
    lpn?: string;
    id?: string;
    [key: string]: unknown;
    sku: string;
    lot: string;
    qty: number;
    status: string;
    bay: string;
  };

  const handleAction = (action: string, item?: ReceiptItem) => {
    addNotification({
      type: "success",
      message: `${action} ${
        item ? `for ${item.lpn || item.id}` : ""
      } completed successfully`,
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  // Modified startBarcodeScanning function
  const startBarcodeScanning = async () => {
    try {
      setIsScannerOpen(true);
      setIsScanning(true);
      setScanError("");
      setScanSuccess(false);
      setScanningActive(true);

      // Initialize ZXing code reader
      const reader = new BrowserMultiFormatReader();
      setCodeReader(reader);

      // 1️⃣  Get available video devices (may be empty before permission is granted)
      let devices = await reader.listVideoInputDevices();

      // 2️⃣  If none found, request temporary camera access to force enumeration
      if (devices.length === 0) {
        try {
          const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
          tempStream.getTracks().forEach((track) => track.stop()); // immediately close
          devices = await reader.listVideoInputDevices(); // retry enumeration
        } catch {
          /* ignore; handled below */
        }
      }

      setVideoDevices(devices);
      setCameraAvailable(devices.length > 0);

      if (devices.length === 0) {
        setScanError("No camera devices found. Please check your device and browser permissions, or use a device with a camera.");
        setIsScanning(false);
        setScanningActive(false);
        setCameraAvailable(false);
        return;
      }

      // 3️⃣  Prefer back-facing camera (environment)
      const backCamera = devices.find(
        (d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("environment")
      );
      const deviceId = backCamera?.deviceId ?? devices[0].deviceId;
      setSelectedDeviceId(deviceId);

      if (!deviceId) {
        setScanError("No camera devices found. Please check your device and browser permissions, or use a device with a camera.");
        setIsScanning(false);
        setScanningActive(false);
        setCameraAvailable(false);
        return;
      }

      setCameraAvailable(true);

      // Start scanning with selected device
      await reader
        .decodeOnceFromVideoDevice(deviceId, "video-preview")
        .then((result) => {
          const scannedCode = result.getText();
          setScannedLPN(scannedCode);
          setScanSuccess(true);
          setIsScanning(false);
          setScanningActive(false);

          addNotification({
            type: "success",
            message: `Barcode scanned successfully: ${scannedCode}`,
          });

          // Auto-close after success with proper cleanup
          setTimeout(() => {
            closeBarcodeScanner();
          }, 2000);
        })
        .catch((err) => {
          if (err instanceof NotFoundException) {
            setScanError("No barcode found. Please try again.");
          } else if (err instanceof ChecksumException) {
            setScanError("Barcode checksum error. Please try again.");
          } else if (err instanceof FormatException) {
            setScanError("Unsupported barcode format.");
          } else {
            setScanError("Scanning failed. Please check camera permissions.");
          }
          setIsScanning(false);
          setScanningActive(false);

          addNotification({
            type: "error",
            message: "Barcode scanning failed. Please try again.",
          });
        });
    } catch (error) {
      console.error("Camera access error:", error);
      setScanError("Camera access denied or not available. Please check your device and browser permissions, or use a device with a camera.");
      setIsScanning(false);
      setScanningActive(false);
      setCameraAvailable(false);
      addNotification({
        type: "error",
        message: "Failed to access any camera. Please check device capabilities and permissions.",
      });
    }
  };

  // Improved closeBarcodeScanner function
  const closeBarcodeScanner = useCallback(() => {
    // Stop ZXing scanner first
    if (codeReader) {
      try {
        codeReader.reset();
      } catch (error) {
        console.error("Error resetting code reader:", error);
      }
      setCodeReader(null);
    }

    // Stop current stream if we have a reference
    if (currentStream) {
      currentStream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped track:", track.kind, track.label);
      });
      setCurrentStream(null);
    }

    // Also stop video element stream as backup
    if (videoRef) {
      const stream = videoRef.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped video ref track:", track.kind, track.label);
        });
      }
      videoRef.srcObject = null;
    }

    // Additional cleanup: get video element by ID and stop its stream
    const videoElement = document.getElementById("video-preview") as HTMLVideoElement;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Stopped element track:", track.kind, track.label);
      });
      videoElement.srcObject = null;
    }

    // Reset all states
    setIsScannerOpen(false);
    setIsScanning(false);
    setScanError("");
    setScanSuccess(false);
    setScanningActive(false);
    setVideoDevices([]);
    setSelectedDeviceId("");
  }, [codeReader, currentStream, videoRef]);

  // Modified switchCamera function
  const switchCamera = async (deviceId: string) => {
  if (!codeReader) return;

  try {
    // Stop current stream before switching
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      setCurrentStream(null);
    }

    setSelectedDeviceId(deviceId);
    setIsScanning(true);
    setScanError("");

    codeReader
      .decodeOnceFromVideoDevice(deviceId, "video-preview")
      .then((result) => {
        const scannedCode = result.getText();
        setScannedLPN(scannedCode);
        setScanSuccess(true);
        setIsScanning(false);

        addNotification({
          type: "success",
          message: `Barcode scanned successfully: ${scannedCode}`,
        });

        setTimeout(() => {
          closeBarcodeScanner();
        }, 2000);
      })
      .catch((err) => {
        if (err instanceof NotFoundException) {
          setScanError("No barcode found. Please try again.");
        } else {
          setScanError("Scanning failed with selected camera.");
        }
        setIsScanning(false);
      });

    // Store new stream reference after initialization
    setTimeout(() => {
      const videoElement = document.getElementById("video-preview") as HTMLVideoElement;
      if (videoElement && videoElement.srcObject) {
        setCurrentStream(videoElement.srcObject as MediaStream);
      }
    }, 100);

  } catch {
    setScanError("Failed to switch camera");
    setIsScanning(false);
  }
};

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      closeBarcodeScanner();
    };
  }, []);

    const getStatusBadge = (status: string) => {
    switch (status) {
      case "Received":
        return <Badge variant="default">Received</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const tableColumns: TableColumn<ReceiptItem>[] = [
    { key: "lpn", label: "LPN", priority: "high" },
    { key: "sku", label: "SKU", priority: "high" },
    { key: "lot", label: "LOT", priority: "high" },
    { key: "qty", label: "Quantity", priority: "high" },
    { key: "status", label: "Status", priority: "high" , render: (value) => getStatusBadge(String(value)),},
    { key: "bay", label: "Bay", priority: "high" },
    // { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Receiving & ASN Processing
          </h2>
          <p className="text-muted-foreground">
            Process incoming shipments and validate against ASNs
          </p>
        </div>
        <Button
          onClick={handleScanToggle}
          className="w-full sm:w-auto"
          disabled={cameraAvailable === false}
        >
          <Scan className="h-4 w-4 mr-2" />
          {scanMode ? "Exit Scan Mode" : "Start Scanning"}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Scanning Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Scan LPN/SSCC
            </CardTitle>
            <CardDescription>
              Scan incoming pallet labels to begin receiving process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lpn">LPN/SSCC Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="lpn"
                  placeholder="Scan or enter LPN/SSCC"
                  value={scannedLPN}
                  onChange={(e) => setScannedLPN(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={startBarcodeScanning}
                  disabled={isScanning || cameraAvailable === false}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              {cameraAvailable === false && (
                <div className="text-xs text-red-600 mt-2">
                  <strong>No camera devices found.</strong> Please check your device and browser permissions, or use a device with a camera.
                </div>
              )}
            </div>

            {scannedLPN && (
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium mb-2">Scanned Item Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>LPN: {scannedLPN}</div>
                  <div>SKU: SKU-12345</div>
                  <div>LOT: LOT240101</div>
                  <div>Qty: 100 units</div>
                  <div>BBD: 2024-12-31</div>
                  <div>Temp Zone: Ambient</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAction("Accept", { ...tempReceipt, lpn: scannedLPN })}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleAction("QC Hold", { ...tempReceipt,lpn: scannedLPN })}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    QC Hold
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      handleAction("Print Label", { ...tempReceipt,lpn: scannedLPN })
                    }
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Print Label
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="bay">Assign Storage Bay</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select bay based on temp zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-12">A-12 (Ambient)</SelectItem>
                  <SelectItem value="c-05">C-05 (Chilled)</SelectItem>
                  <SelectItem value="f-01">F-01 (Frozen)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Receiving Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any damage, discrepancies, or special notes..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Pending ASNs */}
        <Card>
          <CardHeader>
            <CardTitle>Pending ASNs</CardTitle>
            <CardDescription>
              Advanced Shipping Notices awaiting receipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pendingASNs.slice(0, 10).map((asn) => (
                <div
                  key={asn.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2"
                >
                  <div className="flex-1">
                    <div className="font-medium">{asn.id}</div>
                    <div className="text-sm text-gray-600">{asn.supplier}</div>
                    <div className="text-sm text-gray-500">
                      {asn.items} items • ETA: {asn.eta}
                    </div>
                  </div>
                  <Badge
                    variant={
                      asn.status === "Pending"
                        ? "default"
                        : asn.status === "In Transit"
                        ? "secondary"
                        : "destructive"
                    }
                    className="self-start sm:self-center"
                  >
                    {asn.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <CustomTable<ReceiptItem>
          columns={tableColumns}
          data={paginatedReceipts}
          title="Recent Receipts"
          description={`Recently processed incoming items - Showing ${paginatedReceipts.length} of ${allRecentReceipts.length} receipts`}
          onRowAction={(action: string, row: ReceiptItem) =>
            handleAction(action, row)
          }
          expandable={false}
          showDefaultActions={false}
          renderTableActions={(row: ReceiptItem) => (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAction("Print Label", row)}
            >
              <Printer className="h-4 w-4" />
            </Button>
          )}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItemsCount={allRecentReceipts.length}
          handleItemsPerPageChange={handleItemsPerPageChange}
          goToPage={goToPage}
        />
      </div>

      {/* Barcode Scanner Dialog */}
      <Dialog open={isScannerOpen} onOpenChange={closeBarcodeScanner}>
        <DialogContent className="sm:max-w-md w-full max-w-[95vw] max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Camera className="h-5 w-5" />
              Barcode Scanner
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 space-y-4">
            {/* Camera Preview Area */}
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                id="video-preview"
                ref={setVideoRef}
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
                      {scannedLPN}
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
                    onClick={closeBarcodeScanner}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>

                  {scanError && !isScanning && (
                    <Button size="sm" onClick={startBarcodeScanning}>
                      <Camera className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Manual Entry Fallback */}
            <div className="pt-3 border-t space-y-2">
              <Label className="text-xs text-muted-foreground">
                Having trouble? Enter barcode manually:
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode manually"
                  value={scannedLPN}
                  onChange={(e) => setScannedLPN(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (scannedLPN.trim()) {
                      addNotification({
                        type: "success",
                        message: `Barcode entered manually: ${scannedLPN}`,
                      });
                      closeBarcodeScanner();
                    }
                  }}
                  disabled={!scannedLPN.trim()}
                >
                  Use
                </Button>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="text-xs text-muted-foreground text-center">
              Supports: Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, QR Code
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
