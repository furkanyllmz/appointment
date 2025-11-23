import { apiGet, apiPut, apiDelete } from "./api-client"
import { AppointmentDetail } from "./appointment-api"

export interface AdminAppointmentsQuery {
  dateFrom?: string
  dateTo?: string
  serviceId?: number
  status?: string
}

export interface RejectAppointmentRequest {
  adminNote?: string
}

export const adminApi = {
  getAppointments: async (query?: AdminAppointmentsQuery): Promise<AppointmentDetail[]> => {
    const params = new URLSearchParams()
    if (query?.dateFrom) params.append("dateFrom", query.dateFrom)
    if (query?.dateTo) params.append("dateTo", query.dateTo)
    if (query?.serviceId) params.append("serviceId", query.serviceId.toString())
    if (query?.status) params.append("status", query.status)

    const queryString = params.toString()
    const endpoint = `/admin/appointments${queryString ? `?${queryString}` : ""}`
    return apiGet<AppointmentDetail[]>(endpoint)
  },

  approveAppointment: async (id: number): Promise<void> => {
    return apiPut<void>(`/admin/appointments/${id}/approve`, {})
  },

  rejectAppointment: async (id: number, data: RejectAppointmentRequest): Promise<void> => {
    return apiPut<void>(`/admin/appointments/${id}/reject`, data)
  },

  deleteAppointment: async (id: number): Promise<void> => {
    return apiDelete<void>(`/admin/appointments/${id}`)
  },
}
