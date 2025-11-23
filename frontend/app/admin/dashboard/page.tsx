"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/shared/header"
import { StatsCard } from "@/components/admin/stats-card"
import { AppointmentsTable } from "@/components/admin/appointments-table"
import { apiGet } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Calendar, Clock, CheckCircle, Zap, Loader2 } from "lucide-react"

interface Appointment {
  id: string
  customerName: string
  serviceName: string
  startTime: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled"
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    today: 0,
    thisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "Admin") {
      router.push("/business/login")
      return
    }

    const fetchData = async () => {
      try {
        const data = await apiGet<Appointment[]>("/admin/appointments")
        setAppointments(data)

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        const pending = data.filter((a) => a.status === "Pending").length
        const todayCount = data.filter(
          (a) => new Date(a.startTime) >= today && new Date(a.startTime) < new Date(today.getTime() + 86400000),
        ).length
        const monthCount = data.filter((a) => new Date(a.startTime) >= monthStart).length

        setStats({
          total: data.length,
          pending,
          today: todayCount,
          thisMonth: monthCount,
        })
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, refreshKey])

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Randevular</h1>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatsCard
                    label="Toplam Randevu"
                    value={stats.total}
                    icon={<Calendar className="w-6 h-6" />}
                    color="purple"
                  />
                  <StatsCard
                    label="Bekleyen"
                    value={stats.pending}
                    icon={<Clock className="w-6 h-6" />}
                    color="amber"
                  />
                  <StatsCard
                    label="Bugünkü"
                    value={stats.today}
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="green"
                  />
                  <StatsCard label="Bu Ay" value={stats.thisMonth} icon={<Zap className="w-6 h-6" />} color="blue" />
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Filtreler</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="date"
                      placeholder="Başlangıç tarihi"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                      <option value="">Tüm Hizmetler</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                      <option value="">Tüm Durumlar</option>
                      <option value="Pending">Bekleyen</option>
                      <option value="Approved">Onaylanmış</option>
                      <option value="Rejected">Reddedilmiş</option>
                      <option value="Cancelled">İptal Edilmiş</option>
                    </select>
                  </div>
                </div>

                <AppointmentsTable appointments={appointments} onUpdate={() => setRefreshKey((prev) => prev + 1)} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
