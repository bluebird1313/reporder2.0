'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface LowStockAlert {
  id: number
  store: string
  item: string
  currentStock: number
  minStock: number
  severity: 'high' | 'medium' | 'low'
}

interface LowStockAlertsPanelProps {
  alerts: LowStockAlert[]
  onNotifyBuyer: (alertId: number) => void
}

export default function LowStockAlertsPanel({ 
  alerts, 
  onNotifyBuyer 
}: LowStockAlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>Items requiring immediate attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            className={alert.severity === "high" ? "border-red-200" : "border-yellow-200"}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <div className="flex-1">
                  <AlertTitle className="text-sm">{alert.item}</AlertTitle>
                  <AlertDescription className="text-xs">
                    <div className="mt-1">
                      <div className="font-medium">{alert.store}</div>
                      <div className="text-muted-foreground">
                        Current: {alert.currentStock} | Min: {alert.minStock}
                      </div>
                    </div>
                  </AlertDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-2 h-8 px-3 text-xs bg-transparent"
                onClick={() => onNotifyBuyer(alert.id)}
              >
                Notify Buyer
              </Button>
            </div>
          </Alert>
        ))}
        <Button variant="outline" className="w-full bg-transparent" size="sm">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  )
} 