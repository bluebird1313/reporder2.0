"use client";
import { useMemo, useState } from "react";
import clsx from "clsx";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  stock: number;
  price: number;
}

export interface InventoryDataTableProps {
  items: InventoryItem[];
}

export default function InventoryDataTable({ items }: InventoryDataTableProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium">Inventory</h2>
        <input
          type="text"
          placeholder="Search SKU / Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">SKU</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Name</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Stock</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm font-mono">{item.sku}</td>
                <td className="px-4 py-2 text-sm">{item.name}</td>
                <td className="px-4 py-2 text-right text-sm">
                  <span
                    className={clsx(
                      item.stock === 0 && "text-red-600",
                      item.stock > 0 && item.stock < 5 && "text-yellow-600",
                      item.stock >= 5 && "text-gray-800"
                    )}
                  >
                    {item.stock}
                  </span>
                </td>
                <td className="px-4 py-2 text-right text-sm">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 