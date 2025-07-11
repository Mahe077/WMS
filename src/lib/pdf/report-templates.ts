export const reportTemplates = {
  receiving_report: {
    title: "Receiving Report",
    headers: [
      {
        header: "LPN",
        key: "lpn",
      },
      {
        header: "Order No.",
        key: "orderNo",
      },
      {
        header: "SKU",
        key: "sku",
      },
      {
        header: "Description",
        key: "description",
      },
      {
        header: "Quantity Received",
        key: "quantityReceived",
      },
      {
        header: "Received Date",
        key: "receivedDate",
      },
      {
        header: "Status",
        key: "status",
      },
    ],
    fileName: "receiving_report",
  },
  picking_report: {
    title: "Picking Report",
    headers: [
      "Order No.",
      "SKU",
      "Description",
      "Quantity Picked",
      "Picked Date",
      "Status",
    ],
    fileName: "picking_report",
  },
  packing_report: {
    title: "Packing Report",
    headers: [
      "Order No.",
      "SKU",
      "Description",
      "Quantity Packed",
      "Packed Date",
      "Status",
    ],
    fileName: "packing_report",
  },
  stock_on_hand: {
    title: "Stock on Hand Report",
    headers: [
      "SKU",
      "Description",
      "UOM",
      "Available Qty",
      "Committed Qty",
      "Location(s)",
      "Last Updated",
    ],
    fileName: "stock_on_hand_report",
  },
  delivery_docket: {
    title: "Delivery Docket",
    headers: [
      "Delivery Docket No.",
      "Customer Name",
      "Order No.",
      "SKU",
      "Description",
      "Quantity Dispatched",
      "Dispatch Date",
    ],
    fileName: "delivery_docket",
  },
  // Add other reports here...
};
