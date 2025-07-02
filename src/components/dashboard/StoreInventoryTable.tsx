'use client'
import { memo, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"

interface Store {
  id: number
  name: string
  location: string
  totalItems: number
  lowStockItems: number
  outOfStock: number
  inventoryHealth: number
}

interface StoreInventoryTableProps {
  stores: Store[]
  searchQuery: string
  onSearchChange: (query: string) => void
}

const StoreInventoryTable = memo(function StoreInventoryTable({
  stores,
  searchQuery,
  onSearchChange
}: StoreInventoryTableProps) {
  // Memoize filtered stores to prevent unnecessary recalculations
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores
    
    const query = searchQuery.toLowerCase()
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.location.toLowerCase().includes(query),
    )
  }, [stores, searchQuery])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Store Inventory Levels</CardTitle>
            <CardDescription>Monitor inventory health across all locations</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
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
              <TableHead>Health</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell className="text-muted-foreground">{store.location}</TableCell>
                <TableCell>{store.totalItems.toLocaleString()}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})

export default StoreInventoryTable 