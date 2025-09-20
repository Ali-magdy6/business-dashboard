import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export const KPICardSkeleton: React.FC = () => (
  <Card className="kpi-card">
    <CardContent className="flex items-center justify-between h-full p-6">
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
    </CardContent>
  </Card>
);

export const ChartCardSkeleton: React.FC = () => (
  <Card className="chart-card">
    <CardHeader className="pb-4">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="chart-container">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);

export const TableSkeleton: React.FC = () => (
  <Card className="table-card">
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCardSkeleton />
      <ChartCardSkeleton />
    </div>

    {/* Additional Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartCardSkeleton />
      <div className="lg:col-span-2">
        <TableSkeleton />
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
