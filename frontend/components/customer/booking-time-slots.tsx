"use client"

interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface BookingTimeSlotsProps {
  selectedTime: string | null
  onSelectTime: (time: string) => void
  availableSlots: TimeSlot[]
  loading?: boolean
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export function BookingTimeSlots({ 
  selectedTime, 
  onSelectTime,
  availableSlots,
  loading = false 
}: BookingTimeSlotsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Uygun Saatleri Seçin</h3>
        <div className="grid grid-cols-4 gap-3">
          {TIME_SLOTS.map((time) => (
            <div
              key={time}
              className="h-10 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!availableSlots || availableSlots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Uygun Saatleri Seçin</h3>
        <div className="text-center py-8 text-gray-500">
          Bu tarih için uygun saat bulunmamaktadır.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Uygun Saatleri Seçin</h3>
      <div className="grid grid-cols-4 gap-3">
        {availableSlots.map((slot) => {
          const isSelected = selectedTime === slot.startTime
          const isDisabled = !slot.isAvailable
          
          return (
            <button
              key={slot.startTime}
              onClick={() => slot.isAvailable && onSelectTime(slot.startTime)}
              disabled={isDisabled}
              className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                isSelected
                  ? "bg-black text-white"
                  : isDisabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-white border border-gray-300 text-gray-900 hover:border-black"
              }`}
            >
              {slot.startTime}
            </button>
          )
        })}
      </div>
    </div>
  )
}
