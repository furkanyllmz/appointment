const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5025/api"

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error: ${response.status}`)
  }

  // NoContent (204) durumunda boş obje döndür
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

export async function apiPost<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function apiGet<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiCall<T>(endpoint, { ...options, method: "GET" })
}

export async function apiPut<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiCall<T>(endpoint, { ...options, method: "DELETE" })
}
