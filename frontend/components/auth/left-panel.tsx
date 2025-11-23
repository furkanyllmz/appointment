"use client"

export function LeftPanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-black text-white flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-black rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-black rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        <h2 className="text-4xl font-bold mb-4">AppointMe</h2>
        <p className="text-lg text-gray-300">Randevularınızı kolayca yönetin</p>
      </div>
    </div>
  )
}
