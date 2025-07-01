"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MultiStoreNavigation from "../../../components/rep/MultiStoreNavigation";
import InventoryDataTable from "../../../components/rep/InventoryDataTable";
import SalesPerformanceCards from "../../../components/rep/SalesPerformanceCards";
import StoreRelationshipCards from "../../../components/rep/StoreRelationshipCards";
import QuickActionsPanel from "../../../components/rep/QuickActionsPanel";

export default function RepDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a rep user
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }
      if (profile && profile.role !== 'rep') {
        router.push('/dashboard/company');
        return;
      }
    }
  }, [user, profile, loading, router]);

  // Show loading while checking auth
  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show access denied if wrong role
  if (profile.role !== 'rep') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/dashboard/company')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Company Dashboard
          </button>
        </div>
      </div>
    );
  }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Rep Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {profile.full_name || profile.email}
            </span>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto p-4 space-y-6">
        <MultiStoreNavigation stores={stores} />
        <SalesPerformanceCards data={sales} />
        <QuickActionsPanel />
        <StoreRelationshipCards relationships={relationships} />
        <InventoryDataTable items={inventory} />
      </div>
    </div>
  );
} 