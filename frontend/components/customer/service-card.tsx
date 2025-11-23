"use client"

import { useRouter } from "next/navigation"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ServiceCardProps {
  id: number
  name: string
  durationMin: number
  businessId?: number
  image?: string
}

export function ServiceCard({ id, name, durationMin, businessId, image }: ServiceCardProps) {
  const router = useRouter()

  const handleBooking = () => {
    const url = businessId 
      ? `/customer/booking?serviceId=${id}&businessId=${businessId}`
      : `/customer/booking?serviceId=${id}`
    router.push(url)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="w-full h-40 bg-gradient-to-br from-gray-400 to-black flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-black opacity-50" />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{name}</h3>

        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{durationMin} dakika</span>
        </div>

        <Button onClick={handleBooking} className="w-full bg-black hover:bg-gray-800 text-white font-medium">
          Randevu Al
        </Button>
      </div>
    </div>
  )
}
