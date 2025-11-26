export interface Client {
    id: string | number
    isActive: boolean
    fullName: string
    documentNumber: string
    email?: string
    phoneNumber?: string
    organization?: {
        name: string
    }
    employmentStatus?: string
    createdAt?: string
    createdBy?: string
}
  
export interface ClientApiResponse {
    id: string
    firstName?: string
    lastName?: string
    fullName?: string
    documentNumber: string
    email?: string
    phoneNumber?: string
    organization?: {
        name: string
    }
    employmentStatus?: string
    isActive: boolean
    createdAt?: string
} 