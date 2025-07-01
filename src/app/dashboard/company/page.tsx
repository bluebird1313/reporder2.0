"use client";

import { useQuery } from "@tanstack/react-query";
import StoreHealthCard from "../../../components/company/StoreHealthCard";
import PermissionMatrix from "../../../components/company/PermissionMatrix";
import ProductCollectionSelector from "../../../components/company/ProductCollectionSelector";
import RepInvitationFlow from "../../../components/company/RepInvitationFlow";
import AnalyticsOverview from "../../../components/company/AnalyticsOverview";

export default function CompanyDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["company-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/store-owner/me");
      if (!res.ok) throw new Error("Failed to load dashboard");
      return res.json();
    },
  });

  if (isLoading) return <p className="p-6 text-sm">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500 text-sm">{(error as Error).message}</p>;

  const { storeStatus, reps, collections, permissions, analytics } = data;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Company Dashboard</h1>
      <StoreHealthCard status={storeStatus.status} lastSync={storeStatus.lastSync} className="" />
      <ProductCollectionSelector collections={collections} className="" />
      <RepInvitationFlow className="" />
      <PermissionMatrix reps={reps} collections={collections} permissions={permissions} className="" />
      <AnalyticsOverview data={analytics} className="" />
    </div>
  );
} 