"use client";
import clsx from "clsx";

export interface Rep {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
}

export type PermissionLevel = "none" | "read" | "write";

export interface PermissionMatrixProps {
  reps: Rep[];
  collections: Collection[];
  permissions: Record<string, Record<string, PermissionLevel>>; // repId -> collectionId -> level
  className?: string;
}

export default function PermissionMatrix({ reps, collections, permissions, className }: PermissionMatrixProps) {
  return (
    <div className={clsx("overflow-x-auto rounded-lg border", className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Rep / Collection</th>
            {collections.map((col) => (
              <th key={col.id} className="px-4 py-2 text-xs font-semibold text-gray-500">
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {reps.map((rep) => (
            <tr key={rep.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-700">
                {rep.name}
              </td>
              {collections.map((col) => {
                const level = permissions[rep.id]?.[col.id] ?? "none";
                return (
                  <td key={col.id} className="px-4 py-2 text-center text-sm">
                    {level !== "none" ? (
                      <span
                        className={clsx(
                          "inline-block h-3 w-3 rounded-full",
                          level === "read" && "bg-yellow-400",
                          level === "write" && "bg-green-500"
                        )}
                        aria-label={level}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 