"use client"

interface BookingProgressProps {
  currentStep: number
}

export function BookingProgress({ currentStep }: BookingProgressProps) {
  const steps = [
    { number: 1, label: "Hizmet" },
    { number: 2, label: "Tarih & Saat" },
    { number: 3, label: "Onay" },
  ]

  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
              currentStep >= step.number ? "bg-black text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.number}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 transition-colors ${
                currentStep > step.number ? "bg-black" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
