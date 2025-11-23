import { apiGet, apiPost, apiPut } from "./api-client"

export interface Appointment {
  id: number
  serviceId: number
  serviceName: string
  startTime: string
  endTime: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "Completed"
  adminNote?: string
}

export interface AppointmentDetail extends Appointment {
  customerId: number
  customerName: string
  customerEmail: string
}

export interface CreateAppointmentRequest {
  serviceId: number
  startTime: string
}

export const appointmentApi = {
  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    return apiPost<Appointment>("/appointments", data)
  },

  getUserAppointments: async (userId: number): Promise<Appointment[]> => {
    return apiGet<Appointment[]>(`/appointments/user/${userId}`)
  },

  cancel: async (id: number): Promise<void> => {
    return apiPut<void>(`/appointments/${id}/cancel`, {})
  },
}
