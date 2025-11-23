"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/shared/header"
import { ServiceFilterChips } from "@/components/customer/service-filter-chips"
import { ServiceCard } from "@/components/customer/service-card"
import { apiGet } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Service {
  id: number
  name: string
  durationMin: number
  isActive: boolean
}

export default function ServicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const businessIdParam = searchParams.get("businessId")
  const businessId = businessIdParam ? parseInt(businessIdParam) : null
  
  const [services, setServices] = useState<Service[]>([])
  const [businessName, setBusinessName] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Tümü")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/customer/login")
      return
    }

    if (!businessId) {
      router.push("/customer/businesses")
      return
    }

    const fetchData = async () => {
      try {
        const [servicesData, businessData] = await Promise.all([
          apiGet<Service[]>("/services"),
          apiGet<any>(`/businesses/${businessId}`)
        ])
        setServices(servicesData.filter((s) => s.isActive))
        setBusinessName(businessData.name)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Hizmetler yüklenemedi")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, businessId])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <Button
            onClick={() => router.push("/customer/businesses")}
            variant="ghost"
            className="text-white hover:bg-gray-800 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            İşletmelere Dön
          </Button>
          <h1 className="text-4xl font-bold mb-2">{businessName || "Hizmetlerimiz"}</h1>
          <p className="text-gray-300 mb-4">Randevu almak için bir hizmet seçin</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Hizmet ara..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
            />
          </div>
        </div>
      </div>

      <ServiceFilterChips selected={selectedFilter} onSelect={setSelectedFilter} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">Henüz hizmet bulunmamaktadır</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                id={service.id} 
                name={service.name} 
                durationMin={service.durationMin}
                businessId={businessId ?? undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
