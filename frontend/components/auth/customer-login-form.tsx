"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiPost } from "@/lib/api-client"
import { setAuthToken } from "@/lib/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function CustomerLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiPost<{ token: string; user: any }>("/auth/login", {
        email,
        password,
      })

      setAuthToken(response.token)
      router.push("/customer/businesses")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş yapılamadı")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Müşteri Girişi</h1>
        <p className="text-gray-600 mb-8">Hesabınızda giriş yapın</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900">
              Şifremi Unuttum
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Giriş Yapılıyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Hesabınız yok mu?{" "}
          <Link href="/customer/register" className="text-black font-medium hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
