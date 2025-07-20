
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { getInventoryItems } from "@/features/inventory/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const isExport = searchParams.get("export") === "true";
  const format = searchParams.get("format") || "excel";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10", 10);
  const searchTerm = searchParams.get("searchTerm") || undefined;
  const status = searchParams.get("status") || undefined;
  const location = searchParams.get("location") || undefined;
  const bbd = searchParams.get("bbd") || undefined;

  try {
    // If it's an export request, fetch all matching items without pagination
    const { items: filteredItems } = await getInventoryItems({
      page: 1, // Fetch all data for export
      itemsPerPage: 999999, // A large number to get all items
      searchTerm,
      status,
      location,
      bbd,
    });

    if (isExport) {
      const fileName = `inventory-export-${new Date().toISOString()}`;

      if (format === "csv") {
        const csv = Papa.unparse(filteredItems);
        return new NextResponse(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${fileName}.csv"`,
          },
        });
      } else { // Default to Excel
        const worksheet = XLSX.utils.json_to_sheet(filteredItems);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        return new NextResponse(Buffer.from(buffer), {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${fileName}.xlsx"`,
          },
        });
      }
    } else {
      // For regular data requests, fetch paginated data
      const { items, totalItems, totalPages, currentPage } = await getInventoryItems({
        page,
        itemsPerPage,
        searchTerm,
        status,
        location,
        bbd,
      });

      return NextResponse.json({
        items,
        totalItems,
        totalPages,
        currentPage,
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory data." }, { status: 500 });
  }
}
