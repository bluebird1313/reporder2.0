"use client";

export interface SalesStats {
  totalSales: number;
  averageOrderValue: number;
  ordersCount: number;
  target: number;
}

export interface SalesPerformanceCardsProps {
  data: SalesStats;
}

export default function SalesPerformanceCards({ data }: SalesPerformanceCardsProps) {
  const kpis = [
    { label: "Total Sales", value: `$${data.totalSales.toLocaleString()}` },
    { label: "Average Order", value: `$${data.averageOrderValue.toFixed(2)}` },
    { label: "Orders", value: data.ordersCount.toLocaleString() },
    { label: "Target", value: `${Math.round((data.totalSales / data.target) * 100)}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">{kpi.label}</p>
          <p className="text-lg font-semibold">{kpi.value}</p>
        </div>
      ))}
    </div>
  );
} 