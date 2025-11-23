"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/shared/header"
import { apiGet, apiPut } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: number
  serviceId: number
  serviceName: string
  startTime: string
  endTime: string
  status: string
  adminNote?: string
}

export default function AppointmentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/customer/login")
      return
    }

    fetchAppointments()
  }, [router])

  const fetchAppointments = async () => {
    try {
      const user = getCurrentUser()
      if (!user) return
      
      const userId = user.sub // sub içinde user id var
      const data = await apiGet<Appointment[]>(`/appointments/user/${userId}`)
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Randevular yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (id: number) => {
    try {
      setCancelling(id)
      await apiPut(`/appointments/${id}/cancel`, {})
      toast({
        title: "Başarılı",
        description: "Randevunuz iptal edildi",
      })
      await fetchAppointments()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: err instanceof Error ? err.message : "Randevu iptal edilemedi",
      })
    } finally {
      setCancelling(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3" />
            Beklemede
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Onaylandı
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Reddedildi
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3" />
            İptal Edildi
          </span>
        )
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">Randevularım</h1>
          <p className="text-gray-300">Tüm randevularınızı buradan görüntüleyebilirsiniz</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Henüz randevunuz bulunmamaktadır</p>
            <Button
              onClick={() => router.push("/customer/businesses")}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Randevu Oluştur
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{appointment.serviceName}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(appointment.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </span>
                      </div>
                    </div>

                    {appointment.adminNote && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Not:</strong> {appointment.adminNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {appointment.status.toLowerCase() === "pending" && (
                    <Button
                      variant="outline"
                      className="ml-4 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={cancelling === appointment.id}
                    >
                      {cancelling === appointment.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          İptal Ediliyor...
                        </>
                      ) : (
                        "İptal Et"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
