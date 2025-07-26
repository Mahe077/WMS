// import { useState } from "react";
import { CustomTable, TableColumn } from "@/components/common/custom-table";
import { StatusBadge } from "@/components/common/status-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Package,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PickListItemStages } from "@/lib/enum";
import { usePagination } from "@/contexts/app-context";
import { PickListItem } from "../types/order.types";
import { useWarehouse } from "@/contexts/warehouse-context";

interface PickListViewProps {
  pickListData: PickListItem[];
  getStatusBadge?: (status: string) => React.ReactNode;
  getPriorityBadge?: (priority: string) => React.ReactNode;
}

export function PickListView({
  pickListData
 }: PickListViewProps) {
  const { selectedWarehouse } = useWarehouse();
  // Filter states for pick list
  const [pickStrategy, setPickStrategy] = useState("fifo");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPickList = pickListData.filter((item) => {
    const matchesStatus =
      statusFilter === "all" ||
      item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  })

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("orders-pick-list", filteredPickList.length, 10);

  const paginatedPickList = getPageItems(filteredPickList);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

  const pickListColumns: TableColumn<PickListItem>[] = [
    {
      key: "sku",
      label: "SKU",
      priority: "high",
    },
    {
      key: "description",
      label: "Description",
      priority: "high",
    },
    {
      key: "lot",
      label: "LOT",
      priority: "medium",
    },
    {
      key: "location",
      label: "Location",
      priority: "medium",
    },
    {
      key: "qtyOrdered",
      label: "Ordered",
      priority: "high",
    },
    {
      key: "qtyPicked",
      label: "Picked",
      priority: "high",
    },
    {
      key: "status",
      label: "Status",
      priority: "high",
      render: (value) => <StatusBadge status={String(value)} />,
    },
  ];

  // Render filters for pick list
  const renderPickListFilters = () => (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="space-y-2">
        <Select value={pickStrategy} onValueChange={setPickStrategy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fifo">FIFO Strategy</SelectItem>
            <SelectItem value="fefo">FEFO Strategy</SelectItem>
            <SelectItem value="bulk">Bulk First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search SKU or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );

  // Render custom actions for pick list
  const renderPickListActions = () => (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" className="w-full sm:w-auto">
          <FileText className="h-4 w-4 mr-2" />
          Print Pick List
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          <Package className="h-4 w-4 mr-2" />
          Export to WMS
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Progress: 
        {
          pickListData.filter((i) => i.status === PickListItemStages.Completed)
            .length
        }
        /{pickListData.length} items picked
      </div>
    </>
  );

  // Custom table actions for pick list
  const renderPickListTableActions = (row: PickListItem) => (
    <Button
      variant="outline"
      size="sm"
      disabled={row.status === PickListItemStages.Completed}
      onClick={() => console.log("Pick item:", row.sku)}
    >
      Pick
    </Button>
  );

  return (
    <>
      <div className="mb-2 text-sm text-muted-foreground">
        Warehouse: {selectedWarehouse.name}
      </div>
      <CustomTable
        title="Pick List - ORD-2024-001"
        description="Retail Chain A • Priority: High • Due: 2024-01-16 14:00"
        columns={pickListColumns}
        data={paginatedPickList}
        renderFilters={renderPickListFilters}
        renderCustomActions={renderPickListActions}
        renderTableActions={renderPickListTableActions}
        showDefaultActions={false}
        onRowAction={(action, row) => console.log(action, row)}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItemsCount={paginatedPickList.length}
        handleItemsPerPageChange={handleItemsPerPageChange}
        goToPage={goToPage}
      />
    </>
  );
}