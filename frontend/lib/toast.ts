// Simple toast notification helper - integrate with your toast system
export function showToast(message: string, type: "success" | "error" | "info" = "info") {
  // This will be connected to your toast notification system
  console.log(`[Toast ${type}]: ${message}`)
}
