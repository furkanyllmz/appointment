"use client"

interface BookingSummaryProps {
  serviceName: string | null
  durationMin: number | null
  selectedDate: string | null
  selectedTime: string | null
}

export function BookingSummary({ serviceName, durationMin, selectedDate, selectedTime }: BookingSummaryProps) {
  return (
    <div className="hidden lg:block sticky top-20 bg-white rounded-lg shadow-md p-6 h-fit">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Randevu Özeti</h3>

      <div className="space-y-4 text-sm">
        {serviceName && (
          <div>
            <p className="text-gray-600">Hizmet</p>
            <p className="font-bold text-gray-900">{serviceName}</p>
          </div>
        )}

        {selectedDate && (
          <div>
            <p className="text-gray-600">Tarih</p>
            <p className="font-bold text-gray-900">{new Date(selectedDate).toLocaleDateString("tr-TR")}</p>
          </div>
        )}

        {selectedTime && (
          <div>
            <p className="text-gray-600">Saat</p>
            <p className="font-bold text-gray-900">{selectedTime}</p>
          </div>
        )}

        {durationMin && (
          <div>
            <p className="text-gray-600">Süre</p>
            <p className="font-bold text-gray-900">{durationMin} dakika</p>
          </div>
        )}
      </div>
    </div>
  )
}
