"use client"

import { useState } from "react"
import { Edit2, Trash2, Loader2 } from "lucide-react"
import { apiDelete } from "@/lib/api-client"

interface Service {
  id: string
  name: string
  durationMin: number
  isActive: boolean
}

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onUpdate: () => void
}

export function ServicesTable({ services, onEdit, onUpdate }: ServicesTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleActive = async (service: Service) => {
    setLoading(service.id)
    try {
      await apiDelete(`/services/${service.id}`)
      onUpdate()
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Hizmet Adı</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Süre</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Durum</th>
            <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{service.durationMin} dakika</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${service.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className={service.isActive ? "text-green-600" : "text-gray-600"}>
                    {service.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm flex items-center gap-2">
                <button
                  onClick={() => onEdit(service)}
                  className="text-black hover:bg-black-50 p-2 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(service)}
                  disabled={loading === service.id}
                  className="text-gray-600 hover:bg-gray-100 p-2 rounded transition-colors"
                >
                  {loading === service.id ? (
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
  )
}
