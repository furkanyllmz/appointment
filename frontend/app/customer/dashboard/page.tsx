"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/shared/header"
import { CustomerSidebar } from "@/components/customer/sidebar"
import { AppointmentCard } from "@/components/customer/appointment-card"
import { Button } from "@/components/ui/button"
import { apiGet } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, Calendar } from "lucide-react"

interface Appointment {
  id: string
  serviceId: string
  serviceName: string
  startTime: string
  endTime: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled"
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/customer/login")
      return
    }

    const fetchAppointments = async () => {
      try {
        const data = await apiGet<Appointment[]>("/appointments/user")
        setAppointments(data)
      } catch (err) {
        console.error("Error fetching appointments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [router, refreshKey])

  const now = new Date()
  const upcomingAppointments = appointments.filter((a) => new Date(a.startTime) > now)
  const pastAppointments = appointments.filter((a) => new Date(a.startTime) <= now)
  const displayedAppointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Randevunuz başarıyla oluşturuldu!
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Randevularım</h1>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "upcoming"
                      ? "bg-black text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Yaklaşan
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "past" ? "bg-black text-white" : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  Geçmiş
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
              ) : displayedAppointments.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Henüz randevunuz yok</p>
                  <Button
                    onClick={() => router.push("/customer/services")}
                    className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2"
                  >
                    Hizmetlere Göz At
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      id={appointment.id}
                      serviceName={appointment.serviceName}
                      date={appointment.startTime}
                      time={new Date(appointment.startTime).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      status={appointment.status}
                      onCancel={() => setRefreshKey((prev) => prev + 1)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
