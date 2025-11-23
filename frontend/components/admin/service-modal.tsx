"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; durationMin: number; isActive: boolean }) => Promise<void>
  initialData?: { id: string; name: string; durationMin: number; isActive: boolean } | null
}

export function ServiceModal({ isOpen, onClose, onSave, initialData }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    durationMin: 30,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        durationMin: initialData.durationMin,
        isActive: initialData.isActive,
      })
    } else {
      setFormData({ name: "", durationMin: 30, isActive: true })
    }
    setError("")
  }, [initialData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Hizmet adı gerekli")
      return
    }

    if (formData.durationMin < 1) {
      setError("Süre 1 dakikadan az olamaz")
      return
    }

    setLoading(true)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hizmet Adı</label>
            <Input
              type="text"
              name="name"
              placeholder="Örn: Saç Kesimi"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Süre (dakika)</label>
            <Input
              type="number"
              name="durationMin"
              min="1"
              placeholder="30"
              value={formData.durationMin}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 text-black rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Aktif
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black hover:bg-gray-800 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
