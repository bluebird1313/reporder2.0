"use client";
import clsx from "clsx";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export interface StoreHealthCardProps {
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  className?: string;
}

const statusStyles: Record<StoreHealthCardProps["status"], {
  color: string;
  label: string;
  Icon: typeof CheckCircleIcon;
}> = {
  connected: {
    color: "text-green-600",
    label: "Connected",
    Icon: CheckCircleIcon,
  },
  disconnected: {
    color: "text-gray-400",
    label: "Disconnected",
    Icon: ExclamationTriangleIcon,
  },
  error: {
    color: "text-red-500",
    label: "Error",
    Icon: ExclamationTriangleIcon,
  },
};

export default function StoreHealthCard({ status, lastSync, className }: StoreHealthCardProps) {
  const { color, label, Icon } = statusStyles[status];
  return (
    <div className={clsx("rounded-lg border p-4 bg-white shadow-sm", className)}>
      <div className="flex items-center space-x-3">
        <Icon className={clsx("h-6 w-6", color)} />
        <div>
          <h2 className="text-sm font-medium">Store Connection</h2>
          <p className="text-xs text-gray-600">
            Status: <span className={color}>{label}</span>
            {lastSync && (
              <span className="ml-2 text-gray-400">• Last sync: {new Date(lastSync).toLocaleString()}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 