"use client"

import { ProtectedRoute } from "@/components/common/protected-route";

export default function MovementsPage() {
    return (
        <ProtectedRoute requiredPermission="movements.view">
            <div className="space-y-6">
                {/* Warehouse Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Movements</h2>
                        <p className="text-muted-foreground">Manage order processing, picking, and packing</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}