"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full bg-black text-white py-20 md:py-32 px-4">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
          Randevu Yönetimi Artık Çok Kolay
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 text-balance max-w-2xl">
          İşletmeniz için modern randevu sistemi
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link href="/customer/businesses">
            <Button className="bg-white hover:bg-gray-100 text-black rounded-lg px-8 py-6 text-lg font-semibold w-full sm:w-auto">
              Randevu Al
            </Button>
          </Link>
          <Link href="/business/login">
            <Button
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white hover:text-black rounded-lg px-8 py-6 text-lg font-semibold w-full sm:w-auto"
            >
              İşletme Girişi
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
