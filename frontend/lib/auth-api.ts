import { apiPost, apiGet } from "./api-client"

export interface User {
  id: number
  fullName: string
  email: string
  role: "Customer" | "Admin"
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiPost<AuthResponse>("/auth/register", data)
    if (response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    return response
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiPost<AuthResponse>("/auth/login", data)
    if (response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }
    return response
  },

  getMe: async (): Promise<User> => {
    return apiGet<User>("/auth/me")
  },

  logout: () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
  },

  getToken: (): string | null => {
    return typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  },

  getUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: (): boolean => {
    return !!authApi.getToken()
  },

  isAdmin: (): boolean => {
    const user = authApi.getUser()
    return user?.role === "Admin"
  },
}
