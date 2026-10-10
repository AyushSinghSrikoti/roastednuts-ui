export type LoginResponse = {
  token: string;
};

export interface SignupResponse extends LoginResponse {
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export interface CurrentUser {
  id: string | null;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  role: string;
}
