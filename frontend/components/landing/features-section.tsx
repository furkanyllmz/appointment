"use client"

import { Zap, Clock, Settings } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Hızlı Rezervasyon",
    description: "Müşterileriniz saniyeler içinde randevu alabilsin",
  },
  {
    icon: Clock,
    title: "Gerçek Zamanlı Takip",
    description: "Tüm randevuları canlı olarak izleyin ve yönetin",
  },
  {
    icon: Settings,
    title: "Kolay Yönetim",
    description: "Basit ve kullanıcı dostu yönetim paneli",
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full bg-white py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">Öne Çıkan Özellikleri</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100"
              >
                <Icon className="w-10 h-10 text-black mb-4" />
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
