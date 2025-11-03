import type { IUser } from '../../types/user.interfaces';

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IAuthContext {
  user?: IUser | null;
  login?: (userData: ILoginForm) => void;
  logout?: () => void;
  updateLoggedUser?: (user: IUser | null) => void;
  isLoggingIn?: boolean;
  pendingRedirect?: string | null;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}
