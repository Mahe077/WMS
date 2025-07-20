"use client"

import { ProtectedRoute } from "@/components/common/protected-route";

export default function MasterDataPage() {
    return (
        <ProtectedRoute requiredPermission="master-data.view">
            <div className="space-y-6">
                {/* Warehouse Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Master Data</h2>
                        <p className="text-muted-foreground">Manage master data entities</p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}