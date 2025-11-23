"use client"

import { useRouter } from "next/navigation"
import { Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { clearAuthToken, getCurrentUser } from "@/lib/auth"

export function Header() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    clearAuthToken()
    router.push("/")
  }

  const handleLogoClick = () => {
    if (user?.role === "Admin") {
      router.push("/admin/dashboard")
    } else if (user?.role === "Customer") {
      router.push("/customer/businesses")
    } else {
      router.push("/")
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 
          className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
          onClick={handleLogoClick}
        >
          AppointMe
        </h1>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Bell className="w-5 h-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full w-10 h-10 p-0">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
