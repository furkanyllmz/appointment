"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ServicesSection } from "@/components/landing/services-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <Footer />
    </main>
  )
}
