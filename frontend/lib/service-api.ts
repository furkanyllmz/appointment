import { apiGet, apiPost, apiPut } from "./api-client"

export interface Service {
  id: number
  name: string
  durationMin: number
  isActive: boolean
}

export interface CreateServiceRequest {
  name: string
  durationMin: number
  isActive: boolean
}

export interface UpdateServiceRequest {
  name?: string
  durationMin?: number
  isActive?: boolean
}

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    return apiGet<Service[]>("/services")
  },

  create: async (data: CreateServiceRequest): Promise<Service> => {
    return apiPost<Service>("/services", data)
  },

  update: async (id: number, data: UpdateServiceRequest): Promise<void> => {
    return apiPut<void>(`/services/${id}`, data)
  },
}
