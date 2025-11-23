"use client"

import { useState } from "react"
import { Check, X, Trash2, Loader2 } from "lucide-react"
import { apiPut, apiDelete } from "@/lib/api-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Appointment {
  id: string
  customerName: string
  serviceName: string
  startTime: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled"
}

interface AppointmentsTableProps {
  appointments: Appointment[]
  onUpdate: () => void
}

const STATUS_CONFIG = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-800",
}

export function AppointmentsTable({ appointments, onUpdate }: AppointmentsTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ id: string; open: boolean }>({
    id: "",
    open: false,
  })
  const [rejectNote, setRejectNote] = useState("")

  const handleApprove = async (id: string) => {
    setLoading(id)
    try {
      await apiPut(`/admin/appointments/${id}/approve`, {})
      onUpdate()
    } catch (err) {
      console.error("Approve error:", err)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    setLoading(rejectDialog.id)
    try {
      await apiPut(`/admin/appointments/${rejectDialog.id}/reject`, {
        adminNote: rejectNote,
      })
      setRejectDialog({ id: "", open: false })
      setRejectNote("")
      onUpdate()
    } catch (err) {
      console.error("Reject error:", err)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu randevuyu silmek istediğinizden emin misiniz?")) return

    setLoading(id)
    try {
      await apiDelete(`/admin/appointments/${id}`)
      onUpdate()
    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Müşteri</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Hizmet</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Tarih</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Saat</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Durum</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{appointment.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{appointment.serviceName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(appointment.startTime).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(appointment.startTime).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex items-center gap-2">
                  {appointment.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(appointment.id)}
                        disabled={loading === appointment.id}
                        className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
                      >
                        {loading === appointment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setRejectDialog({ id: appointment.id, open: true })}
                        disabled={loading === appointment.id}
                        className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    disabled={loading === appointment.id}
                    className="text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors"
                  >
                    {loading === appointment.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Randevuyu Reddet</AlertDialogTitle>
            <AlertDialogDescription>Reddetme nedeni yazabilirsiniz (opsiyonel)</AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Nedeni yazın..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
          />
          <div className="flex gap-3">
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white">
              Reddet
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
