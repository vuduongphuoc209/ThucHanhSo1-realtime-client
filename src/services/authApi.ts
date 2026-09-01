import api from "./api";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: "online" | "offline";
  lastSeen?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;

  data: {
    user: AuthUser;
    token: string;
  };
}

export const registerApi = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", payload);

  return response.data;
};

export const loginApi = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);

  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get<{
    success: boolean;
    data: {
      user: AuthUser;
    };
  }>("/auth/me");

  return response.data;
};
