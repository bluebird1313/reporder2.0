"use client";
import { useQuery } from "@tanstack/react-query";
import MultiStoreNavigation from "../../../components/rep/MultiStoreNavigation";
import InventoryDataTable from "../../../components/rep/InventoryDataTable";
import SalesPerformanceCards from "../../../components/rep/SalesPerformanceCards";
import StoreRelationshipCards from "../../../components/rep/StoreRelationshipCards";
import QuickActionsPanel from "../../../components/rep/QuickActionsPanel";

export default function RepDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rep-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/rep/me");
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json();
    },
  });

  if (isLoading) return <p className="p-6 text-sm">Loading...</p>;
  if (error) return <p className="p-6 text-red-500 text-sm">{(error as Error).message}</p>;

  const { stores, inventory, sales, relationships } = data;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Rep Dashboard</h1>
      <MultiStoreNavigation stores={stores} />
      <SalesPerformanceCards data={sales} />
      <QuickActionsPanel />
      <StoreRelationshipCards relationships={relationships} />
      <InventoryDataTable items={inventory} />
    </div>
  );
} 