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
    clientId: string  // ID del cliente (clientInfo.id)
    userId: string    // ID del usuario (user.id) - Este es el que se usa para editar
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
