import { CustomTable, TableColumn } from "@/components/common/custom-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications, usePagination } from "@/contexts/app-context";
import { Report } from "@/lib/types";
import { Download } from "lucide-react";
import React from "react";

interface ReportsHistoryViewProps {
  recentReports: Report[]; // Replace with actual type
}

export function ReportsHistoryView({ recentReports }: ReportsHistoryViewProps) {
  const { addNotification } = useNotifications();
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default">Completed</Badge>;
      case "Processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

const formatSize = (size: number) => {
  if (size < 1024) {
    return `${size} KB`;
  } else {
    return `${(size / 1024).toFixed(2)} MB`;
  }
};

const renderSizeBadge = (size: number) => (
  <Badge variant="outline">{formatSize(size)}</Badge>
);

  const tableColumns: TableColumn<Report>[] = [
    { key: "id", label: "Report ID", priority: "high" },
    { key: "name", label: "Name", priority: "high" },
    { key: "type", label: "Type", priority: "high" },
    { key: "generated", label: "Generated", priority: "high" },
    {
      key: "status",
      label: "Status",
      priority: "high",
      render: (value) => getStatusBadge(String(value)),
    },
    { key: "size", label: "Size", priority: "medium", render: (value) => renderSizeBadge(Number(value)) },
  ];

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("reports-history", recentReports.length, 10);

  const paginateReports = getPageItems(recentReports);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  const renderPickListTableActions = (row: Report) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        console.log("Pick item:", row.id);
        addNotification({
          type: "info",
          message: `Downloading report ${row.id}`,
        });
      }}
    >
      <Download className="h-4 w-4" />
    </Button>
  );

  return (
    <React.Fragment>
      {/* Orders Table */}
      <CustomTable
        columns={tableColumns}
        data={paginateReports}
        title={"Reports History"}
        description={"Previously generated reports and their statuses"}
        onRowAction={(action, row) => {
          if (action === "view") {
            // Handle view action
            console.log("View order", row);
            // e.g., navigate to order details page
          } else if (action === "pick") {
            // Handle pick action
            console.log("Pick order", row);
            // e.g., trigger pick workflow
          } else {
            // Handle other actions
            console.log("Other action", action, row);
          }
          addNotification({
            type: "success",
            message: `${action} action performed on ${row.id}`,
          });
        }}
        expandable={false}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItemsCount={paginateReports.length}
        handleItemsPerPageChange={handleItemsPerPageChange}
        goToPage={goToPage}
        renderTableActions={renderPickListTableActions}
      />
    </React.Fragment>
  );
}
