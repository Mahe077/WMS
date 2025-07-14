import { CustomTable, TableColumn } from "@/components/common/custom-table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { useNotifications, usePagination } from "@/contexts/app-context";
import { User } from "@/features/auth/types";
import { Stat } from "@/lib/types";
import { Activity, UserRoundMinus, UserRoundPlus, Users } from "lucide-react";
import React from "react";

const userStats: Stat[] = [
  {
    title: "Total Users",
    value: 27,
    changeDescription: "Active system users",
    icon: Users,
    change: "",
    color: "text-blue-600",
  },
  {
    title: "Active Sessions",
    value: 18,
    changeDescription: "Currently logged in",
    icon: Activity,
    change: "",
    color: "text-green-600",
  },
  {
    title: "New Users (30d)",
    value: 5,
    changeDescription: "Added this month",
    icon: UserRoundPlus,
    change: "",
    color: "text-purple-600",
  },
  {
    title: "Inactive Users",
    value: 3,
    changeDescription: "Require attention",
    icon: UserRoundMinus,
    change: "",
    color: "text-orange-600",
  },
];

interface UserViewProps {
  users: User[];
}

export function UserView({ users }: UserViewProps) {
    const { addNotification } = useNotifications();
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    getPageItems,
    setPagination,
  } = usePagination("orders-active", users.length, 10);

  const paginatedOrders = getPageItems(users);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPagination({ itemsPerPage: newItemsPerPage, currentPage: 1 });
  };

    const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default">Active</Badge>
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "Suspended":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge variant="destructive">Admin</Badge>
      case "Manager":
        return <Badge variant="default">Manager</Badge>
      case "Picker":
        return <Badge variant="secondary">Picker</Badge>
      case "Forklift Driver":
        return <Badge variant="outline">Forklift Driver</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const userColumns: TableColumn<User>[] = [
    { key: "id", label: "User ID", priority: "high" },
    { key: "name", label: "Name", priority: "high" },
    { key: "email", label: "Email", priority: "medium" },
    { key: "role", label: "Role", priority: "medium", render: (value) => getRoleBadge(String(value)) },
    { key: "status", label: "Status", priority: "low", render: (value) =>  getStatusBadge(String(value))},
    { key: "lastLogin", label: "Last Login", priority: "low" }
  ];
  return (
    <React.Fragment>
      {/* User Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            changeDescription={stat.changeDescription}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      {/* Users Table */}
      <CustomTable<User>
        columns={userColumns}
        data={users}
        title={"System Users"}
        description="Manage user accounts and access permissions"
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
            message: `${action} action performed on ${row.name}`,
            });
        }}
        // renderExpandedContent={() => <div>Expanded Content</div>}
        expandable={false}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItemsCount={paginatedOrders.length}
        handleItemsPerPageChange={handleItemsPerPageChange}
        goToPage={goToPage}
      />
    </React.Fragment>
  );
}
