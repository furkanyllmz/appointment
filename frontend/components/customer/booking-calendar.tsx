"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BookingCalendarProps {
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    // Ayın ilk gününün haftanın hangi günü olduğunu bul
    // JavaScript'te 0=Pazar, 1=Pazartesi, ... 6=Cumartesi
    // Türkiye'de hafta Pazartesi'den başlar, bu yüzden ayarlama yap
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    // Pazar'ı 7'ye çevir, diğerlerini 1 azalt (Pazartesi=0, Salı=1, ..., Pazar=6)
    return day === 0 ? 6 : day - 1
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handleDateClick = (day: number | null) => {
    if (!day) return
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    // Yerel tarihi YYYY-MM-DD formatında string'e çevir (UTC kullanma)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const dayStr = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${dayStr}`
    onSelectDate(dateString)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-gray-900">
          {currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
          <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="aspect-square opacity-0" />
          }
          
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const dayStr = String(date.getDate()).padStart(2, '0')
          const dateString = `${year}-${month}-${dayStr}`
          const isSelected = selectedDate === dateString
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`aspect-square rounded-lg font-medium transition-colors ${
                isSelected
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 text-gray-900 hover:border-black-400"
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
