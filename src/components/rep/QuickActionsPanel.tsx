"use client";

export default function QuickActionsPanel() {
  const actions = [
    { label: "Export CSV", onClick: () => alert("Exporting CSV…") },
    { label: "New Order", onClick: () => alert("Creating order…") },
    { label: "Compare Stores", onClick: () => alert("Opening comparison…") },
  ];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm flex gap-2 flex-wrap">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
} 