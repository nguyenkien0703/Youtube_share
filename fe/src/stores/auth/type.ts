import { EActionStatus } from "../type";

export interface IAuthState {
  status: EActionStatus;
  statusSignUp: EActionStatus;
  jwtAuth: string | null;
  isAuthenticated: boolean;
  currentUserId: number;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone: string | null;
  dob: string | null;
}
