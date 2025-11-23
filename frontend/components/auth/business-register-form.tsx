"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiPost } from "@/lib/api-client"
import { setAuthToken } from "@/lib/auth"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const BUSINESS_TYPES = [
  { value: "barber", label: "Berber" },
  { value: "hair", label: "Kuaför" },
  { value: "beauty", label: "Güzellik Merkezi" },
  { value: "nails", label: "Nail Artist" },
  { value: "tattoo", label: "Dövme Stüdyosu" },
  { value: "massage", label: "Masaj Salonu" },
  { value: "other", label: "Diğer" },
]

export function BusinessRegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    businessType: "",
    password: "",
    passwordConfirm: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.businessType) {
      setError("İşletme tipi seçin")
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Şifreler eşleşmiyor")
      return
    }

    setLoading(true)

    try {
      const response = await apiPost<{ token: string; user: any }>("/auth/register", {
        fullName: formData.businessName,
        email: formData.email,
        password: formData.password,
        role: "Admin",
      })

      setAuthToken(response.token)
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt oluşturulamadı")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">İşletme Kaydı</h1>
        <p className="text-gray-600 mb-8">İşletmenizi kayıt edin</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İşletme Adı</label>
            <Input
              type="text"
              name="businessName"
              placeholder="İşletme adınız"
              value={formData.businessName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
            <Input
              type="email"
              name="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İşletme Tipi</label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
            >
              <SelectTrigger disabled={loading}>
                <SelectValue placeholder="Seçin" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Şifrenizi girin"
                value={formData.password}
                onChange={handleChange}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Şifre Tekrar</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="passwordConfirm"
                placeholder="Şifrenizi tekrar girin"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kayıt Oluşturuluyor...
              </>
            ) : (
              "Kayıt Ol"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Zaten hesabınız var mı?{" "}
          <Link href="/business/login" className="text-black font-medium hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
