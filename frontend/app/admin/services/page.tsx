"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/shared/header"
import { ServiceModal } from "@/components/admin/service-modal"
import { ServicesTable } from "@/components/admin/services-table"
import { Button } from "@/components/ui/button"
import { apiGet, apiPost, apiPut } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Plus, Loader2 } from "lucide-react"

interface Service {
  id: string
  name: string
  durationMin: number
  isActive: boolean
}

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "Admin") {
      router.push("/business/login")
      return
    }

    const fetchServices = async () => {
      try {
        const data = await apiGet<Service[]>("/services")
        setServices(data)
      } catch (err) {
        console.error("Error fetching services:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [router, refreshKey])

  const handleAddNew = () => {
    setEditingService(null)
    setModalOpen(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setModalOpen(true)
  }

  const handleSave = async (data: { name: string; durationMin: number; isActive: boolean }) => {
    if (editingService) {
      // Update existing service
      await apiPut(`/services/${editingService.id}`, data)
    } else {
      // Create new service
      await apiPost("/services", data)
    }
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Hizmet Yönetimi</h1>
              <Button
                onClick={handleAddNew}
                className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yeni Hizmet Ekle
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg">
                <p className="text-gray-600 mb-4">Henüz hizmet bulunmamaktadır</p>
                <Button
                  onClick={handleAddNew}
                  className="bg-black hover:bg-gray-800 text-white font-medium px-6 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Hizmet Ekle
                </Button>
              </div>
            ) : (
              <ServicesTable
                services={services}
                onEdit={handleEdit}
                onUpdate={() => setRefreshKey((prev) => prev + 1)}
              />
            )}
          </div>
        </main>
      </div>

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingService(null)
        }}
        onSave={handleSave}
        initialData={editingService}
      />
    </div>
  )
}
