import { InventoryItemView } from "@/lib/types"; // adjust import path as needed
import { InventoryItemStatus } from "../enum";


export const generateInventoryData = (count = 50): InventoryItemView[] => {
  const statuses: InventoryItemStatus[] = [InventoryItemStatus.Available, InventoryItemStatus.OutOfStock, InventoryItemStatus.Discontinued, InventoryItemStatus.Archived, InventoryItemStatus.Blocked, InventoryItemStatus.QCHold];
  const categories = ["Snacks", "Beverages", "Dairy", "Canned Goods", "Health"];
  const uoms = ["pack", "kg", "litre", "unit"];
  const suppliers = [101, 102, 103];

  const data: InventoryItemView[] = Array.from({ length: count }, (_, i) => {
    const sku = `SKU-${1000 + i}`;
    const status = statuses[i % statuses.length];
    const daysToAdd = (i % 60) + 10;

    return {
      id: `itm-${i}`,
      sku,
      name: `Sample Product ${i + 1}`,
      description: `Description for Sample Product ${i + 1}`,
      category: categories[i % categories.length],
      uom: uoms[i % uoms.length],
      unitPrice: parseFloat((5 + (i % 10)).toFixed(2)),
      weight: 0.5 + (i % 3) * 0.5,
      supplierId: suppliers[i % suppliers.length],
      barcode: `1234567890${i}`,
      tags: ["demo", categories[i % categories.length].toLowerCase()],
      customAttributes: { shelfLife: `${90 + i} days` },

      inventory: [
        {
          id: `inv-${i}`,
          masterItemId: `itm-${i}`,
          lotNumber: `LOT-${202400 + i}`,
          batchNumber: `BCH-${i}`,
          serialNumber: `SER-${i}`,
          bbd: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000),
          totalQty: 100 + (i % 50),
          qtyOnHand: {
            available: 60 + (i % 20),
            reserved: 10 + (i % 5),
            damaged: i % 3,
            inTransit: i % 2,
          },
          activeBay: {
            location: `A-${Math.floor(i / 10)}-${i % 10}`,
            palletId: `PAL-${i}`,
            qtyOnPallet: 30 + (i % 20),
            maxPalletCapacity: 100,
          },
          reserve: {
            location: `R-${Math.floor(i / 10)}`,
            pallets: [
              {
                palletId: `PAL-R${i}`,
                qtyOnPallet: 20 + (i % 30),
                location: `R-${Math.floor(i / 10)}-BIN${i % 5}`,
              }
            ],
            totalQtyInReserve: 40 + (i % 60),
          },
          location: `A-${Math.floor(i / 10)}-${i % 10}`,
          status,
          lastUpdated: new Date().toISOString(),
          notes: i % 4 === 0 ? "Needs inspection" : undefined,
          warranty: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
          locationDetails: {
            aisle: `A${i % 5}`,
            shelf: `S${i % 4}`,
            bin: `B${i % 3}`,
          },
          customFields: {
            inspectionPassed: i % 2 === 0,
          },
        }
      ]
    };
  });

  return data;
};
