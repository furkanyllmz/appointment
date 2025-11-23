"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/shared/header"
import { apiGet, apiPut } from "@/lib/api-client"
import { getCurrentUser } from "@/lib/auth"
import { Loader2, Save, Clock, Calendar, Settings as SettingsIcon, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BusinessSettings {
  id: number
  businessName: string
  businessType: string
  address: string
  phone: string
  email: string
  slotDurationMinutes: number
  bufferTimeMinutes: number
  allowSameDayBooking: boolean
  maxAdvanceBookingDays: number
}

interface WorkingHours {
  id: number
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface BreakTime {
  id: number
  dayOfWeek: number
  startTime: string
  endTime: string
  description: string
}

const DAYS_OF_WEEK = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
]

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"business" | "hours" | "breaks">("business")

  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const [breakTimes, setBreakTimes] = useState<BreakTime[]>([])

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "Admin") {
      router.push("/business/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [settingsData, hoursData, breaksData] = await Promise.all([
        apiGet<BusinessSettings>("/admin/settings"),
        apiGet<WorkingHours[]>("/admin/working-hours"),
        apiGet<BreakTime[]>("/admin/break-times"),
      ])
      setSettings(settingsData)
      setWorkingHours(hoursData)
      setBreakTimes(breaksData)
    } catch (err) {
      console.error("Error fetching settings:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    try {
      setSaving(true)
      await apiPut("/admin/settings", settings)
      alert("Ayarlar başarıyla kaydedildi!")
    } catch (err) {
      console.error("Error saving settings:", err)
      alert("Ayarlar kaydedilirken hata oluştu!")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWorkingHours = async (hours: WorkingHours) => {
    try {
      await apiPut(`/admin/working-hours/${hours.id}`, hours)
      alert("Çalışma saatleri kaydedildi!")
      await fetchData()
    } catch (err) {
      console.error("Error saving working hours:", err)
      alert("Çalışma saatleri kaydedilirken hata oluştu!")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center ml-64">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
              <p className="text-gray-600 mt-2">İşletme ayarlarını ve çalışma saatlerini yönetin</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("business")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === "business"
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <SettingsIcon className="w-5 h-5 inline-block mr-2" />
                    İşletme Bilgileri
                  </button>
                  <button
                    onClick={() => setActiveTab("hours")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === "hours"
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Clock className="w-5 h-5 inline-block mr-2" />
                    Çalışma Saatleri
                  </button>
                  <button
                    onClick={() => setActiveTab("breaks")}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === "breaks"
                        ? "border-black text-black"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Calendar className="w-5 h-5 inline-block mr-2" />
                    Ara Dinlenme
                  </button>
                </nav>
              </div>

              {/* Business Settings Tab */}
              {activeTab === "business" && settings && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">İşletme Adı</label>
                      <Input
                        value={settings.businessName}
                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                        placeholder="Örn: Elit Berber"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">İşletme Tipi</label>
                      <Input
                        value={settings.businessType}
                        onChange={(e) => setSettings({ ...settings, businessType: e.target.value })}
                        placeholder="Örn: Berber, Kuaför, Güzellik Salonu"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                      <Input
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        placeholder="Tam adres"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="+90 555 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <Input
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="info@isletme.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Randevu Süresi (dakika)
                      </label>
                      <Input
                        type="number"
                        value={settings.slotDurationMinutes}
                        onChange={(e) =>
                          setSettings({ ...settings, slotDurationMinutes: parseInt(e.target.value) || 30 })
                        }
                        placeholder="30"
                      />
                      <p className="text-xs text-gray-500 mt-1">Her randevu için ayrılan süre</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Randevular Arası Süre (dakika)
                      </label>
                      <Input
                        type="number"
                        value={settings.bufferTimeMinutes}
                        onChange={(e) =>
                          setSettings({ ...settings, bufferTimeMinutes: parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Randevular arasındaki boş süre</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maksimum İleri Rezervasyon (gün)
                      </label>
                      <Input
                        type="number"
                        value={settings.maxAdvanceBookingDays}
                        onChange={(e) =>
                          setSettings({ ...settings, maxAdvanceBookingDays: parseInt(e.target.value) || 30 })
                        }
                        placeholder="30"
                      />
                      <p className="text-xs text-gray-500 mt-1">Müşteriler kaç gün sonrasına randevu alabilir</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.allowSameDayBooking}
                          onChange={(e) =>
                            setSettings({ ...settings, allowSameDayBooking: e.target.checked })
                          }
                          className="w-4 h-4 text-black rounded focus:ring-black"
                        />
                        <span className="text-sm font-medium text-gray-700">Aynı gün randevu alınabilsin</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Kaydet
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Working Hours Tab */}
              {activeTab === "hours" && (
                <div className="p-6">
                  <div className="space-y-4">
                    {workingHours.map((hours) => (
                      <div key={hours.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {DAYS_OF_WEEK[hours.dayOfWeek]}
                          </h3>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hours.isOpen}
                              onChange={(e) => {
                                const updated = { ...hours, isOpen: e.target.checked }
                                setWorkingHours(workingHours.map((h) => (h.id === hours.id ? updated : h)))
                              }}
                              className="w-4 h-4 text-black rounded focus:ring-black"
                            />
                            <span className="text-sm font-medium text-gray-700">Açık</span>
                          </label>
                        </div>

                        {hours.isOpen && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Açılış</label>
                              <Input
                                type="time"
                                value={hours.openTime}
                                onChange={(e) => {
                                  const updated = { ...hours, openTime: e.target.value }
                                  setWorkingHours(workingHours.map((h) => (h.id === hours.id ? updated : h)))
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Kapanış</label>
                              <Input
                                type="time"
                                value={hours.closeTime}
                                onChange={(e) => {
                                  const updated = { ...hours, closeTime: e.target.value }
                                  setWorkingHours(workingHours.map((h) => (h.id === hours.id ? updated : h)))
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => handleSaveWorkingHours(hours)}
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Kaydet
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Break Times Tab */}
              {activeTab === "breaks" && (
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Öğle arası gibi ara dinlenme saatlerini buradan yönetebilirsiniz.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {breakTimes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>Henüz ara dinlenme eklenmemiş</p>
                      </div>
                    ) : (
                      breakTimes.map((breakTime) => (
                        <div key={breakTime.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{breakTime.description}</h3>
                              <p className="text-sm text-gray-600">
                                {DAYS_OF_WEEK[breakTime.dayOfWeek]} - {breakTime.startTime} / {breakTime.endTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
