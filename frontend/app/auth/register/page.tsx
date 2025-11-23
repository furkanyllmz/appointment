import { RegistrationForm } from "@/components/auth/registration-form"
import { RegistrationLeftPanel } from "@/components/auth/registration-left-panel"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <RegistrationLeftPanel />

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-foreground mb-8">Müşteri Kaydı</h2>
          <RegistrationForm />
        </div>
      </div>
    </div>
  )
}
