"use client";

import * as React from "react"
import {
  AlertTriangle,
  Building2,
  Home,
  Package,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Star,
  TrendingUpIcon,
  LogOut,
  UserCircle,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, Suspense, lazy } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// Dynamic imports for dashboard components - loaded only when needed
const OverviewCards = lazy(() => import("@/components/dashboard/OverviewCards"));
const StoreInventoryTable = lazy(() => import("@/components/dashboard/StoreInventoryTable"));
const LowStockAlertsPanel = lazy(() => import("@/components/dashboard/LowStockAlertsPanel"));
const QuickActionsCard = lazy(() => import("@/components/dashboard/QuickActionsCard"));

// Loading component for dynamic imports
function ComponentLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

// Mock data for stores and inventory
const stores = [
  {
    id: 1,
    name: "TYLER'S",
    location: "Main Street, Downtown",
    totalItems: 1250,
    lowStockItems: 8,
    outOfStock: 2,
    inventoryHealth: 85,
  },
  {
    id: 2,
    name: "Racquet & Jog",
    location: "Shopping Center, North",
    totalItems: 980,
    lowStockItems: 12,
    outOfStock: 1,
    inventoryHealth: 78,
  },
  {
    id: 3,
    name: "Whole Earth Provision Co.",
    location: "Airport Terminal",
    totalItems: 650,
    lowStockItems: 5,
    outOfStock: 0,
    inventoryHealth: 92,
  },
  {
    id: 4,
    name: "Sun & Ski Sports",
    location: "Industrial District",
    totalItems: 3200,
    lowStockItems: 25,
    outOfStock: 8,
    inventoryHealth: 72,
  },
]

const lowStockAlerts = [
  {
    id: 1,
    store: "TYLER'S",
    item: "Sendero Logo Baseball Cap",
    currentStock: 3,
    minStock: 20,
    severity: "high" as const,
  },
  {
    id: 2,
    store: "Racquet & Jog",
    item: "Sendero Performance T-Shirt",
    currentStock: 8,
    minStock: 15,
    severity: "medium" as const,
  },
  {
    id: 3,
    store: "Sun & Ski Sports",
    item: "Sendero Hoodie - Navy",
    currentStock: 5,
    minStock: 12,
    severity: "high" as const,
  },
]

const inventoryItems = [
  { id: 1, sku: "SND-CAP-001", name: "Sendero Logo Baseball Cap", category: "Headwear", totalStock: 245, price: 24.99 },
  { id: 2, sku: "SND-TEE-001", name: "Sendero Performance T-Shirt", category: "Apparel", totalStock: 180, price: 19.99 },
  { id: 3, sku: "SND-HOD-001", name: "Sendero Hoodie - Navy", category: "Apparel", totalStock: 95, price: 49.99 },
]

const navigationItems = [
  {
    title: "Overview",
    icon: Home,
    view: "overview",
    isActive: false,
  },
  {
    title: "Stores",
    icon: Building2,
    view: "stores",
    isActive: false,
  },
  {
    title: "Inventory",
    icon: Package,
    view: "inventory",
    isActive: false,
  },
]

// Sidebar component
function AppSidebar({ currentView, onNavigate }: { currentView: string; onNavigate: (view: string) => void }) {
  const updatedNavigationItems = navigationItems.map((item) => ({
    ...item,
    isActive: currentView === item.view,
  }))

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-slate-800 text-white">
            <span className="text-lg font-bold">RO</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">RepOrder</span>
            <span className="text-xs text-muted-foreground">Rep Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {updatedNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <button onClick={() => onNavigate(item.view)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            System Online
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function RepDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentView, setCurrentView] = React.useState("overview")
  
  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

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

  // Memoize expensive calculations
  const filteredStores = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return stores
    
    const query = debouncedSearchQuery.toLowerCase()
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.location.toLowerCase().includes(query)
    )
  }, [stores, debouncedSearchQuery])

  const filteredInventory = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return inventoryItems
    
    const query = debouncedSearchQuery.toLowerCase()
    return inventoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    )
  }, [inventoryItems, debouncedSearchQuery])

  // Memoize totals calculation - only recalculate when stores data changes
  const totals = useMemo(() => ({
    totalItems: stores.reduce((sum, store) => sum + store.totalItems, 0),
    totalLowStock: stores.reduce((sum, store) => sum + store.lowStockItems, 0),
    totalOutOfStock: stores.reduce((sum, store) => sum + store.outOfStock, 0)
  }), [stores])

  const handleNavigation = (view: string) => {
    setCurrentView(view)
    setSearchQuery("") // Reset search when changing views
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onNavigate={handleNavigation} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center gap-4">
            <h1 className="font-semibold">RepOrder Inventory Dashboard</h1>
            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0 bg-transparent">
                    <span className="text-xs font-medium">{profile.full_name?.charAt(0) || profile.email?.charAt(0) || 'U'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {currentView === "overview" && (
            <>
              <Suspense fallback={<ComponentLoader />}>
                <OverviewCards
                  totalItems={totals.totalItems}
                  totalLowStock={totals.totalLowStock}
                  totalOutOfStock={totals.totalOutOfStock}
                  storeCount={stores.length}
                />
              </Suspense>

              <div className="grid gap-4 lg:grid-cols-3">
                {/* Store Inventory List */}
                <div className="lg:col-span-2">
                  <Suspense fallback={<ComponentLoader />}>
                    <StoreInventoryTable 
                      stores={filteredStores}
                      searchQuery={debouncedSearchQuery}
                      onSearchChange={setSearchQuery}
                    />
                  </Suspense>
                </div>

                <div className="space-y-4">
                  <Suspense fallback={<ComponentLoader />}>
                    <LowStockAlertsPanel
                      alerts={lowStockAlerts}
                      onNotifyBuyer={(alertId) => {
                        const alert = lowStockAlerts.find(a => a.id === alertId);
                        if (alert) {
                          console.log(`Notifying buyer for ${alert.item} at ${alert.store}`);
                        }
                      }}
                    />
                  </Suspense>
                  
                  <Suspense fallback={<ComponentLoader />}>
                    <QuickActionsCard 
                      onAddItem={() => console.log('Add new item')}
                      onManageStores={() => console.log('Manage stores')}
                      onManageReps={() => console.log('Manage reps')}
                      onSettings={() => console.log('Settings')}
                    />
                  </Suspense>
                </div>
              </div>
            </>
          )}

          {currentView === "stores" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Stores</CardTitle>
                    <CardDescription>Complete list of store locations and inventory status</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search stores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Store
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Store</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Items</TableHead>
                      <TableHead>Low Stock</TableHead>
                      <TableHead>Out of Stock</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell className="text-muted-foreground">{store.location}</TableCell>
                        <TableCell>{store.totalItems.toLocaleString()}</TableCell>
                        <TableCell className="text-yellow-600">{store.lowStockItems}</TableCell>
                        <TableCell className="text-red-600">{store.outOfStock}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={store.inventoryHealth} className="w-16" />
                            <span className="text-sm">{store.inventoryHealth}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              store.inventoryHealth >= 90
                                ? "default"
                                : store.inventoryHealth >= 75
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {store.inventoryHealth >= 90
                              ? "Excellent"
                              : store.inventoryHealth >= 75
                                ? "Good"
                                : "Needs Attention"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {currentView === "inventory" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Manage all product inventory</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search inventory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.totalStock}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.totalStock > 100 ? "default" : item.totalStock > 50 ? "secondary" : "destructive"
                            }
                          >
                            {item.totalStock > 100 ? "In Stock" : item.totalStock > 50 ? "Low Stock" : "Critical"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 