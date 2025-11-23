"use client"

import { useState } from "react"
import { Clock, Calendar, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiPut } from "@/lib/api-client"

interface AppointmentCardProps {
  id: string
  serviceName: string
  date: string
  time: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled"
  onCancel: () => void
}

const STATUS_CONFIG = {
  Pending: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-800" },
  Approved: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800" },
  Rejected: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-800" },
  Cancelled: { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-800" },
}

export function AppointmentCard({ id, serviceName, date, time, status, onCancel }: AppointmentCardProps) {
  const [loading, setLoading] = useState(false)
  const config = STATUS_CONFIG[status]
  const canCancel = status === "Pending" || status === "Approved"

  const handleCancel = async () => {
    if (!window.confirm("Randevuyu iptal etmek istediğinizden emin misiniz?")) return

    setLoading(true)
    try {
      await apiPut(`/appointments/${id}/cancel`, {})
      onCancel()
    } catch (err) {
      console.error("Cancel error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${config.bg} border-l-4 ${config.border} rounded-lg p-6 shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{serviceName}</h3>
        <span className={`${config.badge} px-3 py-1 rounded-full text-sm font-medium`}>{status}</span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(date).toLocaleDateString("tr-TR")}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </div>

      {canCancel && (
        <Button
          onClick={handleCancel}
          disabled={loading}
          className="w-full text-red-600 hover:bg-red-50 border border-red-200 font-medium bg-transparent"
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              İptal Ediliyor...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              İptal Et
            </>
          )}
        </Button>
      )}
    </div>
  )
}
