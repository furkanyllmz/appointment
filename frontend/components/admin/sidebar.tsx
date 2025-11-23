"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Home, Calendar, Grid3x3, Settings, LogOut } from "lucide-react"
import { getCurrentUser, clearAuthToken } from "@/lib/auth"

const MENU_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/appointments", label: "Randevular", icon: Calendar },
  { href: "/admin/services", label: "Hizmetler", icon: Grid3x3 },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    clearAuthToken()
    router.push("/")
  }

  return (
    <aside className="w-64 bg-black text-white fixed left-0 top-0 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">AppointMe</h1>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? "bg-white text-black" : "text-gray-300 hover:bg-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-900 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
