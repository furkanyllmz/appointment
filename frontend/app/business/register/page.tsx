import { LeftPanel } from "@/components/auth/left-panel"
import { BusinessRegisterForm } from "@/components/auth/business-register-form"

export default function BusinessRegisterPage() {
  return (
    <div className="flex h-screen">
      <LeftPanel />
      <BusinessRegisterForm />
    </div>
  )
}
