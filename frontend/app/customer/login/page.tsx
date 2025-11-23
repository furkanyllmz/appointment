import { LeftPanel } from "@/components/auth/left-panel"
import { CustomerLoginForm } from "@/components/auth/customer-login-form"

export default function CustomerLoginPage() {
  return (
    <div className="flex h-screen">
      <LeftPanel />
      <CustomerLoginForm />
    </div>
  )
}
