'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Building2, Settings, Users } from "lucide-react"

interface QuickActionsCardProps {
  onAddItem?: () => void
  onManageStores?: () => void
  onManageReps?: () => void
  onSettings?: () => void
}

export default function QuickActionsCard({
  onAddItem,
  onManageStores,
  onManageReps,
  onSettings
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent" 
          size="sm"
          onClick={onAddItem}
        >
          <Package className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent" 
          size="sm"
          onClick={onManageStores}
        >
          <Building2 className="mr-2 h-4 w-4" />
          Manage Stores
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent" 
          size="sm"
          onClick={onManageReps}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Reps
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent" 
          size="sm"
          onClick={onSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </CardContent>
    </Card>
  )
} 