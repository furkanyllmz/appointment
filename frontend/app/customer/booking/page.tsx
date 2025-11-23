"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/shared/header"
import { BookingProgress } from "@/components/customer/booking-progress"
import { BookingCalendar } from "@/components/customer/booking-calendar"
import { BookingTimeSlots } from "@/components/customer/booking-time-slots"
import { BookingSummary } from "@/components/customer/booking-summary"
import { Button } from "@/components/ui/button"
import { apiGet, apiPost } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Service {
  id: number
  name: string
  durationMin: number
  isActive: boolean
}

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const serviceIdParam = searchParams.get("serviceId")
  const businessIdParam = searchParams.get("businessId")
  const serviceId = serviceIdParam ? parseInt(serviceIdParam) : null
  const businessId = businessIdParam ? parseInt(businessIdParam) : null

  const [currentStep, setCurrentStep] = useState(1)
  const [service, setService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/customer/login")
      return
    }

    if (!serviceId || !businessId) {
      // Eğer serviceId veya businessId yoksa, businesses sayfasına yönlendir
      router.push("/customer/businesses")
      return
    }

    const fetchService = async () => {
      try {
        console.log("Fetching service with ID:", serviceId)
        const services = await apiGet<Service[]>("/services")
        console.log("All services:", services)
        // Number karşılaştırması
        const found = services.find((s) => s.id === serviceId)
        console.log("Found service:", found)
        if (found) {
          setService(found)
          setCurrentStep(2)
        } else {
          // Hizmet bulunamadı, businesses sayfasına yönlendir
          toast({
            variant: "destructive",
            title: "Hata",
            description: "Hizmet bulunamadı",
          })
          router.push("/customer/businesses")
        }
      } catch (err) {
        console.error("Error fetching service:", err)
        setError(err instanceof Error ? err.message : "Hizmet yüklenemedi")
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Hizmet yüklenemedi",
        })
        router.push("/customer/businesses")
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [serviceId, businessId, router, toast])

  useEffect(() => {
    if (selectedDate && serviceId) {
      const fetchAvailableSlots = async () => {
        try {
          setLoadingSlots(true)
          const slots = await apiGet<TimeSlot[]>(`/availability?date=${selectedDate}&serviceId=${serviceId}`)
          setAvailableSlots(slots)
        } catch (err) {
          console.error("Error fetching slots:", err)
          setAvailableSlots([])
        } finally {
          setLoadingSlots(false)
        }
      }
      fetchAvailableSlots()
    }
  }, [selectedDate, serviceId])

    const handleSubmit = async () => {
    if (!service || !selectedDate || !selectedTime || !businessId) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
      })
      return
    }

    try {
      setSubmitting(true)
      await apiPost("/appointments", {
        serviceId: service.id.toString(),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
      })
      toast({
        title: "Başarılı",
        description: "Randevunuz başarıyla oluşturuldu",
      })
      router.push("/customer/appointments")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: err instanceof Error ? err.message : "Randevu oluşturulamadı",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <BookingProgress currentStep={currentStep} />

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Hizmet Seçin</h2>
                    <p className="text-gray-600">Devam etmek için hizmet sayfasından bir hizmet seçin</p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    {service && (
                      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
                        <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600">Süre: {service.durationMin} dakika</p>
                      </div>
                    )}
                    <BookingCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                    <BookingTimeSlots 
                      selectedTime={selectedTime} 
                      onSelectTime={setSelectedTime}
                      availableSlots={availableSlots}
                      loading={loadingSlots}
                    />
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2"
                      >
                        Devam Et
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Randevuyu Onayla</h2>

                    <div className="space-y-4 mb-6">
                      {service && (
                        <>
                          <div className="flex justify-between py-3 border-b border-gray-200">
                            <span className="text-gray-600">Hizmet:</span>
                            <span className="font-bold text-gray-900">{service.name}</span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-200">
                            <span className="text-gray-600">Tarih:</span>
                            <span className="font-bold text-gray-900">
                              {selectedDate && new Date(selectedDate).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-200">
                            <span className="text-gray-600">Saat:</span>
                            <span className="font-bold text-gray-900">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between py-3">
                            <span className="text-gray-600">Süre:</span>
                            <span className="font-bold text-gray-900">{service.durationMin} dakika</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => setCurrentStep(2)} variant="outline" className="flex-1 py-2">
                        Geri Dön
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Onaylanıyor...
                          </>
                        ) : (
                          "Randevuyu Onayla"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <BookingSummary
            serviceName={service?.name || null}
            durationMin={service?.durationMin || null}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </div>
  )
}
