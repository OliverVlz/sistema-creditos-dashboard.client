import { User } from "@/features/user-management/models/usersTableConfig";

export interface LoginResponseModel {
    token: string;
    user: User;
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    documentNumber: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
  }
