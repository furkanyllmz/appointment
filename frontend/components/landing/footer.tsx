"use client"

import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-black" />
                <span>+90 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-black" />
                <span>info@randevu.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-black" />
                <span>Ankara, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Sosyal Medya</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-black transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-black transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-black transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Hakkında</h3>
            <p className="text-gray-400">Modern randevu yönetim sistemi ile işletmenizi yönetmeyi kolaylaştırın.</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 Randevu Yönetimi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
