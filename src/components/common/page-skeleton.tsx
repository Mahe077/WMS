import React from 'react';

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {/* Header Placeholder */}
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>

      {/* Stats/Cards Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>

      {/* Filter Bar Placeholder */}
      <div className="h-10 bg-gray-200 rounded w-full"></div>

      {/* Table/Content Placeholder */}
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
