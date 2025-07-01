"use client";
import clsx from "clsx";

export interface AnalyticsData {
  sharedValue: number;
  sharedVolume: number;
  topReps: { repName: string; value: number }[];
}

export interface AnalyticsOverviewProps {
  data: AnalyticsData;
  className?: string;
}

export default function AnalyticsOverview({ data, className }: AnalyticsOverviewProps) {
  return (
    <div className={clsx("rounded-lg border bg-white p-4 shadow-sm", className)}>
      <h2 className="text-sm font-medium mb-4">Sharing Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Shared Inventory Value</p>
          <p className="text-lg font-semibold">${data.sharedValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Shared SKU Volume</p>
          <p className="text-lg font-semibold">{data.sharedVolume.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">Top Reps</p>
        <ul className="space-y-1">
          {data.topReps.map((tr) => (
            <li key={tr.repName} className="flex justify-between text-sm">
              <span>{tr.repName}</span>
              <span className="font-medium">${tr.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 