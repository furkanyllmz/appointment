import { LeftPanel } from "@/components/auth/left-panel"
import { BusinessLoginForm } from "@/components/auth/business-login-form"

export default function BusinessLoginPage() {
  return (
    <div className="flex h-screen">
      <LeftPanel />
      <BusinessLoginForm />
    </div>
  )
}
