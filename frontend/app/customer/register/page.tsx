import { LeftPanel } from "@/components/auth/left-panel"
import { CustomerRegisterForm } from "@/components/auth/customer-register-form"

export default function CustomerRegisterPage() {
  return (
    <div className="flex h-screen">
      <LeftPanel />
      <CustomerRegisterForm />
    </div>
  )
}
