"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { usePagination, useNotifications } from "@/contexts/app-context";
import { CustomTable, TableColumn } from "../common/custom-table";
import { BarcodeScannerDialog } from "../common/barcode-scanner-dialog";
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner";
import { usePdfReport } from "@/hooks/use-pdf-report";

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

export function ReceivingModule() {
  const [scannedLPN, setScannedLPN] = useState("");

  const { addNotification } = useNotifications();
  const { createReport } = usePdfReport();
  const [scannerState, scannerActions] = useBarcodeScanner({
    onSuccess: handleScanSuccess,
    onError: handleScanError,
  });

  const { isOpen, isScanning } = scannerState;
  const { startScanning } = scannerActions;

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }
  }, [isOpen, isScanning, startScanning]);



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
      eta: `Day ${i + 1} ${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? "AM" : "PM"
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

  const handleAction = async (action: string, item?: ReceiptItem) => {
    addNotification({
      type: "success",
      message: `${action} ${item ? `for ${item.lpn || item.id}` : ""
        } completed successfully`,
    });
    if (action === "Print Label" && item) {
      // Example: Generate PDF report for the receipt item
      await createReport("receiving_report", [item]);
    }
    console.log(`Action: ${action}`, item);
  };
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };
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
    { key: "status", label: "Status", priority: "high", render: (value) => getStatusBadge(String(value)), },
    { key: "bay", label: "Bay", priority: "high" },
    // { key: "actions", label: "Actions" },
  ];

  function handleScanSuccess(scannedCode: string): void {
    setScannedLPN(scannedCode);
    scannerActions.closeScanner(); // Close on success
    addNotification({
      type: "success",
      message: `Scanned LPN/SSCC: ${scannedCode}`,
    });
  }

  function handleScanError(errorMessage: string): void {
    scannerActions.closeScanner(); // Optional auto-close on error
    addNotification({
      type: "error",
      message: `Scan failed: ${errorMessage}`,
    });
  }
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
        <Button onClick={scannerActions.openScanner} className="w-full sm:w-auto">
          <Scan className="h-4 w-4 mr-2" />
          Start Scanning
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
                  onClick={scannerActions.openScanner}
                >
                  <Camera className="h-4 w-4" />
                </Button>

              </div>
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
                    onClick={() => { }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { }}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    QC Hold
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { }}
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

      <BarcodeScannerDialog
        state={scannerState}
        actions={scannerActions}
        title="Scan LPN or SSCC"
        onManualEntry={(code) => handleScanSuccess(code)}
      />

    </div>
  );
}