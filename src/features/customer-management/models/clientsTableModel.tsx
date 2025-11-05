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
  
  