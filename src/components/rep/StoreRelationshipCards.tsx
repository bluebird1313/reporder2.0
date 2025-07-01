"use client";
import clsx from "clsx";

export interface StoreRelationship {
  storeId: string;
  storeName: string;
  permission: "full" | "limited" | "collection_only";
  status: "connected" | "disconnected" | "error";
}

export interface StoreRelationshipCardsProps {
  relationships: StoreRelationship[];
}

const statusColors: Record<StoreRelationship["status"], string> = {
  connected: "bg-green-500",
  disconnected: "bg-gray-400",
  error: "bg-red-500",
};

export default function StoreRelationshipCards({ relationships }: StoreRelationshipCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {relationships.map((rel) => (
        <div key={rel.storeId} className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{rel.storeName}</h3>
            <span className={clsx("h-2 w-2 rounded-full", statusColors[rel.status])} />
          </div>
          <p className="mt-1 text-xs text-gray-500">Permission: {rel.permission}</p>
        </div>
      ))}
    </div>
  );
} 