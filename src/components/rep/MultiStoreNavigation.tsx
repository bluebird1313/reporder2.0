"use client";
import { useState } from "react";
import clsx from "clsx";

export interface StoreSummary {
  id: string;
  name: string;
  status: "connected" | "disconnected";
}

export interface MultiStoreNavigationProps {
  stores: StoreSummary[];
}

export default function MultiStoreNavigation({ stores }: MultiStoreNavigationProps) {
  const [activeId, setActiveId] = useState(stores[0]?.id);

  return (
    <div className="flex gap-2 overflow-x-auto">
      {stores.map((store) => (
        <button
          key={store.id}
          onClick={() => setActiveId(store.id)}
          className={clsx(
            "whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium",
            activeId === store.id
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          {store.name}
        </button>
      ))}
    </div>
  );
} 