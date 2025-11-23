"use client"

import { Scissors, Waves, Sparkles, Palette, Feather, Hand } from "lucide-react"

const services = [
  {
    icon: Scissors,
    label: "Berber",
  },
  {
    icon: Waves,
    label: "Kuaför",
  },
  {
    icon: Sparkles,
    label: "Güzellik Merkezi",
  },
  {
    icon: Palette,
    label: "Nail Artist",
  },
  {
    icon: Feather,
    label: "Dövme Stüdyosu",
  },
  {
    icon: Hand,
    label: "Masaj Salonu",
  },
]

export function ServicesSection() {
  return (
    <section className="w-full bg-black text-white py-20 md:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Hizmet Kategorileri</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="p-8 rounded-lg bg-white text-black text-center hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-black group-hover:text-white transition-colors" />
                <h3 className="text-lg font-semibold">{service.label}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
