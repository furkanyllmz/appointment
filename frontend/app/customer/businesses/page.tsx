"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/shared/header"
import { CustomerSidebar } from "@/components/customer/sidebar"
import { apiGet } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, MapPin, Phone, Mail, ArrowRight, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Business {
  id: number
  name: string
  type: string
  address: string
  phone: string
  email: string
}

export default function BusinessesPage() {
  const router = useRouter()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/customer/login")
      return
    }

    const fetchBusinesses = async () => {
      try {
        const data = await apiGet<Business[]>("/businesses")
        setBusinesses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "İşletmeler yüklenemedi")
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">İşletmeler</h1>
              <p className="text-gray-600 mt-2">Randevu almak için bir işletme seçin</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 mb-4">{error}</p>
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Henüz işletme bulunmamaktadır</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{business.name}</h3>
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {business.type}
                          </span>
                        </div>
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{business.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{business.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span>{business.email}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => router.push(`/customer/services?businessId=${business.id}`)}
                        className="w-full bg-black hover:bg-gray-800 text-white"
                      >
                        Hizmetleri Görüntüle
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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
