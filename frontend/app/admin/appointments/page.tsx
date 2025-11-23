"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/shared/header"
import { apiGet, apiPut } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, Check, X, Calendar, User, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Appointment {
  id: number
  customerName: string
  customerEmail: string
  serviceName: string
  startTime: string
  endTime: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled"
  adminNote?: string
  createdAt: string
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [filterDate, setFilterDate] = useState<string>("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "Admin") {
      router.push("/business/login")
      return
    }

    fetchAppointments()
  }, [router])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const data = await apiGet<Appointment[]>("/admin/appointments")
      setAppointments(data)
    } catch (err) {
      console.error("Error fetching appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: number, status: "Approved" | "Rejected") => {
    try {
      setUpdatingId(id)
      if (status === "Approved") {
        await apiPut(`/admin/appointments/${id}/approve`, {})
      } else {
        await apiPut(`/admin/appointments/${id}/reject`, { adminNote: "" })
      }
      await fetchAppointments()
    } catch (err) {
      console.error("Error updating appointment:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus && apt.status !== filterStatus) return false
    if (filterDate) {
      const aptDate = new Date(apt.startTime).toISOString().split("T")[0]
      if (aptDate !== filterDate) return false
    }
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Cancelled: "bg-gray-100 text-gray-800",
    }
    const labels = {
      Pending: "Bekliyor",
      Approved: "Onaylandı",
      Rejected: "Reddedildi",
      Cancelled: "İptal Edildi",
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Randevular</h1>
              <p className="text-gray-600 mt-2">Tüm randevuları görüntüleyin ve yönetin</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Tüm Durumlar</option>
                    <option value="Pending">Bekleyen</option>
                    <option value="Approved">Onaylanmış</option>
                    <option value="Rejected">Reddedilmiş</option>
                    <option value="Cancelled">İptal Edilmiş</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Randevu bulunamadı</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.customerName}</h3>
                            <p className="text-sm text-gray-600">{appointment.customerEmail}</p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Hizmet</p>
                              <p className="font-medium">{appointment.serviceName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Tarih</p>
                              <p className="font-medium">{formatDate(appointment.startTime)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Saat</p>
                              <p className="font-medium">
                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {appointment.adminNote && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Not:</span> {appointment.adminNote}
                            </p>
                          </div>
                        )}
                      </div>

                      {appointment.status === "Pending" && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleUpdateStatus(appointment.id, "Approved")}
                            disabled={updatingId === appointment.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            {updatingId === appointment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Onayla
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(appointment.id, "Rejected")}
                            disabled={updatingId === appointment.id}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                          >
                            {updatingId === appointment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Reddet
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
