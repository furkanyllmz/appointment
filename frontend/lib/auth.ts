import { jwtDecode } from "jwt-decode"

export interface AuthToken {
  sub: string
  email: string
  name: string
  role: "Admin" | "Customer"
  jti: string
  exp: number
  iss: string
  aud: string
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

export function decodeToken(token: string): AuthToken | null {
  try {
    return jwtDecode<AuthToken>(token)
  } catch {
    return null
  }
}

export function getCurrentUser(): AuthToken | null {
  const token = getAuthToken()
  if (!token) return null
  return decodeToken(token)
}

export function isTokenValid(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded) return false
  return decoded.exp * 1000 > Date.now()
}
