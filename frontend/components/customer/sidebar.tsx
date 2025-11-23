"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, User, Bell, Store } from "lucide-react"

const MENU_ITEMS = [
  { href: "/customer/businesses", label: "İşletmeler", icon: Store },
  { href: "/customer/appointments", label: "Randevularım", icon: Calendar },
  { href: "/customer/profile", label: "Profil", icon: User },
  { href: "/customer/notifications", label: "Bildirimler", icon: Bell },
]

export function CustomerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
      <nav className="p-6 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? "bg-gray-100 text-black" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
