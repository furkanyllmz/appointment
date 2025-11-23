export function RegistrationLeftPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8 relative overflow-hidden">
      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-primary rounded-full -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-primary rounded-full -bottom-48 -right-48"></div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Hoş Geldiniz</h1>
        <p className="text-primary text-xl">Hemen randevu almaya başlayın</p>
      </div>
    </div>
  )
}
