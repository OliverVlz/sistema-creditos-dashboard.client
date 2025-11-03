import type { IUser } from '../../types/user.interfaces';

export interface ILoginForm {
  email: string;
  password?: string;
}

export interface IAuthContext {
  user?: IUser | null;
  login: (body: ILoginForm) => void;
  logout: () => void;
  updateLoggedUser: (user: IUser) => void;
  isLoggingIn: boolean;
  pendingRedirect: string | null;
}
